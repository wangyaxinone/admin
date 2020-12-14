const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams,
	getEvertDayCode
} = require('../../utils.js');
const NP = require('number-precision');
module.exports = class MenuService extends Service {
	async add(data) {
		var _this = this;
		var date = getServerDate();
		data.create_date = date
		data.update_date = date;
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		var {every_day_code,orderNumber} = await getEvertDayCode({
			collection: 'opendb-admin-order',
			tenantId: data.tenantId,
		})
		data.every_day_code = every_day_code;
		data.order_number = orderNumber;
		if(data.amound_price) {
			data.status = 2;
		}else{
			data.status = 1;
		}
		var goods_list = JSON.parse(JSON.stringify(data.goods_list));
		delete data.goods_list;
		var goodIds = [];
		var num = 0;
		var order_price = 0;
		var numMap = {};
		var foods = [];
		if(goods_list && goods_list.length){
			goods_list.forEach((item)=>{
				goodIds.push(item.goodId);
				numMap[item.goodId] = item;
				num += parseFloat(item.num || 0);
			})
			var {
				data: goods
			} = await this.db.collection('opendb-admin-goods').where({
				'_id': this.db.command.in(goodIds)
			}).get();
			if(goods &&　goods.length) {
				goods.forEach((item)=>{
					if(numMap[item._id].num){
						for(var i=0;i<numMap[item._id].num;i++){
							order_price = NP.plus(order_price, parseFloat(item.goodsPrice));
							foods.push({
								every_day_code,
								orderNumber,
								goodsId: item._id,
								goodsName: item.goodsName,
								goodsPrice:  item.goodsPrice,
								goodsCost:  item.goodsCost,
								goodsVipPrice:  item.goodsVipPrice,
								goodsAttrValue: numMap[item._id].goodsAttrValue || '',
								comment: numMap[item._id].comment || '',
								order_type: numMap[item._id].order_type,
								tenantId:  item.tenantId,
								deptId:  item.deptId,
								goodsBigImg:  item.goodsBigImg,
								goodsSmallImg:  item.goodsSmallImg,
								goodsType: item.goodsType,
								status: 1,
								order_status: data.status,
								create_date: date,
								update_date: date,
								operator: _this.ctx.auth.uid,
								creater: _this.ctx.auth.uid,
							})
						}
					}
				})
			}
		}
		data.number = num;
		data.order_price = order_price;
		const transaction = await this.db.startTransaction();
		try{
			var orderRes = await transaction.collection('opendb-admin-order').add(data);
			if(orderRes.id && goods_list && goods_list.length) {
				var falg = true;
				for(var i=0;i<foods.length;i++){
					var item = foods[i];
					item.orderId = orderRes.id;
					var dishesRes = await transaction.collection('opendb-admin-dishes').add(item);
					if(!dishesRes.id) {
						falg = false;
					}
				}
				if(falg) {
					await transaction.commit();
					return orderRes;
				}else{
					await transaction.rollback(-100)
					return {
						code: 500,
						message: `新增订单失败！`,
						rollbackCode: -100,
					}
				}
				
			}else{
				transaction.rollback(-100);
				return {
					code: 500,
					message: `未点菜，新增订单失败！`,
					rollbackCode: -100,
				}
			}
		}catch(e){
			await transaction.rollback(-100)
			return {
				code: 500,
				message: `新增订单失败！`,
				rollbackCode: -100,
			}
		}
	}
	async update(data) {
		const {
			_id
		} = data;
		var foods = JSON.parse(JSON.stringify(data.foods));
		delete data._id;
		delete data.foods;
		if(data.amound_price && data.status == 1) {
			data.status = 2;
		}
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		const transaction = await this.db.startTransaction();
		try {
			var orderRes = await transaction.collection('opendb-admin-order').doc(_id).update(data);
			if(orderRes.updated) {
				for(var i=0;i<foods.length;i++){
					var item = foods[i];
					var dishesRes = await transaction.collection('opendb-admin-dishes').doc(item._id).update({
						order_status: data.status
					});
					if(!dishesRes.updated) {
						await transaction.rollback()
						return {
						  code: 500,
						  message: '修改失败！'
						}
					}
				}
				await transaction.commit();
				return orderRes;
			}else{
				await transaction.rollback()
				return {
				  code: 500,
				  message: '修改失败！'
				}
			}
		}catch(e) {
			await transaction.rollback()
			return {
			  code: 500,
			  message: e
			}
		}
	}
	async remove(_ids) {
		const transaction = await this.db.startTransaction();
		try {
			var remobeRes = await transaction.collection('opendb-admin-order').doc(_ids[0]).remove();
			if(!remobeRes.deleted) {
				await transaction.rollback()
				return {
				  code: 500,
				  message: '删除失败'
				}
			}
			var {data: dishesyes} = await this.db.collection('opendb-admin-dishes').where({
				'orderId': this.db.command.in(_ids)
			}).get();
			for(var i=0;i<dishesyes.length;i++){
				var item = dishesyes[i];
				var remobeRes = await transaction.collection('opendb-admin-dishes').doc(item._id).remove();
				if(!remobeRes.deleted) {
					await transaction.rollback()
					return {
					  code: 500,
					  message: '删除失败'
					}
				}
			}
			await transaction.commit();
			return remobeRes;
		}catch(e) {
			await transaction.rollback()
			return {
			  code: 500,
			  message: e
			}
		}
	}
	async list(param) {
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
		param.status && (match.status = param.status);
		let {
			basePage,
			baseSize
		} = getPageConfig();
		var page = param.page ? param.page : basePage;
		var size = param.size ? param.size : baseSize;
		let {
			total
		} = await this.db.collection('opendb-admin-order').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-order').aggregate()
			.match(match)
			.sort({
				'create_date': -1
			})
			.skip((page - 1) * size)
			.limit(size)
			.lookup({
			    from: 'opendb-admin-dishes',
			    localField: '_id',
			    foreignField: 'orderId',
			    as: 'foods',
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