<template>
	<view class="reserve" style="">
		<el-card shadow="hover">
			<el-calendar ref="calendar" v-model="date">
				<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
				<div @click="clickHandle(map[data.day])" style="position: relative;" slot="dateCell" slot-scope="{date, data}">
					<div>{{date.getDate()}}</div>
					<div>{{Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[6]=='初一'?Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[5]:Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[6]}}</div>
					<span v-if="map[data.day]" style="position: absolute;top:10px;right:10px;display:inline-block;width:10px;height: 10px;border-radius:5px;background-color: #e4393c;"></span>
				</div>
			</el-calendar>
		</el-card>
		<el-dialog title="订餐列表" :visible.sync="dialogVisible" width="80%" >
			<el-table
			    :data="tableData"
			    height="250"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="name"
			      label="订餐人"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="phone"
			      label="客户电话"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="type"
			      label="午餐/晚餐">
				  <template slot-scope="scope">
				          {{scope.row.type==1?'午餐':'晚餐'}}
					</template>
			    </el-table-column>
				<el-table-column
				  prop="setMeal"
				  label="套餐类型">
				</el-table-column>
				<el-table-column
				  prop="eatNumber"
				  label="就餐人数">
				</el-table-column>
				<el-table-column
				  prop="eatTable"
				  label="就餐桌数">
				</el-table-column>
				<el-table-column
				  prop="deposit"
				  label="押金">
				</el-table-column>
				<el-table-column
				  prop="comment"
				  label="备注">
				</el-table-column>
			  </el-table>
		</el-dialog>
	</view>
</template>

<script>
	import {
		select
	} from "@/api/reserve/reserve.js"
	import Lunar from "@/util/Lunar.js"
	export default {
		data() {
			return {
				Lunar,
				dialogVisible: false,
				date: '',
				currentYear: '',
				currentMonth: '',
				map: {},
				tableData: []
			}
		},
		mounted() {
			this.currentYear = new Date().getFullYear();
			this.currentMonth = new Date().getMonth() + 1;
			this.loadData();
		},
		watch: {
			'date': function(newValue, oldValue) {
				var currentYear = new Date(newValue).getFullYear();
				var currentMonth = new Date(newValue).getMonth() + 1;
				if (this.currentYear != currentYear || this.currentMonth != currentMonth) {
					this.currentYear = currentYear;
					this.currentMonth = currentMonth;
					this.loadData();
				}


			}
		},
		methods: {
			clickHandle(list) {
				if(list && list.length){
					this.dialogVisible = true;
					this.tableData =list; 
				}
				
			},
			loadData() {
				var params = {
					startDate: `${new Date(`${this.currentYear}-${this.currentMonth-1}-01`)/1}`,
					endDate: `${new Date(`${this.currentYear}-${this.currentMonth+1}-31`)/1}`,
				};
				params.tenantId = this.$store.state.app.activeTenant;
				select(params).then((res) => {
					var map = {};
					if (res && res.length) {
						res.forEach((item) => {
							var date = new Date(item.eatDate).Format('yyyy-MM-dd');
							map[date] = map[date] || [];
							map[date].push(item);
						})
					}
					this.map = map;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.reserve {
		background-color: #efefef;
		padding: 10px;
	}
</style>
