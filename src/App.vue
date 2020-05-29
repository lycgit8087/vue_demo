<template>
  <div id="app">
    <!-- <transition name="fade" mode="out-in"> -->
    <keep-alive>
    <router-view v-if="$route.meta.keepAlive" ></router-view>
    </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>

      <!-- </transition> -->
  </div>
</template>

<script>

export default {
  name: 'App',
   data () {
    return {
    }
  },
  created(){
      const token =this.$Cookies.get("token");
      if(token){
          this.$router.replace({name:"ClassIndex"})
              
      }else{
          this.$router.replace({name:"Login"})
      }
  },
  methods: {
  },
  
}
</script>

<style>

.el-message__content{
  font-size: 30px !important;

}
.el-message__icon{
  font-size: 30px !important;
}
.el-loading-mask.is-fullscreen .el-loading-spinner .circular{
  width: 80px !important;
  height: 80px !important;
}
.el-loading-spinner .el-loading-text{
  font-size: 36px !important;
}

.el-dialog__wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-button--primary{
  background: #545DFF !important;
}
.el-tree__empty-text{
  font-size: 28px !important;
}
.el-image-viewer__close{
 font-size: 80px;
 width: 100px;
 height: 100px;
}
.el-image-viewer__btn .el-icon-circle-close{
  font-size: 120px;
}

</style>
