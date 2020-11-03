const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			role_name,
			parent_id,
			tenantId,
			type,
			comment
		} = this.ctx.data
		return await this.service.system.role.add({
			role_name,
			parent_id,
			tenantId,
			type,
			comment
		});
	}
	async update() {
		const {
			_id,
			role_name,
			parent_id,
			tenantId,
			type,
			comment
		} = this.ctx.data
		return await this.service.system.role.update({
			_id,
			role_name,
			parent_id,
			tenantId,
			type,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.role.remove(_ids);
	}
	async list() {
		return await this.service.system.role.list(this.ctx.data);
	}
	async tree() {
		return await this.service.system.role.tree(this.ctx.data);
	}
}
