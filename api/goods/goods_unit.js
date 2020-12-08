import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('goods/goodsUnit/list', params);
}

export const add = (params) => {
  return request('goods/goodsUnit/add', params);
}

export const update = (params) => {
  return request('goods/goodsUnit/update', params);
}

export const remove = (params) => {
  return request('goods/goodsUnit/remove', params);
}

export const select = (params) => {
  return request('goods/goodsUnit/select', params);
}


