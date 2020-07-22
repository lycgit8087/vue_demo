<template>
  <div class="student_view_page">
    <back></back>

    <div class="student_view_des">
      <div class="student_view_des_left" v-infinite-scroll="exam_student_list_scroll"
              style="overflow:auto" >
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
              
            >
              <div v-for="(item,index) in info.qa_results"  :key="index">
                <p class="exam_student_list_title">{{item.partname}}</p>
                <p class="exam_student_list_span">
                  <span
                    :class="qitem.result==1?'span_success':qitem.result==3?'span_error':''"
                    v-for="(qitem,qindex) in item.qas"
                    :key="qindex"
                    @click="scroll_to(qitem.id)"
                  >{{qitem.num}}</span>
                </p>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="知识点掌握率" name="second">
            <div
              class="exam_student_list"
            >
              <div class="exam_konwledge_view" v-for="(item,index) in etag_list" :key="index" >
                <div class="exam_konwledge_view_top">
                  <p>
                    <span :class="index<=2?'wcolor':''" >{{index+1}}</span>
                    <span>{{item.name}}</span>
                  </p>
                  <span>{{item.rp_rate}}%</span>
                </div>
                <el-progress :text-inside="false" color="#66BD6A" :percentage="item.rp_rate"></el-progress>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="student_view_des_right">

            <html-view ref="child" :content="content" :des="tsocre" :title="paper_title" :content_type="1"  ></html-view>


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
      etag_list:[],
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
    this.GetInfo();
    this.get_paper_result()
    this.get_etag_grasp()
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
        this.tsocre= `分数：${tsocre}分` 
        this.paper_title=paper_title
        this.content=qa_results

      })
    },

    // 获取学生知识点掌握
    get_etag_grasp(){
       let { sid, pid, left_arr } = this;
      this.$post("etag_grasp", "/?c=api", {
        student_id: sid,
        pid: pid,

      }).then(res=>{
        let etag_list=res.data
        this.etag_list=etag_list
      })
    },
    exam_student_list_scroll() {},
    handleClick(tab, event) {
    },
    load() {},
    scroll_to(id){
      this.$refs.child.scroll_it(id)
    },
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
border-radius:2px;
margin-right: 20px;
}
.exam_konwledge_view_top>p span:nth-child(2){
font-size:26px;
font-weight:400;
color:rgba(32,32,32,1);
}
.student_view_des_left .el-image {
  
  margin-top: 16px;
  margin-bottom: 18px;
}
.student_view_des_left .el-image img{
  width: 162px;
  height: 162px;
  border-radius: 50%;
}
.el-tabs {
  /* width: 100%; */
  height: 100px;
}
 .student_view_page .el-tabs__item {
  width: 300px !important;
  height: auto !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 30px !important;
  box-sizing: border-box !important;
  padding: 15px 0 !important;
}
.exam_student_list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 36px;
  box-sizing: border-box;
  height: 53vh;
}
.exam_student_list_title {
  font-size: 26px;
  font-weight: 700;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 20px;
}
.exam_student_list_span {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.exam_student_list_span > span {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(135, 139, 148, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #4b4b4b;
  border-radius: 50%;
  margin-right: 24px;
  margin-bottom: 20px;
}
.el-tabs__active-bar {
  height: 6px !important;
  background-color: #545dff !important;
}
.el-tabs__item.is-active {
  color: #545dff !important;
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
  padding: 0px 55px;
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
.student_view_des_left::-webkit-scrollbar {
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
  margin-bottom: 40px;
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
.wcolor{
  color: #fff !important;
  background: rgba(250,96,96,1)
}
</style>
