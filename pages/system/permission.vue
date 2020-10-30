<template>
	<view>
		<view class="uni-container">
			<uni-clientdb ref="dataQuery" :collection="collectionName" :options="options" :where="where" page-data="replace"
			 :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
			 v-slot:default="{data, loading}">
				<avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" 
					@row-del="rowDel"
					@row-update="rowUpdate"
					@row-save="rowSave"
					@search-change="searchChange"
					@search-reset="searchReset"
					@selection-change="selectionChange"
					@current-change="currentChange"
					@size-change="sizeChange"
					@on-load="loadData">
				</avue-crud>
			</uni-clientdb>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	// 表查询配置
	const dbCollectionName = 'uni-id-permissions'
	const dbOrderBy = 'create_date desc'
	const dbSearchFields = ['permission_id', 'permission_name'] // 支持模糊搜索的字段列表
	// 分页配置
	import config from '@/admin.config.js'
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
					column: [{
							label: "角色名称",
							prop: "roleName",
							search: true,
							span: 24,
							rules: [{
								required: true,
								message: "请输入角色名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "所属租户",
							prop: "tenantId",
							type: "tree",
							span: 24,
							dicData: [],
							props: {
								label: "tenantName",
								value: "_id",
							},
							search: false,
							rules: [{
								required: true,
								message: "请输入所属租户",
								trigger: "change",
							}, ],
						},
						{
							label: "角色别名",
							prop: "roleAlias",
							search: true,
							span: 24,
							rules: [{
								required: true,
								message: "请输入角色别名",
								trigger: "blur",
							}, ],
						},
						{
							label: "上级角色",
							prop: "parentId",
							dicData: [],
							type: "tree",
							hide: true,
							span: 24,
							props: {
								label: "roleName",
								value: "_id",
							},
							rules: [{
								required: false,
								message: "请选择上级角色",
								trigger: "change",
							}, ],
						},
						{
							label: "角色排序",
							prop: "sort",
							type: "number",
							span: 24,
							rules: [{
								required: true,
								message: "请输入角色排序",
								trigger: "blur",
							}, ],
						},
						{
							label: "下单推送",
							prop: "orderPush",
							type: "switch",
							dicData: [{
									label: "否",
									value: 0,
								},
								{
									label: "是",
									value: 1,
								}
							],
						},
						{
							label: "制作推送",
							prop: "markPush",
							type: "switch",
							dicData: [{
									label: "否",
									value: 0,
								},
								{
									label: "是",
									value: 1,
								}
							],
						},
						{
							label: "上菜推送",
							prop: "servingPush",
							type: "switch",
							dicData: [{
									label: "否",
									value: 0,
								},
								{
									label: "是",
									value: 1,
								},

							],
						},
					],
				},
				data: [],
			}
		},
		methods: {
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = `/${query}/i`
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
				}
			},
			rowDel() {},
			rowUpdate() {},
			rowSave() {},
			searchReset() {
				this.where = '';
				this.params = {};
				this.loadData();
			},
			searchChange(params, done){
				this.params = params;
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
