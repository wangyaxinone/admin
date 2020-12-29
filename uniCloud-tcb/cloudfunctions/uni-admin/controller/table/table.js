const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			tenantId,
			sort,
			info,
			comment
		} = this.ctx.data
		return await this.service.table.table.add({
			name,
			tenantId,
			sort,
			info,
			comment
		});
	}
	async update() {
		const {
			_id,
			name,
			tenantId,
			sort,
			info,
			comment
		} = this.ctx.data
		return await this.service.table.table.update({
			_id,
			name,
			tenantId,
			sort,
			info,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.table.table.remove(_ids);
	}
	async list() {
		return await this.service.table.table.list(this.ctx.data);
	}
}
