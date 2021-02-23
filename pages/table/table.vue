<template>
	<view class="table">
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="餐桌名称"><el-input v-model="form.name" size="small" placeholder="餐桌名称"></el-input></el-form-item>
			<el-form-item label="餐桌分类">
				<el-select v-model="form.tableType" size="small" placeholder="餐桌分类">
					<el-option v-for="(item,idx) in tableTypeList" :key="idx" :label="`${item.name}(${item.info} ${item.comment})`" :value="item._id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="餐桌负责人">
				<select-user @submit="getFormUser" :label="form.personLiableName" :tenantId="$store.state.app.activeTenant"></select-user>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onSearch">查询</el-button>
				<el-button @click="onResert" size="small">重置</el-button>
			</el-form-item>
		</el-form>
		<div style="margin-bottom: 15px;">
			<el-button-group><el-button type="primary" size="mini" @click="addTable">新增</el-button></el-button-group>
		</div>

		<div v-loading="loadingLoad">
			<div v-for="(value, idx) in tableList" :key="idx">
				<div style="padding:5px;margin-bottom:10px;">{{ value.key }}</div>
				<el-row :gutter="10">
					<el-col style="margin-bottom:5px;" :span="4" v-for="(item, idx) in value.arr" :key="item._id" @dblclick.native="odlclickTable(item)">
						<el-popover placement="bottom" width="200" trigger="hover">
							<div style="text-align: center;">
								<el-button-group>
									<el-button v-if="item.status == 1 && navBtn.order_list_add" @click="dianCai(item)" size="mini" type="primary">点菜</el-button>
									<el-button v-if="(item.status == 2 || item.status == 3) && navBtn.order_list_addFoods" @click="addFoods(item)" size="mini" type="primary">加菜</el-button>
									<el-button v-if="item.status == 3" @click="leave(item)" size="mini" type="primary">离开</el-button>
									<el-button @click="editTable(item)" size="mini" type="primary">编辑</el-button>
									<el-button @click="delTable(item)" size="mini" type="primary">删除</el-button>
								</el-button-group>
							</div>
							<el-card  slot="reference" shadow="hover" :class="[item.status ? `color_${item.status}` : '']">
								<div style="user-select:none;">
									<span style="font-size: 18px;">{{ item.name }}</span>
									<span style="font-size: 12px;margin-left:5px;">({{ statusMap[item.status] }})</span>
								</div>
							</el-card>
							
						</el-popover>
					</el-col>
				</el-row>
			</div>
		</div>

		<el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="formData" :option="option" @reset-change="emptytChange" @submit="submit">
				<template slot-scope="scope" slot="personLiable">
					<select-user @submit="getUser" :tenantId="$store.state.app.activeTenant" :label="formData.personLiableName"></select-user>
				</template>
			</avue-form>
		</el-dialog>
		<addFoods ref="addFoods" @submit="addFoodsSubmit"></addFoods>
		<placingOrder ref="placingOrder" @submit="placingOrderSubmit"></placingOrder>
	</view>
</template>

