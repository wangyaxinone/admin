import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('print/print/list', params);
}

export const add = (params) => {
  return request('print/print/add', params);
}

export const update = (params) => {
  return request('print/print/update', params);
}

export const remove = (params) => {
  return request('print/print/remove', params);
}



