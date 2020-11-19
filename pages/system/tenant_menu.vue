<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @selection-change="selectionChange" @on-load="loadData" @cell-click="cellClick">
			<template v-if="$store.state.user.userInfo.role.indexOf('admin')>-1" slot-scope="{type,size,row}" slot="menu">
				<el-button icon="el-icon-plus" :size="size" :type="type" @click="addChildMenus(row)">添加子菜单</el-button>
			</template>
			<template v-if="$store.state.user.userInfo.role.indexOf('admin')>-1" slot-scope="scope" slot="menuLeft">
				<el-button type="danger" icon="el-icon-plus" size="small" plain @click.stop="handleAddBtn()">批量增加按钮菜单</el-button>
			</template>
		</avue-crud>
		<el-dialog title="批量新增按钮" :visible.sync="dialogVisible" width="80%">
			<view>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column label="按钮名称">
						<template slot-scope="scope">
							<el-input v-model="scope.row.name" placeholder="请输入按钮名称"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="父级菜单">
						<template slot-scope="scope">
							<el-input v-model="scope.row.parent_name" placeholder="请输入父级菜单"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="按钮ID" width="300">
						<template slot-scope="scope">
							<el-input v-model="scope.row.menu_id" placeholder="请输入按钮ID"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="url" width="300">
						<template slot-scope="scope">
							<el-input v-model="scope.row.url" placeholder="请输入url"></el-input>
						</template>
					</el-table-column>
				</el-table>
				<view style="text-align:center;">
				    <el-button @click="dialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="saveBtns">确 定</el-button>
				</view>
			</view>
		</el-dialog>
	</view>
</template>

<script>
	// 分页配置
	import config from '@/admin.config.js'
	import iconList from "@/config/iconList";
	import {
		getList,
		add,
		update,
		remove,
		tree,
		addBtns
	} from "@/api/system/menu.js"
	var _this
	const btns = [{
		btn: 'add',
		name: '新增'
	}, {
		btn: 'update',
		name: '修改'
	}, {
		btn: 'remove',
		name: '删除'
	}, {
		btn: 'list',
		name: '查看'
	}]
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.system_tenant_menu_add || false,
				  viewBtn:  this.navBtn.system_tenant_menu_list || false,
				  delBtn: this.navBtn.system_tenant_menu_remove || false,
				  editBtn: this.navBtn.system_tenant_menu_update || false,
				};
			  },
		},
		data() {
			return {
				dialogVisible: false,
				loading: false,
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
							label: "菜单名称",
							prop: "name",
							search: true,
							width: 150,
							span: 12,
							rules: [{
								required: true,
								message: "请输入角色名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "菜单 Id",
							prop: "menu_id",
							span: 12,
							rules: [{
								required: true,
								message: "请输入菜单 Id",
								trigger: "change",
							}, ],
						},
						{
							label: "父级菜单",
							prop: "parent_id",
							span: 12,
							type: 'tree',
							dicData: [],
							props: {
								label: "name",
								value: "menu_id"
							},
						},
						{
							label: '图标选择器',
							prop: 'icon',
							type: 'icon',
							iconList: iconList
						},
						{
							label: "url",
							prop: "url",
							span: 12,
							rules: [{
								required: false,
								message: "请输入url",
								trigger: "change",
							}, ],
						},
						{
							label: "api",
							prop: "api",
							span: 12,
							rules: [{
								required: false,
								message: "请输入api",
								trigger: "change",
							}, ],
						},
						{
							label: "类型",
							prop: "type",
							span: 12,
							type: 'select',
							value: 1,
							dicData: [{
								label: '菜单',
								value: 1
							}, {
								label: '按钮',
								value: 2
							}],
							rules: [{
								required: true,
								message: "请输入url",
								trigger: "change",
							}, ],
						},
						{
							label: "角色排序",
							prop: "sort",
							type: "number",
							span: 12,
							rules: [{
								required: true,
								message: "请输入角色排序",
								trigger: "blur",
							}, ],
						},
						{
							label: "菜单状态",
							prop: "enable",
							type: "switch",
							search: true,
							span: 12,
							value: true,
							dicData: [{
									label: "禁用",
									value: false,
								},
								{
									label: "启用",
									value: true,
								}
							],
						},
					],
				},
				data: [],
				selection: [],
				tableData: []
			}
		},
		created() {
			_this = this;
		},
		methods: {
			saveBtns() {
				addBtns({
					btns: this.tableData
				}).then(()=>{
					this.loadData();
					this.dialogVisible = false;
				})
			},
			cellClick(row, column, cell, event) {
				this.$refs.crud.toggleRowSelection(row)
			},
			handleAddBtn() {
				if (this.selection && this.selection.length == 1) {
					this.dialogVisible = true;
					this.tableData = [];
					var current = this.selection[0];
					btns.forEach((item, idx) => {
						var menu_id = `${current.menu_id}_${item.btn}`;
						this.tableData.push({
							name: item.name,
							menu_id: menu_id,
							parent_id: current.menu_id,
							parent_name: current.name,
							icon: '',
							url: menu_id.split('_').join('/'),
							type: 2,
							sort: idx,
							enable: true,
							menu_type: 2
						})
					})
				} else {
					this.$message({
						message: '必须只能选择一项操作',
						type: 'warning'
					});
				}
			},
			addChildMenus(row) {
				this.$refs.crud.rowAdd();
				setTimeout(() => {
					this.form.parent_id = row.menu_id;
				}, 300)
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
				row.menu_type = 2;
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
				this.$nextTick(() => {
					tree({
						menu_type: 2
					}).then((res) => {
						this.data = res;
						this.loading = false;
						const column = this.findObject(this.option.column, "parent_id");
						column.dicData = res;
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
