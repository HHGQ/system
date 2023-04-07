import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import router from './router'
import '@/assets/css/reset-ui.less'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式
import 'openlayers/css/ol.css';// 引入样式
import '@/assets/css/openlayers.less'
import '@/utils/request.js'
import "./main-config.js";
import i18n from './i18n/index'

// Vue.prototype.i18n2 = require('gettext.js')()

import './i18n/gettext'

Vue.prototype.$proj4 = window.proj4

Vue.use(UmyUi);
Vue.use(ViewUI);
// Vue.locale = () => {};

import testPlugin1 from './components/plugin/testPlugin1/index'
import testPlugin2 from './components/plugin/testPlugin2/index'
Vue.use(testPlugin1)
Vue.use(testPlugin2)

// 消息提示的环境配置
Vue.config.productionTip = false

// JavaScript 日期处理类库
import moment from  'moment'
Vue.prototype.$moment = moment;

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs;

// Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。
import _ from 'lodash'
Vue.prototype._ = _


// EventBus 又称为事件总线。组件可以上下平行地通知其他组件
// 缺点
// 1.vue是单页应用，如果你在某一个页面刷新了之后，与之相关的EventBus会被移除，就导致业务走不下去
// 2.如果业务有反复操作的页面，EventBus在监听的时候就会触发很多次，因此在vue页面销毁时，同时移除EventBus事件监听
// 3.调用其他组件的方法，没有调用记录，因此才需要更完善的Vuex作为状态管理中心，将通知的概念上升到共享状态层次
// 发送消息
// EventBus.$emit(channel: string, callback(payload1,…))
// 监听接收消息
// EventBus.$on(channel: string, callback(payload1,…))
// 移除事件的监听
// EventBus.$off('aMsg', {})
Vue.prototype.$EventBus = new Vue()

// qs是一个增加了一些安全性的字符串解析和序列化的库
// 解析字符串 qs.parse(string, [options]);
// 序列化字符串 qs.stringify(object, [options]);
// https://www.npmjs.com/package/qs
import qs from 'qs'
Vue.prototype.$qs = qs

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /.(vue|js)$/
)
Vue.prototype.requireComponent = requireComponent
// 基础组件的自动化全局注册
// requireComponent.keys().forEach(fileName => {
  // console.log(requireComponent(fileName))
// })
new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })
// console.log(module.hot)
// if (module.hot) {
//   module.hot.accept(['./en', './ja'], function () {
//     i18n.setLocaleMessage('en', require('./en').default)
//     i18n.setLocaleMessage('ja', require('./ja').default)
//     // 同样可以通过 $i18n 属性进行热更新
//     // app.$i18n.setLocaleMessage('en', require('./en').default)
//     // app.$i18n.setLocaleMessage('ja', require('./ja').default)
//   })
// }
