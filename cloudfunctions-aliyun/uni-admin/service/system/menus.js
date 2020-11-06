const {
	Service
} = require('uni-cloud-router')
const {getServerDate, getTree} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		return await this.db.collection('opendb-admin-menus').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		if(data.menu_id === data.parent_id) {
			this.throw('MENUS_ERROR', `上级菜单不能是当前菜单`);
		}
		delete data._id;
		return await this.db.collection('opendb-admin-menus').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-menus').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.name && (match.name = new RegExp(param.name));
		param.menu_type && (match.menu_type = param.menu_type);
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(param) {
		var match = {};
		param.menu_type && (match.menu_type = param.menu_type);
		param.name && (match.name = new RegExp(param.name));
		let {
			data: list
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', "asc").get();
		return getTree(list,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
	}
	async navMneuOrBtnByRole(type, param) {
		var match = {
			enable: true,
			type: type || 1,
		};
		let permission = this.ctx.auth.permission;
		if(this.ctx.auth.role.indexOf('admin') == -1) {
			var {
				data: roleList
			} = await this.db.collection('uni-id-roles').where({
				'_id': this.db.command.in(this.ctx.auth.role)
			}).get();
			//判断是否是门店管理员，s=是返回所有权限，否返回配置的权限
			var isTenantAdmin = false;
			roleList.forEach((item)=>{
				if(item.type == 1) {
					isTenantAdmin = true;
				}
			})
			if(isTenantAdmin && param.mode == 2) {
				match.menu_type = param.mode;
			}else{
				match._id = this.db.command.in(permission);
			}
		}else{
			match.menu_type = param.mode || 1;
		}
		let {
		    data: menuList
		} = await this.db.collection('opendb-admin-menus').where(match).orderBy('sort', 'asc').get();
		return getTree(menuList,{
			id: 'menu_id',
			parentId: 'parent_id',
		});
	}
	
	async addBtns(data) {
		const {btns} = data;
		return await this.db.collection('opendb-admin-menus').add(btns);
	}
}
