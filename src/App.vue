<template>
  <div id="app">
    <router-view></router-view>
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


</style>
