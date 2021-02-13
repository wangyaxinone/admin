const NP = require('number-precision');
const moment = require('moment');
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

async function requestfeieyun(params) {
	var {data} = params;
	return await uniCloud.httpclient.request('http://api.feieyun.cn/Api/Open/', {
		method: 'POST',
		data: data,
		dataType: 'json'
	})
}
function encodeUTF8(s) {
  var i, r = [], c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
          r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      else r.push(0xE0 + (c >> 12 & 0xF));
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
  return r;
}

// 字符串加密成 hex 字符串
function sha1(s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [], f = [
    function () { return m[1] & m[2] | ~m[1] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; },
    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; }
  ], rol = function (n, c) { return n << c | n >>> (32 - c); },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");
  return hex;
}

async function printPerOrder(params) {
	var {tenantId, foods, _this, order, tableName} = params;
	var {data: prints} = await _this.db.collection('opendb-admin-print').where({
		"tenantId": tenantId,
		"type": 1,
		"printStatus": 1
	}).get();
	var widthMap = {
		'58': {
			chinese: 16,
			english: 32
		},
		'76': {
			chinese: 22,
			english: 33
		},
		'80': {
			chinese: 24,
			english: 48
		},
	}
	var orderTypeMap = {
		1: '堂食',
		2: '打包',
	};
	var printList = {};
	var orderPrice = 0;
	if(foods && foods.length) {
		foods.forEach((item)=>{
			orderPrice = NP.plus(orderPrice, parseFloat(item.goodsPrice));
			printList[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')] = printList[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')] || [];
			printList[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')].push(item);
		})
	}
	if(prints && prints.length){
		for(var i=0;i<prints.length;i++){
			var print = prints[i];
			var UNIX = Math.round(new Date().getTime()/1000);
			var {chinese, english} = widthMap[print.width];
			var orderInfo = '';
			orderInfo = `<CB>#${order.every_day_code}（${orderTypeMap[order.order_type]}）</CB><BR>`;
			tableName && (orderInfo += `<C>餐桌（${tableName}）</C><BR>`);
			orderInfo += paiBan('名称', ['数量', '金额'], chinese);
			orderInfo += '--------------------------------<BR>';
			Object.keys(printList).forEach((name)=>{
				var arr = printList[name];
				orderInfo += paiBan(name, [ arr.length, arr[0].goodsPrice*arr.length], chinese, english);
			})
			orderInfo += '--------------------------------<BR>';
			orderInfo += `<BOLD><B>合计：${orderPrice}元</B></BOLD><BR>`;
			order.comment && (orderInfo += `<BOLD><B>备注：${order.comment}</B></BOLD><BR>`);
			orderInfo += `打印时间：${format("yyyy-MM-dd hh:mm:ss")}<BR>`;
			var {data: feieyun} = await requestfeieyun({
				data: {
					user: print.USER,
					stime: UNIX,
					sig: sha1(`${print.USER}${print.UKEY}${UNIX}`),
					apiname: 'Open_printMsg',
					sn: `${print.SN}`,
					content: orderInfo
				}
			})
		}
	}
}
async function printByDept(params) {
	var {tenantId, foods, _this, order, tableName} = params;
	const dbCmd = _this.db.command;
	var widthMap = {
		'58': {
			chinese: 16,
			english: 32
		},
		'76': {
			chinese: 22,
			english: 33
		},
		'80': {
			chinese: 24,
			english: 48
		},
	}
	var orderTypeMap = {
		1: '堂食',
		2: '打包',
	};
	var printList = {};
	if(foods && foods.length) {
		foods.forEach((item)=>{
			printList[item.deptId] = printList[item.deptId] || [];
			printList[item.deptId].push(item);
		})
	}
	for(var deptId in printList){
		var {data: prints} = await _this.db.collection('opendb-admin-print').where({
			"tenantId": tenantId,
			"type": 2,
			"deptId": dbCmd.elemMatch(dbCmd.eq(deptId)),
			"printStatus": 1
		}).get();
		var foodsByDept = {};
		if(printList[deptId] && printList[deptId].length) {
			printList[deptId].forEach((item)=>{
				foodsByDept[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')] = foodsByDept[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')] || [];
				foodsByDept[item.goodsName+(item.goodsAttrValue?`（${item.goodsAttrValue}）`:'')].push(item);
			})
		}
		if(prints && prints.length){
			for(var i=0;i<prints.length;i++){
				var print = prints[i];
				var UNIX = Math.round(new Date().getTime()/1000);
				var {chinese, english} = widthMap[print.width];
				var orderInfo = '';
				orderInfo = `<CB>#${order.every_day_code}（${orderTypeMap[order.order_type]}）</CB><BR>`;
				tableName && (orderInfo += `<CB>（${tableName}）</CB><BR>`);
				orderInfo += '--------------------------------<BR>';
				Object.keys(foodsByDept).forEach((name)=>{
					var arr = foodsByDept[name];
					orderInfo += paiBan2(name, [`x${arr.length}`], chinese, english);
				})
				orderInfo += '--------------------------------<BR>';
				order.comment && (orderInfo += `<BOLD><B>备注：${order.comment}</B></BOLD><BR>`);
				orderInfo += `打印时间：${format("yyyy-MM-dd hh:mm:ss")}<BR>`;
				var {data: feieyun} = await requestfeieyun({
					data: {
						user: print.USER,
						stime: UNIX,
						sig: sha1(`${print.USER}${print.UKEY}${UNIX}`),
						apiname: 'Open_printMsg',
						sn: `${print.SN}`,
						content: orderInfo
					}
				})
			}
		}
	}
	
}

