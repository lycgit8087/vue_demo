import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 const state={   //要设置的全局访问的state对象
     num: 1,
     //要设置的初始属性值
   };
const getters = {   //实时监听state值的变化(最新状态)
    total_num(state) {  //承载变化的showFooter的值
       return state.num+3
    },
};
const mutations = {
   add_num(state,num=2){
    state.num +=num
   }
};
 const actions = {
   add(context,num){
    context.commit('add_num',num);
   },
};
  const store = new Vuex.Store({
       state,
       getters,
       mutations,
       actions
});
export default store;