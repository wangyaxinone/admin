const {
	Service
} = require('uni-cloud-router')
const {
	getPageConfig,
	getServerDate,
	getTree,
	appendTenantParams
} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(params) {
		var _this = this;
		var newData = [];
		for (var i = 0; i < params.length; i++) {
			var item = params[i];
			item.create_date = getServerDate();
			item.update_date = getServerDate();
			item.operator = _this.ctx.auth.uid;
			item.creater = _this.ctx.auth.uid;
			var {
				data: files
			} = await this.db.collection('opendb-admin-file').where({
				fileID: item.fileID
			}).get();
			if (files && files.length) {
				await this.db.collection('opendb-admin-file').where({
					fileID: item.fileID
				}).update(item);
				
			} else {
				newData.push(item);
			}
		}
		if (newData && newData.length) {
			return await this.db.collection('opendb-admin-file').add(newData);
		} else {
			return await this.list({});
		}
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-file').doc(_id).update(data);
	}
	async remove(_ids) {
		let result = await uniCloud.deleteFile({
		    fileList: _ids
		});
		if(result && result.fileList) {
			return await this.db.collection('opendb-admin-file').where({
				'fileID': this.db.command.in(_ids)
			}).remove();
		}
		
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		match.route = param.route
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data
		} = await this.db.collection('opendb-admin-file')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
	}
}
