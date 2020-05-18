import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/class_index',
      name: 'ClassIndex',
      component: () => import('@/views/ClassIndex')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/Login')
    },
    {
      path: '/exam_list',
      name: 'ExamList',
      component: () => import('@/views/ExamList')
    },
  ]
})
