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
		return await this.db.collection('opendb-admin-table').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-table').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-table').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
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
			data
		} = await this.db.collection('opendb-admin-table').aggregate()
			.match(match)
			.sort({
				'sort': 1
			})
			.lookup({
				from: 'opendb-admin-order',
				let: {
					table: '$_id'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr(
						$.eq(['$table', '$$table'])
					))
					.project({
						_id: 1,
						every_day_code: 1,
						order_number: 1,
						order_price: 1,
						order_type: 1,
						status: 1,
						number: 1
					})
					.done(),
				as: 'order',
			})
			.end();
		return data;
	}
}
