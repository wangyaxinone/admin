const {
	Service
} = require('uni-cloud-router')
const {getPageConfig, getServerDate, getTree, appendTenantParams} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		var _this = this;
		if(data && data.length) {
			data.forEach((item)=>{
				item.create_date = getServerDate();
				item.update_date = getServerDate();
				item.operator = _this.ctx.auth.uid;
				item.creater = _this.ctx.auth.uid;
			})
		}
		return await this.db.collection('opendb-admin-file').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-file').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-file').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.route && (match.route = param.route);
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data
		} = await this.db.collection('opendb-admin-file')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
	}
}
