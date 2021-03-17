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
			orderPush,
			foodPush,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.role.add({
			role_name,
			parent_id,
			tenantId,
			type,
			orderPush,
			foodPush,
			sort,
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
			orderPush,
			foodPush,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.role.update({
			_id,
			role_name,
			parent_id,
			tenantId,
			type,
			orderPush,
			foodPush,
			sort,
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
	async getRoleMenus() {
		return await this.service.system.role.getRoleMenus(this.ctx.data);
	}
	async setRoleMenus() {
		return await this.service.system.role.setRoleMenus(this.ctx.data);
	}
}
