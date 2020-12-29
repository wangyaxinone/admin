const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			dict_name,
			dict_key,
			dict_code,
			parent_id,
			disabled,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.dict.add({
			dict_name,
			dict_key,
			dict_code,
			parent_id,
			disabled,
			sort,
			comment
		});
	}
	async update() {
		const {
			_id,
			dict_name,
			dict_key,
			dict_code,
			parent_id,
			disabled,
			sort,
			comment
		} = this.ctx.data
		return await this.service.system.dict.update({
			_id,
			dict_name,
			dict_key,
			dict_code,
			parent_id,
			disabled,
			sort,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.dict.remove(_ids);
	}
	async list() {
		return await this.service.system.dict.list(this.ctx.data);
	}
	async tree() {
		return await this.service.system.dict.tree(this.ctx.data);
	}
	async getDictByDictCode() {
		return await this.service.system.dict.getDictByDictCode(this.ctx.data);
	}
}
