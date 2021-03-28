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
		if(!data.tenantId){
			data.tenantId = this.ctx.auth.userInfo.tenantId;
		}
		return await this.db.collection('opendb-admin-goods').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-goods').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-goods').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.goodsName && (match.goodsName = new RegExp(param.goodsName));
		param.status && (match.status = param.status);
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
		} = await this.db.collection('opendb-admin-goods').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-goods').aggregate()
			.match(match)
			.sort({
				'sort': 1
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
						$.eq(['$_id','$$operator'])
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
	async select(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.goodsName && (match.goodsName = new RegExp(param.goodsName));
		param.status && (match.status = param.status);
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data
		} = await this.db.collection('opendb-admin-goods')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
		
	}
	async updateGoods(params) {
		var {_ids, status, packingPrice, stockNumber} = params;
		var data = {};
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		status && (data.status = status);
		packingPrice && (data.packingPrice = packingPrice);
		stockNumber && (data.stockNumber = stockNumber);
		return await this.db.collection('opendb-admin-goods').where({
			'_id': this.db.command.in(_ids)
		}).update(data);
	}
}
