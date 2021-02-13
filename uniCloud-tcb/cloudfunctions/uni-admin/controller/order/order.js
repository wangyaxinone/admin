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
			tableName,
			amound_price,
			comment
		} = this.ctx.data
		return await this.service.order.order.add({
			tenantId,
			order_type,
			goods_list,
			status,
			table,
			tableName,
			amound_price,
			comment
		});
	}
	async update() {
		const {
			_id,
			order_type,
			table,
			tenantId,
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
			tenantId,
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
			tenantId
		} = this.ctx.data
		return await this.service.order.order.remove(_ids, tenantId);
	}
	async list() {
		return await this.service.order.order.list(this.ctx.data);
	}
	async invalid() {
		return await this.service.order.order.invalid(this.ctx.data);
	}
	async leave() {
		return await this.service.order.order.leave(this.ctx.data);
	}
	async addFoods() {
		return await this.service.order.order.addFoods(this.ctx.data);
	}
	async getTodayCount() {
		return {
			todayOrderCount: await this.service.order.order.getOrderCount(Object.assign(this.ctx.data,{status: [1,2]})),
			todayInvalidOrderCount: await this.service.order.order.getOrderCount(Object.assign(this.ctx.data,{status: [3]})),
			todayDishesCount: await this.service.dishes.dishes.getDishesCount(Object.assign(this.ctx.data,{status: [1,2,3]})),
			todayInvalidDishesCount: await this.service.dishes.dishes.getDishesCount(Object.assign(this.ctx.data,{status: [4]})),
			todayDishesPrice: await this.service.dishes.dishes.getDishesPrice(Object.assign(this.ctx.data,{status: [1,2,3]})),
			todayUpTable:  await this.service.order.order.getOrderCount(Object.assign(this.ctx.data,{status: [1,2],order_type: 1, table: this.db.command.exists(true)})),
		};
	}
}
