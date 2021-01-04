<template>
	<view class="table">
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="餐桌名称">
				<el-input v-model="form.name" size="small" placeholder="餐桌名称"></el-input>
			</el-form-item>
			<el-form-item label="餐桌分类">
				<el-select v-model="form.tableType" size="small" placeholder="餐桌分类">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onSearch">查询</el-button>
				<el-button @click="onResert" size="small">重置</el-button>
			</el-form-item>
		</el-form>
		<div style="margin-bottom: 15px;" >
			<el-button-group>
				<el-button type="primary" @click="addTable">新增</el-button>
			</el-button-group>
		</div>
		<el-row :gutter="10" v-loading="loadingLoad">
			<el-col :span="3" v-for="(item,idx) in tableList" :key="item._id">
				<el-popover placement="bottom" width="200" trigger="hover">
					<div style="text-align: center;">
						<el-button-group>
							<el-button @click="dianCai(item)" size="mini" type="primary">点菜</el-button>
							<el-button @click="addFoods" size="mini" type="primary">加菜</el-button>
							<el-button size="mini" type="primary">离开</el-button>
							<el-button @click="editTable(item)" size="mini" type="primary">编辑</el-button>
							<el-button @click="delTable(item)" size="mini" type="primary">删除</el-button>
						</el-button-group>
					</div>
					<el-card slot="reference" shadow="hover" :class="[item.status?`color_${item.status}`:'']">
						<div>{{item.name}}</div>
					</el-card>
				</el-popover>
			</el-col>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="formData" :option="option" @reset-change="emptytChange" @submit="submit">
				<template slot-scope="scope" slot="personLiable">
					<select-user @submit="getUser" :tenantId="$store.state.app.activeTenant" :label="formData.personLiableName"></select-user>
				</template>
			</avue-form>
		</el-dialog>
		<addFoods ref="addFoods" @submit="addFoodsSubmit"></addFoods>
		<placingOrder ref="placingOrder"></placingOrder>
	</view>
</template>

<script>
	import addFoods from '@/components/addFoods/addFoods.vue';
	import placingOrder from '@/components/placingOrder/placingOrder.vue';
	import {addFood } from '@/api/order/order.js';
	import {
		getDictByDictCode
	} from "@/api/system/dict.js"
	import {
		select,
	} from "@/api/table/table_type.js"
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/table/table.js"
	var personLiableName = '';
	var _this = null;
	export default {
		components:{
			addFoods,
			placingOrder
		},
		data() {
			return {
				title: '新增',
				dialogVisible: false,
				loading: true,
				loadingLoad: false,
				form: {
					name: '',
					tableType: '',
					personLiableName: ''
				},
				formData: {},
				option: {
					emptyText: '取消',
					column: [{
						label: "餐桌名称",
						prop: "name",
						rules: [{
							required: true,
							message: "请输入餐桌名称",
							trigger: "blur",
						}, ],
					}, {
						label: "餐桌分类",
						prop: "tableType",
						type: 'select',
						typeformat(item, label, value) {
							return `${item[label]} (${item.info} ${item.comment})`
						},
						props: {
							label: "name",
							value: "_id",
							disabled: "disabled"
						},
						dicData: [],
						rules: [{
							required: true,
							message: "请输入餐桌分类",
							trigger: "blur",
						}, ],
					}, {
						label: "餐桌状态",
						prop: "status",
						type: 'select',
						value: 1,
						props: {
							label: "dict_name",
							value: "dict_key",
							disabled: "disabled"
						},
						dicData: [],
					}, {
						label: "负责人",
						prop: "personLiable",
						formslot: true
					}, {
						label: "排序",
						prop: "sort",
						type: 'number'
					}, {
						label: "备注",
						prop: "commit",
					}]
				},
				tableList: []
			};
		},
		mounted() {
			getDictByDictCode({
				dict_code: 'table_status'
			}).then((res) => {
				const column = this.findObject(this.option.column, "status");
				column.dicData = res;
			})
			select().then((res) => {
				const column = this.findObject(this.option.column, "tableType");
				column.dicData = res;
			})
			_this = this;
			this.loadData();
		},
		methods: {
			dianCai(item){
				this.$refs.placingOrder.show({
					table: item._id,
					tableName:  item.name,
				});
			},
			addFoodsSubmit(data){
				this.$refs.addFoods.loading = true;
				addFood(data).then((res)=>{
					this.type = this.tabOption.column[0];
					this.params.status = this.type.prop;
					this.$refs.tabs.changeTabs(0);
					this.$refs.addFoods.loading = false;
					this.$refs.addFoods.hide();
					this.loadData();
					this.$message({
						message: '加菜成功',
						type: 'success'
					});
				}).catch(()=>{
					this.$refs.addFoods.loading = false;
				})
			},
			addFoods(row) {
				this.$refs.addFoods.show(row);
			},
			getUser(row) {
				var formData = JSON.parse(JSON.stringify(this.formData))
				formData.personLiable = row._id;
				formData.personLiableName = row.nickname || row.username;
				this.formData = formData;
			},
			addTable() {
				this.dialogVisible = true;
				this.formData = {};
				this.title = '新增';
			},
			editTable(row) {
				this.dialogVisible = true;
				this.formData = row;
				this.title = '编辑';
			},
			delTable(row) {
				this.$confirm('此操作将永久删除该餐桌, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					remove({
						_ids: [row._id]
					}).then(()=>{
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.loadData();
					})
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			submit(row, done, loading) {
				if(row._id){
					update(row).then(()=>{
						done();
						this.dialogVisible = false;
						this.loadData();
						this.$message({
							type: 'success',
							message: '修改成功!'
						});
					}).catch(()=>{
						done();
					})
				}else{
					row.tenantId = this.$store.state.app.activeTenant;
					add(row).then(() => {
						done();
						this.dialogVisible = false;
						this.loadData();
						this.$message({
							type: 'success',
							message: '新增成功!'
						});
					}).catch(() => {
						done();
					})
				}
				
			},
			emptytChange() {
				this.dialogVisible = false;
			},
			onSearch() {
				this.loadData();
			},
			onResert() {
				this.form = {
					name: '',
					tableType: '',
				};
			},
			loadData(clear = true) {
				this.$nextTick(() => {
					this.loadingLoad = true;
					this.form.tenantId = this.$store.state.app.activeTenant;
					getList(this.form).then((res) => {
						this.loadingLoad = false;
						this.tableList = res;
					}).catch(() => {
						this.loadingLoad = false;
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.table {
		padding: 15px;
		.color_1{
			background-color: #409EFF;
			color: #fff;
			cursor: pointer;
		}
	}
</style>
