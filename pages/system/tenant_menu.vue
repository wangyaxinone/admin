<template>
	<view class="uni-container">
		<avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="{type,size,row}" slot="menu">
				<el-button icon="el-icon-plus" :size="size" :type="type" @click="addChildMenus(row)">添加子菜单</el-button>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	const db = uniCloud.database()
	const dbCmd = db.command
	// 表查询配置
	const dbCollectionName = 'opendb-admin-menus'
	const dbOrderBy = 'create_date desc'
	const dbSearchFields = ['name'] // 支持模糊搜索的字段列表
	// 分页配置
	import config from '@/admin.config.js'
	import iconList from "@/config/iconList";
	import {getList, add, update, remove, tree} from "@/api/system/menu.js"
	var _this
	export default {
		data() {
			return {
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
							width:150,
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
			}
		},
		created() {
			_this = this;
		},
		methods: {
			addChildMenus(row) {
				this.$refs.crud.rowAdd();
				setTimeout(()=>{
					this.form.parent_id = row.menu_id;
				},300)
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
			selectionChange() {},
			loadData(clear = true) {
				this.loading = true;
				this.$nextTick(() => {
					tree().then((res)=>{
						this.data = res;
						this.loading = false;
						const column = this.findObject(this.option.column, "parent_id");
						column.dicData = res;
					}).catch(()=>{
						this.loading = false;
					})
				})

			}
		}
	}
</script>
<style>
</style>
