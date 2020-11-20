<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud"
		 v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange"
		 @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
		 @on-load="loadData">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	var _this
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/goods/goods_type.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	export default {
		components: {
			uniDateformate,
		},
		computed: {
			...mapState('app', ['navBtn']),
			permissionList() {
				return {
					addBtn: this.navBtn.goods_type_add || false,
					viewBtn: this.navBtn.goods_type_list || false,
					delBtn: this.navBtn.goods_type_remove || false,
					editBtn: this.navBtn.goods_type_update || false,
				};
			},
		},
		data() {
			return {
				page: {
					pageSize: config.pages.pageSize,
					currentPage: config.pages.currentPage,
					total: 0
				},
				loading: false,
				selection: [],
				form: {},
				params: {},
				option: {
					height: "auto",
					calcHeight: 80,
					searchShow: true,
					searchMenuSpan: 6,
					rowKey: "_id",
					tip: false,
					tree: true,
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					menuWidth: 300,
					column: [{
							label: "商品小图",
							prop: "commoditySmallImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品大图",
							prop: "commodityBigImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品名称",
							prop: "commodityName",
							search: true,
							rules: [{
								required: true,
								message: "请输入商品名称",
								trigger: "blur"
							}],
						},
						{
							label: "所属部门",
							prop: "deptId",
							type: "tree",
							dicData: [],
							props: {
								label: "deptName",
								value: "_id"
							},
							checkStrictly: true,
							rules: [{
								required: true,
								message: "请选择所属部门",
								trigger: "click"
							}]
						},
						{
							label: "商品类型",
							prop: "commodityType",
							multiple: true,
							type: "select",
							dicData: [],
							props: {
								label: "typeName",
								value: "_id"
							},
							rules: [{
								required: true,
								message: "请选择商品类型",
								trigger: "change"
							}]
						},
						{
							label: "商品单位",
							prop: "unit",
							type: "select",
							dicUrl: "/system",
							dicMethod: "post",
							dicQuery: {
								action: 'dict/detail',
								params: {
									code: "unit"
								}
							},
							props: {
								label: "dictValue",
								value: "dictKey"
							},
						},
						{
							label: "商品成本",
							prop: "commodityCost",
							type: 'number',
							rules: [{
								required: true,
								message: "请输入商品成本",
								trigger: "change"
							}]
						},
						{
							label: "商品售价",
							prop: "commodityPrice",
							type: 'number',
							rules: [{
								required: true,
								message: "请输入商品售价",
								trigger: "change"
							}]
						},
						{
							label: "商品会员价格",
							prop: "commodityVipPrice",
							type: 'number',
						},

						{
							label: "商品属性",
							prop: "commodityAttr",
							type: "array",
							span: 24
						},
						{
							label: "总销量",
							prop: "totalSales",
							addDisplay: false,
							editDisplay: false,
						},
						{
							label: "商品状态",
							prop: "status",
							type: "select",
							value: 1,
							dicUrl: "/system",
							dicMethod: "post",
							dicQuery: {
								action: 'dict/detail',
								params: {
									code: "commodityStatus"
								}
							},
							props: {
								label: "dictValue",
								value: "dictKey"
							},
						},
						{
							label: "备注",
							prop: "remark",
						},

						{
							label: "最后一次操作人",
							prop: "operator",
							addDisplay: false,
							editDisplay: false,
							slot: true
						}
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;

		},
		methods: {
			rowDel(row) {
				if (row.children && row.children.length) {
					this.$message({
						message: '请先删除子菜单！',
						type: 'warning'
					});
					return
				}
				this.$confirm("确定将选择数据删除?", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						remove({
								_ids: [row._id]
							})
							.then((res) => {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.loadData();
							})
					})

			},
			rowUpdate(row, index, done, loading) {
				update(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '修改成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						done();
					})


			},
			rowSave(row, done, loading) {
				row.tenantId = this.$store.state.app.activeTenant;
				add(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						done();
					})

			},
			searchReset() {
				this.params = {};
				this.loadData();
			},
			searchChange(params, done) {
				this.params = params;
				this.loadData();
				done();
			},
			selectionChange(selection) {
				this.selection = selection;
			},
			currentChange(currentPage) {
				this.page.currentPage = currentPage;
			},
			sizeChange(pageSize) {
				this.page.pageSize = pageSize;
			},
			loadData(clear = true) {
				this.$nextTick(() => {
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
					this.params.tenantId = this.$store.state.app.activeTenant;
					getList(this.params).then((res) => {
						this.loading = false;
						this.data = res.data;
						this.page.total = res.total;
					}).catch(() => {
						this.loading = false;
					})
				})
			}
		}
	}
</script>
<style>
</style>
