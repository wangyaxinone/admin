<template>
	<view>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<h3>今日所有门店数据</h3>
			</div>
			<el-row :gutter="20">
				<el-col :span="8" v-for="(item,idx) in todayList" :key="idx">
					<div style="height:130px;border-radius:3px;position: relative;margin-bottom:10px;" :style="{backgroundColor: item.color}">
						<div style="padding-left:30px;font-size:40px;color:#fff;line-height:65px;">
							<countTo style="" :startVal='0' :endVal='item.count/1'
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
		<!-- <h2>支持二次开发 加微信 s7952787</h2>
		<h3>平台功能</h3>
		<view style="color:#e4393c;">
			<h3>没有杂乱的营销功能，只有提升门店效率的功能</h3>
			<p>admin有所有权限，其他角色自行配置。门店管理员可登录平台查看自己权限内的门店</p>
		</view>
		<el-row>
			<el-col :span="12">
				<ol>
					<li>门店管理（多租户模式）</li>
					<li>用户管理</li>
					<li>角色管理（可配置角色页面权限和数据权限）</li>
					<li>部门管理</li>
					<li>系统菜单</li>
					<li>门店菜单</li>
					<li>权限模板</li>
					<li>字典管理</li>
				</ol>
			</el-col>
			<el-col :span="12">
				<el-image style="width: 100%" src="/static/1.png" fit="contain "></el-image>
			</el-col>
		</el-row>
		<h3>门店功能</h3>
		<ul style="color:#e4393c;">
			<li>门店管理员有除了订单删除外的所有权限，其他角色可自行配置权限</li>
			<li>对接了推送，实现实时订单和语音播报功能（goEasy推送）</li>
			<li>对接了打印机，可实现订单打印和分部门打印菜品（飞蛾打印机）</li>
			<li>对接了小程序，支持扫码点餐</li>
			<li>支持查看订单每道菜品付款情款，制作情况</li>
			<li>小程序端支持查看菜品制作情况，没做菜品一键作废。（顾客可以直接推掉没做菜品，提升顾客体验）</li>
		</ul>
		<el-row>
			<el-col :span="12">
				<ol>
					<li>
						商品管理
						<ul>
							<li>商品列表</li>
							<li>商品分类</li>
							<li>商品单位</li>
						</ul>
					</li>
					<li>
						订单管理（支持堂食和打包）（暂未对接外卖配送平台）
						<ul>
							<li>订单列表</li>
						</ul>
					</li>
					<li>
						餐桌管理
						<ul>
							<li>餐桌列表</li>
							<li>餐桌分类</li>
						</ul>
					</li>
					<li>
						菜品制作
					</li>
					<li>
						资源管理
					</li>
					<li>
						门店设置
						<ul>
							<li>门店设置</li>
							<li>小程序设置</li>
							<li>推送设置</li>
							<li>打印机设置</li>
							<li>菜品制作设置</li>
						</ul>
					</li>
				</ol>
			</el-col>
			<el-col :span="12">

			</el-col>
		</el-row>
		<el-image style="width: 100%" src="/static/2.png" fit="contain "></el-image>
		<el-image style="width: 100%" src="/static/3.png" fit="contain "></el-image> -->
	</view>
</template>

<script>
	var _this = null;
	import {
		getTodayCount
	} from '@/api/order/order.js';
	import countTo from 'vue-count-to';
	import {
		select
	} from "@/api/reserve/reserve.js"
	export default {
		components: {
			countTo
		},
		data() {
			return {
				map: {},
				range: ['2019-03-04', '2019-03-24'],
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
				}, {
					click: function(item) {},
					count: '0',
					title: '门店数量',
					decimals: 0,
					icon: 'el-icon-setting',
					color: '#a59c12'
				}],
			}
		},
		mounted() {
			_this = this;
			getTodayCount({
				startTime: `${new Date().Format('yyyy-MM-dd')} 00:00:00`
			}).then((res) => {
				this.todayList[0].count = res.todayOrderCount || 0;
				this.todayList[1].count = res.todayDishesCount || 0;
				this.todayList[2].count = res.todayDishesPrice || 0;
				this.todayList[3].count = res.todayTenantCount || 0;
			})
		},
		methods: {}
	}
</script>

<style>
</style>
