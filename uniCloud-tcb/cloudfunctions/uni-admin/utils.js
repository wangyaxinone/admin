/*
 *	获取服务端时间，在此批量处理阿里云 腾讯云的区别	
 */
function getServerDate() {
	const db = uniCloud.database();
	return new db.serverDate();
}
/**
 * @param {Array} list 数据列表
 * @param {Object} props 参数转换对象
 * */
function getTree(list, props) {
	if (!props) {
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
		nodes.forEach((item, idx) => {
			item.children = [];
			map[item[props.id]] = idx + '';

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
	if (_this.ctx.auth.role.indexOf('admin') > -1) {
		return;
	}
	var dataPermission = _this.ctx.auth.userInfo.dataPermission;
	var type = dataPermission;
	if (!type) {
		if (_this.ctx.auth.userInfo.isTenantAdminOrAdmin) {
			match[_id] = _this.ctx.auth.userInfo.tenantList[0];
			return;
		}
		_this.ctx.throw('FORBIDDEN', `${_this.ctx.event.action}没有配置数据权限`)
	}
	if (type == 3) {
		if (_this.ctx.event.action == 'system/user/list') {
			match._id = _this.ctx.auth.userInfo._id;
		} else {
			match.creater = _this.ctx.auth.userInfo._id;
		}
	} else if (type == 2) {
		match[_id] = _this.ctx.auth.userInfo.tenantList[0];
	} else if (type == 1) {
		// 有新增门店权限 则可以查看门店及子门店权限
		if (_this.ctx.auth.userInfo.permission['tenant_tenant_add']) {
			match[_id] = _this.db.command.in(_this.ctx.auth.userInfo.tenantList);
		} else {
			match[_id] = _this.ctx.auth.userInfo.tenantList[0];
		}
	}
	console.log(match);
}

async function getEvertDayCode(cfg) {
	var {
		collection,
		tenantId
	} = cfg;
	const db = uniCloud.database();
	const dbCmd = db.command;
	const $ = db.command.aggregate;

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var date = date.getDate();

	var list = await db.collection(collection).aggregate().match(dbCmd.expr(
			$.and([
				$.eq(['$tenantId', tenantId]),
				$.gte(['$create_date', $.dateFromString({
					dateString: new Date(`${year}-${month}-${date} 00:00:00`).toISOString()
				})])
			])

		))
		.sort({
			every_day_code: 1
		})
		.group({
			_id: null,
			max: $.last('$every_day_code')
		})
		.end();
	if (list.data && list.data.length) {
		var buWei = {
			1: '0000',
			2: '000',
			3: '00',
			4: '0',
		};
		var every_day_code = list.data[0].max / 1;
		every_day_code++;
		every_day_code = String(every_day_code);
		var buWei = {
			1: '00',
			2: '0',
		};
		if (every_day_code.length < 3) {
			every_day_code = buWei[every_day_code.length] + every_day_code;
		}
		var orderNumber =
			`E-${tenantId.slice(0,8)}-${year}${month<=9?'0'+month:month}${date<=9?'0'+date:date}-${every_day_code}`;
	} else {
		var every_day_code = '001';
		var orderNumber =
			`E-${tenantId.slice(0,8)}-${year}${month<=9?'0'+month:month}${date<=9?'0'+date:date}-${every_day_code}`;
	}
	return {
		every_day_code,
		orderNumber,
	}
}

// const goeasyConfig = {
// 	path: 'https://rest-hangzhou.goeasy.io/publish',
// 	appkey: 'BC-28371c5513814c3dbad7fbd510235716'
// }
async function goeasyPushByTenant(params) {
	var {tenantId, _this, goeasyConfig} = params;
	if(!goeasyConfig.path || !goeasyConfig.appkey) {
		return;
	}
	var res = await uniCloud.httpclient.request(goeasyConfig.path, {
		method: 'POST',
		data: {
			appkey: goeasyConfig.appkey,
			channel: `${tenantId}-orderChange`,
			content: `{
			  type: 'updateOrder',
			  tenantId: ${tenantId}
		  }`
		},
		dataType: 'json'
	})
}
async function goeasyPushByFood(params) {
	var {orderId, _this, goeasyConfig} = params;
	if(!goeasyConfig.path || !goeasyConfig.appkey) {
		return;
	}
	var {data: dishes} = await _this.db.collection('opendb-admin-dishes').where({
		orderId: orderId
	}).get();
	var classMap = {};
	if(dishes && dishes.length) {
		for(var i=0;i<dishes.length;i++){
			var item = dishes[i];
			if(!classMap[item.deptId]) {
				classMap[item.deptId] = true;
				var res = await uniCloud.httpclient.request(goeasyConfig.path, {
					method: 'POST',
					data: {
						appkey: goeasyConfig.appkey,
						channel: `${item.deptId}-foodChange`,
						content: `{
						  type: 'updateFood',
						  deptId: ${item.deptId}
					  }`
					},
					dataType: 'json'
				})
			}
		}
	}
}
async function goeasyPushBydishes(params) {
	var {_ids, _this, tenantId} = params;
	var {data: tenants} =await _this.db.collection('opendb-admin-tenant').where({_id: tenantId}).get();
	var goeasyConfig = tenants[0];
	if(!goeasyConfig.path || !goeasyConfig.appkey) {
		return;
	}
	var {data: dishes} = await _this.db.collection('opendb-admin-dishes').where({
		_id: _this.db.command.in(_ids)
	}).get();
	var classMap = {};
	if(dishes && dishes.length) {
		for(var i=0;i<dishes.length;i++){
			var item = dishes[i];
			if(!classMap[item.deptId]) {
				classMap[item.deptId] = true;
				var res = await uniCloud.httpclient.request(goeasyConfig.path, {
					method: 'POST',
					data: {
						appkey: goeasyConfig.appkey,
						channel: `${item.deptId}-foodChange`,
						content: `{
						  type: 'updateFood',
						  deptId: ${item.deptId}
					  }`
					},
					dataType: 'json'
				})
			}
		}
	}
}
module.exports = {
	getEvertDayCode,
	getServerDate,
	getTree,
	getPageConfig,
	appendTenantParams,
	// goeasyConfig,
	goeasyPushByFood,
	goeasyPushBydishes,
	goeasyPushByTenant
}
