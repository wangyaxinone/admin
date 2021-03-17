const {
    Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
    async init() {
        return {
            userInfo: {
                ...this.ctx.auth.userInfo,
                token: undefined,
                password: undefined,
                permission: this.ctx.auth.permission,
				roles: await this.service.system.role.list({_ids: this.ctx.auth.userInfo.role}),
            },
            navMenu: await this.service.system.menus.navMneuOrBtnByRole(1,this.ctx.data),
			navBtn: await this.service.system.menus.navMneuOrBtnByRole(2,this.ctx.data)
        }
    }
	async modeAndTenant() {
		return await this.service.system.user.modeAndTenant()
	}
	async weixinLogin() {
		return await this.service.user.weixinLogin(this.ctx.data)
	}
}
