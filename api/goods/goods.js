import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('goods/goods/list', params);
}

export const add = (params) => {
  return request('goods/goods/add', params);
}

export const update = (params) => {
  return request('goods/goods/update', params);
}

export const remove = (params) => {
  return request('goods/goods/remove', params);
}

export const select = (params) => {
  return request('goods/goods/select', params);
}

export const updateGoods = (params) => {
  return request('goods/goods/updateGoods', params);
}


