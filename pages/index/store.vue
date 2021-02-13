<template>
	<div>
		<!-- <avue-data-rotate :option="option"></avue-data-rotate> -->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<h3>今日营业数据</h3>
			</div>
			<el-row :gutter="20">
				<el-col :span="8" v-for="(item,idx) in todayList" :key="idx">
					<div style="height:130px;border-radius:3px;position: relative;" :style="{backgroundColor: item.color}">
						<div style="padding-left:30px;font-size:40px;color:#fff;line-height:65px;">
							<countTo style="" :startVal='0' :endVal='item.count'
							 :decimals="item.decimals" :duration='3000'></countTo>
						</div>
						<div style="line-height:65px;padding-left:30px;font-size:18px;font-weight:bold;color:#fff;">
							{{item.title}}
						</div>
						<i style="position: absolute;top: 20px;right: 20px;font-size: 65px;color: rgba(0,0,0,.15);" :class="[item.icon]"></i>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="box-card" style="margin-top:10px;">
			<avue-data-display :option="option"></avue-data-display>
		</el-card>
	</div>
</template>

<script>
	var _this = null;
	import {
		getTodayCount
	} from '@/api/order/order.js';
	import countTo from 'vue-count-to';
	export default {
		components: {
			countTo
		},
		data() {
			return {
				todayList: [{
					click: function(item) {},
					count: '0',
					decimals: 0,
					title: '今日订单',
					icon: 'el-icon-warning',
					color: 'rgb(49, 180, 141)'
				}, {
					click: function(item) {},
					count: '0',
					title: '今日点菜量',
					icon: 'el-icon-view',
					decimals: 0,
					color: '#00a65a'
				}, {
					click: function(item) {},
					count: '0',
					title: '当日营业额',
					decimals: 2,
					icon: 'el-icon-setting',
					color: '#f39c12'
				}],
				option: {
					span: 6,
					data: [{
							click: function(item) {
								uni.navigateTo({
								    url: `/pages/order/order?status=3`
								})
							},
							title: '作废订单',
							count: 0,
							icon: 'el-icon-warning',
							color: 'rgb(49, 180, 141)',
						},
						{
							click: function(item) {
								
							},
							title: '作废菜品',
							count: 0,
							icon: 'el-icon-view',
							color: 'rgb(56, 161, 242)',
						},
						{
							click: function(item) {
								uni.navigateTo({
								    url: `/pages/table/table`
								})
							},
							title: '餐桌上座',
							count: 0,
							icon: 'el-icon-setting',
							color: 'rgb(117, 56, 199)',
						},
						{
							click: function(item) {
								alert(JSON.stringify(item));
							},
							title: '今日订餐',
							count: 0,
							icon: 'el-icon-setting',
							color: 'rgb(117, 56, 199)',
						},
					]
				},
			}
		},
		mounted() {
			_this = this;
			getTodayCount({
				tenantId: this.$store.state.app.activeTenant,
				startTime: `${new Date().Format('yyyy-MM-dd')} 00:00:00`
			}).then((res) => {
				this.todayList[0].count = res.todayOrderCount || 0;
				this.todayList[1].count = res.todayDishesCount || 0;
				this.todayList[2].count = res.todayDishesPrice || 0;
				
				this.option.data[0].count = res.todayInvalidOrderCount || 0;
				this.option.data[1].count = res.todayInvalidDishesCount || 0;
				this.option.data[2].count = res.todayUpTable || 0;
			})
		},
		methods: {}
	}
</script>

<style scoped>

</style>
