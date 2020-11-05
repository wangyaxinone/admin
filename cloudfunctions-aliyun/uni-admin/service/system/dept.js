const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-dept').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-dept').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-dept').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.dept_name && (match.dept_name = new RegExp(param.dept_name));
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-dept').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
}
