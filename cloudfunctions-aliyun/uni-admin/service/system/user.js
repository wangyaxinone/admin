const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree, getPageConfig, appendTenantParams} = require('../../utils.js');
const uniID = require('uni-id')
module.exports = class MenuService extends Service {
	async add(data) {
		console.log(this.ctx.auth);
		data.register_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.register_ip = this.ctx.context.headers['x-mpserverless-client-ip'];
		data.password = await uniID.encryptPwd(data.password);
		return await this.db.collection('uni-id-users').add(data);
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
		var match = {
			_id: this.db.command.exists(true)
		};
		param.username && (match.username = new RegExp(param.username));
		param.nickname && (match.nickname = new RegExp(param.nickname));
		param.status && (match.status = param.status);
		appendTenantParams({
			match, 
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {basePage, baseSize} = getPageConfig();
		var page = param.page?param.page:basePage;
		var size = param.size?param.size:baseSize;
		let {
			total
		} = await this.db.collection('uni-id-users').where(match).count();
		let {
			data
		} = await this.db.collection('uni-id-users').where(match).orderBy('sort', "asc").limit(size).skip((page-1)*size).get();
		return {
			total,
			page,
			size,
			data
		};
	}
}
