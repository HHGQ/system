import request from '@/utils/request'

export function getUsersExcel() {
  return request({
    url: 'users/excel',
    responseType: 'blob'
  })
}

export function queryUser() {
  return request({
    url: 'users/queryUser',
    headers: { Common: 2, Secret: 33, common: { Authorization: 4 } }
  })
}

export function queryUsers() {
  return request({
    url: 'users/queryUsers',
  })
}

/**
 * 发送 head 请求
 */
export function queryUserHead() {
  return request.head('users/queryUser')
}