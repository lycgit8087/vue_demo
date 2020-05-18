<!-- login -->
<template>
  <div class="login">
    <div class="login_left">
      <el-image :src="login_image" fit="cover" ></el-image>
    </div>
    <div class="login_right">
      <div class="login_right_tab">
        <p :class="tab_index==0?'login_right_tab_active':''" @click="change_tab(0)" >扫一扫</p>
        <p :class="tab_index==1?'login_right_tab_active':''" @click="change_tab(1)" >人脸识别</p>
      </div>

      <!-- 二维码 -->
      <div class="qrcode_bg" @click="ToIndex" >
        <div class="qrcode_view" ref="qrcode_bg_style">
          <div id="qrcode" ></div>
        </div>
      </div>

      <!-- 登录 -->
      <div class="login_text">
        <p>快速安全登录</p>
        <p>微信扫码登录</p>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import QRCode from "qrcodejs2";

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "login",
  components: {},
  data() {
    //这里存放数据
    return {
      login_image: require("../assets/login_img.png"),
      tab_index: 0,
      fullHeight: document.documentElement.clientHeight,
      fullWidth: document.documentElement.clientWidth,
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    fullHeight(oldval) {
        document.getElementById('qrcode').innerHTML = ''
        this.qrcode()
    },
    fullWidth(val) {
        this.fullWidth=val
        document.getElementById('qrcode').innerHTML = ''
        this.qrcode()


       
    }
  },
  //方法集合
  methods: {
    qrcode() {
      let el_width = this.$refs.qrcode_bg_style.clientWidth
        
         new QRCode("qrcode", {
          width: el_width, // 设置宽度，单位像素
          height: el_width, // 设置高度，单位像素
          text: "https://www.baidu.com" // 设置二维码内容或跳转地址
        });
    },

    // 切换tab
    change_tab(index){
        this.tab_index=index
    },
    ToIndex(){
      console.log(this.$router)
      this.$router.replace({name:"ClassIndex"})
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.qrcode(); //生成二维码
    //获取屏幕宽高
    this.$message(`宽：${document.documentElement.clientWidth},高：${document.documentElement.clientHeight}`);
    
    const that = this;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        that.fullHeight = window.fullHeight;
        that.fullWidth = window.fullWidth;
      })();
    };
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {

  }, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  scoped>
/* @import url(); 引入公共css类 */


.login_left {
  width: 1920px;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}
.login_left .el-image {
  height: 100vh;
  width: 100%;
}
.login_right {
  width: 960px;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  background: #fff;
  z-index: 2;
}
.qrcode_view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: 195px;
  background: rgba(241, 241, 241, 1);
  border-radius: 20px;
}
.Scan_me{
    width: 195px;
    height: 195px;
}
.login_right_tab {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 79px;
}
.login_right_tab p {
  font-size: 48px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
  height: 80px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.login_right_tab p:last-child {
  margin-left: 81px;
}
.login_right_tab_active {
  color: #545dff !important ;
   border-bottom: 9px solid #545DFF;
}
.qrcode_bg {
  width: 293px;
  height: 293px;
  background: rgba(241, 241, 241, 1);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_text {
  display: flex;
  flex-direction: column;
  margin-top: 57px;
  align-items: center;
  justify-content: center;
}
.login_text p:nth-child(1) {
  font-size: 44px;
  /* font-family: PingFangSC-Medium, PingFang SC; */
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.login_text p:nth-child(2) {
  font-size: 24px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
  margin-top: 6px;
}
</style>