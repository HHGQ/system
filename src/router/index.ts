import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const constantRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import ('@/components/layout/login.vue'),
    alias: '/'
  },
  // {
  //   path: '/',
  //   name: 'login',
  //   redirect: '/login',
  //   component: () => import ('@/components/layout/login.vue'),
  // },
  {
    path: '/main',
    name: 'main',
    meta: { name: 'main' },
    redirect: '/learn',
    component: () => import ('@/components/layout/main.vue'),
    children: [
      { path: '', component: () => import (`@/components/home.vue`) },
    ]
  },
  {
    path: '/login/:id',
    name: 'login',
    component: () => import ('@/components/layout/login.vue'),
    props: true
  },
  // {
  //   path: '*',
  //   component: () => import ('@/components/layout/login.vue')
  // }
]
const requireComponent = require.context(
  // 其组件目录的相对路径
  '../components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /.(vue|js)$/
)
// 基础组件的自动化全局注册
requireComponent.keys().forEach(item => {
  if (!constantRoutes[1].children) return
  const mapData: string = item.split('/')[1].split('.')[0]
  if (!mapData) return
  const routeObj = {
    path: `${mapData}`,
    name: mapData,
    component: () => import (`@/components/${mapData}.vue`),
    meta: { name: mapData }
  }
  constantRoutes[1].children.push(routeObj)
})

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  // scrollBehavior功能只在 HTML5 history 模式下可用，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      // 仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: constantRoutes 
})


const router = createRouter()
router.beforeEach((to, from ,next) => {
  next()
})
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}
console.log(router,'router')

export default router
