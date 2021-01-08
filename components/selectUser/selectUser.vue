<template>
	<div>
		<el-input v-model="label" placeholder="请输入内容" @focus="focus"></el-input>
		<el-dialog title="选择用户" :visible.sync="dialogVisible" width="60%" append-to-body>
			<avue-crud :permission="permissionList" :option="option" :page="page" :table-loading="loading" :data="data" ref="crud"
			 v-model="form" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
			 @size-change="sizeChange" @on-load="loadData" @cell-click="cellClick">
				<template slot="last_login_date" slot-scope="scope">
					<uni-dateformate :date="scope.row.last_login_date"></uni-dateformate>
				</template>
				<template slot="role" slot-scope="scope">
					<view>{{scope.row.roleShow.join(',')}}</view>
				</template>
				<template slot="dept" slot-scope="scope">
					<view>{{scope.row.deptShow.join(',')}}</view>
				</template>
			</avue-crud>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getList,
		add,
		update,
		remove
	} from "@/api/system/user.js"
	import config from '@/admin.config.js'
	export default {
		name: 'select-user',
		data() {
			return {
				input: '',
				currentId: '',
				dialogVisible: false,
				loading: false,
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
					viewBtn: true,
					menu: false,
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
							props: {
								label: "dict_name",
								value: "dict_key"
							},
							dicData: [],
						},
						{
							label: "用户角色",
							prop: "role",
							type: 'tree',
							slot: true,
							multiple: true,
							checkStrictly: true,
							width: 150,
							dicData: [],
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
							type: 'tree',
							slot: true,
							multiple: true,
							checkStrictly: true,
							width: 150,
							dicData: [],
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
							label: "手机号码",
							prop: "mobile",
							span: 12,
							rules: [{
								required: true,
								message: "请输入手机号码",
								trigger: "blur",
							}],
						},
					],
				},
				data: [],
			};
		},
		props:{
			label:{
				type: String
			},
			tenantId:{
				type: String
			}
		},
		computed: {
			permissionList() {
				return {
					addBtn: false,
					viewBtn: false,
					delBtn: false,
					editBtn: false,
				};
			},
		},
		methods: {
			cellClick(row, column, cell, event){
				this.$emit('submit', row);
				this.dialogVisible = false;
			},
			focus() {
				this.dialogVisible = true;
				this.loadData();
			},
			searchReset() {
				this.params = {};
				this.loadData();
			},
			searchChange(params, done) {
				this.page.currentPage = 1;
				this.params = params;
				this.loadData();
				done();
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
					this.params.tenantId = this.tenantId;
					getList(this.params).then((res) => {
						if (res.data && res.data.length) {
							var map = {};
							res.data.forEach((item) => {
								item.roleShow = [];
								item.deptShow = [];
								item.roles && (item.roles.forEach((child) => {
									map[child._id] = child.role_name
								}))
								item.role && item.role.forEach((key) => {
									if (map[key]) {
										item.roleShow.push(map[key]);
									} else {
										item.roleShow.push(key);
									}
								})
								item.depts && item.depts.forEach((dept) => {
									item.deptShow.push(dept.dept_name);
								})
							})
						}
						this.data = res.data;
						this.loading = false;
						this.page.total = res.total;
					}).catch(() => {
						this.loading = false;
					})
				})

			}
		}
	}
</script>

<style lang="scss">

</style>
