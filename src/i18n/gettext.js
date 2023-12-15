
import Vue from 'vue';
import gettextFn from 'gettext.js'
import axios from 'axios'
Vue.prototype.translator = gettextFn()
Vue.prototype.translator.setMessages('messages', 'en', {
  "Welcome": "Bienvenue",
  "Welcome1": "There are %1 in the %2",
  "There is %1 apple": [
    "Il y a %1 pomme",
    "Il y a %1 pommes",
    "Il y a %1 pommese",
    "Il y a %1 pommeses"
  ]
}, 'nplurals=2; plural=n>1;');
// console.log(Vue.prototype.translator.getLocale())
axios('./static/en.po').then(res => {
  console.log(res, 'res')
})
// console.log(gettextFn())
// translator.addTranslations('zh-CN', 'messages', require('./lang/en.po'))