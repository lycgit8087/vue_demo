<template>
  <div class="student_view_page">
    <back></back>

    <div class="student_view_des">
      <div class="student_view_des_left">
        <el-image :src="info.avatar" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <span class="student_name">{{info.sname}}</span>
        <div class="student_des">
          <div class="left_des" v-for="item in left_arr" :key="item.text">
            <span>{{item.des}}</span>
            <span>{{item.text}}</span>
          </div>
        </div>

        <!-- 答题切换 -->
        <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
          <el-tab-pane label="答题卡" name="first">
            <div
              class="exam_student_list"
              v-infinite-scroll="exam_student_list_scroll"
              style="overflow:auto"
            >
              <div v-for="(item,index) in info.qa_results" :key="index">
                <p class="exam_student_list_title">{{item.partname}}</p>
                <p class="exam_student_list_span">
                  <span
                    :class="qitem.result==1?'span_success':qitem.result==3?'span_error':''"
                    v-for="(qitem,qindex) in item.qas"
                    :key="qindex"
                  >{{qitem.num}}</span>
                </p>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="知识点掌握率" name="second">
            <div
              class="exam_student_list"
              v-infinite-scroll="exam_student_list_scroll"
              style="overflow:auto"
            >
              <div class="exam_konwledge_view">
                <div class="exam_konwledge_view_top">
                  <p>
                    <span>1</span>
                    <span>20以内退位减法</span>
                  </p>
                  <span>42%</span>
                </div>
                <el-progress :text-inside="false" color="#66BD6A" :percentage="20"></el-progress>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="student_view_des_right">

            <html-view :content="content" :des="tsocre" :title="paper_title"  ></html-view>


      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "student_view",
  data() {
    return {
      left_arr: [
        { text: "成绩排行", des: "" },
        { text: "分数", des: "" },
        { text: "用时", des: "" },
        { text: "答错数", des: "" },
        { text: "答对数", des: "" }
      ],
      list: 10,
      pid: 0,
      activeName: "first",
      paper_title:"",
      tsocre:"",
      content:[],
      sid: 0,
      info: {}
    };
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    this.sid = this.$route.query.sid;
    console.log(this.$route.query);
    this.GetInfo();
    this.get_paper_result()
  },

  mounted() {},
  methods: {
    GetInfo() {
      let { sid, pid, left_arr } = this;
      this.$post("paper_result", "/?c=api", {
        student_id: sid,
        pid: pid
      }).then(res => {
        let info = res;
        info.avatar = this.$till.change_file_url(info.avatar);
        left_arr[0].des = info.order;
        left_arr[1].des = info.score;
        left_arr[2].des = this.$till.formatSeconds(info.used_time);
        left_arr[3].des = info.nq_count;
        left_arr[4].des = info.rq_count;
        let num = 1;
        for (let i in info.qa_results) {
          for (let j in info.qa_results[i].qas) {
            info.qa_results[i].qas[j].num = num;
            num++;
          }
        }

        this.left_arr = left_arr;
        this.info = info;
        console.log(left_arr);
        console.log(info);
      });
    },
    get_paper_result(){
       let { sid, pid, left_arr } = this;
      this.$post("paper_result", "/?c=api", {
        student_id: sid,
        pid: pid,
        is_result:0
      }).then(res=>{
        let {paper_title,tsocre,qa_results}=res
        console.log(res)
        this.tsocre= `分数：${tsocre}分` 
        this.paper_title=paper_title
        this.content=qa_results

      })
    },
    exam_student_list_scroll() {},
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    load() {}
  }
};
</script>
<style  >
.student_view_des {
  display: flex;
}

.student_view_des_left {
  width: 750px;
  display: flex;
  height: 100vh;
  flex-direction: column;
  padding: 56px 46px;
  box-sizing: border-box;
  align-items: center;
  background: #ededee;
}
.ExamDetail_right_title {
  font-size: 38px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 26px;
}

.ExamDetail_right_text {
  font-size: 29px;
  font-weight: 400;
  color: rgba(135, 139, 148, 1);
  margin-bottom: 25px;
}
.exam_konwledge_view_top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.exam_konwledge_view_top>span{
font-size:26px;
font-weight:400;
color:rgba(32,32,32,1);
}
.exam_konwledge_view_top>p{
  display: flex;
  align-items: center;
}
.exam_konwledge_view_top>p span:nth-child(1){
  display: flex;
  align-items: center;
  justify-content: center;
font-size:20px;
font-weight:500;
color:rgba(174,174,174,1);
width:26px;
height:26px;
background:rgba(250,96,96,1);
border-radius:2px;
margin-right: 20px;
}
.exam_konwledge_view_top>p span:nth-child(2){
font-size:26px;
font-weight:400;
color:rgba(32,32,32,1);
}
.student_view_des_left .el-image {
  width: 162px;
  height: 162px;
  border-radius: 50%;
  margin-top: 16px;
  margin-bottom: 18px;
}
.el-tabs {
  /* width: 100%; */
  height: 100px;
}
.el-tabs__item {
  width: 300px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
.exam_student_list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 36px;
  box-sizing: border-box;
}
.exam_student_list_title {
  font-size: 26px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 20px;
}
.exam_student_list_span {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.exam_student_list_span > span {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(135, 139, 148, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #4b4b4b;
  border-radius: 50%;
  margin-right: 25px;
  margin-bottom: 20px;
}
.el-tabs__active-bar {
  height: 6px;
  background-color: #545dff;
}
.el-tabs__item.is-active {
  color: #545dff;
}
.span_error {
  background: #fa6060 !important;
  color: #fff !important;
  border: none !important;
}
.span_success {
  background: #545dff !important;
  color: #fff !important;
  border: none !important;
}
.student_des {
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 30px;
  padding: 0 40px;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 54px;
}
.student_name {
  font-size: 32px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-top: 10px;
}
.student_view_page .left_des {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
}
.student_view_page .left_des span:nth-child(1) {
  font-size: 40px;
  font-weight: bold;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 15px;
}
.student_view_page .left_des span:nth-child(2) {
  font-size: 26px;
  font-weight: 400;
  color: rgba(136, 136, 136, 1);
}
.student_view_page .student_view_des_right {
  display: flex;
  flex-direction: column;
  width: 1170px;
  padding: 72px 55px 0px 55px;
  box-sizing: border-box;
  align-items: center;
}
.student_view_page .student_view_des_right_title {
  color: #202020;
  font-size: 32px;
  margin-bottom: 19px;
}
.student_view_page .student_view_des_right_text {
  font-size: 28px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 65px;
}

.student_view_page .student_scroll_view {
  width: 100%;
  height: 100vh;
}
.student_view_page .student_scroll_view::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.student_scroll_view_item {
  display: flex;
  flex-direction: column;
}
.student_scroll_view_item > span {
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 27px;
}
.student_scroll_view_item_des {
  display: flex;
  flex-wrap: wrap;
}
.student_scroll_view_item_des > span {
  width: 76px;
  height: 76px;
  background: rgba(255, 255, 255, 1);
  border: 2px solid rgba(135, 139, 148, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 45px;
  margin-bottom: 26px;
  font-size: 38px;
  box-sizing: border-box;
}
.exam_konwledge_view {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.exam_konwledge_view {
  display: flex;
  flex-direction: column;
}
.tab_des_view {
  width: 100%;
  display: flex;
  align-items: center;
}
.tab_des_view p {
  font-size: 30px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-right: 50px;
}
</style>
