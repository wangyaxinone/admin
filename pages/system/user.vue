<template>
	<view>
		<view class="uni-container">
			<uni-clientdb ref="dataQuery" :collection="collectionName" :options="options" :where="where" page-data="replace"
			 :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
			 v-slot:default="{data, loading, pagination}"
			 @load="clientdbload"
			 >
				{{pagination}}
				<avue-crud :option="option" :page="pagination" :table-loading="loading" :data="data" ref="crud" v-model="form" 
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
	const dbCollectionName = 'uni-id-users'
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
							label: "用户名称",
							prop: "username",
							search: true,
							span: 12,
							rules: [{
								required: true,
								message: "请输入用户名称",
								trigger: "blur",
							}],
						},
						{
							label: "密码",
							prop: "password",
							span: 12,
							hide: true,
							editDisplay: false,
							viewDisplay: false,
							type: 'password',
							rules: [{
								required: true,
								message: "请输入密码",
								trigger: "blur",
							}],
						},
						{
							label: "用户昵称",
							prop: "nickname",
							search: true,
							span: 12,
						},
						{
							label: "用户性别",
							prop: "gender",
							span: 12,
						},
						{
							label: "所属租户",
							prop: "tenantId",
							type: "tree",
							span: 12,
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
							label: "用户角色",
							prop: "role",
							span: 12,
							rules: [{
								required: true,
								message: "请输入用户角色",
								trigger: "blur",
							}],
						},
						{
							label: "用户状态",
							prop: "status",
							span: 12,
							rules: [{
								required: true,
								message: "请输入用户状态",
								trigger: "blur",
							}],
						},
						{
							label: "手机号码",
							prop: "mobile",
							span: 12,
						},
						{
							label: "最后登录时间",
							prop: "last_login_date",
							width:120,
							span: 12,
						},
						{
							label: "最后登录时 IP 地址",
							prop: "last_login_ip",
							width:120,
							span: 12,
						},
					],
				},
				data: [],
			}
		},
		methods: {
			clientdbload(data) {
				debugger
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
