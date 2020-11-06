const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			menu_id,
			menu_type,
			parent_id,
			icon,
			url,
			type,
			sort,
			enable
		} = this.ctx.data
		return await this.service.system.menus.add({
			name,
			menu_id,
			menu_type,
			parent_id,
			icon,
			url,
			type,
			sort,
			enable
		});
	}
	async update() {
		const {
			_id,
			name,
			menu_id,
			menu_type,
			parent_id,
			icon,
			url,
			type,
			sort,
			enable
		} = this.ctx.data
		return await this.service.system.menus.update({
			_id,
			name,
			menu_id,
			menu_type,
			parent_id,
			icon,
			url,
			type,
			sort,
			enable
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.menus.remove(_ids);
	}
	async list() {
		return await this.service.system.menus.list(this.ctx.data);
	}
	async tree() {
		return await this.service.system.menus.tree(this.ctx.data);
	}
	async addBtns() {
		return await this.service.system.menus.addBtns(this.ctx.data);
	}
}
