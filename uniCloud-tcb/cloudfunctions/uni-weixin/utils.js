/*
 *	获取服务端时间，在此批量处理阿里云 腾讯云的区别	
 */
function getServerDate() {
	const db = uniCloud.database();
	return new db.serverDate();
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
	getServerDate
}
