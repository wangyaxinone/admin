<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @current-change="currentChange"
		 @size-change="sizeChange"
		  @refresh-change="loadData"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="update_date">
				<uniDateformate :date="scope.row.update_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="status">
				<el-tooltip class="item" effect="dark" :content="scope.row.status" placement="top">
				  <span style="width:15px;height: 15px;border-radius:10px;display:inline-block;" :style="{backgroundColor: mapClass[scope.row.status].color}"></span>
				</el-tooltip>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	var _this
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/print/print.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	import {getDeptByUser} from "@/api/system/user.js"
	import {getList as getDeptList} from "@/api/system/dept.js"
	export default {
		components: {
			uniDateformate,
		},
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: true,
				  viewBtn: true,
				  delBtn: true,
				  editBtn: true,
				};
			  },
		},
		data() {
			return {
				mapClass: {
					'离线。':{
						color: '#F56C6C',
						status: '1',
					},
					'在线，工作状态正常。':{
						color: '#67C23A',
						status: '2',
					},
					'在线，工作状态不正常。':{
						color: '#E6A23C',
						status: '3',
					},
				},
				page: {
					pageSize: config.pages.pageSize,
					currentPage: config.pages.currentPage,
					total: 0
				},
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
					menuWidth: 220,
					column: [{
							label: "打印机名称",
							prop: "name",
							span: 12,
							rules: [{
								required: true,
								message: "请输入单位名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "打印机类型",
							prop: "type",
							span: 12,
							type: 'select',
							value: 1,
							dicData: [{
								label: '前台打印机',
								value: 1
							},{
								label: '后厨打印机',
								value: 2
							}],
							rules: [
								{
									required: true,
									message: '请选择下单类型',
									trigger: 'change'
								}
							]
						},
						{
							label: "打印机部门",
							prop: "deptId",
							display: true,
							type: 'select',
							dicData:[],
							multiple: true,
							props: {
								label: "dept_name",
								value: "_id"
							},
							rules: [
								{
									required: true,
									message: '请选择打印机部门',
									trigger: 'change'
								}
							],
							span: 12,
						},
						{
							label: "USER",
							prop: "USER",
							value:'410694500@qq.com',	
							span: 12,
							editDisabled: true,
							rules: [{
								required: true,
								message: "请输入USER",
								trigger: "change",
							}, ],
						},
						{
							label: "UKEY",
							prop: "UKEY",
							editDisabled: true,
							value:'gUj5WWM8XsbnGhQD',
							span: 12,
							rules: [{
								required: true,
								message: "请输入UKEY",
								trigger: "change",
							}, ],
						},
						{
							label: "SN",
							prop: "SN",
							editDisabled: true,
							span: 12,
							value:'921592694',
							rules: [{
								required: true,
								message: "请输入SN",
								trigger: "change",
							}, ],
						},
						{
							label: "KEY",
							prop: "KEY",
							editDisabled: true,
							span: 12,
							value:'m4pw29mx',
							rules: [{
								required: true,
								message: "请输入KEY",
								trigger: "change",
							}, ],
						},
						{
							label: "电话卡",
							prop: "phone",
							editDisabled: true,
							span: 12,
						},
						{
							label: "打印机宽度（mm）",
							prop: "width",
							value: '58',
							span: 12,
						},
						{
							label: "是否启用",
							prop: "printStatus",
							type: 'select',
							fixed: true,
							width:60,
							value: 1,
							dicData: [{
								label: '启用',
								value: 1
							},{
								label: '禁用',
								value: 2
							}],
							rules: [
								{
									required: true,
									message: '请选择是否启用',
									trigger: 'change'
								}
							]
						},
						{
							label: "状态",
							prop: "status",
							width:50,
							fixed: true,
							display: false,
							span: 12,
							slot: true
						},
						{
							label: "备注",
							prop: "comment",
							span: 12,
							rules: [{
								required: false,
								message: "请输入备注",
								trigger: "change",
							}, ],
						},
						{
							label: '创建时间',
							prop: 'create_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作时间',
							prop: 'update_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作人',
							prop: 'operator',
							addDisplay: false,
							editDisplay: false
						}
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;
			const column = _this.findObject(_this.option.column, "deptId");
			if(this.$store.state.app.isTenantAdminOrAdmin){
				getDeptList({
					isCook: 1,
					tenantId: this.$store.state.app.activeTenant
				}).then((res)=>{
					column.dicData = res;
				})
			}else{
				getDeptByUser({
					userId: this.$store.state.user.userInfo._id
				}).then((res)=>{
					column.dicData = res;
				})
				
			}
		},
		watch: {
			'form.type': function(newValue) {
				const column = _this.findObject(_this.option.column, "deptId");
				if(newValue==1){
					column.display = false;
					this.form.deptId = '';
				}else{
					column.display = true;
				}
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
				row.tenantId = this.$store.state.app.activeTenant;
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
				this.$nextTick(()=>{
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
					this.params.tenantId = this.$store.state.app.activeTenant;
					getList(this.params).then((res) => {
						this.loading = false;
						if(res.data && res.data.length) {
							res.data.forEach((item)=>{
								if(item.operatorShow && item.operatorShow.length) {
									item.operator = item.operatorShow[0].nickname || item.operatorShow[0].username;
								}
							})
						}
						this.data = res.data;
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
