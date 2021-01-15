import {
	request
} from '@/js_sdk/uni-admin/request.js'

export const getList = (params) => {
  return request('dishes/dishes/list', params);
}

export const add = (params) => {
  return request('dishes/dishes/add', params);
}

export const cook = (params) => {
  return request('dishes/dishes/cook', params);
}

export const invalid = (params) => {
  return request('dishes/dishes/invalid', params);
}


