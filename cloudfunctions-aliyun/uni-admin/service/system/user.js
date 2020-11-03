const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		data.register_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return this.ctx;//await this.db.collection('uni-id-users').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = new Date()/1;
		data.operator = this.ctx.auth._id;
		return await this.db.collection('uni-id-users').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('uni-id-users').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.role_name && (match.role_name = new RegExp(param.role_name));
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data: menuList
		} = await this.db.collection('uni-id-users').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
}
