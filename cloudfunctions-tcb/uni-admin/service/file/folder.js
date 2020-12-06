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
		return await this.db.collection('opendb-admin-folder').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-folder').doc(_id).update(data);
	}
	async remove(_ids) {
		var {data} = await this.db.collection('opendb-admin-folder').where({
			'_id': this.db.command.in(_ids)
		}).get();
		if(data && data.length) {
			for(var i=0;i<data.length;i++){
				var item = data[i];
				var {
					data: files
				} = await this.db.collection('opendb-admin-file').where({
					route: item.fullName.slice(1)
				}).get();
				if(files && files.length){
					this.throw('FILE_ERROR', `当前文件下有资源，不能删除文件夹。`);
				}
			}
		}
		return await this.db.collection('opendb-admin-folder').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		match.parentId = param.parentId
		appendTenantParams({
			match,
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data
		} = await this.db.collection('opendb-admin-folder')
			.where(match)
			.orderBy('sort', "asc")
			.get();
		return data;
	}
}
