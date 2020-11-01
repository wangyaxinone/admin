<template>
	<view>
		<view class="uni-container">
			<uni-clientdb ref="dataQuery" :collection="collectionName" :options="options" :where="where" page-data="replace"
			 :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
			 v-slot:default="{data, loading}" :prtLoad="clientdbload">
				<avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
				 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
				 @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @on-load="loadData">
					<template slot-scope="{type,size,row}" slot="menu">
						<el-button icon="el-icon-plus" :size="size" :type="type" @click="addChildMenus(row)">添加子菜单</el-button>
					</template>
				</avue-crud>
			</uni-clientdb>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	const dbCmd = db.command
	// 表查询配置
	const dbCollectionName = 'uni-id-roles'
	const dbOrderBy = 'create_date desc'
	const dbSearchFields = ['permission_id', 'permission_name'] // 支持模糊搜索的字段列表
	// 分页配置
	import config from '@/admin.config.js'
	import iconList from "@/config/iconList";
	var _this
	export default {
		data() {
			return {
				query: '',
				where: '',
				orderby: dbOrderBy,
				collectionName: dbCollectionName,
				options: {
					pageSize: config.pages.pageSize,
					pageCurrent: config.pages.pageCurrent,
				},
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
			clientdbload(data) {
				data.sort((data1, data2) => {
					return data1.sort > data2.sort ? 1 : -1;
				})
				var tree = _this.$getTree(data, {
					id: 'menu_id',
					children: 'children',
					parentId: 'parent_id',
				});

				const column = _this.findObject(_this.option.column, "parent_id");
				column.dicData = tree;
				return tree;
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = `/${query}/i`
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				debugger
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
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
						db.collection(dbCollectionName).doc(row._id).remove().then((res) => {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.loadData();
						}).catch((err) => {
							this.$message({
								message: err.message || '删除失败',
								type: 'error'
							});
						})
					})

			},
			rowUpdate(row, index, done, loading) {
				db.collection(dbCollectionName).where({
						_id: row._id
					}).update({
						name: row.name,
						menu_id: row.menu_id,
						parent_id: row.parent_id,
						url: row.url,
						type: row.type,
						sort: row.sort,
						enable: row.enable,
						icon: row.icon,
					})
					.then(() => {
						this.loadData();
						this.$message({
							message: '修改成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						this.$message({
							message: err.message || '修改失败',
							type: 'error'
						});
						done();
					})
			},
			rowSave(row, done, loading) {
				db.collection(dbCollectionName).add({
						name: row.name,
						menu_id: row.menu_id,
						parent_id: row.parent_id,
						url: row.url,
						type: row.type,
						sort: row.sort,
						enable: row.enable,
						icon: row.icon,
					})
					.then(() => {
						this.loadData();
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						this.$message({
							message: err.message || '新增失败',
							type: 'error'
						});
						done();
					})
			},
			searchReset() {
				this.where = '';
				this.params = {};
				this.loadData();
			},
			searchChange(params, done) {
				this.params = params;
				this.params.name && (this.where = `name==${this.params.name}`);
				this.loadData();
				done();
			},
			selectionChange() {},
			currentChange(pageCurrent) {
				this.options.pageCurrent = pageCurrent;
			},
			sizeChange(pageSize) {
				this.options.pageSize = pageSize;
			},
			loadData(clear = true) {
				this.$nextTick(() => {
					this.$refs.dataQuery.loadData({
						clear
					})
				})

			}
		}
	}
</script>
<style>
</style>
