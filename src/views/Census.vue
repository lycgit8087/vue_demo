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
            <el-progress type="circle" :percentage="(over_view.s_count/over_view.m_count)*100" :show-text="false"></el-progress>
            <p>
              <span>{{over_view.s_count}}</span>
              <span>/{{over_view.m_count}}</span>
            </p>
          </div>

          <!-- 平均用时 -->
          <div class="average_time">
            <p>{{over_view.avg_time}}</p>
            <p>平均用时</p>
          </div>

          <!-- 平均分 -->
          <div class="average_time">
            <p>{{over_view.avg_score}}</p>
            <p>平均分</p>
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
            <div
              class="student_view_left_scroll"
              v-infinite-scroll="student_left_scroll"
              style="overflow:auto"
            >
              <div v-if="over_view.ys_results.length!=0">
                <div
                  v-for="(item,index) in over_view.ys_results"
                  :key="item.sid"
                  @click="ToStudentView(item.sid)"
                >
                  <div class="stunde_number">
                    <p v-if="index+1>3" > {{index+1}} </p>
                    <div v-else >
                      <el-image :src="index==0?FirstIcon:index==2?SecondIcon:ThreeIcon" fit="cover">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                      

                    </div>
                    </div>
                  <div class="stunde_name">
                    <el-image :src="item.avatar" fit="cover">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                    <span>{{item.name}}</span>
                  </div>
                  <div class="stunde_time">{{item.use_time}}</div>
                  <div class="stunde_mark">{{item.score}}分</div>
                </div>
              </div>

              <!-- 无数据展示 -->
              <div v-else class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无任何排名</p>
              </div>
            </div>
          </div>

          <div class="student_view_right">
            <template v-if="over_view.ns_results.length!=0">
              
            
            <p>未交题学生 ({{over_view.ns_results.length}})</p>
            <div
              class="student_view_right_scroll"
              v-infinite-scroll="student_right_scroll"
              style="overflow:auto"
            >
              <div v-for="item in over_view.ns_results" :key="item.sid" @click="ToStudentView(item.sid)" >
                <el-image :src="item.avatar" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span>{{item.name}}</span>
              </div>
            </div>

            </template>
            <template v-else>
              <!-- 无数据展示 -->
              <div  class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无任何排名</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="Census_right">
      <span>题目排行</span>
      <div class="Census_right_tab">
        <div
          v-for="(item,index) in TabArr"
          :class="TabIndex==index?'tab_action':''"
          :key="item.text"
          @click="TabCheck(index)"
        >{{item.text}}</div>
      </div>
      <!-- 题目 -->
      
      <template  v-if="TabIndex==0&&topic_list.length!=0&&over_view.ys_results.length!=0" >
      
      <div
        class="list_view_scroll"
        v-infinite-scroll="load"
        style="overflow:auto"
        
      >
      <template >
        <div v-for="(item,index) in topic_list" :key="item.code" @click="CheckQas(item.code)">
          <p class="list_view_scroll_number">{{index+1}}</p>
          <p class="list_view_scroll_title">{{item.title}}</p>
          <div class="all_cout" v-if="item.points.length">
            <p v-for=" pitem in  item.points" :key="pitem.id">{{pitem.name}}</p>
          </div>
          <div class="list_view_scroll_bot">
            <div class="list_view_scroll_bot_left">
              <div class="right_number">
                <p>正确率：</p>
                <p>{{item.rq_rate}}%</p>
              </div>
              <!-- 人数 -->
              <div class="poeple_right">
                <el-image :src="RightIcon" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span>{{item.ycount}}人</span>
              </div>
              <div class="poeple_right">
                <el-image :src="ErrorIcon" fit="cover">
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
        </template>
         

      </div>
        </template>
        
       <template v-if="TabIndex==0&&over_view.ys_results.length==0">
              <!-- 无数据展示 -->
              <div  class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无任何排名</p>
              </div>
            </template>

      <template v-if="TabIndex==1&&other_list.length!=0&&over_view.ys_results.length!=0" >
        
     
      <!-- 知识点 -->
      <div
        class="list_view_scroll_other"
        v-infinite-scroll="load"
        style="overflow:auto"
        v-show="TabIndex==1"
      >
      
        <div v-for="(item,index) in other_list" :key="item.name">
          <p class="list_view_scroll_number">{{index+1}}</p>
          <div class="list_view_scroll_other_title">
            <p>{{item.name}}</p>
            <p class="list_view_scroll_other_text">
              <span>正确率：</span>
              <span>{{item.rp_rate}}%</span>
            </p>
          </div>
          <el-progress :text-inside="false" :stroke-width="26" :percentage="item.rp_rate"></el-progress>
        </div>
      </div>
       </template>
        <template v-if="TabIndex==1&&other_list.length==0&&over_view.ys_results.length==0">
              <!-- 无数据展示 -->
              <div  class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无任何排名</p>
              </div>
            </template>

    </div>

    <!-- 题目弹出框 -->
    <el-dialog :visible.sync="answer_toggle">
      <div class="answer_center">
        <div class="answer_center_top">
          <span>{{rq_title}}</span>
          <p>
            <span>正确率：</span>
            <span>{{rq_rate}}%</span>
          </p>
        </div>
        <div class="html_div" v-html="qas_content"></div>
         <!-- 选择题答案项显示 -->
          <div v-if="qtype==1||qtype==2" class="check_qas_view_parent" >
          <div class="check_qas_view" v-for=" aitem in  answer_data" :key="aitem.id" >
            <!-- <p>{{aitem.name}}</p> -->
            <div v-for="oitem in aitem.content.options " class="oitem_item" :key="oitem.value" >
             <span  >{{oitem.value}}</span>  <span>{{oitem.text}}</span>  
            </div>
          </div>
          </div>

        <!-- 答案解析 -->
        <div class="answer_konw" @click="change_right_toggle" >
          <el-image :src="answericon">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

          </el-image>
          <span>答案解析</span>

           <el-image :src="right_toggle?bluetop:bluebot">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

          </el-image>


        </div>

        <div class="answer_qri" v-show="right_toggle" v-html="qri" ></div>
       

        <!-- 人员显示 -->
        <!-- 答错 -->
        <div class="poeple_view" v-if='ns_data.length!=0' >
          <p @click="change_error" > <span>答错学生</span> <span>{{ns_data.length}}</span>   <el-image :src="error_toggle?blacktop:blackbot" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image> </p>
          <div class="poeple_view_item" v-if="error_toggle" >
            <div v-for="item in ns_data" :key="item.sid">
              <el-image :src="item.avatar" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>

        <!-- 答对 -->

        <div class="poeple_view" v-if='ys_data.length!=0' >
          <p @click="change_success" > <span>答对学生</span> <span>{{ys_data.length}}</span>   <el-image :src="success_toggle?blacktop:blackbot" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image> </p>
          <div class="poeple_view_item" v-if="success_toggle" >
            <div v-for="item in ys_data" :key="item.sid">
              <el-image :src="item.avatar" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>

      </div>
      <div slot="footer">
        <el-button
          type="danger"
          :loading="is_change_before"
          :disabled="is_change"
          class="send_cancle"
          @click="before"
        >上一题</el-button>

        <el-button
          type="primary"
          :loading="is_change_next"
          :disabled="is_change"
          class="send_confrm"
          @click="next"
        >下一题</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bluetop from '../assets/blue_top.png';
