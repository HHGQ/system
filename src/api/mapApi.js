import request from '@/utils/request'

export function getPoint(data) {
  return request({
    method: 'post',
    url: 'map/point',
    data
  })
}