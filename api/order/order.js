import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('order/order/list', params);
}

export const add = (params) => {
  return request('order/order/add', params);
}

export const update = (params) => {
  return request('order/order/update', params);
}

export const remove = (params) => {
  return request('order/order/remove', params);
}

export const invalid = (params) => {
  return request('order/order/invalid', params);
}

export const addFood = (params) => {
  return request('order/order/addFoods', params);
}
