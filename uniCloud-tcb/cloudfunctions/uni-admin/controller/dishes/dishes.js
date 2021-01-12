const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			tenantId,
			order_type,
			goods_list,
			status,
			table,
			amound_price,
			comment
		} = this.ctx.data
		return await this.service.dishes.dishes.add({
			tenantId,
			order_type,
			goods_list,
			status,
			table,
			amound_price,
			comment
		});
	}
	async update() {
		const {
			_id,
			order_type,
			table,
			amound_price,
			status,
			order_price,
			no_order_price,
			no_amound_price,
			comment,
			foods
		} = this.ctx.data
		return await this.service.dishes.dishes.update({
			_id,
			order_type,
			status,
			table,
			order_price,
			amound_price,
			no_order_price,
			no_amound_price,
			comment,
			foods
		});
	}
	async list() {
		return await this.service.dishes.dishes.list(this.ctx.data);
	}
	async invalid() {
		return await this.service.dishes.dishes.invalid(this.ctx.data);
	}
}
