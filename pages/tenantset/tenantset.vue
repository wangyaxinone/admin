<template>
	<view class="tenantset">
		<el-row>
			<el-col :span="4">
				<el-menu default-active="0" class="el-menu-vertical-demo" @select="open">
					<el-menu-item :index="idx+''" v-for="(item,idx) in tabs" :key="idx">
						<i class="el-icon-menu"></i>
						<span slot="title">{{item.label}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="20">
				<component :is="currComponents"></component>
			</el-col>
		</el-row>

	</view>
</template>

<script>
	import payset from "./components/payset.vue"
	import pushset from "./components/pushset.vue"
	import printset from "./components/printset.vue"
	import foodset from "./components/foodset.vue"
	import xiaoChengXu from "./components/xiaoChengXu.vue"
	export default {
		components:{
			payset,
			pushset,
			printset,
			foodset,
			xiaoChengXu
		},
		data() {
			return {
				tabs: [
					{
					label: '小程序设置',
					components: 'xiaoChengXu'
				}, 
				{
					label: '推送设置',
					components: 'pushset'
				}, {
					label: '打印机设置',
					components: 'printset'
				}, {
					label: '菜品制作设置',
					components: 'foodset'
				}],
				currComponents: 'pushset'
			};
		},
		methods:{
			open(index) {
				this.currComponents = this.tabs[index].components;
			}
		}
	}
</script>

<style lang="scss">
	.tenantset {
		padding: 10px 20px;
		min-height: 100%;
	}
</style>
