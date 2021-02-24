<template>
	<view class="reserve" style="">
		<el-card shadow="hover">
		    <el-calendar>
		      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
		      <template
		        slot="dateCell"
		        slot-scope="{date, data}">
				<div>{{date.getDate()}}</div>
				<div>{{Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[6]=='初一'?Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[5]:Lunar.toLunar(date.getFullYear(), date.getMonth()+1, date.getDate())[6]}}</div>
		      <!--  <p :class="data.isSelected ? 'is-selected' : ''">
		          {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
		        </p> -->
				<div>{{map[data.day]?'1':''}}</div>
		      </template>
		    </el-calendar>
		</el-card>
	</view>
</template>

<script>
	import {select} from "@/api/reserve/reserve.js"
	import Lunar from "@/util/Lunar.js"
	export default {
		data() {
			return {
				Lunar,
				map:[]
			}
		},
		mounted() {
			this.loadData();
		},
		methods: {
			loadData() {
				var currentYear = new Date().getFullYear();
				var currentMonth = new Date().getMonth()+1;
				var params = {
					startDate:`${new Date(`${currentYear}-${currentMonth}-01`)/1}`,
					endDate:`${new Date(`${currentYear}-${currentMonth}-31`)/1}`,
				};
				params.tenantId = this.$store.state.app.activeTenant;
				select(params).then((res)=>{
					var map = {};
					if(res && res.length) {
						res.forEach((item)=>{
							var date = new Date(item.eatDate).Format('yyyy-MM-dd')
							map[date] = item;
						})
					}
					this.map = map;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.reserve{
	background-color: #efefef;
	padding:10px;
}
</style>
