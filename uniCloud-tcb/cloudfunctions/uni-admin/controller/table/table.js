const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			tableType,
			tenantId,
			personLiable,
			sort,
			status,
			comment
		} = this.ctx.data
		return await this.service.table.table.add({
			name,
			tableType,
			tenantId,
			personLiable,
			sort,
			status,
			comment
		});
	}
	async update() {
		const {
			_id,
			name,
			tableType,
			personLiable,
			sort,
			status,
			comment
		} = this.ctx.data
		return await this.service.table.table.update({
			_id,
			name,
			tableType,
			personLiable,
			sort,
			status,
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
