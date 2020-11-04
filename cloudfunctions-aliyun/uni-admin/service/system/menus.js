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
}
