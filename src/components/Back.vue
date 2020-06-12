<!-- back -->
<template>
  <div class="Back">
    <div class="back_to">
       <!-- 返回上一页 -->
      <div @click="BackIt" v-if="route_name!='ClassIndex'" >
        <el-image  :src="backIcon" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <!-- 放大缩小 -->
      <div @click="change_scale"  >
        <el-image  :src="this.$store.state.is_change_sacale?bigIcon:smallIcon" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>

      <!-- 返回首页 -->
      <div @click="Backindex" v-if="route_name!='ClassIndex'" >
        <el-image  :src="indexIcon" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>

      <!-- 刷新 -->
      <div @click="updateIt" >
        <el-image  :src="updateIcon" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>


      <!-- 退出 -->
      <div @click="LoginIt" v-if="route_name=='ClassIndex'" >
        <el-image  :src="loginIcon" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>


     



    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "Back",
  components: {},
  data() {
    //这里存放数据
    return {
      backIcon: require("../assets/back_icon.png"),
      indexIcon: require("../assets/index_icon.png"),
      updateIcon: require("../assets/update.png"),
      loginIcon: require("../assets/login.png"),
      bigIcon: require("../assets/big.png"),
      smallIcon: require("../assets/small.png"),

      route_name:"",
      is_change:false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    BackIt() {
      this.$router.go(-1);
    },
    Backindex() {
      this.$router.replace({ name: "ClassIndex" });
    },
    LoginIt(){
      this.$emit("loginit") 
    },
    updateIt(){
      this.$emit("updateit") 
    },
     change_scale(){
       let is_change=this.$store.state.is_change_sacale
       this.$store.dispatch('change_sacale', !is_change)
      
         this.$forceUpdate()
       if(is_change){
          document.webkitExitFullscreen()
       }else{
         document.documentElement.webkitRequestFullscreen()
       }
       
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.route_name=this.$route.name
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  >
/* //@import url(); 引入公共css类 */
.Back {
  /* width: 100%; */
}
.back_to {
  width: 94px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px 0px 0px 15px;
  border: 1px solid rgba(233, 233, 233, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  box-sizing: border-box;
  position: fixed;
  right: 0;
  bottom: 5vh;
  z-index: 666;
}
.back_to > div {
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back_to .el-image {
  width: 51px;
  height: 51px;
}
</style>