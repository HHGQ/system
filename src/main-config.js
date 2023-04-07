import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import i18n from './i18n/index'
Vue.prototype._i18n = i18n // 若不加，会出问题。如iView的this.Modal.confirm()
Vue.use(ElementUI, {
    i18n:(key, value) => i18n.t(key, value)
});

// 基于Vue的颜色选择器插件
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)