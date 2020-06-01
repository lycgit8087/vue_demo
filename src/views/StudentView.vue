<template>
  <div class="student_view_page">
    <div class="student_view_left">
      <back></back>
      <el-image :src="info.avatar" fit="cover">
         <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
      </el-image>
      <span class="student_name">{{info.sname}}</span>
      <div class="left_des" v-for="item in left_arr" :key="item.text">
        <span>{{item.text}}</span>
        <span>{{item.des}}</span>
      </div>
    </div>
    <div class="student_view_right">
      <span class="student_view_right_title">答题卡</span>
      <span class="student_view_right_text">{{info.paper_title}}</span>

      <div class="student_scroll_view" v-infinite-scroll="load" style="overflow:auto">
        <div class="student_scroll_view_item" v-for="item in info.qa_results" :key="item.partname">
          <span>{{item.partname}}</span>
          <div class="student_scroll_view_item_des">
            <span
              v-for="qitem in item.qas"
              :key="qitem.id"
              :class="qitem.result==0?'span_error':qitem.result==1?'span_success':''"
            >{{qitem.num}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "student_view",
  data() {
    return {
      HeadImage: require("../assets/login_img.png"),
      left_arr: [
        { text: "成绩排行", des: "" },
        { text: "分数", des: "" },
        { text: "用时", des: "" },
        { text: "答错数", des: "" },
        { text: "答对数", des: "" }
      ],
      list: 10,
      pid:0,
      sid:0,
      info:{}

    };
  },
  components: {},
  created() {
     this.pid = this.$route.query.pid;
     this.sid = this.$route.query.sid;
    console.log(this.$route.query)
    this.GetInfo()

  },

  
  
  mounted() {},
  methods: {

    GetInfo(){
    let {sid,pid,left_arr}=this
     this.$post("paper_result", "/?c=api", {
        student_id: sid,
        pid: pid
      }).then(res=>{
        let info=res
        console.log(info)
        info.avatar=this.$till.change_file_url(info.avatar)
        left_arr[0].des=info.order
        left_arr[1].des=info.score
        left_arr[2].des=this.$till.formatSeconds(info.used_time)
        left_arr[3].des= info.nq_count 
        left_arr[4].des=info.rq_count
          let num=1
        for(let i in info.qa_results){
          for(let j in info.qa_results[i].qas){
          info.qa_results[i].qas[j].num=num
          num++
          }
        }

      this.left_arr=left_arr
      this.info=info
      })
  },
    load(){

    }
  }
};
</script>
<style  >
.student_view_page {
  display: flex;
}
 .student_view_page .student_view_left {
  width: 727px;
  height: 100vh;
  background: #f8f8ff;
  display: flex;
  flex-direction: column;
  padding: 0 100px 30px 20px;
  box-sizing: border-box;
  align-items: center;
}
 .student_view_page .student_view_left .el-image {
  width: 162px;
  height: 162px;
  border-radius: 50%;
  margin-top: 16px;
  margin-bottom: 18px;
}
 .student_view_page .student_name {
  margin-bottom: 88px;
  color: #202020;
  font-size: 32px;
}
 .student_view_page .left_des {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 58px;
  padding: 0 70px;
  box-sizing: border-box;
}
 .student_view_page .left_des span:nth-child(1) {
  font-size: 36px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
}
.left_des span:nth-child(2) {
  font-size: 36px;
  font-weight: 400;
  color: #202020;
}
  .student_view_page  .student_view_right {
  display: flex;
  flex-direction: column;
  width: 1193px;
  height: 100vh;
  padding: 72px 55px 0px 55px;
  box-sizing: border-box;
  align-items: center;
}
  .student_view_page .student_view_right_title {
  color: #202020;
  font-size: 32px;
  margin-bottom: 19px;
}
 .student_view_page .student_view_right_text {
  font-size: 28px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 65px;
}
 .student_view_page .student_scroll_view {
  width: 100%;
  height: 70vh;
}
 .student_view_page .student_scroll_view::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.el-tree-node > .el-tree-node__children {
  overflow: visible !important;
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
.span_error {
  background: #fa6060 !important;
  color: #fff;
  border: none !important;
}
.span_success {
  background: #545dff !important;
  color: #fff;
  border: none !important;
}
</style>
