const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		return await this.db.collection('opendb-admin-menus').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		if(data.menu_id === data.parent_id) {
			this.throw('MENUS_ERROR', `上级菜单不能是当前菜单`);
		}
		delete data._id;
		return await this.db.collection('opendb-admin-menus').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-menus').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.name && (match.name = new RegExp(param.name));
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(param) {
		var match = {};
		param.name && (match.name = new RegExp(param.name));
		let {
			data: list
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', "asc").get();
		return getTree(list,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
	}
	async navMneuOrBtnByRole(type) {
		var match = {
			enable: true,
			type: type || 1
		};
		let permission = this.ctx.auth.permission;
		console.log(this.ctx.auth)
		if(this.ctx.auth.role.indexOf('admin') == -1) {
			match._id = this.db.command.in(permission);
		}
		let {
		    data: menuList
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', 'asc').get();
		return getTree(menuList,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
	}
}
