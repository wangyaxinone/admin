<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @selection-change="selectionChange" @on-load="loadData" @cell-click="cellClick">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="menuLeft" v-if="navBtn.system_role_permission">
				<el-button type="danger" icon="el-icon-plus" size="small" plain @click.stop="addRolePermissions()">权限</el-button>
			</template>
		</avue-crud>
		<uniRolePermissions :template="template" :templateList="templateList" :isAdminTemplate="currentSelect.type" :dataPermissTree="dataPermissTree" :defaultCheckedData="defaultCheckedData" :defaultCheckedKeys="defaultCheckedKeys" @permissionsSubmit="permissionsSubmit" :menusTree="menusTree" ref="uniRolePermissions"></uniRolePermissions>
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
		tree,
		getRoleMenus,
		setRoleMenus
	} from "@/api/system/role.js"
	import {
		select
	} from "@/api/system/permissionTemplate.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import uniRolePermissions from '@/components/uni-role-permissionsByRole/uni-role-permissions.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		components: {
			uniDateformate,
			uniRolePermissions
		},
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.system_role_add || false,
				  viewBtn:  this.navBtn.system_role_list || false,
				  delBtn: this.navBtn.system_role_remove || false,
				  editBtn: this.navBtn.system_role_update || false,
				};
			  },
		},
		data() {
			return {
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
					defaultExpandAll: true,
					menuWidth: 300,
					column: [{
							label: "角色名",
							prop: "role_name",
							search: true,
							width: 250,
							span: 12,
							rules: [{
								required: true,
								message: "请输入角色名",
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
								required: true,
								message: "请输入所属租户",
								trigger: "change",
							}, ],
						},
						{
							label: "上级角色",
							prop: "parent_id",
							span: 12,
							width: 150,
							type: 'tree',
							hide:true,
							dicData: [],
							props: {
								label: "role_name",
								value: "_id"
							},
							rules: [{
								required: true,
								message: "请选择上级角色",
								trigger: "change",
							}, ],
						},

						{
							label: "门店管理员",
							prop: "type",
							span: 12,
							type: 'select',
							width:120,
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
								message: "请选择是否是门店管理员",
								trigger: "change",
							}, ],
						},
						{
							label: "订单推送",
							prop: "orderPush",
							width: 150,
							type: 'switch',
							value: false,
							span: 12,
						},
						{
							label: "菜品推送",
							prop: "foodPush",
							width: 150,
							type: 'switch',
							value: false,
							span: 12,
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
							label: "排序",
							prop: "sort",
							span: 12,
							width: 100,
							type: 'number',
							rules: [{
								required: true,
								message: "请输入排序",
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
				defaultCheckedKeys: [],
				dataPermissTree: [],
				defaultCheckedData: {},
				currentSelect: {},
				template:'self',
				templateList: []
			}
		},
		created() {
			_this = this;
			tenantTree().then((tree) => {
				const column = _this.findObject(_this.option.column, "tenantId");
				column.dicData = tree;
			})
		},
		watch: {
			'form.tenantId': {
				handler(newValue) {
					if (newValue) {
						tree({
							tenantId: newValue
						}).then((tree) => {
							const column = _this.findObject(_this.option.column, "parent_id");
							column.dicData = tree;
						})
					}
				},
				deep: true
			}
		},
		methods: {
			cellClick(row, column, cell, event) {
				this.$refs.crud.toggleRowSelection(row)
			},
			permissionsSubmit(data) {
				setRoleMenus({
					_id: this.selection[0]._id,
					template: data.value,
					permission: data.permissions,
					dataPermission: data.dataPermissions,
				}).then(()=>{
					this.$refs.uniRolePermissions.hide();
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.loadData();
				})
			},
			addRolePermissions() {
				if(this.selection &&　this.selection.length) {
					if(this.selection.length>1) {
						this.$message({
							message: '只能选择一项',
							type: 'warning'
						});
					}else{
						const loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
						});
						this.currentSelect = this.selection[0];
						this.template = this.currentSelect.template || 'self';
						getRoleMenus({
							parent_id: this.selection[0].parent_id,
							type: this.selection[0].type,
							permission: this.selection[0].permission,
						}).then((res)=>{
							this.defaultCheckedKeys = this.selection[0].permission || [];
							this.defaultCheckedData = this.selection[0].dataPermission || '';
							this.menusTree = this.$getTree(res, {
								id: 'menu_id',
								children: 'children',
								parentId: 'parent_id',
							});
							
							select({
								tenantId: this.selection[0].tenantId,
								isAdminTemplate: this.selection[0].type,
								parent_id: this.selection[0].parent_id
							}).then((res)=>{
								var templateList = res; 
								templateList.push({
									name: '自定义权限',
									_id: 'self'
								})
								this.templateList = templateList;
								loading.close();
								this.$refs.uniRolePermissions.show();
							})
						})
					}
				}else{
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
				row.permission = [];
				row.dataPermission = {};
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
			loadData(clear = true) {
				this.loading = true;
				tree(this.params).then((res) => {
					this.loading = false;
					this.data = res;
					tree().then((tree) => {
						const column = this.findObject(this.option.column, "parent_id");
						column.dicData = tree;
					})
				}).catch(() => {
					this.loading = false;
				})

			}
		}
	}
</script>
<style>
</style>
