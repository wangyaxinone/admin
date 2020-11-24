import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('file/file/list', params);
}

export const add = (params) => {
  return request('file/file/add', params);
}

export const update = (params) => {
  return request('file/file/update', params);
}

export const remove = (params) => {
  return request('file/file/remove', params);
}



