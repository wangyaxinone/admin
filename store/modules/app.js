import {
	request
} from '@/js_sdk/uni-admin/request.js'
import {
	getItem,
	setItem
} from '@/js_sdk/uni-admin/localStorage.js'
export default {
	namespaced: true,
	state: {
		inited: getItem("app_inited") || false,
		navBtn: getItem("app_navBtn") || {},
		navMenu: getItem("app_navMenu") || [],
		active:  '',
		appName: process.env.VUE_APP_NAME || '',
		tenantInfo: getItem("app_tenantInfo") || {
			mode: 1, // 1 管理平台 2 门店
			activeTenant: ''
		}
	},
	mutations: {
		SET_TENANTINFO: (state, tenantInfo) => {
			state.tenantInfo = tenantInfo;
			setItem('app_tenantInfo', tenantInfo)
		},
		SET_APP_NAME: (state, appName) => {
			state.appName = appName
		},
		SET_NAV_MENU: (state, navMenu) => {
			state.inited = true
			state.navMenu = navMenu
			setItem('app_inited', true)
			setItem('app_navMenu', navMenu)
		},
		SET_NAV_BTN: (state, navBtn) => {
			state.navMenu = navBtn
			setItem('app_navBtn', navBtn)
		},
		TOGGLE_MENU_ACTIVE: (state, url) => {
			state.active = url
		}
	},
	actions: {
		init({
			commit,
			state
		}) {
			return request('app/init',state.tenantInfo)
				.then(res => {
					var tenantInfo = JSON.parse(JSON.stringify(state.tenantInfo));
					const {
						navMenu,
						userInfo,
						navBtn
					} = res;
					tenantInfo.activeTenant = userInfo.tenantId;
					var permission = {};//按钮权限
					if(navBtn && navBtn.length) {
						navBtn.forEach((item)=>{
							permission[item.menu_id] = true;
						})
					}
					commit('SET_NAV_BTN', permission)
					commit('SET_TENANTINFO', tenantInfo)
					commit('SET_NAV_MENU', navMenu)
					commit('user/SET_USER_INFO', userInfo, {
						root: true
					})
				})
		},
		setAppName({
			commit
		}, appName) {
			commit('SET_APP_NAME', appName)
		},
		changeMenuActive({
			commit
		}, url) {
			commit('TOGGLE_MENU_ACTIVE', url)
		}
	}
}
