<template>
	<scroll-view class="sidebar"  v-if="inited" scroll-y="true">
		<template>
			<uni-nav-menu  :uniqueOpened="true" :active="active" :style="{width:`${platform=='ipad'?56:200}px`}" activeKey="url" activeTextColor="#409eff" @select="select">
				<uni-menu-sidebar :data="navMenu"></uni-menu-sidebar>
				<uni-menu-sidebar :data="staticMenu"></uni-menu-sidebar>
			</uni-nav-menu>
		</template>
	</scroll-view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	export default {
		data() {
			return {
				...config.sideBar,
				platform: config.platform,
				defaultValue: '',
			}
		},
		computed: {
			...mapState('app', ['inited', 'navMenu', 'active', 'tenantInfo']),
			isCollapse(){
				return this.platform=='ipad'?true:false;
			}
		},
		watch: {
			$route: {
				immediate: true,
				handler(newRoute, oldRoute) {
					if (newRoute.path !== (oldRoute && oldRoute.path)) {
						this.changeMenuActive(newRoute.path)
					}
				}
			},
			platform: {
				handler: function() {
					this.$nextTick(() => {
						var dom = document.getElementsByTagName('uni-left-window');
						var a = dom.item(()=>{})
						var style = '';
						if(!this.$store.state.user.token) {
							style += 'display:none;'
						}
						if(this.platform=='ipad') {
							style += 'width:56px;'
							a.setAttribute('style',style);
						}else{
							style += 'width:200px;'
							a.setAttribute('style',style);
						}
					})
					
				},
				immediate: true
			}
		},
		methods: {
			...mapActions({
				changeMenuActive: 'app/changeMenuActive'
			}),
			select(e) {
				// var idxArr = e.split('-');
				// if(idxArr.length==1) {
				// 	var item = this.navMenu[idxArr[0]];
				// }else{
				// 	var item = this.navMenu[idxArr[0]].children[idxArr[1]];
				// }
				let url = e.url
				if (!url) {
					url = this.active
				}
				this.clickMenuItem(url)
			},
			clickMenuItem(url) {
				// #ifdef H5
				if (url.indexOf('http') === 0) {
					return window.open(url)
				}
				// #endif
				// TODO 后续要调整
				uni.redirectTo({
					url: url,
					success: () => {
						this.changeMenuActive(url)
					},
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '页面 ' + url + ' 跳转失败',
							showCancel: false
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sidebar {
		position: fixed;
		top: var(--window-top);
		width: 200px;
		height: calc(100vh - (var(--window-top)));
		box-sizing: border-box;
		border-right: 1px solid darken($left-window-bg-color, 8%);
		background-color: $left-window-bg-color;
		padding-bottom: 10px;
	}

	.iconfont {
		margin-right: 5px;
	}
</style>
