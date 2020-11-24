/*
*	获取服务端时间，在此批量处理阿里云 腾讯云的区别	
*/
function getServerDate() {
   return new Date()/1;
}
/**
 * @param {Array} list 数据列表
 * @param {Object} props 参数转换对象
 * */
function getTree(list, props) {
	if(!props) {
		props = {
			id: '_id',
			parentId: 'parent_id',
		}
	}
	var roots = [];
	if (list && list.length) {
		var nodes = list;
		var map = {},
			node;
		nodes.forEach((item, idx)=>{
			item.children = [];
			map[item[props.id]] = idx+'';
			
		})
		for (var i = 0; i < nodes.length; i += 1) {
			node = nodes[i];
			node.children = node.children || [];
			node[props.parentId] = node[props.parentId] || "0";
			if (map[node[props.parentId]]) {
				nodes[map[node[props.parentId]]].children.push(node);
			} else {
				roots.push(node);
			}
		}
	}
	return roots;
}
/**
 * 获取默认的分页配置
 * */
function getPageConfig() {
	return {
		basePage: 1,
		baseSize: 10
	}
}
/**
 * 
 * */
function appendTenantParams(param) {
	let {
		match,
		_this,
		_id
	} = param;
	if(_this.ctx.auth.role.indexOf('admin') > -1) {
		return;
	}
	var dataPermission = _this.ctx.auth.userInfo.dataPermission;
	var type = dataPermission;
	if(!type) {
		if(_this.ctx.auth.userInfo.isTenantAdminOrAdmin) {
			match[_id] = _this.ctx.auth.userInfo.tenantList[0];
			return;
		}
		_this.ctx.throw('FORBIDDEN', `${_this.ctx.event.action}没有配置数据权限`)
	}
	if(type == 3) {
		if(_this.ctx.event.action == 'system/user/list') {
			match._id = _this.ctx.auth.userInfo._id;
		}else{
			match.creater = _this.ctx.auth.userInfo._id;
		}
	}else if(type == 2){
		match[_id] = _this.ctx.auth.userInfo.tenantList[0];
	}else if(type == 1) {
		// 有新增门店权限 则可以查看门店及子门店权限
		if(_this.ctx.auth.userInfo.permission['tenant_tenant_add']) {
			match[_id] = _this.db.command.in(_this.ctx.auth.userInfo.tenantList);
		}else{
			match[_id] = _this.ctx.auth.userInfo.tenantList[0];
		}
	}
	console.log(match);
}
module.exports = {
	getServerDate,
	getTree,
	getPageConfig,
	appendTenantParams
}