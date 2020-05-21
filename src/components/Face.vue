<!-- 人脸识别 -->
<template>
  <div class="face" v-loading="loading"
    element-loading-text="识别中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" >
    <div class="container">
      <video id="video" preload autoplay loop muted ref="video_view" ></video>
      <canvas id="canvas" ></canvas>
      <canvas id="canvas1" ></canvas>
      <canvas v-show="a==0" id="shortCut" width="140" height="140"  ></canvas>
      <div id="img" v-show="a==0"></div>


    </div>
    <div class="btns">
      <el-button type="primary" icon="el-icon-user" @click="start">人脸识别</el-button>
    </div>
    
  </div>
</template>
<script>
import "../utils/tracking-min.js"; // 
import "../utils/face-min.js"; // // 
export default {
  name: "testTracking",
  props: ["faceView"],
  data() {
    return {
      saveArray: {},
      imgView: false,
      loading:false,
      a:1,
      BaseImage:""
    };
  },
  created(){
  },
  methods: {
 
    // 打开摄像头
    start() {
      let {faceView}=this
      this.loading=true
      var saveArray = {};
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");
      // eslint-disable-next-line no-undef
      var tracker = new window.tracking.ObjectTracker("face");
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      // eslint-disable-next-line no-undef
      this.trackerTask = window.tracking.track("#video", tracker, {
        camera: true
      });
      tracker.on("track", function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          context.strokeStyle = "#fff";
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.fillStyle = "#fff";
          saveArray.x = rect.x;
          saveArray.y = rect.y;
          saveArray.width = rect.width;
          saveArray.height = rect.height;
        });
      });
      let el_width = this.$refs.video_view.clientWidth;
      let el_height = this.$refs.video_view.clientHeight;
      var canvas1 = document.getElementById("canvas1");
      var context1 = canvas1.getContext("2d");
      context1.strokeStyle = "#69fff1";
      // context1.moveTo(190, 118);
      // context1.lineTo(390, 118);
      // context1.lineTo(390, 318);
      // context1.lineTo(190, 318);
      // context1.lineTo(190, 118);
      context1.moveTo(0, 0);
      context1.lineTo(0, el_width);
      context1.lineTo(el_height, el_width);
      context1.lineTo(0, el_height);
      context1.lineTo(0, el_width);
      context1.stroke();
      setTimeout(()=>{
        this.loading=true
          if(faceView){
          this.getPhoto();
          }
          for (var key in saveArray) {
            delete saveArray[key];
          }
      },5000)
      
    },
    // 获取人像照片
    getPhoto() {
      var video = document.getElementById("video");
      var can = document.getElementById("shortCut");
      var context2 = can.getContext("2d");
      let el_width = this.$refs.video_view.clientWidth;
      let el_height = this.$refs.video_view.clientHeight;
      // console.log(el_width,el_height)
      // context2.drawImage(video, 210, 130, 210, 210, 0, 0, 140, 140);
      context2.drawImage(video, 0, 0, el_width, el_height, 0, 0, el_width, el_height);

      this.imgView = true;
      this.keepImg()
    },
    
    // 将canvas转化为图片
    convertCanvasToImage(canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/jpeg");
      let src=image.src
      src=src.substring(src.indexOf(",")+1,src.length)
      return src;
    },
    
    // 保存图片
    keepImg() {
      var can = document.getElementById("shortCut");
      this.BaseImage=this.convertCanvasToImage(can)
      this.LoginIn()
    },

     // 登录
    LoginIn(){
      let{BaseImage}=this
       this.$get_token("/?c=api",{
      user_type:1,
      mode:1,
      image:BaseImage,
      }).then(res=>{
        
        console.log(res)
      })
        this.loading=false

    },
    clearCanvas() {
      var c = document.getElementById("canvas");
      var c1 = document.getElementById("canvas1");
      var cxt = c.getContext("2d");
      var cxt1 = c1.getContext("2d");
      cxt.clearRect(0, 0, 581, 436);
      cxt1.clearRect(0, 0, 581, 436);
    },
    closeFace() {
      console.log("关闭人脸识别窗口");
      this.imgView = false;
      this.clearCanvas();
      // 停止侦测
      this.trackerTask.stop();
      console.log(this.trackerTask);
      // 关闭摄像头
      var video = document.getElementById("video");
      video.srcObject.getTracks()[0].stop();
    }
  },
  watch: {
    faceView(v) {
      if (v == false) {
        // this.closeFace();
      }
    },
    imgView(v) {
      if (v == true) {
        // this.$message.success({
        //   message: "截取成功！点击保存图片",
        //   offset: 380,
        //   duration: 1000
        // });
      }
    }
  },
  destroyed() {}
};
</script>
<style scoped >

  .container {
    background: #000;
    position: relative;
    width: 581px;
    height: 436px;
    
   
  }
  .face .el-button{
    font-size: 26px !important;
  }
  #canvas1 {
      position: absolute;
    }
   video,
    #canvas,
    #canvas1 {
      position: absolute;
      width: 581px;
      height: 436px;
    }
    #shortCut{
      opacity: 0;
    }
  .btns {
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
   .tips {
      font-size: 14px;
      color: #666;
      margin: 10px 0;
      line-height: 24px;
    }
  .imgs {
    padding: 10px;
    box-sizing: border-box;

    
  }
 .imgs p {
      font-size: 16px;
    }

</style>