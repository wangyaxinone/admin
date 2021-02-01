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
	export default {
		components:{
			payset
		},
		data() {
			return {
				tabs: [{
					label: '支付设置',
					components: 'payset'
				}, {
					label: '推送设置',
					components: ''
				}, {
					label: '打印机设置',
					components: ''
				}, {
					label: '菜品制作设置',
					components: ''
				}],
				currComponents: 'payset'
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
