<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :option="option" :page="page" :table-loading="loading" :data="data" ref="crud" v-model="form"
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
			<template slot="role" slot-scope="scope">
				<view>{{scope.row.roleShow.join(',')}}</view>
			</template>
			<template slot="dept" slot-scope="scope">
				<view>{{scope.row.deptShow.join(',')}}</view>
			</template>
			<template v-if="$store.state.user.userInfo.role.indexOf('admin')>-1" slot-scope="{type,size,row}" slot="menu">
				<el-button icon="el-icon-plus" :size="size" :type="type" @click="addChildMenus(row)">创建用户10000000</el-button>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	// 分页配置
	import config from '@/admin.config.js'
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {getList, add, update, remove, create} from "@/api/system/user.js"
	import {tree as tenantTree} from "@/api/tenant/tenant.js"
	import {tree as roleTree} from "@/api/system/role.js"
	import {getDictByDictCode} from "@/api/system/dict.js"
	import {tree as deptTree} from "@/api/system/dept.js"
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		components: {uniDateformate},
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.system_user_add || false,
				  viewBtn:  this.navBtn.system_user_list || false,
				  delBtn: this.navBtn.system_user_remove || false,
				  editBtn: this.navBtn.system_user_update || false,
				};
			  },
		},
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
							props: {
								label: "dict_name",
								value: "dict_key"
							},
							dicData:[],
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
							search: true,
							rules: [{
								required: true,
								message: "请输入所属租户",
								trigger: "change",
							}, ],
						},
						{
							label: "用户角色",
							prop: "role",
							type:'tree',
							slot: true,
							multiple: true,
							checkStrictly: true,
							width: 150,
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
							label: "部门",
							prop: "dept",
							type:'tree',
							slot: true,
							multiple: true,
							checkStrictly: true,
							width: 150,
							dicData:[],
							span: 12,
							props: {
								label: "dept_name",
								value: "_id"
							},
							rules: [{
								required: false,
								message: "请输入用户部门",
								trigger: "blur",
							}],
						},
						{
							label: "用户状态",
							prop: "status",
							type: 'select',
							value: 0,
							props: {
								label: "dict_name",
								value: "dict_key",
								disabled: "disabled"
							},
							dicData:[],
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
							rules: [{
								required: true,
								message: "请输入手机号码",
								trigger: "blur",
							}],
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
			getDictByDictCode({dict_code: 'gender'}).then((res)=>{
				const column = this.findObject(this.option.column, "gender");
				column.dicData = res;
			})
			getDictByDictCode({dict_code: 'user_status'}).then((res)=>{
				const column = this.findObject(this.option.column, "status");
				column.dicData = res;
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
						deptTree({
							tenantId: newValue
						}).then((data)=>{
							const column = this.findObject(this.option.column, "dept");
							column.dicData = data;
						})
					}
				},
				deep: true
			}
		},
		methods: {
			addChildMenus() {
				create().then(()=>{
					this.loadData();
				})
			},
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
						if(res.data && res.data.length) {
							var map = {};
							res.data.forEach((item)=>{
								item.roleShow = [];
								item.deptShow = [];
								item.roles && (item.roles.forEach((child)=>{
									map[child._id] = child.role_name
								}))
								item.role && item.role.forEach((key)=>{
									if(map[key]) {
										item.roleShow.push(map[key]);
									}else{
										item.roleShow.push(key);
									}
								})
								item.depts && item.depts.forEach((dept)=>{
									item.deptShow.push(dept.dept_name);
								})
							})
						}
						this.data = res.data;
						this.loading = false;
						this.page.total = res.total;
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
