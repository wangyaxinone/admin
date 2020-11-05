import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/dept/list', params);
}

export const add = (params) => {
  return request('system/dept/add', params);
}

export const update = (params) => {
  return request('system/dept/update', params);
}

export const remove = (params) => {
  return request('system/dept/remove', params);
}
