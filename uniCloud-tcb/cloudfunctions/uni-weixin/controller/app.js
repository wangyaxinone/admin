const {
    Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async weixinLogin() {
		return await this.service.app.weixinLogin(this.ctx.data)
	}
}
