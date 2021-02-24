import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('reserve/reserve/list', params);
}

export const add = (params) => {
  return request('reserve/reserve/add', params);
}

export const update = (params) => {
  return request('reserve/reserve/update', params);
}

export const remove = (params) => {
  return request('reserve/reserve/remove', params);
}

export const select = (params) => {
  return request('reserve/reserve/select', params);
}


