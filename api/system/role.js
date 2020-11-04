import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/role/list', params);
}

export const add = (params) => {
  return request('system/role/add', params);
}

export const update = (params) => {
  return request('system/role/update', params);
}

export const remove = (params) => {
  return request('system/role/remove', params);
}

export const tree = (params) => {
  return request('system/role/tree', params);
}

export const getRoleMenus = (params) => {
  return request('system/role/getRoleMenus', params);
}

export const setRoleMenus = (params) => {
  return request('system/role/setRoleMenus', params);
}