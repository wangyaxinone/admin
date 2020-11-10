const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			tenantId,
			isAdminTemplate,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.permissionTemplate.add({
			name,
			tenantId,
			isAdminTemplate,
			sort,
			comment
		});
	}
	async update() {
		const {
			_id,
			name,
			tenantId,
			isAdminTemplate,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.permissionTemplate.update({
			_id,
			name,
			tenantId,
			isAdminTemplate,
			sort,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.permissionTemplate.remove(_ids);
	}
	async list() {
		return await this.service.system.permissionTemplate.list(this.ctx.data);
	}
	async select() {
		return await this.service.system.permissionTemplate.select(this.ctx.data);
	}
	async getPermissionByTenant() {
		return await this.service.system.permissionTemplate.getPermissionByTenant(this.ctx.data);
	}
	async setPermission() {
		const {
			_id,
			permissions,
			dataPermissions,
		} = this.ctx.data
		return await this.service.system.permissionTemplate.setPermission({
			_id,
			permissions,
			dataPermissions,
		});
	}
}
