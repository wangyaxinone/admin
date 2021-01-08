<template>
	<div>
		<el-input v-model="label" placeholder="请输入内容" @focus="focus"></el-input>
		<el-dialog title="选择餐桌" :visible.sync="dialogVisible" width="80%" append-to-body>
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
				<div v-loading="loadingLoad">
					<div v-for="(value, idx) in tableList" :key="idx">
						<div style="padding:5px;margin-bottom:10px;">{{ value.key }}</div>
						<el-row :gutter="10">
							<el-col style="margin-bottom:5px;" :span="3" v-for="(item, idx) in value.arr" :key="item._id" @click.native="odlclickTable(item)">
								<el-card  shadow="hover" :class="[item.status ? `color_${item.status}` : '']">
									<div style="user-select:none;">
										<span style="font-size: 18px;">{{ item.name }}</span>
										<span style="font-size: 12px;margin-left:5px;">({{ statusMap[item.status] }})</span>
									</div>
								</el-card>
							</el-col>
						</el-row>
					</div>
				</div>
			</view>
		</el-dialog>
	</div>
</template>

<script>
	import addFoods from '@/components/addFoods/addFoods.vue';
	import placingOrder from '@/components/placingOrder/placingOrder.vue';
	import { addFood, leave } from '@/api/order/order.js';
	import { getDictByDictCode } from '@/api/system/dict.js';
	import { select } from '@/api/table/table_type.js';
	import { getList, add, update, remove } from '@/api/table/table.js';
	var personLiableName = '';
	var _this = null;
	export default {
		components: {
			addFoods,
			placingOrder
		},
		props:{
			label:{
				type: String
			},
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
				tableList: [],
				tableTypeList: [],
				statusMap: {}
			};
		},
		methods: {
			focus() {
				this.dialogVisible = true;
				getDictByDictCode({
					dict_code: 'table_status'
				}).then(res => {
					var statusMap = JSON.parse(JSON.stringify(this.statusMap));
					if (res && res.length) {
						res.forEach(item => {
							statusMap[item.dict_key] = item.dict_name;
						});
					}
					this.statusMap = statusMap;
				});
				select().then(res => {
					this.tableTypeList = res;
				});
				this.loadData();
			},
			odlclickTable(item){
				if(!item.order.order_number){
					this.$emit('submit', item)
					this.dialogVisible = false;
				}
				
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
	}
</script>

<style lang="scss" scoped>
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
</style>
