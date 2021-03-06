const {
	Service
} = require('uni-cloud-router')
const {
	getServerDate,
	getTree
} = require('../../utils.js');
module.exports = class MenuService extends Service {
	async add(data) {
		data.create_date = getServerDate();
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		data.creater = this.ctx.auth.uid;
		return await this.db.collection('opendb-admin-dict').add(data);
	}
	async update(data) {
		const {
			_id
		} = data;
		if (data._id === data.parent_id) {
			this.throw('DICT_ERROR', `上级字典不能是当前字典`);
		}
		data.update_date = getServerDate();
		data.operator = this.ctx.auth.uid;
		delete data._id;
		return await this.db.collection('opendb-admin-dict').doc(_id).update(data);
	}
	async remove(_ids) {
		return await this.db.collection('opendb-admin-dict').where({
			'_id': this.db.command.in(_ids)
		}).remove();
	}
	async list(param) {
		var match = {};
		param.dict_name && (match.dict_name = new RegExp(param.dict_name));
		param.dict_code && (match.dict_code = new RegExp(param.dict_code));
		let {
			data: menuList
		} = await this.db.collection('opendb-admin-dict').where(match).orderBy('sort', "asc").get();
		return menuList;
	}
	async tree(param) {
		var match = {};
		param.dict_name && (match.dict_name = new RegExp(param.dict_name));
		param.dict_code && (match.dict_code = new RegExp(param.dict_code));
		let {
			data: list
		} = await this.db.collection('opendb-admin-dict').where(match).orderBy('sort', "asc").get();
		return getTree(list, {
			id: '_id',
			parentId: 'parent_id',
		});
	}
	async getDictByDictCode(param) {
		let {
			dict_code
		} = param;
		let {
			data: list
		} = await this.db.collection('opendb-admin-dict').where({
			dict_code,
			parent_id: this.db.command.and(this.db.command.neq('0'), this.db.command.neq(''))
		}).orderBy('sort', "asc").get();
		return list;
	}
	async getDicts() {
		let {
			data: nodes
		} = await this.db.collection('opendb-admin-dict').where({
			'_id': this.db.command.exists(true)
		}).orderBy('sort', "asc").get();
		var map = {},
			node, roots = {};
		nodes.forEach((item,idx)=>{
			map[item._id] = idx;
		})
		for (var i = 0; i < nodes.length; i += 1) {
			node = nodes[i];
			if (node.parent_id) {
				nodes[map[node.parent_id]].children = nodes[map[node.parent_id]].children || [];
				nodes[map[node.parent_id]].children.push({
					label: node.dict_name,
					value: node.dict_key,
					disabled: node.disabled,
				});
			} else {
				roots[node.dict_code] = node.children;
			}
		}
		return roots;
	}
}
