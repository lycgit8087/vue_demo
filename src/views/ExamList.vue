<!-- ExamList -->
<template>
  <div class="ExamList">
    <div class="exam_list_left">
      <back></back>
      <p class="exam_list_left_title">数的运算（一）</p>
      <p class="exam_list_left_text">教学建议教材分析</p>
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
      <div class="exam_list_view">
        <p>试题</p>
          <el-scrollbar class="scroll_view">
            <div class="exam_list_view_item" v-for="i in list_arr" :key="i">
              <el-image :src="file_image" fit="fit"></el-image>
              <div class="exam_list_view_item_right">
                <p class="exam_list_view_item_right_title">数的运算一 练习题</p>
                <p class="exam_list_view_item_right_num">共8题</p>
                <div class="exam_list_view_item_right_edit">
                  <el-button type="primary" @click="SeeIt">查看</el-button>
                  <el-button type="primary" @click="SendIt">发送</el-button>
                  <el-button type="primary" @click="SeeData">数据</el-button>
                </div>
              </div>
            </div>
          </el-scrollbar>
      </div>

      <!--  查看  -->
      <el-dialog :visible.sync="centerDialogVisible" center>
        <div class="see_dialog_center">
          <span class="see_dialog_center_title">
            2020上学期二年级
            模拟试题（一）
          </span>
          <span class="see_dialog_center_text">总分100分，作答120分钟</span>
          <span class="see_dialog_center_tree">共分为4个部分：</span>

          <div class="see_item" v-for="item in see_list" :key="item.text">
            <span>{{item.text}}</span>
            <span>{{item.num}}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="see" @click="centerDialogVisible = false">点击查看</el-button>
        </span>
      </el-dialog>

      <!-- 试题发送 -->

      <el-dialog :visible.sync="send_toggle" :show-close="false"  v-loading="send_loading"
    element-loading-text="发送中" >
        <div class="send_dialog_center">
          <div class="send_dialog_center_check">
            <span>一年级107班</span>
            <el-checkbox v-model="checked" border size="medium">全选</el-checkbox>
          </div>

          <div class="people_view">
            <div
              class="people_view_item"
              v-for="(item,index) in people_arr"
              :key="item.name"
              @click="check_now(index)"
            >
              <div class="people_view_item_image">
                <el-image :src="item.url"></el-image>
                <el-image v-if="item.is_check" :src="CheckedImage"></el-image>
                <div v-if="!item.is_check" class="image_bg"></div>
              </div>
              <span :class="item.is_check?'action_text':'span_text'">{{item.name}}</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" class="send_cancle" @click="close_send">取消</el-button>

          <el-button type="primary" class="send_confrm" @click="send_data">发送</el-button>
        </span>
      </el-dialog>

      <!-- 发送成功 -->
      <el-dialog :visible.sync="send_success" :show-close="false">
        <div class="send_success_center">
          <el-image :src="SuccessImage"></el-image>
          <span class="success_text" >发送成功</span>
          <el-button type="primary" class="to_see_data" @click="to_see_data">查看数据</el-button>
          <div class="back_index" @click="BackIndex" >返回首页</div>
        </div>
      </el-dialog>
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
      loading: true,
      file_arr: [
        { url: require("../assets/Word.png"), name: "word" },
        { url: require("../assets/Ppt.png"), name: "PPt" }
      ],
      centerDialogVisible: false,
      CheckedImage: require("../assets/check_it.png"),
      SuccessImage: require("../assets/send_success.png"),

      people_arr: [
        {
          url: require("../assets/login_img.png"),
          id: 1,
          is_check: true,
          name: "111"
        },
        {
          url: require("../assets/login_img.png"),
          id: 2,
          is_check: true,
          name: "123"
        },
        {
          url: require("../assets/login_img.png"),
          id: 3,
          is_check: true,
          name: "134"
        }
      ],
      list_arr: 6,
      see_list: [
        { text: "基础知识", num: 46 },
        { text: "基础知识1", num: 40 },
        { text: "基础知识2", num: 16 },
        { text: "基础知识3", num: 6 }
      ],
      send_toggle: false,
      send_success: false,
      checked: true,
      send_loading:false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    checked() {
      let { people_arr } = this;
      let has_check = people_arr.filter(item => item.is_check == false);
      if (has_check.length) {
        for (let i in people_arr) {
          people_arr[i].is_check = true;
        }
      } else {
        for (let i in people_arr) {
          people_arr[i].is_check = false;
        }
      }
      this.people_arr = people_arr;
    }
  },
  //方法集合
  methods: {
    SeeIt() {
      this.centerDialogVisible = true;
    },
    SendIt() {
      this.send_toggle = true;
    },
    SeeData() {},
    to_see_data(){

    },
    check_now(index) {
      let { people_arr } = this;
      people_arr[index].is_check = !people_arr[index].is_check;
      this.people_arr = people_arr;
    },
    send_data() {
      this.send_loading=true
      setTimeout(()=>{
      this.send_loading=false
      this.close_send();
      this.send_success = true;
      },3000)
      
    },
    BackIndex(){
      this.$router.replace({name:"ClassIndex"})

    },
    close_send() {
      this.send_toggle = !this.send_toggle;
    }
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
.el-button--small,
.el-button--small.is-round {
  width: 576px;
  height: 94px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  font-size: 32px;
}
.el-message-box {
  width: auto;
}
.ExamList {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: space-between;
}
.msg_text {
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
.el-tree-node > .el-tree-node__children {
  overflow: visible !important;
}

.file_list > p {
  font-size: 32px;
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
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.exam_list_view_item_right_num {
  font-size: 22px;
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
  font-size: 25px !important;
}
.el-button + .el-button {
  margin-left: 0 !important;
}
.exam_list_left_title {
  font-size: 38px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 54px;
}
.exam_list_left_text {
  font-size: 32px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.see {
  width: 576px;
  height: 94px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 18px;
  font-size: 32px !important;
}
.see_dialog_center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.see_dialog_center > span {
  width: 100%;
}
.see_dialog_center_title {
  font-size: 43px;
  font-weight: 500;
  color: rgba(13, 13, 13, 1);
  line-height: 61px;
  margin-bottom: 70px;
  display: flex;
  justify-content: center;
}
.see_dialog_center_text {
  font-size: 32px;
  font-weight: 400;
  color: rgba(13, 13, 13, 1);
  margin-bottom: 50px;
}
.see_dialog_center_tree {
  font-size: 32px !important;
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
  margin-bottom: 72px;
}
.el-dialog__headerbtn .el-dialog__close{
  font-size: 40px !important;
}
.see_item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
}
.send_cancle {
  width: 180px;
  height: 72px;
  /* background:rgba(253,104,125,1); */
  box-shadow: 0px 9px 27px 0px rgba(253, 104, 125, 0.3);
  border-radius: 9px;
  font-size: 24px !important;
  margin-right: 27px;
}
.send_confrm {
  width: 180px;
  height: 72px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 9px;
  font-size: 24px !important;
}
.send_dialog_center {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  box-sizing: border-box;
}
.send_dialog_center_check {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}
.send_dialog_center_check > span {
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
}
.el-dialog__body {
  padding-top: 50px;
}
/* .el-checkbox__inner{
  width: 30px;
  height: 30px;
}
.el-checkbox__inner::after{
   width: 5px;
  height: 5px;
} */
.send_dialog_center .el-checkbox__label {
  font-size: 24px;
}
.send_dialog_center .el-checkbox.is-bordered.el-checkbox--medium {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: auto;
}
.send_dialog_center .people_view {
  display: flex;
  flex-wrap: wrap;
}
.people_view_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  margin-right: 50px;
}
.people_view_item > span {
  font-size: 24px;
  font-weight: 400;
}
.people_view_item_image {
  display: flex;
  align-items: center;
  height: 90px;
  width: 90px;
  border-radius: 50%;
  position: relative;
  margin-bottom: 20px;
  justify-content: center;
}
.people_view_item_image .el-image:nth-child(1) img {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  background: rgba(216, 216, 216, 0.4);
}
.people_view_item_image .el-image:nth-child(2) {
  width: 43px;
  height: 43px;
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translate(-50%, 0%);
}
.image_bg {
  width: 90px;
  height: 90px;
  background: rgba(216, 216, 216, 0.4);
  position: absolute;
  z-index: 66;
  border-radius: 50%;
}
.action_text {
  color: #202020;
}
.span_text {
  color: #878b94;
}
.send_success_center {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.send_success_center img {
  width: 352px;
  height: 345px;
  margin-bottom: 10px;
}
.success_text{
font-size:43px !important;
font-weight:500;
color:rgba(0,173,86,1);
margin-bottom: 88px !important;
}
.to_see_data{
width:576px;
height:94px;
box-shadow:0px 9px 27px 0px rgba(84,93,255,0.3);
border-radius:18px;
font-size: 32px;

}
.back_index{
font-size:32px;
font-weight:500;
color:rgba(135,139,148,1);
display: flex;
align-items: center;
height: 94px;
margin-top: 30px;
}
.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label{
  font-size: 24px !important;
}
.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__inner{
  width: 24px !important;
  height: 24px !important;
}
.el-checkbox__inner::after{
  height: 10px !important;
  width: 10px !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner::after{
  transform: rotate(45deg) scaleY(1.5) !important;
}

</style>