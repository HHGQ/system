import Vue from 'vue';
// import LangEn from './lang/en.js';
// import LangCn from './lang/zh.js';
import en from 'view-design/dist/locale/en-US';
import zh from 'view-design/dist/locale/zh-CN';
import tw from 'view-design/dist/locale/zh-TW';
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

// 判断获取后的值是什么语言
const lang_cur = localStorage.getItem('language');
// 实例化VueI18n对象
const i18n = new VueI18n({
    // 默认语言
    locale: lang_cur || 'zh-CN',
    // locale: 'zh-CN',
    //当为 VueI18n 构造函数选项指定 fallbackLocale 选项时，message 键使用 zh-CN 语言环境进行本地化：
    fallbackLocale: 'zh-CN',
    // 注意，默认情况下回退到 fallbackLocale 会产生两个控制台警告：
    // [vue-i18n] Value of key 'message' is not a string!
    // [vue-i18n] Fall back to translate the keypath 'message' with 'en' locale.
    // 为了避免这些警告 (同时保留那些完全没有翻译给定关键字的警告)，需初始化 VueI18n 实例时设置 
    silentFallbackWarn: true,
    // 如果在message中找不到相应的键值将回退到原本的语言：
    // formatFallbackMessages: true,
    //  两种方式
    messages: {
        'en-US': { ...require('./lang/en-US').default, ...en },
        'zh-CN': { ...require('./lang/zh-CN').default, ...zh },
        'zh-TW': { ...require('./lang/zh-TW').default, ...tw },
    },
    // messages: {
    //     'en': LangEn,
    //     'zh': LangCn 
    // }
})
if (module.hot) {
  module.hot.accept(['./lang/en-US', './lang/zh-CN', './lang/zh-TW'], function () {
    i18n.setLocaleMessage('en-US', require('./lang/en-US').default)
    i18n.setLocaleMessage('zh-CN', require('./lang/zh-CN').default)
    i18n.setLocaleMessage('zh-TW', require('./lang/zh-TW').default)
    // 同样可以通过 $i18n 属性进行热更新
    // app.$i18n.setLocaleMessage('en', require('./en').default)
    // app.$i18n.setLocaleMessage('ja', require('./ja').default)
  })
}
// 抛出去
export default i18n