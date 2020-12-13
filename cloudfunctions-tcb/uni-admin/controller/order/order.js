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
			comment
		} = this.ctx.data
		return await this.service.order.order.update({
			_id,
			order_type,
			table,
			amound_price,
			comment
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
}
