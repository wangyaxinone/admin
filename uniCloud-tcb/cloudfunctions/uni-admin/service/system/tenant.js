const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree, appendTenantParams} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		const currentDate = getServerDate();
		data.create_date = currentDate;
		data.update_date = currentDate;
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		data.point = new this.db.Geo.Point(data.longitude, data.latitude);
		data.parentTenants = [];
		if(data.parent_id) {
			// 添加所有父级门店
			var arr = [data.parent_id];
			 while (arr.length) {
				var now = arr.shift();
				data.parentTenants.push(now);
				var {
					data: tenantList
				} = await this.db.collection('opendb-admin-tenant').where({
					_id: now
				}).get();
				if(tenantList && tenantList.length && tenantList[0].parent_id) {
					arr.push(tenantList[0].parent_id);
				}
			}
		}
		var res = await this.db.collection('opendb-admin-tenant').add(data);
		if(res.id) {
			//添加默认门店管理员角色
			var {
				data: roleList
			} = await this.db.collection('uni-id-roles').where({
				tenantId: data.parent_id,
				type: 1
			}).orderBy('create_date', "asc").get();
			var role = await this.service.system.role.add({
				role_name: `${data.name}_管理员`,
				parent_id: (roleList && roleList.length) ? roleList[0]._id : '',
				tenantId: res.id,
				type: 1,
				sort:999,
				comment: '门店管理员',
				create_date: currentDate,
				update_date: currentDate,
				operator: this.ctx.auth.uid
			})
			//添加默认门店管理员部门
			var {
				data: deptList
			} = await this.db.collection('opendb-admin-dept').where({
				tenantId: data.parent_id,
			}).orderBy('create_date', "asc").get();
			var role = await this.service.system.dept.add({
				dept_name: `${data.name}_管理部`,
				parent_id: (deptList && deptList.length) ? deptList[0]._id : '',
				tenantId: res.id,
				isCook: 2,
				sort:999,
				comment: `${data.name}_管理部`,
				create_date: currentDate,
				update_date: currentDate,
				operator: this.ctx.auth.uid
			})
		}
		return res;
	}
	async update(data) {
		const {
			_id
		} = data;
		if(_id === data.parent_id) {
			this.throw('TENANT_ERROR', `上级门店不能是当前门店`);
		}
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth._id;
		data.point = new this.db.Geo.Point(data.longitude, data.latitude);
		return await this.db.collection('opendb-admin-tenant').doc(_id).update(data);
	}
	async updatePush(data) {
		const {
			_id
		} = data;
		delete data._id;
		data.update_date = getServerDate();
		data.operator = this.ctx.auth._id;
		return await this.db.collection('opendb-admin-tenant').doc(_id).update(data);
	}
	async remove(_ids) {
		await this.db.collection('uni-id-roles').where({
			'tenantId': this.db.command.in(_ids)
		}).remove();
		await this.db.collection('opendb-admin-dept').where({
			'tenantId': this.db.command.in(_ids)
		}).remove();
		return await this.db.collection('opendb-admin-tenant').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(params) {
		var {name, _id} = params;
		var match = {};
		name && (match.name = new RegExp(name));
		_id && (match._id = _id);
		appendTenantParams({
			match, 
			_this: this,
			_id: '_id'
		});
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-tenant').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(name) {
		var match = {};
		name && (match.name = new RegExp(name));
		appendTenantParams({
			match, 
			_this: this,
			_id: '_id'
		});
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-tenant').where(match).orderBy('sort', "asc").get();
		return getTree(menuList);
	}
}
