import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('table/tableType/list', params);
}

export const add = (params) => {
  return request('table/tableType/add', params);
}

export const update = (params) => {
  return request('table/tableType/update', params);
}

export const remove = (params) => {
  return request('table/tableType/remove', params);
}

export const select = (params) => {
  return request('table/tableType/select', params);
}


