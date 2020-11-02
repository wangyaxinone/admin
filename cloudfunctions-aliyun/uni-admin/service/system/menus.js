const {
	Service
} = require('uni-cloud-router')
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
			'_id': this.db.command.in(_ids.join(','))
		}).remove();
	}
	async list(name) {
		var match = {};
		name && (match.name = new RegExp(name));
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
}
