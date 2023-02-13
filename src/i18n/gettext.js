
import Vue from 'vue';
import i18n2 from 'gettext.js'
Vue.prototype.i18n2 = i18n2()
Vue.prototype.i18n2.setMessages('messages', 'en', {
  "Welcome": "Bienvenue",
  "Welcome1": "There are %1 in the %2",
  "There is %1 apple": [
    "Il y a %1 pomme",
    "Il y a %1 pommes",
    "Il y a %1 pommese",
    "Il y a %1 pommeses"
  ]
}, 'nplurals=2; plural=n>1;');
// console.log(Vue.prototype.i18n2.getLocale())