import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/class_index',
      name: 'ClassIndex',
      component: () => import('@/components/ClassIndex')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('@/components/Login')
    },
    {
      path: '/exam_list',
      name: 'ExamList',
      component: () => import('@/components/ExamList')
    },
  ]
})
