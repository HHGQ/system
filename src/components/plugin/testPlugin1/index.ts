import testPanel from './panel.vue'
import testToast from './toast.vue'
console.log('testPlugin1')
const test = {
  install: (Vue: any, options: any) => {}
}
test.install = function (Vue:any, options:any) {
  Vue.prototype.$msg = 'Hello I am test.js'
  Vue.prototype.$myMethod = function (arr:[]) {
    if (arr.length < 0) {
      return false
    } else {
      return arr.join('连接你我')
    }
  }
  Vue.component(testPanel.name, testPanel) // testPanel.name 组件的name属性
  Vue.component(testToast.name, testToast) // testPanel.name 组件的name属性
}
export default test