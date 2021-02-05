import store from '@/store'
import config from '@/admin.config.js'
const debugOptions = config.navBar.debug
import {
	Message,
	Loading
} from 'element-ui';
var loadingInstance = null;
export function request(action, data, options,{
	functionName = 'uni-admin',
	showModal = true
} = {}) {
	if(options && options.loading) {
		loadingInstance = Loading.service();
	}
	return uniCloud.callFunction({
		name: functionName,
		data: {
			action,
			data
		}
	}).then(({
		result
	}) => {
		if(loadingInstance) {
			loadingInstance.close();
		}
		if (result.code) {
			if (typeof result.code === 'string' && result.code.indexOf('TOKEN_INVALID') === 0) {
				uni.reLaunch({
					url: config.login.url
				})
			}
			const err = new Error(result.message)
			err.code = result.code
			return Promise.reject(err)
		}
		const {
			token,
			tokenExpired
		} = result
		if (token && tokenExpired) {
			store.commit('user/SET_TOKEN', {
				token,
				tokenExpired
			})
		}
		return Promise.resolve(result)
	}).catch(err => {
		if(loadingInstance) {
			loadingInstance.close();
		}
		Message.error(err.message || '请求服务失败');
		if (debugOptions && debugOptions.enable === true) {
			store.dispatch('error/add', {
				err: err.toString(),
				info: '$request("' + action + '")',
				route: '',
				time: new Date().toLocaleTimeString()
			})
		}
		return Promise.reject(err)
	})
}

export function initRequest(Vue) {
	Vue.prototype.$request = request
}
