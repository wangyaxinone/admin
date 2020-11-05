const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			dept_name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.dept.add({
			dept_name,
			tenantId,
			sort,
			comment
		});
	}
	async update() {
		const {
			_id,
			dept_name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.dept.update({
			_id,
			dept_name,
			tenantId,
			sort,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.dept.remove(_ids);
	}
	async list() {
		return await this.service.system.dept.list(this.ctx.data);
	}
}
