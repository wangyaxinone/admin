const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams,
	getEvertDayCode,
	// goeasyConfig,
	goeasyPushByFood,
	goeasyPushByTenant,
	requestfeieyun,
	sha1,
	printPerOrder,
	printByDept,
	calcOrderPrice
} = require('../../utils.js');
const NP = require('number-precision');
module.exports = class MenuService extends Service {
	async add(data) {
		var _this = this;
		var {
			tenantId,
			tableName
		} = data;
		delete data.tableName;
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
		var goeasyConfig = tenants[0];
		var date = getServerDate();
		data.create_date = date
		data.update_date = date;
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		var {
			every_day_code,
			orderNumber
		} = await getEvertDayCode({
			collection: 'opendb-admin-order',
			tenantId: data.tenantId,
		})
		data.every_day_code = every_day_code;
		data.order_number = orderNumber;
		if (data.amound_price) {
			data.status = 2;
		} else {
			data.status = 1;
		}
		var goods_list = JSON.parse(JSON.stringify(data.goods_list));
		delete data.goods_list;
		var goodIds = [];
		var numMap = {};
		var foods = [];
		var goodsClassMap = {};
		if (goods_list && goods_list.length) {
			goods_list.forEach((item) => {
				goodIds.push(item.goodId);
				numMap[item.goodId+(item.goodsAttrValue?`-${item.goodsAttrValue}`:'')] = item;
			})
			var {
				data: goods
			} = await this.db.collection('opendb-admin-goods').where({
				'_id': this.db.command.in(goodIds)
			}).get();
			if (goods && goods.length) {
				goods.forEach((item) => {
					goodsClassMap[item._id] = item;
				})
				Object.keys(numMap).forEach((name)=>{
					var [goodId,goodsAttrValue] = name.split('-');
					var item = goodsClassMap[goodId];
					if(item.stockNumber < numMap[name].num) {
						_this.ctx.throw('stockNumber', `库存数量不足`)
					}
					if (numMap[name].num) {
						for (var i = 0; i < numMap[name].num; i++) {
							foods.push({
								every_day_code,
								orderNumber,
								goodsId: item._id,
								goodsName: item.goodsName,
								goodsPrice: item.goodsPrice,
								goodsCost: item.goodsCost,
								goodsVipPrice: item.goodsVipPrice,
								goodsAttrValue: numMap[name].goodsAttrValue || '',
								order_comment: numMap[name].comment || '',
								order_type: numMap[name].order_type,
								tenantId: item.tenantId,
								deptId: item.deptId,
								goodsBigImg: item.goodsBigImg,
								goodsSmallImg: item.goodsSmallImg,
								goodsType: item.goodsType,
								status: 1,
								order_status: data.status,
								table: data.table,
								create_date: date,
								update_date: date,
								packingPrice: item.packingPrice,
								packingPriceEvery: item.packingPriceEvery,
								operator: '',
								creater: _this.ctx.auth.uid,
							})
						}
					}
				})
			}
		}
		data.isLeave = 2;
		var allPrice= calcOrderPrice({
			foods, 
			order_type: data.order_type, 
			eatPeople: data.eatPeople, 
			utensils: data.utensils,
		})
		data.order_price = allPrice.order_price;
		data.allPackingPrice = allPrice.allPackingPrice;
		data.utensilsPrice = allPrice.utensilsPrice;
		data.number = allPrice.number;
		const transaction = await this.db.startTransaction();
		try {
			var orderRes = await transaction.collection('opendb-admin-order').add(data);
			var foodByDept = {};
			if (orderRes.id && goods_list && goods_list.length) {
				var falg = true;
				for (var i = 0; i < foods.length; i++) {
					var item = foods[i];
					item.orderId = orderRes.id;
					foodByDept[item.deptId] = foodByDept[item.deptId] || [];
					foodByDept[item.deptId].push(item);
					var dishesRes = await transaction.collection('opendb-admin-dishes').add(item);
					if (!dishesRes.id) {
						falg = false;
					}
					var goodsRes = await transaction.collection('opendb-admin-goods').doc(item.goodsId).update({
						stockNumber: _this.db.command.inc(-1)
					});
					if (!goodsRes.updated) {
						falg = false;
					}
				}
				if (falg) {
					await printPerOrder({
						tenantId,
						foods,
						_this,
						order: data,
						tableName
					});
					await printByDept({
						tenantId,
						foods,
						_this,
						order: data,
						tableName
					})
					if(goeasyConfig.path && goeasyConfig.appkey) {
						var res = await uniCloud.httpclient.request(goeasyConfig.path, {
							method: 'POST',
							data: {
								appkey: goeasyConfig.appkey,
								channel: `${tenantId}-orderChange`,
								content: `{
								  type: 'addOrder',
								  tenantId: ${tenantId}
							  }`
							},
							dataType: 'json'
						})
						for(var deptId in foodByDept){
							var res = await uniCloud.httpclient.request(goeasyConfig.path, {
								method: 'POST',
								data: {
									appkey: goeasyConfig.appkey,
									channel: `${deptId}-foodChange`,
									content: `{
									  type: 'addFood',
									  deptId: ${deptId},
								  }`
								},
								dataType: 'json'
							})
						}
					}
					
					await transaction.commit();
					return orderRes;
				} else {
					await transaction.rollback(-100)
					return {
						code: 500,
						message: `新增订单失败！`,
						rollbackCode: -100,
					}
				}

			} else {
				transaction.rollback(-100);
				return {
					code: 500,
					message: `未点菜，新增订单失败！`,
					rollbackCode: -100,
				}
			}
		} catch (e) {
			await transaction.rollback(-100)
			return {
				code: 500,
				message: e.message,
				rollbackCode: -100,
			}
		}
	}
	async update(data) {
		const {
			_id,
			no_order_price,
			no_amound_price,
			tenantId
		} = data;
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
		var goeasyConfig = tenants[0];
		var _this = this;
		var foods = JSON.parse(JSON.stringify(data.foods));
		delete data._id;
		delete data.tenantId;
		delete data.foods;
		delete data.no_order_price;
		delete data.no_amound_price;
		
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		
		var {
			data: dishes
		} = await this.db.collection('opendb-admin-dishes').where({
			'orderId': _id,
			'status': this.db.command.neq(4)
		}).get();
		var allPrice= calcOrderPrice({
			foods: dishes, 
			order_type: data.order_type, 
			eatPeople: data.eatPeople, 
			utensils: data.utensils,
		})
		data.order_price = allPrice.order_price;
		data.allPackingPrice = allPrice.allPackingPrice;
		data.utensilsPrice = allPrice.utensilsPrice;
		data.number = allPrice.number;
		const transaction = await this.db.startTransaction();
		try {
			var orderRes = await transaction.collection('opendb-admin-order').doc(_id).update(data);
			if (orderRes.updated) {
				for (var i = 0; i < foods.length; i++) {
					var item = foods[i];
					var dishesRes = await transaction.collection('opendb-admin-dishes').doc(item._id).update({
						order_status: item.order_status == 3 ? item.order_status : data.status,
						table: data.table,
						order_type: data.order_type,
						order_comment: data.comment,
						update_date: getServerDate(),
					});
					if (!dishesRes.updated) {
						await transaction.rollback()
						return {
							code: 500,
							data: dishesRes,
							message: '修改失败！'
						}
					}
				}
				await goeasyPushByTenant({
					tenantId: tenantId,
					_this: this,
					goeasyConfig
				})
				await goeasyPushByFood({
					orderId: _id,
					_this: this,
					goeasyConfig
				})
				await transaction.commit();
				return orderRes;
			} else {
				await transaction.rollback()
				return {
					code: 500,
					data: orderRes,
					message: '修改失败！'
				}
			}
		} catch (e) {
			await transaction.rollback()
			return {
				code: 500,
				message: e
			}
		}
		// if (isStartTransaction) {
			
		// } else {
		// 	var res = await this.db.collection('opendb-admin-dishes').where({
		// 		orderId: _id
		// 	}).update({
		// 		table: data.table,
		// 		order_type: data.order_type,
		// 		order_comment: data.comment,
		// 		update_date: getServerDate()
		// 	})
		// 	await goeasyPushByFood({
		// 		orderId: _id,
		// 		_this: this,
		// 		goeasyConfig
		// 	})
		// 	await goeasyPushByTenant({
		// 		tenantId: tenantId,
		// 		_this: this,
		// 		goeasyConfig
		// 	})
		// 	return await this.db.collection('opendb-admin-order').doc(_id).update(data);
		// }

	}
	async remove(_ids, tenantId) {
		var _this = this;
		
		const transaction = await this.db.startTransaction();
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		try {

			for (var i = 0; i < _ids.length; i++) {
				var remobeRes = await transaction.collection('opendb-admin-order').doc(_ids[i]).remove();
				if (!remobeRes.deleted) {
					await transaction.rollback()
					return {
						code: 500,
						message: '删除失败'
					}
				}
			}
			var {
				data: dishesyes
			} = await this.db.collection('opendb-admin-dishes').where({
				'orderId': this.db.command.in(_ids)
			}).get();
			for (var i = 0; i < dishesyes.length; i++) {
				var item = dishesyes[i];
				var remobeRes = await transaction.collection('opendb-admin-dishes').doc(item._id).remove();
				if (!remobeRes.deleted) {
					await transaction.rollback()
					return {
						code: 500,
						message: '删除失败'
					}
				}
				if(item.status != 4){
					var goodsRes = await transaction.collection('opendb-admin-goods').doc(item.goodsId).update({
						stockNumber: _this.db.command.inc(1)
					});
					if (!goodsRes.updated) {
						await transaction.rollback()
						return {
							code: 500,
							message: '删除失败'
						}
					}
				}
			}
			var {
				tenantId
			} = dishesyes[0];
			var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
			var goeasyConfig = tenants[0];
			await goeasyPushByTenant({
				tenantId: tenantId,
				_this: this,
				goeasyConfig
			})
			for (var i = 0; i < _ids.length; i++) {
				await goeasyPushByFood({
					orderId: _ids[i],
					_this: this,
					goeasyConfig
				})
			}
			await transaction.commit();
			return remobeRes;
		} catch (e) {
			await transaction.rollback()
			return {
				code: 500,
				message: e
			}
		}
	}
	async list(param) {
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
		param.status && (match.status = param.status);
		param.order_number && (match.order_number = param.order_number);
		if(param.startTime) {
			match.create_date = dbCmd.gte(new Date(param.startTime))
		}
		if(param.endTime) {
			match.create_date = dbCmd.lte(new Date(param.startTime))
		}
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
				let: {
					orderId: '$_id'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr(
						$.eq(['$orderId', '$$orderId'])
					))
					.done(),
				as: 'foods',
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
	async getOrderCount(param) {
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
		param.table && (match.table = param.table);
		param.order_type && (match.order_type = param.order_type);
		param.status && (match.status = this.db.command.in(param.status));
		let {
			total
		} = await this.db.collection('opendb-admin-order').where(match).count();
		
		return total;
	}
	async invalid(data) {
		var _this = this;
		var {
			_ids,
			tenantId,
			comment
		} = data;
		if (!_ids || !_ids.length) {
			_this.ctx.throw('FORBIDDEN', `_ids 不能为空`)
		}
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
		var goeasyConfig = tenants[0];
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		const transaction = await this.db.startTransaction();
		try {
			for (var i = 0; i < _ids.length; i++) {
				var remobeRes = await transaction.collection('opendb-admin-order').doc(_ids[i]).update({
					isLeave: 1,
					status: 3,
					comment,
					update_date,
					operator
				});
				if (!remobeRes.updated) {
					await transaction.rollback()
					return {
						code: 500,
						message: '作废失败'
					}
				}
			}

			var {
				data: dishesyes
			} = await this.db.collection('opendb-admin-dishes').where({
				'orderId': this.db.command.in(_ids)
			}).get();
			for (var i = 0; i < dishesyes.length; i++) {
				var item = dishesyes[i];
				var remobeRes = await transaction.collection('opendb-admin-dishes').doc(item._id).update({
					order_status: 3,
					status: 4,
					order_comment: comment,
					update_date,
					operator
				});
				if (!remobeRes.updated) {
					await transaction.rollback()
					return {
						code: 500,
						message: '作废失败'
					}
				}
				if(item.status != 4){
					var goodsRes = await transaction.collection('opendb-admin-goods').doc(item.goodsId).update({
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
			var {
				tenantId
			} = dishesyes[0];
			await goeasyPushByTenant({
				tenantId: tenantId,
				_this: this,
				goeasyConfig
			})
			for (var i = 0; i < _ids.length; i++) {
				await goeasyPushByFood({
					orderId: _ids[i],
					_this: this,
					goeasyConfig
				})
			}
			await transaction.commit();
			return remobeRes;
		} catch (e) {
			await transaction.rollback()
			return {
				code: 500,
				message: e
			}
		}
	}
	async leave(data) {
		var _this = this;
		var {
			_ids,
			tenantId
		} = data;
		if (!_ids || !_ids.length) {
			_this.ctx.throw('FORBIDDEN', `_ids 不能为空`)
		}
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
		var goeasyConfig = tenants[0];
		const transaction = await this.db.startTransaction();
		var update_date = getServerDate();
		var operator = this.ctx.auth.uid;
		var {
			data: order
		} = await this.db.collection('opendb-admin-order').doc(_ids[0]).get();
		try {
			for (var i = 0; i < _ids.length; i++) {
				var remobeRes = await transaction.collection('opendb-admin-order').doc(_ids[i]).update({
					isLeave: 1,
					update_date,
					operator
				});
				if (!remobeRes.updated) {
					await transaction.rollback()
					return {
						code: 500,
						message: '离开失败'
					}
				}
			}
			var {
				tenantId
			} = order[0];
			await goeasyPushByTenant({
				tenantId: tenantId,
				_this: this,
				goeasyConfig
			})
			await transaction.commit();
			return remobeRes;
		} catch (e) {
			await transaction.rollback()
			return {
				code: 500,
				message: e
			}
		}
	}
	async addFoods(data) {
		var _this = this;
		var {data: tenants} =await this.db.collection('opendb-admin-tenant').where({_id: data.tenantId}).get();
		var goeasyConfig = tenants[0];
		var updateData = {};
		var date = getServerDate();
		updateData.update_date = date;
		updateData.operator = this.ctx.auth.uid;
		updateData.status = 1;
		var goods_list = JSON.parse(JSON.stringify(data.goods_list));
		var goodIds = [];
		var numMap = {};
		var foods = [];
		var goodsClassMap = {};
		if (goods_list && goods_list.length) {
			goods_list.forEach((item) => {
				goodIds.push(item.goodId);
				numMap[item.goodId+(item.goodsAttrValue?`-${item.goodsAttrValue}`:'')] = item;
			})
			var {
				data: goods
			} = await this.db.collection('opendb-admin-goods').where({
				'_id': this.db.command.in(goodIds)
			}).get();
			var {
				tenantId
			} = goods[0];
			if (goods && goods.length) {
				goods.forEach((item) => {
					goodsClassMap[item._id] = item;
				})
				Object.keys(numMap).forEach((name)=>{
					var [goodId,goodsAttrValue] = name.split('-');
					var item = goodsClassMap[goodId];
					if (numMap[name].num) {
						for (var i = 0; i < numMap[name].num; i++) {
							foods.push({
								every_day_code: data.every_day_code,
								orderNumber: data.order_number,
								goodsId: item._id,
								goodsName: item.goodsName,
								goodsPrice: item.goodsPrice,
								goodsCost: item.goodsCost,
								goodsVipPrice: item.goodsVipPrice,
								goodsAttrValue: numMap[name].goodsAttrValue || '',
								order_comment: data.comment || '',
								order_type: data.order_type,
								tenantId: item.tenantId,
								deptId: item.deptId,
								goodsBigImg: item.goodsBigImg,
								goodsSmallImg: item.goodsSmallImg,
								goodsType: item.goodsType,
								packingPrice: item.packingPrice,
								packingPriceEvery: item.packingPriceEvery,
								status: 1,
								order_status: 1,
								table: data.table,
								create_date: date,
								update_date: date,
								creater: _this.ctx.auth.uid,
							})
						}
					}
				})
			}
		}
		var {
			data: dishes
		} = await this.db.collection('opendb-admin-dishes').where({
			'orderId': data._id,
			'status': this.db.command.neq(4)
		}).get();
		var allPrice= calcOrderPrice({
			foods: foods.concat(dishes), 
			order_type: data.order_type, 
			eatPeople: data.eatPeople, 
			utensils: data.utensils,
		})
		updateData.order_price = allPrice.order_price;
		updateData.allPackingPrice = allPrice.allPackingPrice;
		updateData.utensilsPrice = allPrice.utensilsPrice;
		updateData.number = allPrice.number;
		const transaction = await this.db.startTransaction();
		try {
			var orderRes = await transaction.collection('opendb-admin-order').doc(data._id).update(updateData);
			if (orderRes.updated && foods && foods.length) {
				var falg = true;
				var foodByDept = {};
				for (var i = 0; i < foods.length; i++) {
					var item = foods[i];
					item.orderId = data._id;
					foodByDept[item.deptId] = foodByDept[item.deptId] || 0;
					foodByDept[item.deptId]++;
					var dishesRes = await transaction.collection('opendb-admin-dishes').add(item);
					if (!dishesRes.id) {
						falg = false;
					}
					var goodsRes = await transaction.collection('opendb-admin-goods').doc(item.goodsId).update({
						stockNumber: _this.db.command.inc(-1)
					});
					if (!goodsRes.updated) {
						falg = false;
					}
				}
				if (falg) {
					await printByDept({
						tenantId,
						foods,
						_this,
						order: data
					})
					await goeasyPushByTenant({
						tenantId: tenantId,
						_this: this,
						goeasyConfig
					})
					for(var deptId in foodByDept){
						var num = foodByDept[deptId];
						if(goeasyConfig.path && goeasyConfig.appkey) {
							var res = await uniCloud.httpclient.request(goeasyConfig.path, {
								method: 'POST',
								data: {
									appkey: goeasyConfig.appkey,
									channel: `${deptId}-foodChange`,
									content: `{
									  type: 'addFood',
									  deptId: ${deptId},
									  num: ${num}
								  }`
								},
								dataType: 'json'
							})
						}
					}
					await transaction.commit();
					return  orderRes;
				} else {
					await transaction.rollback(-100)
					return {
						code: 500,
						message: `新增订单失败！`,
						rollbackCode: -100,
					}
				}

			} else {
				transaction.rollback(-100);
				return {
					code: 500,
					message: `未点菜！`,
					rollbackCode: -100,
				}
			}
		} catch (e) {
			await transaction.rollback(-100)
			return {
				code: 500,
				message: e.message,
				rollbackCode: -100,
			}
		}
	}
	
}
