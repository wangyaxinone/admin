const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	appendTenantParams,
	requestfeieyun,
	sha1
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
		var UNIX = Math.round(new Date().getTime()/1000);
		const transaction = await this.db.startTransaction();
		var feieyun = await requestfeieyun({
			data: {
				user: data.USER,
				stime: UNIX,
				sig: sha1(`${data.USER}${data.UKEY}${UNIX}`),
				apiname: 'Open_printerAddlist',
				printerContent: `${data.SN}#${data.KEY}#${data.name}#${data.phone}`,
			}
		})
		if(feieyun.data && feieyun.data.data && feieyun.data.data.ok && feieyun.data.data.ok.length){
			var res = await this.db.collection('opendb-admin-print').add(data)
			if (res.id){
				return res;
			}else{
				var feieyun = await requestfeieyun({
					data: {
						user: data.USER,
						stime: UNIX,
						sig: sha1(`${data.USER}${data.UKEY}${UNIX}`),
						apiname: 'Open_printerDelList',
						snlist: `${data.SN}`,
					}
				})
				return {
					code: 500,
					message: '新增打印机失败'
				}
			}
		}else{
			return {
				code: 500,
				message: feieyun.data.data.no.join(',')
			}
		}
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-print').doc(_id).update(data);
	}
	async remove(params) {
		var {_ids} = params;
		var {data: print} = await this.db.collection('opendb-admin-print').doc(_ids[0]).get();
		var data = print[0];
		var UNIX = Math.round(new Date().getTime()/1000);
		var {data: feieyun} = await requestfeieyun({
			data: {
				user: data.USER,
				stime: UNIX,
				sig: sha1(`${data.USER}${data.UKEY}${UNIX}`),
				apiname: 'Open_printerDelList',
				snlist: `${data.SN}`,
			}
		})
		if(feieyun.data && feieyun.data.ok && feieyun.data.ok.length) {
			return await this.db.collection('opendb-admin-print').where({
				'_id': this.db.command.in(_ids)
			}).remove();
		}else{
			return {
				code: 500,
				message: feieyun.data.no.join(',')
			}
		}
		
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		var dbCmd = this.db.command;
		var $ = this.db.command.aggregate;
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
			total
		} = await this.db.collection('opendb-admin-print').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-print').aggregate()
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
			
		
		for(var i=0;i<data.length;i++){
			var item = data[i];
			var UNIX = Math.round(new Date().getTime()/1000);
			var {data: feieyun} = await requestfeieyun({
				data: {
					user: item.USER,
					stime: UNIX,
					sig: sha1(`${item.USER}${item.UKEY}${UNIX}`),
					apiname: 'Open_queryPrinterStatus',
					sn: `${item.SN}`,
				}
			})
			item.status = feieyun.data;
		}
		return {
			total,
			page,
			size,
			data
		};
	}
}
