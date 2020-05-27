<template>
  <div class="Census">
    <!-- 试题报告概览 -->
    <div class="Census_left">
      <back></back>
      <div class="Census_left_view">
        <p class="Census_left_title">试题报告概览</p>

        <!-- 统计 -->
        <div class="all_data_view">
          <!-- 进度条 -->
          <div class="progress_view">
            <el-progress type="circle" :percentage="23" :show-text="false"></el-progress>
            <p>
              <span>12</span>
              <span>/25</span>
            </p>
          </div>

          <!-- 平均用时 -->
          <div class="average_time">
            <p>23′12″</p>
            <p>平均用时</p>
          </div>

          <!-- 平均分 -->
          <div class="average_time">
            <p>23′12″</p>
            <p>平均用时</p>
          </div>
        </div>
        <!-- 学生排名情况 -->
        <div class="student_view">
          <div class="student_view_left">
            <span>成绩排行</span>
            <div class="student_high">
              <span>排名</span>
              <span>姓名</span>
              <span>用时</span>
              <span>分数</span>
            </div>
            <div class="student_view_left_scroll" v-infinite-scroll="student_left_scroll" style="overflow:auto">
              <div v-for="i in 9" :key="i" @click="ToStudentView" >
                <div class="stunde_number">
                  01
                </div>
                <div class="stunde_name">
                  <el-image :src="BookImage" fit="fit">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                  </el-image>
                  <span>司马昭</span>
                </div>
                <div class="stunde_time">23′12″</div>
                <div class="stunde_mark">100分</div>
              </div>
            </div>
          </div>

          <div class="student_view_right">
            <p>未交题学生 (23)</p>
            <div class="student_view_right_scroll" v-infinite-scroll="student_right_scroll" style="overflow:auto">
              <div v-for="i in 9" :key="i">
                <el-image :src="BookImage" fit="fit">
                  <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                </el-image>
                <span>司马昭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="Census_right">
      <span>题目排行</span>
      <div class="Census_right_tab">
        <div v-for="(item,index) in TabArr" :class="TabIndex==index?'tab_action':''" :key="item.text" @click="TabCheck(index)" >{{item.text}}</div>
      </div>
      <!-- 题目 -->
      <div class="list_view_scroll" v-infinite-scroll="load" style="overflow:auto" v-show="TabIndex==0" >
        <div v-for="(item,index) in topic_list" :key="item.code" @click="CheckQas(item.code)" >
          <p class="list_view_scroll_number">{{index+1}}</p>
          <p class="list_view_scroll_title" >{{item.title}}</p>
          <div class="all_cout" v-if="item.points.length" > <p v-for=" pitem in  item.points" :key="pitem.id" >{{pitem.name}}</p> </div>
          <div class="list_view_scroll_bot">
            <div class="list_view_scroll_bot_left">
              <div class="right_number">
                <p>正确率：</p>
                <p>{{item.rq_rate}}%</p>
              </div>
              <!-- 人数 -->
              <div class="poeple_right">
                <el-image :src="RightIcon" fit="fit">
                  <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                </el-image>
                <span>{{item.ycount}}人</span>
              </div>
              <div class="poeple_right">
                <el-image :src="ErrorIcon" fit="fit">
                  <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                </el-image>
                <span>{{item.ncount}}人</span>
              </div>
            </div>

            <!-- 科目章节 -->
            <div class="list_view_scroll_bot_right"></div>
          </div>
        </div>
      </div>

      <!-- 知识点 -->
      <div class="list_view_scroll_other" v-infinite-scroll="load" style="overflow:auto" v-show="TabIndex==1">
          <div  v-for="item in 10" :key="item" >
            <p class="list_view_scroll_number" >{{item}}</p>
            <div class="list_view_scroll_other_title" >
              <p>整十数加、减整十数</p>
              <p class="list_view_scroll_other_text" >
                <span>正确率：</span>
                <span>28%</span>

              </p>

            </div>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
          </div>
    </div>


    </div>

    <!-- 题目弹出框 -->
    <el-dialog :visible.sync="answer_toggle">
      <div class="answer_center">
        <div class="answer_center_top">
          <span>题目</span>
          <p>
            <span>正确率：</span>
            <span>87%</span>
          </p>
        </div>
        <p v-html="p_html"></p>
        <!-- 答案解析 -->
        <div class="answer_konw">
          <el-image :src="BookImage">
            <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
          </el-image>
          <span>答案解析</span>
        </div>

        <!-- 人员显示 -->
        <div class="poeple_view">
          <span>答错学生 12</span>
          <div class="poeple_view_item">
            <div v-for="i in 10" :key="i">
              <el-image :src="BookImage">
                <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
              </el-image>
              <span>张郃</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="danger" class="send_cancle">上一题</el-button>

        <el-button type="primary" class="send_confrm">下一题</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Census",
  data() {
    return {
      answer_toggle: false,
      BookImage: require("../assets/open_book.png"),
      RightIcon: require("../assets/right_icon.png"),
      ErrorIcon: require("../assets/eorr.png"),
      pid:0,
      topic_list:[],
      TabArr:[
        {text:"题目",type:0},
        {text:"知识点",type:0},

      ],
      TabIndex:0,
      p_html: '<span style="font-size:30px" >张郃</span>'
    };
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    this.GetRightList()
  },
  mounted() {},
  methods: {
    TabCheck(index){
      this.TabIndex=index
    },
    student_left_scroll(){

    },
    student_right_scroll(){

    },
    load(){

    },
    CheckQas(){
    let {answer_toggle}=this
    this.answer_toggle=!answer_toggle
    },

     async GetRightList(){
       let {pid}=this
      await this.$post("qa_content_list", "/?c=api", {
        pid:pid
      })
      .then(res=>{
        let topic_list=res.data
        this.topic_list=topic_list
        console.log(res)
      })
    },
    ToStudentView(){
      this.$router.push({name:"StudentView"})
    },
  }
};
</script>
<style  >
.stunde_number {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  font-size: 22px;
}
.tab_action{
  background: #409EFF !important;
  color: #fff !important;
}
.list_view_scroll_bot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 47px;
}
.list_view_scroll_bot > div {
  display: flex;
  align-items: center;
}
.list_view_scroll_bot_right {
  color: #bdbdbd;
  font-size: 25px;
}
.list_view_scroll_bot_left > div {
  display: flex;
  align-items: center;
}
.poeple_right {
  color: #878b94;
  font-size: 25px;
  margin-left: 30px;
}
.poeple_right .el-image {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  margin-right: 4px;
}
.right_number p:nth-child(1) {
  color: #878b94;
  font-size: 25px;
}
.right_number p:nth-child(2) {
  color: #00ad56;
  font-size: 25px;
}
.stunde_number .el-image {
  width: 43px;
  height: 43px;
}
.stunde_mark {
  font-size: 22px;
  font-weight: 500;
  color: rgba(250, 96, 96, 1);
}
.stunde_time {
  font-size: 22px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.stunde_name {
  display: flex;
  align-items: center;
  color: #202020;
  font-size: 22px;
}
.stunde_name .el-image {
  width: 54px;
  height: 54px;
  margin-right: 24px;
  border-radius: 50%;
}

.Census {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.Census_left_view {
  display: flex;
  flex-direction: column;
  width: 855px;
  align-items: center;
}
.el-progress-circle {
  width: 104px !important;
  height: 104px !important;
}
.Census_left_title {
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 32px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-top: 10px;
  margin-bottom: 20px;
}

.Census_left {
  width: 1008px;
  height: 100vh;
  background: #f8f8ff;
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  box-sizing: border-box;
  align-items: center;
}
.all_data_view {
  width: 100%;
  height: 162px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 27px 0px rgba(27, 27, 78, 0.1);
  border-radius: 18px;
  padding: 20px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.el-progress__text {
  font-size: 26px !important;
}

.progress_view {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  position: relative;
}
.average_time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.average_time p:nth-child(1) {
  font-size: 43px;
  font-weight: 500;
  color: rgba(100, 100, 100, 1);
  margin-bottom: 6px;
}
.average_time p:nth-child(2) {
  font-size: 22px;
  font-weight: 500;
  color: #bdbdbd;
}
.progress_view > p {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 29px;
}
.progress_view > p span:nth-child(1) {
  color: #646464;
}
.student_view {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 27px;
}
.student_view_left {
  width: 576px;
  height: 70vh;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 27px 0px rgba(27, 27, 78, 0.1);
  border-radius: 18px;
  padding: 20px 40px;
  box-sizing: border-box;
  margin-right: -20px;
}
.student_view_left > span {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 18px;
}
.student_view_left_scroll {
  width: 100%;
  height: 60vh;
  margin-top: 33px;
}
.student_view_left_scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.student_view_left_scroll > div {
  height: 90px;
  border-bottom: 2px solid #ecedf1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.student_view_left_scroll > div:last-child {
  border-bottom: none;
}

.student_view_right {
  width: 252px;
  height: 70vh;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 27px 0px rgba(27, 27, 78, 0.1);
  border-radius: 18px;
  padding: 20px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.student_view_right_scroll {
  height: 60vh;
}
.list_view_scroll,.list_view_scroll_other {
  /* height: 800px; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list_view_scroll{
  padding-top: 15px;
  box-sizing: border-box;
}
.list_view_scroll > div,.list_view_scroll_other>div {
  width: 770px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 27px 0px rgba(27, 27, 78, 0.1);
  border-radius: 18px;
  margin-bottom: 18px;
  position: relative;
  padding: 18px 28px;
  box-sizing: border-box;
}
.list_view_scroll_other_title{
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.list_view_scroll_other_text{
  display: flex;
  align-items: center;
  
}
.list_view_scroll_other_text span:nth-child(1){
  color: #878B94;
  font-size: 24px;
}
.list_view_scroll_other_text span:nth-child(2){
  color: #FA6060;
  font-size: 24px;
}
.list_view_scroll_number {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(84, 93, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  color: #fff;
  left: -13px;
  top: 50%;
  transform: translate(0%, -50%);
}
.student_view_right_scroll::-webkit-scrollbar,
.list_view_scroll::-webkit-scrollbar,.list_view_scroll_other::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.student_view_right_scroll > div {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 43px;
}
.student_view_right_scroll > div .el-image {
  width: 61px;
  height: 61px;
  margin-right: 23px;
}
.student_view_right > p {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 43px;
}
.progress_view > p span:nth-child(2) {
  color: #bdbdbd;
}
.Census_right {
  width: 912px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 27px 0;
  box-sizing: border-box;
}
.Census_right > span {
  font-size: 32px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 18px;
  width: 100%;
  padding-left: 70px;
  box-sizing: border-box;
}
.Census_right_tab {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  padding-left: 70px;
  box-sizing: border-box;
}
.Census_right_tab > div {
  width: 144px;
  height: 54px;
  background: rgba(236, 236, 236, 1);
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b4b4b;
  font-size: 32px;
  margin-right: 18px;
}
.send_cancle {
  width: 180px;
  height: 72px;
  /* background:rgba(253,104,125,1); */
  box-shadow: 0px 9px 27px 0px rgba(253, 104, 125, 0.3);
  border-radius: 9px;
  font-size: 24px;
  margin-right: 27px;
}
.send_confrm {
  width: 180px;
  height: 72px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 9px;
  font-size: 24px;
}
.el-dialog__headerbtn {
  font-size: 35px;
}
.answer_center {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
.answer_center_top {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}
.list_view_scroll_title{
font-size:25px;
font-weight:500;
color:rgba(32,32,32,1);
margin-bottom: 20px;
}
.answer_center_top > span {
  font-size: 24px;
  font-weight: 500;
  color: rgba(189, 189, 189, 1);
  margin-right: 38px;
}
.answer_center_top p {
  display: flex;
  font-size: 24px;
}
.answer_center_top p span:nth-child(1) {
  color: #202020;
}
.answer_center_top p span:nth-child(2) {
  color: #00ad56;
}
.answer_konw {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
  margin-bottom: 37px;
  width: 100%;
}
.answer_konw .el-image {
  width: 43px;
  height: 39px;
  margin-right: 20px;
}
.poeple_view {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.poeple_view > span {
  font-size: 24px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 28px;
}
.poeple_view > div {
  display: flex;
  flex-wrap: wrap;
  font-size: 21px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.poeple_view_item > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 45px;
  margin-bottom: 35px;
}

.poeple_view_item > div .el-image {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.student_high {
  display: flex;
  align-items: center;
  font-size: 22px;
  color: #bdbdbd;
  justify-content: space-between;
  margin-top: 18px;
}
.all_cout{
  display: flex;
  align-items: center;
  color: #bdbdbd;
  font-size: 26px;
}
.all_cout p{
  margin-right: 15px;
}
</style>
