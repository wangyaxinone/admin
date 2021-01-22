const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams
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
		return await this.db.collection('opendb-admin-dishes').add(data);
	}
	async cook(data) {
		var {
			_ids
		} = data;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-dishes').where({
			'_id': this.db.command.in(_ids)
		}).update({
			status: 2,
			update_date,
			operator
		});
	}
	async updateStatus(data) {
		var {
			_ids,
			status
		} = data;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-dishes').where({
			'_id': this.db.command.in(_ids)
		}).update({
			status: status,
			update_date,
			operator
		});
	}
	async invalid(data) {
		var dbCmd = this.db.command;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		var {
			_ids
		} = data;
		// if (!_ids || !_ids.length) {
		// 	return {
		// 		code: 500,
		// 		message: `作废失败！`,
		// 	}
		// }
		
		const transaction = await this.db.startTransaction();
		try {
			
			for (var i = 0; i < _ids.length; i++) {
				var id = _ids[i];
				var dishesRes = await transaction.collection('opendb-admin-dishes').doc(id).update({
					status: 4,
					order_status: 3,
					update_date,
					operator
				});
				
				if (!dishesRes.updated) {
					await transaction.rollback()
					return {
						code: 500,
						data: dishesRes,
						message: '作废失败！'
					}
				}
				var {data: dishes} = await this.db.collection('opendb-admin-dishes').doc(id).get();
				if(dishes && dishes.length) {
					var {goodsPrice, orderId} = dishes[0];
					var {data: order} = await this.db.collection('opendb-admin-order').doc(orderId).get();
					var {order_price} = order[0];
					var orderRes = await transaction.collection('opendb-admin-order').doc(orderId).update({
						order_price: NP.minus(order_price, parseFloat(goodsPrice)),
						number: dbCmd.inc(-1),
						update_date,
						operator
					});
					if (!orderRes.updated) {
						await transaction.rollback()
						return {
							code: 500,
							data: orderRes,
							message: '作废失败！'
						}
					}
				}
			}
			await transaction.commit();
			return {
				code: 0,
				message: `作废成功！`,
			};
		} catch (e) {
			await transaction.rollback(-100)
			return {
				code: 500,
				message: `作废失败！`,
				rollbackCode: -100,
			}
		}
	}
	async list(param) {
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.goodsName && (match.goodsName = new RegExp(param.goodsName));
		param.deptId && (match.deptId = param.deptId);
		param.operator && (match.operator = param.operator);
		param.status && (match.status = this.db.command.in(param.status));
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
		} = await this.db.collection('opendb-admin-dishes').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-dishes').aggregate()
			.match(match)
			.sort({
				'create_date': 1
			})
			.skip((page - 1) * size)
			.limit(size)
			.lookup({
				from: 'opendb-admin-dept',
				localField: 'deptId',
				foreignField: '_id',
				as: 'depts',
			})
			.lookup({
				from: 'opendb-admin-table',
				localField: 'table',
				foreignField: '_id',
				as: 'tables',
			})
			.lookup({
				from: 'uni-id-users',
				let: {
					operator: '$operator'
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
				as: 'operatorShow',
			})
			.end();
		return {
			total,
			page,
			size,
			data
		};
	}
}
