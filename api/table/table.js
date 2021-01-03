import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('table/table/list', params);
}

export const add = (params) => {
  return request('table/table/add', params);
}

export const update = (params) => {
  return request('table/table/update', params);
}

export const remove = (params) => {
  return request('table/table/remove', params);
}



