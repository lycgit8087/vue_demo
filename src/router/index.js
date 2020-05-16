import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: () => import('@/components/HelloWorld')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/components/shop')
    },
    {
      path: '/',
      name: 'login',
      component: () => import('@/components/login')
    },
  ]
})
