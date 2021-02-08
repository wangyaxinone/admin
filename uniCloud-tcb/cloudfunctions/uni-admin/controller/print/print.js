const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			tenantId,
			name,
			type,
			deptId,
			USER,
			UKEY,
			SN,
			KEY,
			phone,
			printStatus,
			comment
		} = this.ctx.data
		return await this.service.print.print.add({
			tenantId,
			name,
			type,
			deptId,
			USER,
			UKEY,
			SN,
			KEY,
			phone,
			printStatus,
			comment
		});
	}
	async update() {
		const {
			_id,
			tenantId,
			name,
			type,
			deptId,
			USER,
			UKEY,
			SN,
			KEY,
			phone,
			printStatus,
			comment
		} = this.ctx.data
		return await this.service.print.print.update({
			_id,
			tenantId,
			name,
			type,
			deptId,
			USER,
			UKEY,
			SN,
			KEY,
			phone,
			printStatus,
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
