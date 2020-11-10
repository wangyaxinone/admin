import {
	formatDate
} from '@/components/uni-dateformat/date-format.js'

function formatBytes(bytes) {
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
	if (bytes == 0) {
		return 'n/a'
	}
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	if (i == 0) {
		return bytes + ' ' + sizes[i]
	}
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

function getTree(nodes, props) {
	if(!props) {
		props = {
			id: '_id',
			children: 'children',
			parentId: 'parent_id',
		}
	}
	var map = {},
		node, roots = [];
	nodes.forEach((item,idx)=>{
		item[props.children] = [];
		map[item[props.id]] = idx + ''; // use map to look-up the parents
	})	
	for (var i = 0; i < nodes.length; i += 1) {
		node = nodes[i];
		if (node[props.parentId] && map[node[props.parentId]]) {
			nodes[map[node[props.parentId]]][props.children].push(node);
		} else {
			roots.push(node);
		}
	}
	return JSON.parse(JSON.stringify(roots));
}

function isEmptyObject(data) {
	return JSON.stringify(data) == "{}";
}

export function initUtil(Vue) {
	Vue.prototype.$formatDate = formatDate
	Vue.prototype.$formatBytes = formatBytes
	Vue.prototype.$getTree = getTree
	Vue.prototype.$isEmptyObject = isEmptyObject
}
