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
    const { url, method, data, params, headers } = response.config
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
      clearTimeout(timeoutId) // 防止弹出过多错误弹窗
      timeoutId = setTimeout(() => {
        Message({
          message: errTipArr[status] || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }, 1000)
      // return Promise.reject(new Error(res.message || 'Error'))
      let reRequest
      switch(method) {
        case 'post':
          reRequest = () => service.post(url, data, { headers })
          break
        case 'get':
          reRequest = () => service.get(url, { params, headers })
      }
      // return Promise，可不执行axios后面的then，等res()后才执行
      return new Promise((resolve, reject) => {
        if (status == 401) {
          handleTokenOutAjax(() => resolve(reRequest()))
        } else {
          reject(new Error(res.message || 'Error'))
        }
      })
    } else {
      return res ? res : response // head 请求的 data 为空
    }
  },
  error => {
    console.log('err' + error) // for debug

    const { url, method, data, params, headers } = error.response.config

    clearTimeout(timeoutId) // 防止弹出过多错误弹窗
    timeoutId = setTimeout(() => {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }, 1000)
    // return Promise.reject(error)
  
    let reRequest
    switch(method) {
      case 'post':
        reRequest = () => service.post(url, data, { headers })
        break
      case 'get':
        reRequest = () => service.get(url, { params, headers })
    }
    // return Promise，可不执行axios后面的then，等res()后才执行
    return new Promise((resolve, reject) => {
      if (error.response.status == 401) {
        handleTokenOutAjax(() => resolve(reRequest()))
      } else {
        reject(error)
      }
    })
  }
)

const handleTokenOutAjax = (resolve) => {
  Vue.prototype.$EventBus.$emit('needReRequest', resolve)
}

Vue.prototype.$ajax = service
export default service