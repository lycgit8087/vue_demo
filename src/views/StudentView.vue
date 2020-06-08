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
              :class="qitem.result==0?'span_error':qitem.result==1?'span_success':qitem.result==2?'span_error':''"
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

</style>
