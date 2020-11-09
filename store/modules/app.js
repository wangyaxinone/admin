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
		
		
		isTenantAdminOrAdmin: getItem("app_isTenantAdminOrAdmin") || false,
		mode: getItem("app_mode") || 1, // 1 管理平台 2 门店
		activeTenant: getItem("app_activeTenant") || '',
		activeTenantInfo: getItem("app_activeTenantInfo") || {},
	},
	mutations: {
		set_ACTIVETENANTINFO: (state, activeTenantInfo) => {
			state.activeTenantInfo = activeTenantInfo;
			setItem('app_activeTenantInfo', activeTenantInfo)
		},
		set_ISTENANTADMINORADMIN: (state, isTenantAdminOrAdmin) => {
			state.isTenantAdminOrAdmin = isTenantAdminOrAdmin;
			setItem('app_isTenantAdminOrAdmin', isTenantAdminOrAdmin)
		},
		SET_MODE: (state, mode) => {
			state.mode = mode;
			setItem('app_mode', mode)
		},
		SET_ACTIVETENANT: (state, activeTenant) => {
			state.activeTenant = activeTenant;
			setItem('app_activeTenant', activeTenant)
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
			state.navBtn = navBtn
			setItem('app_navBtn', navBtn)
		},
		TOGGLE_MENU_ACTIVE: (state, url) => {
			state.active = url
		}
	},
	actions: {
		mode({commit}){
			return request('app/modeAndTenant').then((res)=>{
				commit('SET_MODE', res.mode)
				commit('SET_ACTIVETENANT', res.activeTenant)
				commit('set_ISTENANTADMINORADMIN', res.isTenantAdminOrAdmin)
				res.activeTenantInfo && commit('set_ACTIVETENANTINFO', res.activeTenantInfo)
			})
		},
		init({
			commit,
			state
		}) {
			return request('app/init',{
				mode: state.mode
			})
				.then(res => {
					const {
						navMenu,
						userInfo,
						navBtn
					} = res;
					var permission = {};//按钮权限
					if(navBtn && navBtn.length) {
						navBtn.forEach((item)=>{
							permission[item.menu_id] = true;
						})
					}
					commit('SET_NAV_BTN', permission)
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
