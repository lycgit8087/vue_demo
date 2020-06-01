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

/* viewer.css */

.viewer-toolbar > ul > li{
  height: 80px;
  width: 80px;
  position: relative;
}
.viewer-toolbar > ul > .viewer-large{
  height: 90px;
  width: 90px;
}
.viewer-title{
  font-size: 30px;
}
.viewer-zoom-in::before, .viewer-zoom-out::before, .viewer-one-to-one::before, .viewer-reset::before, .viewer-prev::before, .viewer-play::before, .viewer-next::before, .viewer-rotate-left::before, .viewer-rotate-right::before, .viewer-flip-horizontal::before, .viewer-flip-vertical::before, .viewer-fullscreen::before, .viewer-fullscreen-exit::before, .viewer-close::before{
  height: 50px;
  width: 50px;
  /* font-size:60px; */
  background-size:50px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-image: url('./assets/BookImage.png'); */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-position: 0 0 !important;
  margin: 0 !important;
  
}
.viewer-button{
  width: 100px;
  height: 100px;
  right: 0;
}
.viewer-close::before{
  background-image: url('./assets/v_close.png');

}
.viewer-toolbar > ul > li:nth-child(1)::before{
  background-image: url('./assets/v_add.png');

}
.viewer-toolbar > ul > li:nth-child(2)::before{
  background-image: url('./assets/v_cut.png');

}
.viewer-toolbar > ul > li:nth-child(3)::before{
  background-image: url('./assets/v_one.png');

}
.viewer-toolbar > ul > li:nth-child(4)::before{
  background-image: url('./assets/v_turn.png');

}

.viewer-toolbar > ul > li:nth-child(5)::before{
  background-image: url('./assets/v_left.png');

}.viewer-toolbar > ul > li:nth-child(6)::before{
  background-image: url('./assets/v_play.png');

}
.viewer-toolbar > ul > li:nth-child(7)::before{
  background-image: url('./assets/v_right.png');

}
.viewer-toolbar > ul > li:nth-child(8)::before{
  background-image: url('./assets/v_back.png');

}
.viewer-toolbar > ul > li:nth-child(9)::before{
  background-image: url('./assets/v_to.png');

}
.viewer-toolbar > ul > li:nth-child(10)::before{
  background-image: url('./assets/v_left_right.png');

}

.viewer-toolbar > ul > li:nth-child(11)::before{
  background-image: url('./assets/v_top_bot.png');

}
/* .viewer-toolbar > ul > li:nth-child(12)::before{
  background-image: url('./assets/v_all.png');

}

.viewer-toolbar > ul > li:nth-child(13)::before{
  background-image: url('./assets/v_samll.png');

} */

/* element.css */

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
