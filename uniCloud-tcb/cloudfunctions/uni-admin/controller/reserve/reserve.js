const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			phone,
			eatDate,
			type,
			setMeal,
			eatNumber,
			eatTable,
			deposit,
			comment,
			tenantId
		} = this.ctx.data
		return await this.service.reserve.reserve.add({
			name,
			phone,
			eatDate,
			type,
			setMeal,
			eatNumber,
			eatTable,
			deposit,
			comment,
			tenantId
		});
	}
	async update() {
		const {
			_id,
			name,
			phone,
			eatDate,
			type,
			setMeal,
			eatNumber,
			eatTable,
			deposit,
			comment,
			tenantId
		} = this.ctx.data
		return await this.service.reserve.reserve.update({
			_id,
			name,
			phone,
			eatDate,
			type,
			setMeal,
			eatNumber,
			eatTable,
			deposit,
			comment,
			tenantId
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.reserve.reserve.remove(_ids);
	}
	async list() {
		return await this.service.reserve.reserve.list(this.ctx.data);
	}
	async select() {
		return await this.service.reserve.reserve.select(this.ctx.data);
	}
}
