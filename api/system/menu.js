import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/menus/list', params);
}

export const add = (params) => {
  return request('system/menus/add', params);
}

export const update = (params) => {
  return request('system/menus/update', params);
}

export const remove = (params) => {
  return request('system/menus/remove', params);
}

export const tree = (params) => {
  return request('system/menus/tree', params);
}