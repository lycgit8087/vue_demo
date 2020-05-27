<!-- login -->
<template>
  <div class="login">
    <div class="login_left">
      <el-image :src="login_image" fit="cover">
         <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
      </el-image>
    </div>
    <div class="login_right">
      <div class="login_right_tab">
        <p :class="tab_index==0?'login_right_tab_active':''" @click="change_tab(0)">扫一扫</p>
        <p :class="tab_index==1?'login_right_tab_active':''" @click="change_tab(1)">人脸识别</p>
      </div>

      <!-- 二维码 -->
      <div v-show="tab_index==0">
        <div class="qrcode_bg" >
          <div class="qrcode_view" ref="qrcode_bg_style">
            <div id="qrcode"></div>
          </div>
        </div>
        <!-- 登录 -->
        <div class="login_text">
          <p @click="LoginIn">快速安全登录</p>
          <p >微信扫码登录</p>
        </div>
      </div>
      <div v-show="tab_index==1">
        <face :faceView="checkFaceView"></face>
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
      openFaceView: true,
      faceloading: false,
      videoinput: true,
      fileList: [],
      LoginTime:'',
      face: "",
      checkFaceView: true,
      QrcodeUrl: "",
      oc_id: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    fullHeight(oldval) {
      document.getElementById("qrcode").innerHTML = "";
      this.qrcode();
    },
    fullWidth(val) {
      this.fullWidth = val;
      document.getElementById("qrcode").innerHTML = "";
      this.qrcode();
    }
  },
  //方法集合
  methods: {

    // 地址转二维码
    qrcode() {
      let el_width = this.$refs.qrcode_bg_style.clientWidth;
      let { QrcodeUrl } = this;
      new QRCode("qrcode", {
        width: el_width, // 设置宽度，单位像素
        height: el_width, // 设置高度，单位像素
        text: QrcodeUrl // 设置二维码内容或跳转地址
      });
    },
    // 登录
    LoginIn() {
      this.$get_token("/?c=api", {
        user_type: 1,
        mode: 0,
        username: "fang",
        password: "123456"
      }).then(res => {
        this.ToIndex();
      });
    },

    // 二维码登录
    LoginQrcode() {
      let { oc_id } = this;
      this.$get_token("/?c=api", {
        user_type: 1,
        mode: 2,
        oc_id: oc_id
      }).then(res => {
        if (res.token == "") {
          let path=this.$route.path
          if(path=="/login"){
            
            this.LoginTime= setTimeout(() => {
            this.LoginQrcode();
          }, 2000);
          }else{
            clearTimeout(this.LoginTime)
          }
        
        } else {
          this.checkFaceView=false
           this.$message.success({
              message: "扫码登录成功",
              offset: 380,
              duration: 1000
            });

            setTimeout(this.ToIndex(),2100)
          ;
        }
      });
    },

    // 获取二维码
    get_qrcode() {
      this.$post("qrcode_get", "/?c=api", {
        user_type: 1,
        code_type: 0
      }).then(res => {
        this.QrcodeUrl = res.text;
        this.oc_id = res.oc_id;
        this.qrcode();
        this.LoginQrcode()
      });
    },

   
    // 切换tab
    change_tab(index) {
      if (index == 1) {
        // 判断有无摄像头
        var deviceList = [];
        navigator.mediaDevices
          .enumerateDevices()
          .then(devices => {
            devices.forEach(device => {
              deviceList.push(device.kind);
            });
            if (deviceList.indexOf("videoinput") == "-1") {
              this.$message({
                message: "未能识别摄像头，无法使用人脸识别",
                type: "warning"
              });
              this.tab_index = 0;

              return false;
            } else {
              this.videoinput = true;
              this.checkFaceView = true;

            }
          })
          .catch(function(err) {
            alert(err.name + ": " + err.message);
          });
      }else {
        this.checkFaceView=false
      }

      this.tab_index = index;
    },
    ToIndex() {
      this.checkFaceView = false;
      this.$router.replace({ name: "ClassIndex" });
    },
    
    // 将canvas转化为图片
    convertCanvasToImage(canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/jpeg");
      let src = image.src;
      // src=src.substring(src.indexOf(",")+1,src.length)
      return src;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.get_qrcode();
  },


  // 保存图片
  keepImg() {
    var can = document.getElementById("shortCut");
    this.BaseImage = this.convertCanvasToImage(can);
    this.LoginIn();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.qrcode(); //生成二维码
    //获取屏幕宽高
    // this.$message(
    //   `宽 ：${document.documentElement.clientWidth},高 ：${document.documentElement.clientHeight}`
    // );
    var can = document.getElementsByClassName("Scan_me");
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
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {
      clearTimeout(this.LoginTime)


  }, //生命周期 - 销毁之前
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
#qrcode canvas {
  display: none;
}
.qrcode_view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 350px;
  background: rgba(241, 241, 241, 1);
  border-radius: 20px;
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
  border-bottom: 9px solid #545dff;
}
.qrcode_bg {
  width: 450px;
  height: 450px;
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
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.login_text p:nth-child(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
  margin-top: 6px;
}
.face {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>