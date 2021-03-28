const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams,
	goeasyPushBydishes,
	calcOrderPrice 
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
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: data.tenantId}).get();
		var goeasyConfig = tenants[0];
		return await this.db.collection('opendb-admin-dishes').add(data);
	}
	async cook(data) {
		var _this = this;
		var {
			_ids,
			tenantId
		} = data;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		var res= await this.db.collection('opendb-admin-dishes').where({
			'_id': this.db.command.in(_ids)
		}).update({
			status: 2,
			update_date,
			operator
		});
		if(res.updated){
			await goeasyPushBydishes({
				_ids: _ids,
				_this: _this,
				tenantId
			})
		}
		return res;
	}
	async updateStatus(data) {
		var _this = this;
		var {
			_ids,
			status,
			tenantId
		} = data;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		var res = await this.db.collection('opendb-admin-dishes').where({
			'_id': this.db.command.in(_ids)
		}).update({
			status: status,
			update_date,
			operator
		});
		if(res.updated){
			await goeasyPushBydishes({
				_ids: _ids,
				_this: _this,
				tenantId
			})
		}
		return res;
	}
	async invalid(data) {
		var _this = this;
		var dbCmd = this.db.command;
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		var {
			_ids,
			tenantId,
			orderId
		} = data;
		
		var {
			data: dishes
		} = await this.db.collection('opendb-admin-dishes').where({
			'orderId':orderId,
			'status': this.db.command.neq(4)
		}).get();
		var goodsIdMap = {};
		dishes.forEach((item)=>{
			goodsIdMap[item._id] = item;
		})
		var {
			data: orders
		} = await this.db.collection('opendb-admin-order').where({
			'_id':orderId
		}).get();
		var allPrice= calcOrderPrice({
			foods: dishes.filter((item)=>{
				if(_ids.indexOf(item._id)>-1) {
					return false;
				}else{
					return true;
				}
			}), 
			order_type: orders[0].order_type, 
			eatPeople: orders[0].eatPeople, 
			utensils: orders[0].utensils,
		})
		var updateData = {
			update_date,
			operator
		}
		updateData.order_price = allPrice.order_price;
		updateData.allPackingPrice = allPrice.allPackingPrice;
		updateData.utensilsPrice = allPrice.utensilsPrice;
		updateData.number = allPrice.number;
		
		const transaction = await this.db.startTransaction();
		try {
			var orderRes = await transaction.collection('opendb-admin-order').doc(orderId).update(updateData);
			if (!orderRes.updated) {
				await transaction.rollback()
				return {
					code: 500,
					data: orderRes,
					message: '作废失败！'
				}
			}
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
				if(goodsIdMap[id].status != 4) {
					var goodsRes = await transaction.collection('opendb-admin-goods').doc(goodsIdMap[id].goodsId).update({
						stockNumber: _this.db.command.inc(1)
					});
					if (!goodsRes.updated) {
						await transaction.rollback()
						return {
							code: 500,
							message: '作废失败'
						}
					}
				}
			}
			
			await goeasyPushBydishes({
				_ids: _ids,
				_this: _this,
				tenantId
			})
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
		param.goodsAttrValue && (match.goodsAttrValue = param.goodsAttrValue);
		param.operator && (match.operator = param.operator);
		param.status && (match.status = this.db.command.in(param.status));
		param._ids && (match._id = this.db.command.in(param._ids));
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
		} = await this.db.collection('opendb-admin-dishes')
			.aggregate()
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
	async getDishesCount(param) {
		var _this = this;
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		if(param.startTime) {
			match.create_date = dbCmd.gte(new Date(param.startTime))
		}
		if(param.endTime) {
			match.create_date = dbCmd.lte(new Date(param.startTime))
		}
		param.status && (match.status = this.db.command.in(param.status));
		let {
			total
		} = await this.db.collection('opendb-admin-dishes').where(match).count();
		
		return total;
	}
	async getDishesPrice(param) {
		var _this = this;
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		if(param.startTime) {
			match.create_date = dbCmd.gte(new Date(param.startTime))
		}
		if(param.endTime) {
			match.create_date = dbCmd.lte(new Date(param.startTime))
		}
		param.status && (match.status = this.db.command.in(param.status));
		let {
			data: allprice
		} = await this.db.collection('opendb-admin-dishes').aggregate()
		.match(match)
		.group({
			_id: null,
			allprice: $.sum('$goodsPrice')
		})
		.end()
		
		return (allprice && allprice[0]) ? allprice[0].allprice : 0;
	}
}
