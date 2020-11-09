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
		return await this.service.system.permissionTemplate.add({
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
		return await this.service.system.permissionTemplate.update({
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
		return await this.service.system.permissionTemplate.remove(_ids);
	}
	async list() {
		return await this.service.system.permissionTemplate.list(this.ctx.data);
	}
}
