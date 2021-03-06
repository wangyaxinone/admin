export default {
    namespaced: true,
    state: {
        token: uni.getStorageSync('uni_id_token'),
        tokenExpired: uni.getStorageSync('uni_id_token_expired'),
        userInfo: uni.getStorageSync('userInfo') || {}
    },
    getters: {
        isTokenValid(state) {
            return !!state.token && state.tokenExpired > Date.now()
        }
    },
    mutations: {
        SET_TOKEN: (state, {
            token,
            tokenExpired
        }) => {
            state.token = token
            state.tokenExpired = tokenExpired
            uni.setStorageSync('uni_id_token', token)
            uni.setStorageSync('uni_id_token_expired', tokenExpired)
        },
        REMOVE_TOKEN: (state) => {
            state.token = ''
            state.tokenExpired = 0
            state.userInfo = {}
			// uni.clearStorage();
			uni.removeStorageSync('app_mode')
			uni.removeStorageSync('app_navBtn')
			uni.removeStorageSync('app_navMenu')
			uni.removeStorageSync('app_activeTenant')
			uni.removeStorageSync('app_isTenantAdminOrAdmin')
			uni.removeStorageSync('userInfo')
            uni.removeStorageSync('uni_id_token')
            uni.removeStorageSync('uni_id_token_expired')
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
			uni.setStorageSync('userInfo', userInfo)
        }
    },
    actions: {}
}
