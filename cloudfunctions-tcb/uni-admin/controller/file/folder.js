const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			parentId,
			tenantId,
			folderName,
			fullName,
			sort,
			key,
			remark
		} = this.ctx.data
		return await this.service.file.folder.add({
			parentId,
			tenantId,
			folderName,
			fullName,
			sort,
			key,
			remark
		});
	}
	async update() {
		const {
			_id,
			parentId,
			tenantId,
			folderName,
			fullName,
			sort,
			key,
			remark
		} = this.ctx.data
		return await this.service.file.folder.update({
			_id,
			parentId,
			tenantId,
			folderName,
			fullName,
			sort,
			key,
			remark
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.file.folder.remove(_ids);
	}
	async list() {
		return await this.service.file.folder.list(this.ctx.data);
	}
}
