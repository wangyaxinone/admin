import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('file/folder/list', params);
}

export const add = (params) => {
  return request('file/folder/add', params);
}

export const update = (params) => {
  return request('file/folder/update', params);
}

export const remove = (params) => {
  return request('file/folder/remove', params);
}



