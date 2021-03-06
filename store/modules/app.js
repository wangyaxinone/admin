import {
	request
} from '@/js_sdk/uni-admin/request.js'
import {
	getItem,
	setItem
} from '@/js_sdk/uni-admin/localStorage.js'
import {getDeptByUser} from "@/api/system/user.js"
import getList from "@/api/system/dept.js"
import {getDicts} from '@/api/system/dict.js';
export default {
	namespaced: true,
	state: {
		inited: getItem("app_inited") || false,
		navBtn: getItem("app_navBtn") || {},
		navMenu: getItem("app_navMenu") || [],
		dicts: {},
		active:  '',
		appName: process.env.VUE_APP_NAME || '',
		
		
		isTenantAdminOrAdmin: getItem("app_isTenantAdminOrAdmin") || false,
		mode: getItem("app_mode") || 1, // 1 管理平台 2 门店
		activeTenant: getItem("app_activeTenant") || '',
		activeTenantInfo: getItem("app_activeTenantInfo") || {},
		deptlist:  getItem("app_deptlist") || [],
	},
	mutations: {
		SET_DICTS: (state, dicts) => {
			state.dicts = dicts;
		},
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
		SET_INITED: (state, bool) => {
			state.inited = bool
			setItem('app_inited', bool)
		},
		SET_NAV_BTN: (state, navBtn) => {
			state.navBtn = navBtn
			setItem('app_navBtn', navBtn)
		},
		TOGGLE_MENU_ACTIVE: (state, url) => {
			state.active = url
		},
		SET_DEPT_LIST: (state, deptlist) => {
			state.deptlist = deptlist
			setItem('app_deptlist', deptlist)
		},
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
		},
		getDicts({commit}){
			getDicts().then((res)=>{
				commit('SET_DICTS', res);
			})
		},
		getCurrentDepts({
			state,
			commit,
			rootState
		}) {
			if(state.isTenantAdminOrAdmin){
				return request('system/dept/list', {
					isCook: 1,
					tenantId: state.activeTenant
				}).then((res)=>{
					commit('SET_DEPT_LIST', res);
					return res;
				})
			}else{
				return request('system/user/getDeptByUser', {
					userId: rootState.user.userInfo._id
				}).then((res)=>{
					commit('SET_DEPT_LIST', res);
					return res;
				})
				
			}
		}
	}
}
