import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/token'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

let timeoutId
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const status = response.status
    // const url = response.request.responseURL || response.config.url // 兼容ie
    // const resType = response.request.responseType || response.config.responseType // 兼容ie
    if (status !== 200) {
      let errTipArr = {
        500: '服务器错误',
        504: '服务器返回超时',
        401: 'token过期',
        404: '接口不存在'
      }
      Message({
        message: errTipArr[status] || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data ? res : response // head 请求的 data 为空
    }
  },
  error => {
    console.log('err' + error) // for debug
    clearTimeout(timeoutId) // 防止弹出过多错误弹窗
    timeoutId = setTimeout(() => {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }, 1000)
    return Promise.reject(error)
  }
)

Vue.prototype.$ajax = service
export default service