const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree, appendTenantParams} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		return await this.db.collection('uni-id-roles').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = new Date()/1;
		data.operator = this.ctx.auth._id;
		return await this.db.collection('uni-id-roles').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('uni-id-roles').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.role_name && (match.role_name = new RegExp(param.role_name));
		appendTenantParams({
			match, 
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data: menuList
		} = await this.db.collection('uni-id-roles').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(param) {
		var match = {};
		param.role_name && (match.role_name = new RegExp(param.role_name));
		appendTenantParams({
			match, 
			_this: this,
			_id: 'tenantId'
		});
		param.tenantId && (match.tenantId = param.tenantId);
		let {
			data: list
		} = await this.db.collection('uni-id-roles').where(match).orderBy('sort', "asc").get();
		return getTree(list);
	}
	async getRoleMenus(param) {
		if(param.parent_id && param.parent_id!= '0') {
			let {
				data: roleList
			} = await this.db.collection('uni-id-roles').where({
				'_id': param.parent_id
			}).get();
			let permission = (roleList && roleList[0]) ? (roleList[0].permission || []) : [];
			let {
			    data: list
			} = await this.db.collection('opendb-admin-menus').where({
			    enable: true,
				'_id': this.db.command.in(permission)
			}).orderBy('sort', 'asc').get();
			return getTree(list,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
		}else{
			let {
			    data: list
			} = await this.db.collection('opendb-admin-menus').where({
			    enable: true
			}).orderBy('sort', 'asc').get();
			return getTree(list,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
		}
	}
	async setRoleMenus(param) {
		let {
			_id,
			permission,
		} = param;
		let update_date = getServerDate()
		let operator = this.ctx.auth._id;
		return await this.db.collection('uni-id-roles').doc(_id).update({
			permission,
			update_date,
			operator
		});
	}
}
