<template>
	<view class="uni-container">
		<avue-crud :option="option" :page="page" :table-loading="loading" :data="data" ref="crud" v-model="form"
			@row-del="rowDel"
			@row-update="rowUpdate"
			@row-save="rowSave"
			@search-change="searchChange"
			@search-reset="searchReset"
			@selection-change="selectionChange"
			@current-change="currentChange"
			@size-change="sizeChange"
			@on-load="loadData">
			<template slot="last_login_date" slot-scope="scope">
			  <uni-dateformate :date="scope.row.last_login_date" ></uni-dateformate>
			</template>
			
		</avue-crud>
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
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {getList, add, update, remove} from "@/api/system/user.js"
	import {tree as tenantTree} from "@/api/tenant/tenant.js"
	import {tree as roleTree} from "@/api/system/role.js"
	export default {
		components: {uniDateformate},
		data() {
			return {
				loading:false,
				page: {
					pageSize: config.pages.pageSize,
					currentPage: config.pages.currentPage,
					total: 0
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
							type: 'select',
							dicData:[{
								label:'未知',
								value:0
							},{
								label:'男性',
								value:1
							},{
								label:'女性',
								value:2
							}],
						},
						{
							label: "所属门店",
							prop: "tenantId",
							type: "tree",
							span: 12,
							dicData: [],
							props: {
								label: "name",
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
							type:'select',
							multiple: true,
							dicData:[],
							span: 12,
							props: {
								label: "role_name",
								value: "_id"
							},
							rules: [{
								required: true,
								message: "请输入用户角色",
								trigger: "blur",
							}],
						},
						{
							label: "用户状态",
							prop: "status",
							type: 'select',
							value: 0,
							dicData:[{
								label:'正常',
								value:0
							},{
								label:'禁用',
								value:1
							},{
								label:'审核中',
								disabled:true,
								value:2
							},{
								label:'审核拒绝',
								disabled:true,
								value:3
							}],
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
							slot: true,
							width:140,
							span: 12,
							display: false,
						},
						{
							label: "最后登录时 IP 地址",
							prop: "last_login_ip",
							width:120,
							span: 12,
							display: false,
						},
					],
				},
				data: [],
			}
		},
		created() {
			tenantTree().then((tree)=>{
				const column = this.findObject(this.option.column, "tenantId");
				column.dicData = tree;
			})
		},
		watch:{
			'form.tenantId':{
				handler(newValue){
					if(newValue) {
						roleTree({
							tenantId: newValue
						}).then((tree)=>{
							const column = this.findObject(this.option.column, "role");
							column.dicData = tree;
						})
					}
				},
				deep: true
			}
		},
		methods: {
			rowDel(row) {
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
					getList(this.params).then((res)=>{
						this.data = res.data;
						this.loading = false;
						this.page.total = res.total;
						roleTree().then((tree)=>{
							const column = this.findObject(this.option.column, "role");
							column.dicData = tree;
						})
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
