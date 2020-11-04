const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			username,
			password,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			role
		} = this.ctx.data
		return await this.service.system.user.add({
			username,
			password,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			role
		});
	}
	async update() {
		const {
			_id,
			username,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			role
		} = this.ctx.data
		return await this.service.system.user.update({
			_id,
			username,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			role
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.user.remove(_ids);
	}
	async list() {
		return await this.service.system.user.list(this.ctx.data);
	}
}
