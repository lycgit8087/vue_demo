// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import axios from 'axios';
import './style/reset.css'
// import './style/border.css'
import Cookies from 'js-cookie'

import ElementUI  from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {post,fetch,patch,put,get_token} from './utils/http'
import store from "./store"
import Back from './components/Back'
import AlertView from './components/AlertView'
import Face from './components/Face'


Vue.component("back",Back);
Vue.component("alert-view",AlertView);
Vue.component("face",Face);



Vue.use(ElementUI);

//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;
Vue.prototype.$get_token=get_token;
Vue.prototype.$axios=axios;
Vue.prototype.$Cookies=Cookies;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
