const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		const currentDate = getServerDate();
		data.create_date = currentDate;
		data.update_date = currentDate;
		data.operator = this.ctx.auth.uid;
		data.point = new this.db.Geo.Point(data.longitude, data.latitude);
		var res = await this.db.collection('opendb-admin-tenant').add(data);
		if(res.id) {
			//添加默认门店管理员角色
			var role = await this.service.system.role.add({
				role_name: `${data.name}_管理员`,
				parent_id: '',
				tenantId: res.id,
				type: 1,
				comment: '门店管理员',
				create_date: currentDate,
				update_date: currentDate,
				operator: this.ctx.auth.uid
			})
		}
		return res;
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth._id;
		data.point = new this.db.Geo.Point(data.longitude, data.latitude);
		return await this.db.collection('opendb-admin-tenant').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-tenant').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(name) {
		var match = {};
		name && (match.name = new RegExp(name));
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-tenant').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(name) {
		var match = {};
		name && (match.name = new RegExp(name));
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-tenant').where(match).orderBy('sort', "asc").get();
		return getTree(menuList);
	}
}
