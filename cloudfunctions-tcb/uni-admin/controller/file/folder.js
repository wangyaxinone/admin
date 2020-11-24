const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			fileID,
			tenantId,
			filename,
			fullPath,
			path,
			route
		} = this.ctx.data
		return await this.service.file.file.add({
			fileID,
			tenantId,
			filename,
			fullPath,
			path,
			route
		});
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
			_ids,
		} = this.ctx.data
		return await this.service.file.file.remove(_ids);
	}
	async list() {
		return await this.service.file.file.list(this.ctx.data);
	}
}
