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
			<template slot-scope="scope" slot="eatDate">
				<uniDateformate format="yyyy/MM/dd" :date="scope.row.eatDate"></uniDateformate>
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
	} from "@/api/reserve/reserve.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	import {
		select,
	} from "@/api/reserve/setMeal.js"
	export default {
		components: {
			uniDateformate,
		},
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.goods_type_add || false,
				  viewBtn:  this.navBtn.goods_type_list || false,
				  delBtn: this.navBtn.goods_type_remove || false,
				  editBtn: this.navBtn.goods_type_update || false,
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
					tree: true,
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					menuWidth:200,
					column: [{
							label: "订餐人",
							prop: "name",
							search: true,
							width: 100,
							span: 12,
							rules: [{
								required: true,
								message: "请输入订餐人",
								trigger: "blur",
							}, ],
						},
						{
							label: "客户电话",
							prop: "phone",
							span: 12,
							width: 100,
							type: 'number',
							rules: [{
								required: true,
								message: "请输入客户电话",
								trigger: "blur",
							}, ],
						},
						{
							label: "就餐日期",
							prop: "eatDate",
							span: 12,
							type: 'date',
							width: 100,
							slot: true,
							pickerOptions:{
							  disabledDate(time) {
								return time.getTime() < Date.now() - 8.64e7;  //如果没有后面的-8.64e7就是不可以选择今天的 
							  }
							},
							rules: [{
								required: true,
								message: "请输入客户电话",
								trigger: "blur",
							}, ],
						},
						{
							label: "午餐/晚餐",
							prop: "type",
							span: 12,
							type: 'select',
							dicData: [{
								label: '午餐',
								value: 1
							},{
								label: '晚餐',
								value: 2
							}],
							rules: [{
								required: true,
								message: "请输入客户电话",
								trigger: "blur",
							}, ],
						},
						{
							label: "套餐类型",
							prop: "setMeal",
							span: 12,
							type: 'select',
							props: {
								label: "name",
								value: "_id"
							},
							typeformat(item, label, value) {
								return `${item[label]} (${item.comment})`;
							},
							dicData: []
							
						},
						{
							label: "就餐人数",
							prop: "eatNumber",
							span: 12,
							type: 'number',
							rules: [{
								required: true,
								message: "请输入套餐类型",
								trigger: "blur",
							}, ],
						},
						{
							label: "就餐桌数",
							prop: "eatTable",
							span: 12,
							type: 'number',
							rules: [{
								required: true,
								message: "请输入套餐类型",
								trigger: "blur",
							}, ],
						},
						{
							label: "押金",
							prop: "deposit",
							span: 12,
							type: 'number',
						},
						{
							label: "备注",
							prop: "comment",
							span: 12,
							width: 150,
							rules: [{
								required: false,
								message: "请输入备注",
								trigger: "change",
							}, ],
						},
						{
							label: "最后一次操作时间",
							prop: "update_date",
							slot: true,
							width: 150,
							span: 12,
							display: false
						},
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;
			select().then((data) => {
				const column = this.findObject(this.option.column, "setMeal");
				column.dicData = data;
			})
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
				var data = JSON.parse(JSON.stringify(row))
				data.eatDate = new Date(data.eatDate)/1;
				update(data)
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
				var data = JSON.parse(JSON.stringify(row))
				data.eatDate = new Date(data.eatDate)/1;
				add(data)
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
						this.page.total = res.total;
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
