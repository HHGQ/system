import Vue from 'vue'
import panel from './index.vue'

const panelConstructor = Vue.extend(panel)

export default () => {
  function checkVersion() {
    const instance:any = new panelConstructor()
    instance.vm = instance.$mount()
  }
  return () => {
    console.log('111')
  }
}