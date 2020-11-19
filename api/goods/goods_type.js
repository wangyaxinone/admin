import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('goods/goodsType/list', params);
}

export const add = (params) => {
  return request('goods/goodsType/add', params);
}

export const update = (params) => {
  return request('goods/goodsType/update', params);
}

export const remove = (params) => {
  return request('goods/goodsType/remove', params);
}

export const select = (params) => {
  return request('goods/goodsType/select', params);
}


