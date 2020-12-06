const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		return await this.service.file.file.add(this.ctx.data);
	}
	async update() {
		const {
			_id,
			fileID,
			tenantId,
			filename,
			fullPath,
			path,
			route
		} = this.ctx.data
		return await this.service.file.file.update({
			_id,
			fileID,
			tenantId,
			filename,
			fullPath,
			path,
			route
		});
	}
	async remove() {
		const {
			ids,
		} = this.ctx.data
		return await this.service.file.file.remove(ids);
	}
	async list() {
		return await this.service.file.file.list(this.ctx.data);
	}
}
