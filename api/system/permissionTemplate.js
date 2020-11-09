import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/permissionTemplate/list', params);
}

export const add = (params) => {
  return request('system/permissionTemplate/add', params);
}

export const update = (params) => {
  return request('system/permissionTemplate/update', params);
}

export const remove = (params) => {
  return request('system/permissionTemplate/remove', params);
}


