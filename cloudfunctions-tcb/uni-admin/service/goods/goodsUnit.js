const {
	Service
} = require('uni-cloud-router')
const {getPageConfig, getServerDate, getTree, appendTenantParams} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-goodsUnit').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-goodsUnit').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-goodsUnit').where({
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
		} = await this.db.collection('opendb-admin-goodsUnit').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-goodsUnit')
			.where(match)
			.orderBy('sort', "asc")
			.limit(size)
			.skip((page - 1) * size)
			.get();
		return {
			total,
			page,
			size,
			data
		};
	}
	async select(param) {
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
			data
		} = await this.db.collection('opendb-admin-goodsUnit')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
		
	}
}
