import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 const state={   //要设置的全局访问的state对象
     num: 1,
     sid:0,
     org_id:0,
     class_id:0,
     url:"http://files.imofang.cn",
     websocket:null,
     web_type:0,
     web_num:0,
     keepAlive: [],
     is_change_sacale:false
     //要设置的初始属性值
   };
const getters = {   //实时监听state值的变化(最新状态)
    total_num(state) {  //承载变化的showFooter的值
       return state.num+3
    },
    keepAlive: state => state.keepAlive
};
const mutations = {
   edit_sid(state,id){
    state.sid =id
   },
   edit_sacale(state,bol){
      state.is_change_sacale =bol
     },

   edit_websocket(state,web){
      state.websocket=web
   },
   edit_org_id(state,id){
      state.org_id =id
     },
     edit_class_id(state,id){
      state.class_id =id

     },
     edite_web_type(state,type){
      state.web_type =type

     },
     edit_web_num(state,num){
      state.web_num =num

     },
     setKeepAlive: (state, keepAlive) => {
      state.keepAlive = keepAlive;
  }
};
 const actions = {
   change_sid(context,id){
    context.commit('edit_sid',id);
   },
   change_org_id(context,id){
    context.commit('edit_org_id',id);

   },
   change_web_num(context,num){
      context.commit('edit_web_num',num);

   },
   change_class_id(context,id){
    context.commit('edit_class_id',id);

   },
   change_websocket(context,web){
    context.commit('edit_websocket',web);

   },
   change_web_type(context,type){
      context.commit('edite_web_type',type);
  
     },
     change_keep_alive(context,keepAlive){
      context.commit('setKeepAlive',keepAlive);

     },
     change_sacale(context,bol){
      context.commit('edit_sacale',bol);

     }
};
  const store = new Vuex.Store({
       state,
       getters,
       mutations,
       actions
});
export default store;