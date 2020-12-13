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
							order_price += parseFloat(item.goodsPrice);
							foods.push({
								every_day_code,
								orderNumber,
								goodsId: item._id,
								goodsName: item.goodsName,
								goodsPrice:  item.goodsPrice,
								goodsCost:  item.goodsCost,
								goodsVipPrice:  item.goodsVipPrice,
								goodsAttrValue: numMap[item._id].goodsAttrValue,
								tenantId:  item.tenantId,
								deptId:  item.deptId,
								goodsBigImg:  item.goodsBigImg,
								goodsSmallImg:  item.goodsSmallImg,
								goodsType: item.goodsType,
								status: 1,
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
				foods.forEach(async (item)=>{
					item.orderId = orderRes.id;
					var dishesRes = await transaction.collection('opendb-admin-dishes').add(item);
					if(!dishesRes.id) {
						transaction.rollback(-100);
						return {
							code: 500,
							message: `菜品保存失败！`,
							rollbackCode: -100,
						}
					}
				})
				await transaction.commit();
				return orderRes;
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
		delete data._id;
		if(data.amound_price) {
			data.status = 2;
		}else{
			data.status = 1;
		}
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-order').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-order').where({
			'_id': this.db.command.in(_ids)
		}).remove();
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
