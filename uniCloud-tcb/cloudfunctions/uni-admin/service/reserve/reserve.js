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
		return await this.db.collection('opendb-admin-reserve').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-reserve').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-reserve').where({
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
		param.eatDate && (match.eatDate = param.eatDate);
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
		} = await this.db.collection('opendb-admin-reserve').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-reserve').aggregate()
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
		param.name && (match.name = new RegExp(param.name));
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		if(param.startDate && param.endDate) {
			match.eatDate = this.db.command.and([
				this.db.command.gte(parseFloat(param.startDate)),
				this.db.command.lte(parseFloat(param.endDate))
			])
		}else if(param.startDate){
			match.eatDate = this.db.command.gte(parseFloat(param.startDate))
		}else if(param.endDate) {
			match.eatDate = this.db.command.lte(parseFloat(param.endDate))
		}
		let {
			data
		} = await this.db.collection('opendb-admin-reserve')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
		
	}
}
