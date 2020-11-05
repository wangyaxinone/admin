import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('system/dict/list', params);
}

export const add = (params) => {
  return request('system/dict/add', params);
}

export const update = (params) => {
  return request('system/dict/update', params);
}

export const remove = (params) => {
  return request('system/dict/remove', params);
}

export const tree = (params) => {
  return request('system/dict/tree', params);
}

export const getDictByDictCode = (params) => {
  return request('system/dict/getDictByDictCode', params);
}
