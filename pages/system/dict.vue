<template>
	<view class="uni-container">
		<avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="{type,size,row}" slot="menu">
				<el-button icon="el-icon-plus" :size="size" :type="type" @click="addChildMenus(row)">添加子字典</el-button>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	// 分页配置
	import config from '@/admin.config.js'
	import iconList from "@/config/iconList";
	import {getList, add, update, remove, tree} from "@/api/system/dict.js"
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
							label: "字典名称",
							prop: "dict_name",
							width:150,
							span: 12,
							rules: [{
								required: true,
								message: "请输入字典名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "字典编号",
							prop: "dict_code",
							search: true,
							span: 12,
							rules: [{
								required: true,
								message: "请输入字典编号",
								trigger: "change",
							}, ],
						},
						{
							label: "上级字典",
							prop: "parent_id",
							span: 12,
							type: 'tree',
							dicData: [],
							props: {
								label: "dict_name",
								value: "_id"
							},
						},
						{
							  label: "字典键值",
							  prop: "dict_key",
							  type: "number",
							  rules: [{
								required: true,
								message: "请输入字典键值",
								trigger: "blur"
							  }]
						},
						{
							label: "禁止选中",
							prop: "disabled",
							span: 12,
							type: 'switch',
							value: false,
							dicData: [{
								label: '禁用',
								value: true
							}, {
								label: '启用',
								value: false
							}],
							rules: [{
								required: true,
								message: "请输入url",
								trigger: "change",
							}, ],
						},
						{
							label: "字典排序",
							prop: "sort",
							type: "number",
							span: 12,
							rules: [{
								required: true,
								message: "请输入角色排序",
								trigger: "blur",
							}, ],
						},{
							label: "备注",
							prop: "comment",
							span: 12,
						}
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
					this.form.parent_id = row._id;
					this.form.dict_code= row.dict_code;
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
					tree(this.params).then((res)=>{
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
