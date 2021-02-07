const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams,
	goeasyPushBydishes
} = require('../../utils.js');
const NP = require('number-precision');
module.exports = class MenuService extends Service {
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		if (!data.tenantId) {
			data.tenantId = this.ctx.auth.userInfo.tenantId;
		}
		return await this.db.collection('opendb-admin-print').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-print').doc(_id).update(data);
	}
	async remove(params) {
		var {_ids} = params;
		return await this.db.collection('opendb-admin-print').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.name && (match.name = new RegExp(param.name));
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			basePage,
			baseSize
		} = getPageConfig();
		var page = param.page ? param.page : basePage;
		var size = param.size ? param.size : baseSize;
		let {
			total
		} = await this.db.collection('opendb-admin-print').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-print')
			.where(match)
			.orderBy('sort', "asc")
			.skip((page - 1) * size)
			.limit(size)
			.get();
		return {
			total,
			page,
			size,
			data
		};
	}
}
