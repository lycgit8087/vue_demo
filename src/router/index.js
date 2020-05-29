import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/class_index',
      name: 'ClassIndex',
      component: () => import('@/views/ClassIndex'),
      meta:{keepAlive: true} 
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login'),
      meta:{keepAlive: false} 
    },
    {
      path: '/exam_list',
      name: 'ExamList',
      component: () => import('@/views/ExamList')
    },
    {
      path: '/student_view',
      name: 'StudentView',
      component: () => import('@/views/StudentView')
    },
    {
      path: '/census',
      name: 'Census',
      component: () => import('@/views/Census')
    },
    {
      path: '/exam_detail',
      name: 'ExamDetail',
      component: () => import('@/views/ExamDetail')
    },
  ]
})
