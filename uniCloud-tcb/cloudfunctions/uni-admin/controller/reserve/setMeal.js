const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.reserve.setMeal.add({
			name,
			tenantId,
			sort,
			comment
		});
	}
	async update() {
		const {
			_id,
			name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.reserve.setMeal.update({
			_id,
			name,
			tenantId,
			sort,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.reserve.setMeal.remove(_ids);
	}
	async list() {
		return await this.service.reserve.setMeal.list(this.ctx.data);
	}
	async select() {
		return await this.service.reserve.setMeal.select(this.ctx.data);
	}
}
