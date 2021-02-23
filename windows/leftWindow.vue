<template>
	<scroll-view class="sidebar" scroll-y="true">
		<template v-if="inited">
			<!-- <uni-nav-menu :active="active" activeKey="url" activeTextColor="#409eff" @select="select">
				<uni-menu-sidebar :data="navMenu"></uni-menu-sidebar>
				<uni-menu-sidebar :data="staticMenu"></uni-menu-sidebar>
			</uni-nav-menu> -->
			<el-menu default-active="1-1" class="el-menu-vertical-demo" menu-trigger="click" :collapse="isCollapse" @select="select">
				<template v-for="(item,idx) in navMenu">
					<el-submenu :index="`${idx}`" v-if="item.children && item.children.length">
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{item.name}}</span>
						</template>
						<el-menu-item-group>
							<el-menu-item :index="`${idx}-${childIdx}`" v-for="(child,childIdx) in item.children">
								<i :class="child.icon"></i>
								<span slot="title">{{child.name}}</span>
							</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-menu-item :index="`${idx}`" v-else>
						<i :class="item.icon"></i>
						<span slot="title">{{item.name}}</span>
					</el-menu-item>
				</template>

			</el-menu>
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

		},
		methods: {
			...mapActions({
				changeMenuActive: 'app/changeMenuActive'
			}),
			select(e) {
				var idxArr = e.split('-');
				if(idxArr.length==1) {
					var item = this.navMenu[idxArr[0]];
				}else{
					var item = this.navMenu[idxArr[0]].children[idxArr[1]];
				}
				let url = item.url
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

<style lang="scss">
	.sidebar {
		position: fixed;
		top: var(--window-top);
		width: 240px;
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
