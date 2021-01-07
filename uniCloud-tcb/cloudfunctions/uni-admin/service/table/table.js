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
		var _this = this;
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		var {data: table} = await this.db.collection('opendb-admin-table').doc(_id).get();
		if(table && table.length){
			if(table[0].status == 2 || table[0].status == 3 || table[0].status == 4) {
				_this.ctx.throw('FORBIDDEN', `当前餐桌状态不能操作`)
			}
		}
		return await this.db.collection('opendb-admin-table').doc(_id).update(data);
	}
	async remove(_ids) {
		var _this = this;
		var {
			data: tables
		} = await this.db.collection('opendb-admin-table').where({
			'_id': this.db.command.in(_ids)
		}).get();
		if(tables && tables.length) {
			tables.forEach((table)=>{
				if(table.status == 2 || table.status == 3 || table.status == 4) {
					_this.ctx.throw('FORBIDDEN', `当前餐桌状态不能操作`)
				}
			})
		}
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
						$.and([
							$.eq(['$table', '$$table']),
							$.eq(['$isLeave', 2])
						])
					))
					.done(),
				as: 'order',
			})
			.lookup({
				from: 'opendb-admin-tableType',
				let: {
					tableType: '$tableType'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr(
						$.eq(['$_id', '$$tableType'])
					))
					.project({
						_id: 1,
						name: 1,
						info: 1,
						comment: 1
					})
					.done(),
				as: 'tableTypeShow',
			})
			.lookup({
				from: 'uni-id-users',
				let: {
					operator: '$personLiable'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr(
						$.eq(['$_id', '$$operator'])
					))
					.project({
						_id: 0,
						username: 1,
						nickname: 1
					})
					.done(),
				as: 'personLiableShow',
			})
			.end();
		return data;
	}
}
