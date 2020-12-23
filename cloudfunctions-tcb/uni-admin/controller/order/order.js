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
		return await this.service.order.order.add({
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
		return await this.service.order.order.update({
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
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.order.order.remove(_ids);
	}
	async list() {
		return await this.service.order.order.list(this.ctx.data);
	}
	async invalid() {
		return await this.service.order.order.invalid(this.ctx.data);
	}
}
