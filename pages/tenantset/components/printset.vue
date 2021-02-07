<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @current-change="currentChange"
		 @size-change="sizeChange"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="scope" slot="update_date">
				<uniDateformate :date="scope.row.update_date"></uniDateformate>
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
					menuWidth: 180,
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
						},
						{
							label: "打印机部门",
							prop: "type",
							span: 12,
						},
						{
							label: "打印机类型",
							prop: "type",
							span: 12,
						},
						{
							label: "USER",
							prop: "USER",
							span: 12,
							rules: [{
								required: true,
								message: "请输入USER",
								trigger: "change",
							}, ],
						},
						{
							label: "UKEY",
							prop: "UKEY",
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
							span: 12,
							rules: [{
								required: true,
								message: "请输入SN",
								trigger: "change",
							}, ],
						},
						{
							label: "KEY",
							prop: "KEY",
							span: 12,
							rules: [{
								required: true,
								message: "请输入KEY",
								trigger: "change",
							}, ],
						},
						{
							label: "phone",
							prop: "phone",
							span: 12,
						},
						{
							label: "打印机状态",
							prop: "printStatus",
							span: 12,
						},
						{
							label: "状态",
							prop: "status",
							span: 12,
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
						
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;
			
		},
		methods: {
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
