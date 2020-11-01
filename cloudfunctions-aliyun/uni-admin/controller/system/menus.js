const {
    Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
    async add() {
        return await this.service.system.menus.add(this.ctx.data);
    }
}
