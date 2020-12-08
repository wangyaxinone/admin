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
		data.creater = this.ctx.auth.uid;
		data.tenantId || (data.tenantId = this.ctx.auth.userInfo.tenantId);
		data.tenantId || (data.tenantId = '');
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
		data.tenantId || (data.tenantId = '');
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
			.skip((page - 1) * size)
			.limit(size)
			.get();
		return {
			total,
			page,
			size,
			data
		};
	}
	async select(param) {
		var match = {};
		param.name && (match.name = new RegExp(param.name));
		param.isAdminTemplate && (match.isAdminTemplate = param.isAdminTemplate);
		var tenantIds = [param.tenantId]
		if(param.parent_id && param.parent_id != '0') {
			let {
				data: roles
			} = await this.db.collection('uni-id-roles').where({
				_id: param.parent_id
			}).orderBy('sort', "asc").get();
			if(roles[0] && roles[0].tenantId) {
				tenantIds.push(roles[0].tenantId);
			}
		}else{
			if(this.ctx.auth.role.indexOf('admin') != -1) {
				tenantIds.push('');
			}
		}
		match.tenantId = this.db.command.in(tenantIds);
		let {
			data
		} = await this.db.collection('opendb-admin-permissionTemplate')
			.aggregate()
			.match(match)
			.sort({
				'sort': 1
			})
			.lookup({
				from: 'opendb-admin-tenant',
				localField: 'tenantId',
				foreignField: '_id',
				as: 'tenant',
			})
			.end();
		return data;
		
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
		await this.db.collection('uni-id-roles').where({
			template: _id
		}).update({
			permission: this.db.command.set(data.permissions),
			dataPermission: this.db.command.set(data.dataPermissions),
		})
		return await this.db.collection('opendb-admin-permissionTemplate').doc(_id).update({
			update_date: getServerDate(),
			operator: this.ctx.auth.uid,
			permissions: this.db.command.set(data.permissions),
			dataPermissions: this.db.command.set(data.dataPermissions),
		});
	}
}
