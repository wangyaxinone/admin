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
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.tenantId || (data.tenantId = this.ctx.auth.userInfo.tenantId);
		return await this.db.collection('opendb-admin-permissionTemplate').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.tenantId || (data.tenantId = this.ctx.auth.userInfo.tenantId);
		return await this.db.collection('opendb-admin-permissionTemplate').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-permissionTemplate').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(true)
		};
		param.dept_name && (match.dept_name = new RegExp(param.dept_name));
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
		} = await this.db.collection('opendb-admin-permissionTemplate').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-permissionTemplate')
			.where(match)
			.orderBy('sort', "asc")
			.limit(size)
			.skip((page - 1) * size)
			.get();
		return {
			total,
			page,
			size,
			data
		};
	}
	async select(param) {
		var match = {
			_id: param._id ? param._id : this.db.command.exists(false)
		};
		param.dept_name && (match.dept_name = new RegExp(param.dept_name));
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
		} = await this.db.collection('opendb-admin-permissionTemplate').where(match).count();
		let {
			data
		} = await this.db.collection('opendb-admin-permissionTemplate')
			.where(match)
			.orderBy('sort', "asc")
			.limit(size)
			.skip((page - 1) * size)
			.get();
		return {
			total,
			page,
			size,
			data
		};
	}
	async getPermissionByTenant(param) {
		var match = {
			_id: this.db.command.exists(true)
		};
		param.tenantId && (match.tenantId = param.tenantId);
		if (!match.tenantId) {
			match.tenantId = this.ctx.auth.userInfo.tenantId || '';
		}
		if (param.isAdminTemplate == 1) {
			if(!match.tenantId) {
				let {
					data: menu
				} = await this.db.collection('opendb-admin-menus').where({
					menu_type: 1
				}).orderBy('sort', 'asc').get();
				return menu;
			}
			let {
				data
			} = await this.db.collection('uni-id-roles').where(match).get();
			var permission = data[0].permission;
			let {
				data: menu
			} = await this.db.collection('opendb-admin-menus').where({
				_id: this.db.command.in(permission)
			}).orderBy('sort', 'asc').get();
			return menu;
		} else {
			let {
				data: menu
			} = await this.db.collection('opendb-admin-menus').where({
				menu_type: 2
			}).orderBy('sort', 'asc').get();
			return menu;
		}

	}
	async setPermission(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.tenantId || (data.tenantId = this.ctx.auth.userInfo.tenantId);
		return await this.db.collection('opendb-admin-permissionTemplate').doc(_id).update(data);
	}
}
