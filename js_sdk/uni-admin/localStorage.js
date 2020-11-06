export function getItem(name) {
	var item = localStorage.getItem(name);
	if(item) {
		item = JSON.parse(item);
		return item.data;
	}
	return item;
}
export function setItem(name, data) {
	var item = {}
	if(typeof data == "object") {
		item.type = "object"
	}else{
		item.type = "string";
	}
	item.data = data;
	localStorage.setItem(name, JSON.stringify(item));
}
export function initLocalStorage(Vue) {
	Vue.prototype.$setItem = setItem;
	Vue.prototype.$getItem = getItem;
}