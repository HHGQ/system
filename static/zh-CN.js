// 不同的语言文件统一用以下格式。最外层是lang对象、lang对象有三个必要属性local、common、view
const lang = {
  // 语言代码描述
  locale: "", // 如 中文"zh-CN"、澳门"zh-MO"、美式英文 "en-US"、
  // 多个页面同时用到的，放到common对象
  common: {
    x: 'xxxx',
    y: 'yyyy',
    z: 'zzzz'
  },
  // 单个页面用到的，分别放入对应的页面对象中。页面对象的名称使用对应的路由地址，如服务管理为serviceMrg、平台管理为platFromMrg
  view: {
    serviceMrg: {
      a: 'aaaa',
      b: 'bbbb',
      c: 'cccc'
    },
    platFromMrg: {
      d: 'dddd',
      f: 'ffff',
      g: 'gggg',
    }
  }
}