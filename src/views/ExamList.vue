<!-- ExamList -->
<template>
  <div class="ExamList">
    <div class="exam_list_left">
        <back></back>
        <p class="exam_list_left_title" >数的运算（一）</p>
        <p class="exam_list_left_text" >教学建议教材分析</p>


    </div>
    <div class="exam_list_right">
      <!-- 附件 -->
      <div class="file_list">
        <p>附件</p>
        <div class="file_list_view">
          <div v-for="item in file_arr" :key="item.name">
            <el-image :src="item.url" fit="fit"></el-image>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>

      <!-- 试题 -->
      <div class="exam_list_view"  >
        <p>试题</p>
        <el-scrollbar class="scroll_view">
          <div class="exam_list_view_item" v-for="i in list_arr" :key="i">
            <el-image :src="file_image" fit="fit"></el-image>
            <div class="exam_list_view_item_right">
              <p class="exam_list_view_item_right_title">数的运算一 练习题</p>
              <p class="exam_list_view_item_right_num">共8题</p>
              <div class="exam_list_view_item_right_edit">
                <el-button type="primary" @click="SeeIt" >查看</el-button>
                <el-button type="primary">发送</el-button>
                <el-button type="primary">数据</el-button>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "ExamList",
  components: {},
  data() {
    //这里存放数据
    return {
      HeadImage: require("../assets/login_img.png"),
      file_image: require("../assets/file.png"),
      loading:true,
      file_arr: [
          {url:require("../assets/Word.png"),name:"word"},
          {url:require("../assets/Ppt.png"),name:"PPt"},

      ],
      list_arr: 6
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    SeeIt(){
    
    },

  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.$route.params.id);
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style >
/* //@import url(); 引入公共css类 */
/* @import url('../style/index.css'); */
.el-button--small, .el-button--small.is-round{
  width:576px;
height:94px;
box-shadow:0px 9px 27px 0px rgba(84,93,255,0.3);
border-radius:18px;
padding: 0;
display: flex;
align-items: center;
justify-content: center;
margin-right: 0;
font-size: 32px;
}
.el-message-box{
  width: auto;
}
.ExamList {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: space-between;
}
.msg_text{
  color: rebeccapurple;
}
.exam_list_left {
  width: 1118px;
  height: 100%;
  background: #f8f8ff;
  padding: 30px 100px;
  box-sizing: border-box;
}
.exam_list_right {
  display: flex;
  padding: 54px 0px;
  width: 732px;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
}
.file_list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.el-tree-node>.el-tree-node__children{
   overflow:visible !important;
 }
 
.file_list > p {
  font-size: 32px;
  /* font-family: PingFangSC-Medium, PingFang SC; */
  font-weight: 500;
  color: rgba(0, 3, 54, 1);
  margin-bottom: 40px;
}
.file_list_view {
  display: flex;
  flex-wrap: wrap;
}
.file_list_view > div {
  display: flex;
  flex-direction: column;
  margin-right: 70px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
.file_list_view > div img {
  width: 54px;
  height: 54px;
  margin-bottom: 12px;
}
.exam_list_view {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  width: 100%;
}
.exam_list_view > p {
  font-size: 32px;
  /* font-family: PingFangSC-Medium, PingFang SC; */
  font-weight: 500;
  color: rgba(0, 3, 54, 1);
  margin-bottom: 16px;
}
.scroll_view {
  height: 800px;
  width: 702px;
}
.exam_list_view_item {
  height: 200px;
  display: flex;
  width: 540px;
  border-bottom: 2px solid #ecedf1;
  margin-bottom: 50px;
}
.exam_list_view_item img {
  width: 61px;
  height: 61px;
  margin-right: 36px;
}
.exam_list_view_item_right {
  display: flex;
  flex-direction: column;
}
.exam_list_view_item_right_title {
  font-size: 25px;
  /* font-family: PingFangSC-Medium, PingFang SC; */
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.exam_list_view_item_right_num {
  font-size: 22px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
  margin-top: 15px;
}
.exam_list_view_item_right_edit {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
}
.exam_list_view_item_right_edit .el-button {
  width: 90px;
  height: 50px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 9px;
  margin-right: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.exam_list_left_title{
font-size:38px;
/* font-family:PingFangSC-Medium,PingFang SC; */
font-weight:500;
color:rgba(32,32,32,1);
margin-bottom: 54px;
}
.exam_list_left_text{
font-size:32px;
/* font-family:PingFangSC-Medium,PingFang SC; */
font-weight:500;
color:rgba(32,32,32,1);
}

</style>