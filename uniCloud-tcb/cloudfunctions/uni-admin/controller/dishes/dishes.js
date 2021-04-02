const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			tenantId,
			order_type,
			goods_list,
			tableName,
			order_comment
		} = this.ctx.data
		return await this.service.dishes.dishes.add({
			tenantId,
			order_type,
			goods_list,
			tableName,
			order_comment
		});
	}
	async cook() {
		return await this.service.dishes.dishes.cook(this.ctx.data);
	}
	async updateStatus() {
		return await this.service.dishes.dishes.updateStatus(this.ctx.data);
	}
	async list() {
		return await this.service.dishes.dishes.list(this.ctx.data);
	}
	async invalid() {
		return await this.service.dishes.dishes.invalid(this.ctx.data);
	}
}
