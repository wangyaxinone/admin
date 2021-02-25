import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('reserve/setMeal/list', params);
}

export const add = (params) => {
  return request('reserve/setMeal/add', params);
}

export const update = (params) => {
  return request('reserve/setMeal/update', params);
}

export const remove = (params) => {
  return request('reserve/setMeal/remove', params);
}

export const select = (params) => {
  return request('reserve/setMeal/select', params);
}


