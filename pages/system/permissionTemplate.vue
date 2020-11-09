<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @current-change="currentChange"
		 @size-change="sizeChange"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	var _this
	import {
		tree as tenantTree
	} from "@/api/tenant/tenant.js"
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/system/permissionTemplate.js"
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
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.system_dept_add || false,
				  viewBtn:  this.navBtn.system_dept_list || false,
				  delBtn: this.navBtn.system_dept_remove || false,
				  editBtn: this.navBtn.system_dept_update || false,
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
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					menuWidth: 300,
					column: [{
							label: "模板名称",
							prop: "name",
							search: true,
							width: 200,
							span: 12,
							rules: [{
								required: true,
								message: "请输入模板名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "所属门店",
							prop: "tenantId",
							type: "tree",
							span: 12,
							width: 150,
							dicData: [],
							props: {
								label: "name",
								value: "_id",
							},
							search: true,
							rules: [{
								required: false,
								message: "请输入所属租户",
								trigger: "change",
							}, ],
						},
						{
							label: "排序",
							prop: "sort",
							span: 12,
							type: 'number',
							rules: [{
								required: false,
								message: "请输入备注",
								trigger: "change",
							}, ],
						},
						{
							label: "备注",
							prop: "comment",
							span: 12,
							width: 150,
							rules: [{
								required: false,
								message: "请输入备注",
								trigger: "change",
							}, ],
						},
						{
							label: "创建时间",
							prop: "create_date",
							slot: true,
							width: 150,
							span: 12,
							display: false
						},
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;
			tenantTree().then((tree) => {
				const column = _this.findObject(_this.option.column, "tenantId");
				column.dicData = tree;
			})
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
				this.$nextTick(()=>{
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
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
