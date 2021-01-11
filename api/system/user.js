import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/user/list', params);
}

export const add = (params) => {
  return request('system/user/add', params);
}

export const update = (params) => {
  return request('system/user/update', params);
}

export const remove = (params) => {
  return request('system/user/remove', params);
}

export const getDeptByUser = (params) => {
  return request('system/user/getDeptByUser', params);
}

