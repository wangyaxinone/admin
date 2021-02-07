const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			tenantId,
			user,
			name,
			SN,
			KEY,
			phone,
			comment
		} = this.ctx.data
		return await this.service.print.print.add({
			tenantId,
			user,
			name,
			SN,
			KEY,
			phone,
			comment
		});
	}
	async update() {
		const {
			_id,
			tenantId,
			user,
			name,
			SN,
			KEY,
			phone,
			comment
		} = this.ctx.data
		return await this.service.print.print.update({
			_id,
			tenantId,
			user,
			name,
			SN,
			KEY,
			phone,
			comment
		});
	}
	async remove() {
		return await this.service.print.print.remove(this.ctx.data);
	}
	async list() {
		return await this.service.print.print.list(this.ctx.data);
	}
}