<script>
import addFoods from '@/components/addFoods/addFoods.vue';
import placingOrder from '@/components/placingOrder/placingOrder.vue';
import { addFood, leave } from '@/api/order/order.js';
import { getDictByDictCode } from '@/api/system/dict.js';
import { select } from '@/api/table/table_type.js';
import { getList, add, update, remove } from '@/api/table/table.js';
import { mapState, mapActions } from 'vuex';
var personLiableName = '';
var _this = null;
export default {
	components: {
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
				column: [
					{
						label: '餐桌名称',
						prop: 'name',
						rules: [
							{
								required: true,
								message: '请输入餐桌名称',
								trigger: 'blur'
							}
						]
					},
					{
						label: '餐桌分类',
						prop: 'tableType',
						type: 'select',
						typeformat(item, label, value) {
							return `${item[label]} (${item.info} ${item.comment})`;
						},
						props: {
							label: 'name',
							value: '_id',
							disabled: 'disabled'
						},
						dicData: [],
						rules: [
							{
								required: true,
								message: '请输入餐桌分类',
								trigger: 'blur'
							}
						]
					},
					{
						label: '餐桌状态',
						prop: 'status',
						type: 'select',
						value: 1,
						props: {
							label: 'dict_name',
							value: 'dict_key',
							disabled: 'disabled'
						},
						dicData: []
					},
					{
						label: '负责人',
						prop: 'personLiable',
						formslot: true
					},
					{
						label: '排序',
						prop: 'sort',
						type: 'number'
					},
					{
						label: '备注',
						prop: 'comment'
					}
				]
			},
			tableList: [],
			tableTypeList: [],
			statusMap: {}
		};
	},
	computed:{
		...mapState('app', ['navBtn']),
	},
	mounted() {
		_this = this;
		getDictByDictCode({
			dict_code: 'table_status'
		}).then(res => {
			const column = this.findObject(this.option.column, 'status');
			column.dicData = res;
			var statusMap = JSON.parse(JSON.stringify(_this.statusMap));
			if (res && res.length) {
				res.forEach(item => {
					statusMap[item.dict_key] = item.dict_name;
				});
			}
			this.statusMap = statusMap;
		});

		select({
			tenantId: this.$store.state.app.activeTenant
		}).then(res => {
			const column = this.findObject(this.option.column, 'tableType');
			column.dicData = res;
			this.tableTypeList = res;
		});
		this.loadData();
		this.$eventBus.on('orderChange', ()=>{
			this.loadData();
		})
	},
	watch: {
		dialogVisible() {
			if (!this.dialogVisible) {
				this.$refs.form.resetForm();
			}
		}
	},
	methods: {
		odlclickTable(item){
			if(item.order && item.order.order_number){
				uni.navigateTo({
				    url: `/pages/order/order?status=${item.order.status}&order_number=${item.order.order_number}`
				})
			}
			
		},
		leave(item) {
			leave({
				_ids: [item.order._id],
				tenantId:item.order.tenantId
			}).then((res)=>{
				this.loadData();
				this.$message({
					message: '操作成功',
					type: 'success'
				});
			})
		},
		dianCai(item) {
			this.$refs.placingOrder.show({
				table: item._id,
				tableName: item.name
			});
		},
		placingOrderSubmit() {
			this.loadData();
		},
		addFoodsSubmit(data) {
			this.$refs.addFoods.loading = true;
			addFood(data)
				.then(res => {
					this.$refs.addFoods.loading = false;
					this.$refs.addFoods.hide();
					this.loadData();
					this.$message({
						message: '加菜成功',
						type: 'success'
					});
				})
				.catch(() => {
					this.$refs.addFoods.loading = false;
				});
		},
		addFoods(row) {
			row.order.tableName = row.name;
			this.$refs.addFoods.show(row.order);
		},
		getFormUser(row) {
			var form = JSON.parse(JSON.stringify(this.form));
			form.personLiable = row._id;
			form.personLiableName = row.nickname || row.username;
			this.form = form;
		},
		getUser(row) {
			var formData = JSON.parse(JSON.stringify(this.formData));
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
			})
				.then(() => {
					remove({
						_ids: [row._id]
					}).then(() => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.loadData();
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		submit(row, done, loading) {
			if (row._id) {
				update(row)
					.then(() => {
						done();
						this.dialogVisible = false;
						this.loadData();
						this.$message({
							type: 'success',
							message: '修改成功!'
						});
					})
					.catch(() => {
						done();
					});
			} else {
				row.tenantId = this.$store.state.app.activeTenant;
				add(row)
					.then(() => {
						done();
						this.dialogVisible = false;
						this.loadData();
						this.$message({
							type: 'success',
							message: '新增成功!'
						});
					})
					.catch(() => {
						done();
					});
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
				tableType: ''
			};
			this.loadData();
		},
		loadData(clear = true) {
			this.$nextTick(() => {
				this.loadingLoad = true;
				this.form.tenantId = this.$store.state.app.activeTenant;
				getList(this.form)
					.then(res => {
						this.loadingLoad = false;
						var classMap = {};
						if (res && res.length) {
							res.forEach(item => {
								item.order = item.order[0] || {};
								if(item.order && item.order.status){
									item.status = parseFloat(item.order.status) + 1;
								}else{
									item.status = item.status || 1;
								}
								var tableType = item.tableTypeShow[0];
								if (item.personLiableShow && item.personLiableShow[0]) {
									item.personLiableName = item.personLiableShow[0].nickname || item.personLiableShow[0].username;
								}
								var key = `${tableType.name}(${tableType.info} ${tableType.comment})`;
								classMap[key] = classMap[key] || [];
								classMap[key].push(item);
							});
						}
						var newclassMap = [];
						Object.keys(classMap).forEach(key => {
							newclassMap.push({
								key,
								arr: classMap[key]
							});
						});
						newclassMap.sort((data1, data2) => {
							return data1.key > data2.key ? 1 : -1;
						});
						this.tableList = newclassMap;
					})
					.catch(() => {
						this.loadingLoad = false;
					});
			});
		}
	}
};
</script>

<style lang="scss" >
	
.table {
	padding: 15px;

	.color_1 {
		background-color: #909399;
		color: #fff;
		cursor: pointer;
	}
	.color_2 {
		background-color: #f56c6c;
		color: #fff;
		cursor: pointer;
	}
	.color_3 {
		background-color: #67c23a;
		color: #fff;
		cursor: pointer;
	}
	.color_4 {
		background-color: #e6a23c;
		color: #fff;
		cursor: pointer;
	}
	.color_5 {
		background-color: #DCDFE6;
		color: #fff;
		cursor: pointer;
		cursor: not-allowed;
	}
}
</style>
