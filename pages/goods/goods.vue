<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud"
		 v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange"
		 @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
		 @on-load="loadData">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="goodsSmallImgForm">
				<div class="el-upload">
					<img v-if="scope.row.goodsSmallImg" :src="scope.row.goodsSmallImg" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</template>
			<template slot-scope="scope" slot="goodsBigImgForm">
				<div class="el-upload">
					<img v-if="scope.row.goodsBigImg" :src="scope.row.goodsBigImg" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</template>
		</avue-crud>
		<selectFile ref="selectFile"></selectFile>
	</view>
</template>

<script>
	var _this
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/goods/goods.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js';
	import {
		tree as deptTree
	} from "@/api/system/dept.js"
	import {
		select,
	} from "@/api/goods/goods_type.js"
	import {
		select as unitSelect
	} from "@/api/goods/goods_unit.js"
	import {
		getDictByDictCode
	} from "@/api/system/dict.js"
	import selectFile from "@/components/selectFile/selectFile.vue"
	export default {
		components: {
			uniDateformate,
			selectFile
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
							prop: "goodsSmallImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品大图",
							prop: "goodsBigImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品名称",
							prop: "goodsName",
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
								label: "dept_name",
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
							prop: "goodsType",
							multiple: true,
							type: "select",
							dicData: [],
							props: {
								label: "name",
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
							dicData: [],
							props: {
								label: "name",
								value: "_id"
							},
						},
						{
							label: "商品成本",
							prop: "goodsCost",
							type: 'number',
							rules: [{
								required: true,
								message: "请输入商品成本",
								trigger: "change"
							}]
						},
						{
							label: "商品售价",
							prop: "goodsPrice",
							type: 'number',
							rules: [{
								required: true,
								message: "请输入商品售价",
								trigger: "change"
							}]
						},
						{
							label: "商品会员价格",
							prop: "goodsVipPrice",
							type: 'number',
						},

						{
							label: "商品属性",
							prop: "goodsAttr",
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
							type: 'select',
							value: 1,
							props: {
								label: "dict_name",
								value: "dict_key",
								disabled: "disabled"
							},
							dicData: [],
							span: 12,
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
					deptTree({
						tenantId: this.params.tenantId,
						isCook: 1
					}).then((data) => {
						const column = this.findObject(this.option.column, "deptId");
						column.dicData = data;
					})
					select().then((data) => {
						const column = this.findObject(this.option.column, "goodsType");
						column.dicData = data;
					})
					unitSelect({
						tenantId: this.params.tenantId,
					}).then((data) => {
						const column = this.findObject(this.option.column, "unit");
						column.dicData = data;
					})
					getDictByDictCode({
						dict_code: 'goods_status'
					}).then((res) => {
						const column = this.findObject(this.option.column, "status");
						column.dicData = res;
					})
				})
			}
		}
	}
</script>
<style scoped>
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