import bluebot from '../assets/blue_bot.png';
import blackbot from '../assets/black_bot.png';
import blacktop from '../assets/black_top.png';
import answericon from '../assets/answer_icon.png';
export default {
  name: "Census",
  data() {
    return {
      bluetop,
      answericon,
      blackbot,
      bluebot,
      blacktop,
      answer_toggle: false,
      BookImage: require("../assets/open_book.png"),
      RightIcon: require("../assets/right_icon.png"),
      ErrorIcon: require("../assets/eorr.png"),
      NoNumImage: require("../assets/no_num.png"),
      NoStundetImage: require("../assets/no_student.png"),
      NoDataImage: require("../assets/no_data.png"),
      FirstIcon: require("../assets/first_icon.png"),
      SecondIcon: require("../assets/second_icon.png"),
      ThreeIcon: require("../assets/there_icon.png"),
      other_list:[],
      pid: 0,
      over_view: {
        ns_results: [],
        ys_results: [],
        s_count:0,
        m_count:0,

      },
      topic_list: [],
      TabArr: [
        { text: "题目", type: 0 },
        { text: "知识点", type: 0 }
      ],
      TabIndex: 0,
      is_change_before: false,
      is_change_next: false,
      qri:"",
      is_change: false,
      qas_code: "",
      code: "",
      ns_data: [],
      ys_data: [],
      rq_rate: 0,
      rq_title: "",
      qtype:-1,
      qas_content: "",
      right_toggle: false,
       answer_data:[],
      error_toggle:true,
      success_toggle:false

    };
  },
   computed: {
    web_type() {
        return this.$store.state.web_type;
    }
  },
  watch:{
      web_type(val){
        if(val==2){
          console.log(val)
           this.GetRightList();
          this.GetPaperOverview();
          this.GetRightOther()
          this.$store.dispatch('change_web_type',0)
        }
      }
  },
  components: {},
  created() {
   
    this.pid = this.$route.query.pid;
    this.GetRightList();
    this.GetPaperOverview();
  },
  beforeRouteLeave(to, from, next) {
        // 设置下一个路由的 meta
        if(to.name=="StudentView"){
          from.meta.keepAlive = true; 

        }else{
          from.meta.keepAlive = false; 

        }
        next();
    },
  mounted() {},
  methods: {
        change_error(){
      let　{error_toggle}=this
      this.error_toggle=!error_toggle
    },
    change_success(){
      let　{success_toggle}=this
      this.success_toggle=!success_toggle
    },
    TabCheck(index) {
      let {other_list,over_view}=this
      
      this.TabIndex = index;
      if(index==1&&other_list.length==0&&over_view.ys_results.length!=0){
        this.GetRightOther()
      }
    },
    student_left_scroll() {},
    student_right_scroll() {},
    load() {},
    

    ToSetunde(sid){
      let { pid } = this;

      this.$router.push({ name: "StudentView",query:{pid:id,sid:sid} });

    },

    // 获取统计
    async GetPaperOverview() {
      let { pid } = this;

      await this.$post("paper_overview", "/?c=api", {
        pid: pid,
        class_id:this.$store.state.class_id
      }).then(res => {
        let over_view = res;
        for (let i in over_view.ns_results) {
          over_view.ns_results[i].avatar = this.$till.change_file_url(
            over_view.ns_results[i].avatar
          );
        }

          for (let i in over_view.ys_results) {
          over_view.ys_results[i].avatar = this.$till.change_file_url(
            over_view.ys_results[i].avatar
          );
           over_view.ys_results[i].use_time=this.$till.formatSeconds(over_view.ys_results[i].use_time)

        }
        over_view.avg_time=this.$till.formatSeconds(over_view.avg_time)
        this.over_view = over_view;
      });
    },
   async GetRightOther(){
        let { pid } = this;
      await this.$post("etag_grasp", "/?c=api", {
        pid: pid,
        class_id:this.$store.state.class_id

      }).then(res => {
        let other_list=res.data
        this.other_list=other_list
      });
    },

    async GetRightList() {
      let { pid ,topic_list} = this;
      await this.$post("qa_content_list", "/?c=api", {
        pid: pid,
        class_id:this.$store.state.class_id

      }).then(res => {
        if(res.data){
       topic_list = res.data;
        }
        this.topic_list = topic_list;
      });
    },

    //查看题目
    async CheckQas(code) {
      let { pid } = this;
      this.qas_code = code;
      await this.$post("qa_content", "/?c=api", {
        code: code,
        pid: pid,
        is_loadstus:1
      }).then(res => {
        res.qas_content = this.$till.htmlspecialchars_decode(res.content);

        // 答错
        for(let i in res.ns_data){
          res.ns_data[i].avatar=this.$till.change_file_url(res.ns_data[i].avatar)
        }

       // 答对
        for(let i in res.ys_data){
          res.ys_data[i].avatar=this.$till.change_file_url(res.ys_data[i].avatar)
        }
        this.qas_content = res.qas_content;
        this.ns_data = res.ns_data;
        this.ys_data = res.ys_data;
        this.rq_rate = res.rq_rate;
        this.rq_title = res.title;
        if(res.qri){
          res.qri =  this.$till.htmlspecialchars_decode(res.qri);
        }
        this.answer_data=res.answer_data
        this.qri=res.qri
        this.qtype=res.type
        this.answer_toggle = true;
        this.is_change = false;
        this.is_change_before = false;
        this.is_change_next = false;
      });
    },
    next() {
      let { content, qas_code,topic_list } = this;
      this.is_change = true;
      this.is_change_next = true;
      let num=topic_list.findIndex(item=>item.code==qas_code)
      if(num==topic_list.length-1){
        this.is_change = false;
        this.is_change_next = false;
         this.$message({
                  message: "已到底部",
                  type: "warning"
                });
      }else{
        this.CheckQas(topic_list[parseInt(num) + 1].code);
      }
    
    },

   
    before() {
      let { content, qas_code,topic_list } = this;
     
      this.is_change = true;
      this.is_change_before = true;
       let num=topic_list.findIndex(item=>item.code==qas_code)
      if(num==0){
        this.is_change = false;
          this.is_change_before = false;
         this.$message({
                  message: "已到顶部",
                  type: "warning"
                });
      }else{
        this.CheckQas(topic_list[parseInt(num) - 1].code);
      }
    },
      // 答案解析显示隐藏
    change_right_toggle(){
      let {right_toggle}=this
      this.right_toggle=!right_toggle
    },
    ToStudentView(sid) {
      let { pid } = this;

      this.$router.push({ name: "StudentView",query:{pid:pid,sid:sid} });
    }
  }
};
</script>
<style  >
.el-progress-bar__outer{
  height: 30px !important;
}
.stunde_number {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  color: #bdbdbd;
  font-size: 22px;
}
.tab_action {
  background: #545DFF !important;
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
.answer_qri{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
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
  display: none !important;
}
.el-progress-bar{
  padding: 0 !important;
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
.student_view_left_scroll > div{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.student_view_left_scroll > div>div {
  height: 90px;
  border-bottom: 2px solid #ecedf1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.student_view_left_scroll >div> div:last-child {
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
.list_view_scroll,
.list_view_scroll_other {
  /* height: 800px; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list_view_scroll {
  padding-top: 15px;
  box-sizing: border-box;
}
.list_view_scroll > div,
.list_view_scroll_other > div {
  width: 770px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 27px 0px rgba(27, 27, 78, 0.1);
  border-radius: 18px;
  margin-bottom: 18px;
  position: relative;
  padding:18px 18px 28px 60px ;
  box-sizing: border-box;
}
.list_view_scroll_other_title {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.list_view_scroll_other_text {
  display: flex;
  align-items: center;
}
.list_view_scroll_other_text span:nth-child(1) {
  color: #878b94;
  font-size: 24px;
}
.list_view_scroll_other_text span:nth-child(2) {
  color: #fa6060;
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
  left: 16px;
  top: 18px;
}
.student_view_right_scroll::-webkit-scrollbar,
.list_view_scroll::-webkit-scrollbar,
.list_view_scroll_other::-webkit-scrollbar {
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
  border-radius: 50%;
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
.list_view_scroll_title {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 20px;
}
.answer_center_top > span {
  font-size: 24px;
  font-weight: 700;
  color: rgba(32, 32, 32, 1);

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
  margin-bottom: 37px;
  width: 100%;
}
.answer_konw span{
  color: #545DFF;
  margin-right: 15px;

}
.answer_konw .el-image:nth-child(1) {
  width: 31px;
  height: 31px;
  margin-right: 20px;
}

.answer_konw .el-image:nth-child(3){
     width: 17px;
  height: 19px;
}
.poeple_view {
  display: flex;
  flex-direction: column;
  width: 100%;

}
.poeple_view > p {
  font-size: 24px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
}
.poeple_view > p> span{
  margin-right: 10px;
}
.poeple_view > p .el-image{
  width: 19px;
  height: 17px;
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
.answer_qri{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
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
  margin-top: 18px;
}
.student_high span:nth-child(1){
  width: 60px;
}
.student_view_left_scroll > div>div>div:nth-child(1){
  width: 60px;

}
.student_high span:nth-child(2){
  width: 220px;
  display: flex;
  justify-content: center;
}
.student_view_left_scroll > div>div>div:nth-child(2){
  width: 220px;
  display: flex;
  justify-content: center;
}
.student_high span:nth-child(3),.student_view_left_scroll > div>div>div:nth-child(3){
  width: 150px;
   display: flex;
  justify-content: center;
}
.student_high span:nth-child(4),.student_view_left_scroll > div>div>div:nth-child(4){
  width: 66px;
   display: flex;
  justify-content: flex-end;

}
.all_cout {
  display: flex;
  align-items: center;
  color: #bdbdbd;
  font-size: 26px;
}
.all_cout p {
  margin-right: 15px;
}
.no_data_view {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100% !important;
  justify-content: center !important;
  align-items: center;
  font-size: 24px;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
}
.no_data_view>p{
  margin-top: 30px;
}
.student_view_left_scroll .no_data_view .el-image {
  width: 304px;
  height: 217px;
}
student_view_right_scroll .no_data_view .el-image {
  width: 144px;
  height: 88px;
}
.Census_right .no_data_view .el-image {
  width: 400px;
  height: 219px;
}
</style>
