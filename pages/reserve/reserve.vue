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
		      </template>
		    </el-calendar>
		</el-card>
	</view>
</template>

<script>
	import Lunar from "@/util/Lunar.js"
	export default {
		data() {
			return {
				Lunar
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.reserve{
	background-color: #efefef;
	padding:10px;
}
</style>
