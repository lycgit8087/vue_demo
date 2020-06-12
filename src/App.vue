<template>
  <div id="app">
    <!-- <transition name="fade" mode="out-in"> -->
    <keep-alive :include="keepAlive"   >
    <router-view  ></router-view>
    </keep-alive>
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
      const token =localStorage.getItem("token");
      if(token){
      this.$store.dispatch('change_keep_alive', ['ClassIndex'])
      this.$router.replace({name:"ClassIndex"})
      }else{
        this.$store.dispatch('change_keep_alive', [])
        this.$router.replace({name:"Login"})
      }
  },
  methods: {
  },
   computed: {
    keepAlive () {
      return this.$store.getters.keepAlive
    }
  }
  
}
</script>

<style>

/* viewer.css */

.viewer-toolbar > ul > li{
  height: 80px !important;
  width: 80px !important;
  position: relative !important;
}
.viewer-toolbar > ul > .viewer-large{
  height: 90px !important;
  width: 90px !important;
}
.viewer-title{
  font-size: 30px !important;
}
.viewer-zoom-in::before, .viewer-zoom-out::before, .viewer-one-to-one::before, .viewer-reset::before, .viewer-prev::before, .viewer-play::before, .viewer-next::before, .viewer-rotate-left::before, .viewer-rotate-right::before, .viewer-flip-horizontal::before, .viewer-flip-vertical::before, .viewer-fullscreen::before, .viewer-fullscreen-exit::before, .viewer-close::before{
  height: 50px !important;
  width: 50px !important;
  /* font-size:60px; */
  background-size:50px 50px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-image: url('./assets/BookImage.png'); */
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-position: 0 0 !important;
  margin: 0 !important;
  
}
.viewer-close::before{
  left: 50% !important;
}
.viewer-list{
  height: 90px !important;
}
.viewer-list > li{
  height: 100% !important;
  width: 90px !important;
}
.viewer-list > li  img{
  width: 100% !important;
  height: 100% !important;
      transform: translateY(0) !important;
}
.viewer-button{
  width: 100px !important;
  height: 100px !important;
  right: 0 !important;
  top: 0 !important;
}
.viewer-close::before{
  background-image: url('./assets/v_close.png') !important;

}
.viewer-toolbar > ul > li:nth-child(1)::before{
  background-image: url('./assets/v_add.png') !important;

}
.viewer-toolbar > ul > li:nth-child(2)::before{
  background-image: url('./assets/v_cut.png') !important;

}
.viewer-toolbar > ul > li:nth-child(3)::before{
  background-image: url('./assets/v_one.png') !important;

}
.viewer-toolbar > ul > li:nth-child(4)::before{
  background-image: url('./assets/v_turn.png') !important;

}

.viewer-toolbar > ul > li:nth-child(5)::before{
  background-image: url('./assets/v_left.png') !important;

}.viewer-toolbar > ul > li:nth-child(6)::before{
  background-image: url('./assets/v_play.png') !important;

}
.viewer-toolbar > ul > li:nth-child(7)::before{
  background-image: url('./assets/v_right.png') !important;

}
.viewer-toolbar > ul > li:nth-child(8)::before{
  background-image: url('./assets/v_back.png') !important;

}
.viewer-toolbar > ul > li:nth-child(9)::before{
  background-image: url('./assets/v_to.png') !important;

}
.viewer-toolbar > ul > li:nth-child(10)::before{
  background-image: url('./assets/v_left_right.png') !important;

}

.viewer-toolbar > ul > li:nth-child(11)::before{
  background-image: url('./assets/v_top_bot.png') !important;

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

.success_stundets{
  width:41px;
height:30px;
background:rgba(102,189,106,1);
border-radius:103px;
padding: 6px 8px ;
box-sizing: border-box;
color: #fff;
display: flex;
align-items: center;
justify-content: center;
}
.error_stundets{
  width:41px;
height:30px;
background:#FF5A58;
border-radius:103px;
padding: 6px 10px ;
box-sizing: border-box;
color: #fff;
display: flex;
align-items: center;
justify-content: center;
}
html::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      background-color: #545dff !important;
    border-color: #545dff !important;
}
.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #545dff !important
}
.el-checkbox.is-bordered.is-checked{
  border-color:#545dff !important
}
.el-loading-spinner .path{
  stroke:#545dff !important
}
.el-loading-spinner .el-loading-text{
  color: #545dff !important;
}

</style>
