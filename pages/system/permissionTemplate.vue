<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud"
		 v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange"
		 @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
		 @on-load="loadData" @cell-click="cellClick">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="menuLeft" v-if="navBtn.system_permissionTemplate_permission">
				<el-button type="danger" icon="el-icon-plus" size="small" plain @click.stop="addRolePermissions()">权限</el-button>
			</template>
		</avue-crud>
		<uniRolePermissions :isAdminTemplate="isAdminTemplate" :type="1" :defaultCheckedData="defaultCheckedData" :defaultCheckedKeys="defaultCheckedKeys" @permissionsSubmit="permissionsSubmit"
		 :menusTree="menusTree" :dataPermissTree="dataPermissTree" ref="uniRolePermissions"></uniRolePermissions>
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
		getPermissionByTenant,
		setPermission
	} from "@/api/system/permissionTemplate.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import uniRolePermissions from '@/components/uni-role-permissions/uni-role-permissions.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'

	export default {
		components: {
			uniDateformate,
			uniRolePermissions
		},
		computed: {
			...mapState('app', ['navBtn']),
			permissionList() {
				return {
					addBtn: this.navBtn.system_permissionTemplate_add || false,
					viewBtn: this.navBtn.system_permissionTemplate_list || false,
					delBtn: this.navBtn.system_permissionTemplate_remove || false,
					editBtn: this.navBtn.system_permissionTemplate_update || false,
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
				isAdminTemplate: '',
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
							value:'',
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
							label: "门店管理员模板",
							prop: "isAdminTemplate",
							span: 12,
							type: 'select',
							width: 120,
							value: 2,
							dicData: [{
								label: '是',
								value: 1
							}, {
								label: '否',
								value: 2
							}],
							rules: [{
								required: true,
								message: "请选择是否是门店管理员模板",
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
				menusTree: [],
				dataPermissTree: [],
				defaultCheckedKeys: [],
				defaultCheckedData: '',
				currentSelect: {}
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
			permissionsSubmit(data) {
				setPermission({
					_id: this.selection[0]._id,
					permissions: data.permissions,
					dataPermissions: data.dataPermissions
				}).then(()=>{
					this.$refs.uniRolePermissions.hide();
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.loadData();
				})
			},
			cellClick(row, column, cell, event) {
				this.$refs.crud.toggleRowSelection(row)
			},
			addRolePermissions() {
				var _this = this;
				if (this.selection && this.selection.length) {
					if (this.selection.length > 1) {
						this.$message({
							message: '只能选择一项',
							type: 'warning'
						});
					} else {
						this.currentSelect = this.selection[0];
						this.isAdminTemplate = this.selection[0].isAdminTemplate;
						getPermissionByTenant({
							tenantId: this.selection[0].tenantId,
							isAdminTemplate: this.selection[0].isAdminTemplate
						}).then((res) => {
							_this.defaultCheckedKeys = _this.selection[0].permissions || [];
							_this.defaultCheckedData = _this.selection[0].dataPermissions || '';
							_this.menusTree = _this.$getTree(res, {
								id: 'menu_id',
								children: 'children',
								parentId: 'parent_id',
							});
							
							_this.$refs.uniRolePermissions.show();
						})
					}
				} else {
					this.$message({
						message: '请先选择角色',
						type: 'warning'
					});
				}
			},
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
				row.permissions = [];
				row.dataPermissions = {};
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
