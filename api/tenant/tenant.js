import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/tenant/list', params);
}

export const add = (params) => {
  return request('system/tenant/add', params);
}

export const update = (params) => {
  return request('system/tenant/update', params);
}

export const remove = (params) => {
  return request('system/tenant/remove', params);
}

export const tree = (params) => {
  return request('system/tenant/tree', params);
}