function paiBan(left,right,chinese, english) {
	var leftNext = (chinese/2-1) - left.length;
	var str = '';
	if(leftNext >= 0) {
		str += `${left}`;
		for(var i=0;i<leftNext;i++){
			str += '  ';
		}
		str += ' ';
		printRight();
	}else{
		str += `${left.slice(0, chinese/2-1)} `;
		printRight();
		str += `${left.slice(chinese/2-1)}<BR>`;
	}
	return str;
	function printRight() {
		if(english) {
			var widthRight = parseFloat((english/2)/right.length);
			right.forEach((text)=>{
				var textLength = String(text).length;
				var rightNext = widthRight - textLength;
				str += `${text}`;
				for(var i=0;i<rightNext;i++){
					str += ' ';
				}
			})
		}else{
			var widthRight = parseFloat((chinese/2)/right.length);
			right.forEach((text)=>{
				var textLength = String(text).length;
				var rightNext = widthRight - textLength;
				str += `${text}`;
				for(var i=0;i<rightNext;i++){
					str += '  ';
				}
			})
		}
		str += "<BR>";
	}
}
function paiBan2(left,right,chinese, english) {
	var weight = true;//加粗
	var leftNext = (chinese*3/4-2) - (left.length * (weight?2:1));
	var str = '';
	if(leftNext >= 0) {
		str += `<B>${left}</B>`;
		for(var i=0;i<leftNext;i++){
			str += '  ';
		}
		str += ' ';
		printRight();
	}else{
		str += `<B>${left.slice(0, (chinese*3/4-2)/2)}</B> `;
		printRight();
		str += `<B>${left.slice((chinese*3/4-2)/2)}</B><BR>`;
	}
	return str;
	function printRight() {
		if(english) {
			var widthRight = parseFloat((english/4)/right.length);
			right.forEach((text)=>{
				var textLength = String(text).length;
				var rightNext = widthRight - textLength;
				for(var i=0;i<rightNext;i++){
					str += ' ';
				}
				str += `<B>${text}</B>`;
			})
		}else{
			var widthRight = parseFloat((chinese/4)/right.length);
			right.forEach((text)=>{
				var textLength = String(text).length;
				var rightNext = widthRight - textLength;
				for(var i=0;i<rightNext;i++){
					str += '  ';
				}
				str += `<B>${text}</B>`;
			})
		}
		str += "<BR>";
	}
}
function format(fmt) { 
	var date = new Date();
	var o = { 
	        "M+" : date.getMonth()+1,                 //月份 
	        "d+" : date.getDate(),                    //日 
	        "h+" : date.getHours()+8,                   //小时 
	        "m+" : date.getMinutes(),                 //分 
	        "s+" : date.getSeconds(),                 //秒 
	        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
	        "S"  : date.getMilliseconds()             //毫秒 
	    }; 
	    if(/(y+)/.test(fmt)) {
	            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	    }
	     for(var k in o) {
	        if(new RegExp("("+ k +")").test(fmt)){
	             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	         }
	     }
	    return fmt; 
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
	goeasyPushByTenant,
	requestfeieyun,
	sha1,
	printPerOrder,
	printByDept
}
