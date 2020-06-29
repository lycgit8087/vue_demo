<template>
  <div class="Census">
    <!-- 试题报告概览 -->
    <div class="Census_left">
      <back @updateit="get_all" ></back>
      <div class="Census_left_view">
        <p class="Census_left_title">
          <span @dblclick="close_web" >试题报告概览</span>
          <span :class=" this.$store.state.web_num==0?'web_error web_view ':'web_view'  "  ></span>
          </p>

        <!-- 统计 -->
        <div class="all_data_view">
          <!-- 进度条 -->
          <div class="progress_view">
            <el-progress type="circle" :stroke-width="12" color="#545DFF" :percentage="(over_view.s_count/over_view.m_count)*100" :show-text="false"></el-progress>
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
              <div v-for="item in over_view.ns_results" :key="item.sid" >
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
                <p>暂无学生</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="Census_right">
      <span>题目排行</span>
      <div class="Census_right_tab">
        <div class="Census_right_tab_left" >
            <div
          v-for="(item,index) in TabArr"
          :class="TabIndex==index?'tab_action':''"
          :key="item.text"
          @click="TabCheck(index)"
        >{{item.text}}</div>

        </div>
        <div class="Census_right_tab_right" v-if="TabIndex==1"  >
            <div class="Census_right_tab_right_image" @click="change_send" v-if="is_send" >
               <el-image :src="close_cancle" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span>取消</span>
            </div>
            <div class="send_button" @click="change_push_toggle" v-if="is_send" >推送</div>

            <div class="Census_right_tab_right_image" @click="change_send" v-if="!is_send" >
               <el-image :src="pencil" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span>个性化作业</span>
            </div>

        </div>
        
      </div>
      <!-- 题目 -->
      
      <template  v-if="TabIndex==0&&topic_list.length!=0&&over_view.ys_results.length!=0" >
      <el-checkbox-group v-model="leftcheckList">
      <div
        class="list_view_scroll"
        v-infinite-scroll="load"
        style="overflow:auto"
        
      >
      <template >
        
        <div v-for="(item,index) in topic_list" :key="index" @click="CheckQas(item.code)">
          <el-checkbox :label="item.code"   v-if="is_send&&TabIndex==1"  >
          <div class="list_view_scroll_top"  >
            <div class="list_view_scroll_top_left" >
              <p :class="['list_view_scroll_number',index<3?'list_view_scroll_number_avtive':'']">{{index+1}}</p>
              <p class="list_view_scroll_title">{{item.title}}</p>
            </div>
              
           
          </div>
           </el-checkbox>

           <div class="list_view_scroll_top bottom_top" v-else >
             <div class="list_view_scroll_top_left" >

               <p :class="['list_view_scroll_number',index<3?'list_view_scroll_number_avtive':'']">{{index+1}}</p>
              <p class="list_view_scroll_title">{{item.title}}</p>
             </div>
              
           
          </div>

          
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
            <div class="list_view_scroll_bot_right" v-if="!is_send" @click.stop="change_push_toggle" >相似题推送</div>
          </div>
        </div>

        </template>
         

      </div>
      </el-checkbox-group>

        </template>
        
       <template v-if="TabIndex==0&&over_view.ys_results.length==0">
              <!-- 无数据展示 -->
              <div  class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无内容</p>
              </div>
            </template>

      <template v-if="TabIndex==1&&other_list.length!=0&&over_view.ys_results.length!=0" >
        
      <el-checkbox-group v-model="rightcheckList">
        
      <!-- 知识点 -->
      <div
        class="list_view_scroll_other"
        v-infinite-scroll="load"
        style="overflow:auto"
        v-show="TabIndex==1"
      >
        <div v-for="(item,index) in other_list" :key="item.name">
             <el-checkbox :label="item.id"  v-model="other_list_value" v-if="is_send" >
          <div class="list_view_scroll_top "  >
            <div class="list_view_scroll_top_left"  >
               <p :class="['list_view_scroll_number',index<3?'list_view_scroll_number_avtive':'']">{{index+1}}</p>
            <div class="list_view_scroll_other_title_fp" >{{item.name}}</div>

            </div>
           
          <div class="list_view_scroll_other_title">
            
            <p class="list_view_scroll_other_text">
              <span>正确率：</span>
              <span>{{item.rp_rate}}%</span>
            </p>
          </div>

          </div>
          </el-checkbox>

          <div class="list_view_scroll_top bottom_top " v-else  >
            <div class="list_view_scroll_top_left"  >
            <p :class="['list_view_scroll_number',index<3?'list_view_scroll_number_avtive':'']">{{index+1}}</p>
            <div class="list_view_scroll_other_title_fp" > {{item.name}}</div>

            </div>
          <div class="list_view_scroll_other_title">
            <p class="list_view_scroll_other_text">
              <span>正确率：</span>
              <span>{{item.rp_rate}}%</span>
            </p>
          </div>

          </div>
          
          <el-progress :text-inside="false" color="#545DFF"  :percentage="item.rp_rate"></el-progress>
        </div>
      </div>
      </el-checkbox-group>

       </template>
        <template v-if="TabIndex==1&&other_list.length==0&&over_view.ys_results.length==0">
              <!-- 无数据展示 -->
              <div  class="no_data_view">
                <el-image :src="NoNumImage" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>暂无内容</p>
              </div>
            </template>

    </div>

     <!-- 学生弹出框 -->
    <el-dialog :visible.sync="student_toggle" custom-class="dclass" >

      <div class="student_view_page">
    <div class="student_view_left_msg">

      <div class="stundet_title" ><span>个人答题详情</span></div>

      <div class="stundet_msg" >
        <div class="stundet_msg_top" >
             <el-image :src="info.avatar" fit="cover">
         <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
      </el-image>
      <span class="student_name">{{info.sname}}</span>
        </div>
       <div class="left_des" v-for="item in left_arr" :key="item.text">
        <span>{{item.text}}</span>
        <span>{{item.des}}</span>
      </div>

      </div>
     
     
    </div>
    <div class="student_view_right_msg">
      <span class="student_view_right_title">答题卡</span>
      <span class="student_view_right_text">{{info.paper_title}}</span>

      <div class="student_scroll_view" v-infinite-scroll="load" style="overflow:auto">
        <div class="student_scroll_view_item" v-for="item in info.qa_results" :key="item.partname">
          <span>{{item.partname}}</span>
          <div class="student_scroll_view_item_des">
            <span
              v-for="(qitem,qindex) in item.qas"
              :key="qindex"
              :class="qitem.result==0?'':qitem.result==1?'span_success':qitem.result==2?'span_error':qitem.result==3?'span_error':''"
              @click="CheckQas(qitem.code)"
            >{{qitem.num}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
      
    </el-dialog>

    <!-- 题目弹出框 -->
    <el-dialog :visible.sync="answer_toggle">
      <div class="answer_center" ref="answer_center_ref" v-infinite-scroll="answer_load" style="overflow:auto"  >
        <div class="answer_center_top">
          <span>{{rq_title}}</span>
        </div>
        <div class="html_div" v-html="qas_content"></div>

        <div class="right_answer_view" v-if="sid" >
          <span>正确答案是：</span>
          <p> <span v-for="item in answer_arr" :key="item" >{{item}}</span> </p>
        </div>

        <!-- 答案解析 -->
        <div class="answer_konw" @click="change_right_toggle" v-show="!right_toggle"  >
          <el-image :src="answericon">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <span>答案解析</span>
        </div>

        <div class="answr_parent" v-show="right_toggle" >
          <div class="answr_parent_top" @click="change_right_toggle"  >
            <div class="answr_parent_top_left">解析</div>
            
               <el-image :src="closeIcon" >
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          </div>
          <div class="answer_qri"  v-html="qri" ></div>
        </div>

         <p class="answer_rate" v-if='ns_data.length!=0||ys_data.length!=0' >
            <span>正确率：</span>
            <span>{{rq_rate}}%</span>
          </p>
       

        <!-- 人员显示 -->
        <!-- 答错 -->
        <div class="poeple_view" v-if='ns_data.length!=0' >
          <p @click="change_error" > 
            <span>答错学生</span> 
            <span class="error_stundets" >{{ns_data.length}}</span> 
              <el-image :src="error_toggle?blacktop:blackbot" fit="cover">
                 <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image> 
              </p>
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
          <p @click="change_success" > <span>答对学生</span> <span class="success_stundets" >{{ys_data.length}}</span>   <el-image :src="success_toggle?blacktop:blackbot" fit="cover">
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
          @click="all_before"
        >上一题</el-button>

        <el-button
          type="primary"
          :loading="is_change_next"
          :disabled="is_change"
          class="send_confrm"
          @click="all_next"
        >下一题</el-button>
      </div>
    </el-dialog>


    <!-- 推送题目 -->
    <el-dialog :visible.sync="push_toggle">
      <div class="answer_center" v-infinite-scroll="answer_load" style="overflow:auto"  >
        <p class="push_title" >个性化作业推送</p>
        <template v-if="TabIndex==1" >
         
        
        <p class="push_text" v-if="knowledge_list.length"  >已选择{{knowledge_list.length}}个知识点</p>
        <div  class="knowledge_view" >
            <div v-for="item in knowledge_list" :key="item.id" @click="dele_konwledge(item.id)" >
              <span>{{item.name}}</span>
                <el-image :src="blue_close" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image>
            </div>

        </div>
        </template>
        <p class="push_text_des" >每道题推送相似题数量</p>
        
        <div class="push_text_des_view" >
            <p :class="push_check_num==i?'des_action':''" v-for="i in 10" :key="i" @click="change_push_num(i)"  >{{i}}</p>
            <el-input
            placeholder="自定义"
            v-model="input_value"
            clearable>
          </el-input>
        </div>
        <!--答错学生列表 -->
        <div class="student_list_view_push" v-if="error_students.length!=0" >
          <div class="student_list_view_push_top" >
            <div class="student_list_view_push_top_left" >
              <span>答错学生</span> 
            <span class="error_stundets" >{{error_students.length}}</span> 
              <el-image :src="error_is_show?blacktop:blackbot" fit="cover">
                 <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image> 
            </div>
            <div class="student_list_view_push_top_right" ><el-checkbox v-model="error_students_check" border size="medium">全选</el-checkbox></div>

          </div >
          <div  class="student_list_view_push_bot" >
              <div v-for="(item,index) in error_students" :key="item.sid" @click="change_error_student(index)" >
                <el-image  :class="item.is_check?'student_check':''" :src="item.avatar" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image>
              <img v-if="item.is_check" :src="CheckedImage" >
              <span>{{item.name}}</span>


              </div>

          </div>


        </div>

        <!-- 答对学生  success_stundets -->
        <div class="student_list_view_push" v-if="right_students.length!=0" >
          <div class="student_list_view_push_top" >
            <div class="student_list_view_push_top_left" >
              <span>答对学生</span> 
            <span class="success_stundets" >{{right_students.length}}</span> 
              <el-image :src="right_is_show?blacktop:blackbot" fit="cover">
                 <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image> 
            </div>
            <div class="student_list_view_push_top_right" ><el-checkbox v-model="right_students_check" border size="medium">全选</el-checkbox></div>

          </div >
          <div  class="student_list_view_push_bot" >
              <div v-for="(item,index) in right_students" :key="item.sid" @click="change_right_student(index)"  >
                <el-image :class="item.is_check?'student_check':''" :src="item.avatar" fit="cover">
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

              </el-image>
              <img v-if="item.is_check" :src="CheckedImage" >
              <span>{{item.name}}</span>


              </div>

          </div>


        </div>


      </div>
      <div slot="footer">
        <el-button
          type="danger"
          class="send_cancle"
          @click="change_push_toggle"
        >取消</el-button>

        <el-button
          type="primary"
          class="send_confrm"
          @click="Personlize_push"
        >发送</el-button>
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
      student_toggle:false,
      checked:false,
      CheckedImage: require("../assets/check_it.png"),
      BookImage: require("../assets/open_book.png"),
      closeIcon: require("../assets/detail_close_icon.png"),
      pencil: require("../assets/pencil.png"),
      close_cancle: require("../assets/close_cancle.png"),
      blue_close: require("../assets/blue_close.png"),
      input_value:"",
      qas_num:0,
      RightIcon: require("../assets/right_icon.png"),
      ErrorIcon: require("../assets/eorr.png"),
      NoNumImage: require("../assets/no_num.png"),
      NoStundetImage: require("../assets/no_student.png"),
      NoDataImage: require("../assets/no_data.png"),
      FirstIcon: require("../assets/first_icon.png"),
      SecondIcon: require("../assets/second_icon.png"),
      ThreeIcon: require("../assets/there_icon.png"),
      push_toggle:false,
      other_list:[],
      pid: 0,
      over_view: {
        ns_results: [],
        ys_results: [],
        s_count:0,
        m_count:0,

      },
      error_is_show:true,
      right_is_show:true,

      knowledge_list:[],
      right_students:[
      ],
      right_students_check:false,
      error_students_check:true,

      error_students:[
      ],
      push_check_num:-1,
      other_list_value:"",
      topic_list: [],
      TabArr: [
        { text: "题目", type: 0 },
        { text: "知识点", type: 0 }
      ],
       left_arr: [
        { text: "成绩排行", des: "" },
        { text: "分数", des: "" },
        { text: "用时", des: "" },
        { text: "答错数", des: "" },
        { text: "答对数", des: "" }
      ],
      answer_arr:[],
      sid:"",
      info:{},
      TabIndex: 0,
      is_change_before: false,
      is_change_next: false,
      qri:"",
      is_change: false,
      qas_code: "",
      code: "",
      ns_data: [],
      is_send:false,
      ys_data: [],
      rq_rate: 0,
      rq_title: "",
      qtype:-1,
      qas_content: "",
      right_toggle: false,
       answer_data:[],
      error_toggle:true,
      success_toggle:true,
      leftcheckList:[],
      rightcheckList:[],
      right_list:[]

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
          // this.$message.success({
          //     message: "接收到web",
          //     offset: 380,
          //     duration: 1000
          //   });
          this.GetRightList();
          this.GetPaperOverview();
          this.GetRightOther()
          this.$store.dispatch('change_web_type',0)
        }
      },
      input_value(val){
        this.push_check_num=val
      },
      student_toggle(val){
        if(!val){
          this.sid=""
        }
      },
      error_students_check(val,oldval){
        let {error_students}=this
        
          for(let i in error_students){
            if(val){
              error_students[i].is_check=true
            }else{
              error_students[i].is_check=false

            }
          }
        
        this.error_students=error_students
      },
      right_students_check(val){
         let {right_students}=this
          for(let i in right_students){
            if(val){
              right_students[i].is_check=true
            }else{
              right_students[i].is_check=false

            }
          }
        
        this.right_students=right_students
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
    all_next(){
    this.$refs.answer_center_ref.scrollTop=0
      let {sid}=this
      if(sid){
        this.next_it()
      }else{

        this.next()
      }
    },
    all_before(){
       let {sid}=this
      if(sid){
        this.before_it()
      }else{
        this.before()
      }
    },
    get_all(){
          this.GetRightList();
          this.GetPaperOverview();
          this.GetRightOther()
    },
    close_web(){
       let websock=this.$store.state.websocket
       websock.close()
    },
    change_error_student(index){
      let {error_students}=this
      error_students[index].is_check=!error_students[index].is_check
      this.error_students=error_students
    },
    change_right_student(index){
      let {right_students}=this
      right_students[index].is_check=!right_students[index].is_check
      this.right_students=right_students
    },
   async dele_konwledge(id){
      let{knowledge_list}=this
      knowledge_list=knowledge_list.filter(item=>item.id!=id)
      this.knowledge_list=knowledge_list
    await  this.get_qa_student_list()

    },
    change_push_num(index){
      this.push_check_num=index
    },
    //个性化推送
     Personlize_push(){
      let {push_check_num,pid,error_students,right_students,knowledge_list }=this
      let ystudents_arr=[],wstudents_arr=[],kid=[]

      // 错误学生ID
      for(let i in error_students){
        if(error_students[i].is_check){
          wstudents_arr.push(error_students[i].sid)
        }

      }
      // 正确学生ID
       for(let i in right_students){
        if(right_students[i].is_check){
          ystudents_arr.push(right_students[i].sid)
        }

      }

      // 知识点
       for(let i in knowledge_list){
        kid.push(knowledge_list[i].id)
      }


       this.$post("qa_special_push", "/?c=api", {
        ystudents:ystudents_arr.join(","),
        wstudents:wstudents_arr.join(","),
        kpoints:kid.join(","),
        ptype:1,
        num:push_check_num,
        pid: pid,
        class_id:this.$store.state.class_id,
      }).then(res=>{
        console.log(res)
        
        this.change_push_toggle()
        this.$message.success({
              message: "推送成功",
              offset: 380,
              duration: 1000
            });
      })

    },
    // 获取知识点错误学生
    get_qa_student_list(){
      let {knowledge_list,pid}=this
      let kid=[]
      for(let i in knowledge_list){
        kid.push(knowledge_list[i].id)
      }
      
      this.$post("qa_student_list", "/?c=api", {
        pid: pid,
        class_id:this.$store.state.class_id,
        kpoints:kid.join(",")
      }).then(res=>{
        let push_ns_data=res.ns_data
        let push_ys_data=res.ys_data
        for(let i in push_ns_data){
          push_ns_data[i].avatar=this.$till.change_file_url(push_ns_data[i].avatar)
          push_ns_data[i].is_check=true
        }

        for(let i in push_ys_data){
          push_ys_data[i].avatar=this.$till.change_file_url(push_ys_data[i].avatar)
          push_ys_data[i].is_check=false
        }

        this.error_students=push_ns_data
        this.right_students=push_ys_data
        console.log(push_ns_data)

      })

    },

   
   async change_push_toggle(){
      let {push_toggle,rightcheckList,knowledge_list,other_list}=this
      knowledge_list=[]
      
      for(let i in other_list){
        for(let j in rightcheckList){
          if(rightcheckList[j]==other_list[i].id){
            knowledge_list.push(other_list[i])
          }
        }
      }
      this.knowledge_list=knowledge_list
      if(!push_toggle){
       await this.get_qa_student_list()
      }
      this.push_toggle=!push_toggle
    },
    change_send(){
      let {is_send}=this
      this.is_send=!is_send
    },
        change_error(){
      let　{error_toggle}=this
      this.error_toggle=!error_toggle
    },
    change_success(){
      let　{success_toggle}=this
      this.success_toggle=!success_toggle
    },
    TabCheck(index) {
      let {other_list,over_view,is_send}=this
      
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
        for(let i in other_list){
          other_list[i].name=this.$till.htmlspecialchars_decode(other_list[i].name)
        }
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
          for(let i in topic_list){
            for(let j in topic_list[i].points){
              topic_list[i].points[j].name=this.$till.htmlspecialchars_decode(topic_list[i].points[j].name)
            }
          }
        }
        this.topic_list = topic_list;
      });
    },
    answer_load(){

    },

    //查看题目
    async CheckQas(code) {
      let { pid,is_send,sid } = this;
      
      this.qas_code = code;
      await this.$post("qa_content", "/?c=api", {
        student_id:sid,
        code: code,
        pid: pid,
        is_loadstus:1
      }).then(res => {
        
        res.qas_content = this.$till.htmlspecialchars_decode(res.content);
        let answer_arr=[]
           //选择题转换
        for(let i in res.answer_data){
          if(sid){
             answer_arr.push(res.uanswers[`answer_${res.answer_data[i].id}`])
          }
         
          if(res.answer_data[i].type==1){
            let html_text=""
            
            
             for(let o in res.answer_data[i].content.options){
               
               if(res.answer_data[i].content.options[o].text.indexOf("img:")!=-1){
                    res.answer_data[i].content.options[o].url=this.$till.change_file_url(res.answer_data[i].content.options[o].text.substring(5)) 
                      if(sid){
                          html_text+=`<div class="oitem_item ${((res.uanswers[`uanswer_${res.answer_data[i].id}`]==res.answer_data[i].content.options[o].value)&&res.uanswers[`uanswer_${res.answer_data[i].id}`]!=res.uanswers[`answer_${res.answer_data[i].id}`])?'eborder_class':''}  ${res.uanswers[`answer_${res.answer_data[i].id}`]==res.answer_data[i].content.options[o].value?'rborder_class':''} "><span>${res.answer_data[i].content.options[o].value}</span> <img src="${res.answer_data[i].content.options[o].url}"></img></span>
                  </div>`
                      }else{
                          html_text+=`<div class="oitem_item"><span>${res.answer_data[i].content.options[o].value}</span> <img src="${res.answer_data[i].content.options[o].url}"></img></span>
                  </div>`
                      }
                  }else{
                    if(sid){
                      html_text+=`<div class="oitem_item ${((res.uanswers[`uanswer_${res.answer_data[i].id}`]==res.answer_data[i].content.options[o].value)&&res.uanswers[`uanswer_${res.answer_data[i].id}`]!=res.uanswers[`answer_${res.answer_data[i].id}`])?'eborder_class':''} ${res.uanswers[`answer_${res.answer_data[i].id}`]==res.answer_data[i].content.options[o].value?'rborder_class':''} "><span>${res.answer_data[i].content.options[o].value}</span> <span>${res.answer_data[i].content.options[o].text}</span></span>
                  </div>`
                    }else{
                      html_text+=`<div class="oitem_item"><span>${res.answer_data[i].content.options[o].value}</span> <span>${res.answer_data[i].content.options[o].text}</span></span>
                  </div>`
                    }
                     
                  }
                   }
                 let allhtml=`<div class="check_qas_view">${html_text}</div>`
                res.qas_content=res.qas_content.replace(`卍${res.answer_data[i].id}卍`, allhtml)
              }else{

                if(sid){
                  // "<span class='eclass' ></span>"  "<span class='rclass' ></span>"
                  res.qas_content=res.qas_content.replace(`卍${res.answer_data[i].id}卍`, res.uanswers[`uanswer_${res.answer_data[i].id}`]==res.uanswers[`answer_${res.answer_data[i].id}`]?`<span class='rclass' >${res.uanswers[`uanswer_${res.answer_data[i].id}`]}</span>`:`<span class='eclass' >${res.uanswers[`uanswer_${res.answer_data[i].id}`]}</span>`)

                }else{
                  res.qas_content=res.qas_content.replace(`卍${res.answer_data[i].id}卍`, "")
                }
                    

              }
         
        }
        res.answer_arr=answer_arr
        res.qas_content=res.qas_content.replace(/卍.*?卍/g, "")
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
        this.answer_arr=answer_arr
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
      this.student_toggle=true
      this.left_arr=left_arr
      this.info=info
      })
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


    next_it() {
      let { info, qas_code } = this;
      let content=info.qa_results
      for (let i in content) {
        for (let j in content[i].qas) {
          if (qas_code == content[i].qas[j].code) {
            if (j == content[i].qas.length - 1) {
              if (
                content[parseInt(i) + 1] &&
                content[parseInt(i) + 1].qas.length != 0
              ) {
                this.right_toggle=false
                this.CheckQas(content[parseInt(i) + 1].qas[0].code);
              } else {
                
                this.$message({
                  message: "已到底部",
                  type: "warning"
                });
              }
            } else {
              this.right_toggle=false
              this.CheckQas(content[i].qas[parseInt(j) + 1].code);
            }
          }
        }
      }
    },

   
    before_it() {
      let { info, qas_code } = this;
      let content=info.qa_results
     
      

      for (let i in content) {
        for (let j in content[i].qas) {
          if (qas_code == content[i].qas[j].code) {
            if (j == 0) {
              if (
                content[parseInt(i) - 1] &&
                content[parseInt(i) - 1].qas.length != 0
              ) {
                this.right_toggle=false
                this.CheckQas(
                  content[parseInt(i) - 1].qas[
                    content[parseInt(i) - 1].qas.length - 1
                  ].code
                );
              } else {
                this.$message({
                  message: "已到顶部",
                  type: "warning"
                });
              }
            } else {
              this.right_toggle=false
              this.CheckQas(content[i].qas[parseInt(j) - 1].code);
            }
          }
        }
      }
    },
      // 答案解析显示隐藏
    change_right_toggle(){
      let {right_toggle}=this
      this.right_toggle=!right_toggle
    },
    ToStudentView(sid) {
      this.sid=sid
      this.GetInfo()
    }
  }
};
</script>
<style  >
.student_list_view_push{
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 40px;
}
.student_list_view_push .el-checkbox.is-bordered.el-checkbox--medium{
  height: 60px;
  display: flex;
  align-items: center;
}
.student_list_view_push_top{
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.student_list_view_push_bot{
  display: flex;
  flex-wrap: wrap;
}
.student_list_view_push_bot>div{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  margin-right: 30px;
  position: relative;
}
.student_list_view_push_bot>div>img{
  position: absolute;
  top: 50px;
  right: 0px;
  width: 25px;
  height: 25px;
}
.student_list_view_push_bot>div .el-image{
  width: 74px;
  height: 74px;
  margin-bottom: 10px;
  border-radius: 50%;
  opacity: 0.5;
}
.student_check{
  opacity: 1 !important;
}
.student_list_view_push_bot>div>span{
font-size:22px;
font-weight:500;
color:rgba(32,32,32,1);
}
.student_list_view_push_top_left{
  display: flex;
  align-items: center;

}
.student_list_view_push_top_left span{
  margin-right: 10px;
}
.student_list_view_push_top_left span:nth-child(1){
font-size:25px;
font-weight:500;
color:rgba(32,32,32,1);
}
.el-progress-bar__outer{
  height: 20px !important;
}
.check_qas_view_parent{
  width: 100%;
  
}
.check_qas_view{
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  padding-left: 55px;
  box-sizing: border-box;
}
.list_view_scroll_bot > div {
  display: flex;
  align-items: center;
}
.list_view_scroll_bot_right {
  color: #fff;
  font-size: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  width:175px;
height:55px;
background:rgba(84,93,255,1);
border-radius:37px;
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
.right_number{
  display: flex;
  align-items: center;
  width: 190px;
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
.stunde_number p{
   width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 25px;
  padding-left:40px;
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
.oitem_item{
  display: flex;
  align-items: center;
  min-width:483px;
min-height:74px;
background:rgba(255,255,255,1);
border-radius:9px;
border:4px solid rgba(189,189,189,1);
margin-bottom: 19px;
font-size: 25px;
padding: 10px 0;
box-sizing: border-box;

}
.oitem_item span:nth-child(1){
  width: 68px;
  border-right: 4px solid #BDBDBD;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #545DFF;
}
.oitem_item span:nth-child(2){
  padding: 0 30px;
  box-sizing:border-box;
}

.oitem_item .el-image{
  margin-left: 15px;
}

.answer_konw {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 400;
  margin-bottom: 20px;
  background:rgba(84,93,255,1);
  border-radius:8px;
  padding: 10px 20px;
  box-sizing: border-box;
}
.answer_konw span{
  color: #fff;
  margin-left: 15px;

}
.answer_konw .el-image:nth-child(1) {
  width: 31px;
  height: 31px;
}

.answer_konw .el-image:nth-child(3){
     width: 17px;
  height: 19px;
}

.answr_parent{
  width:100%;
background:rgba(244,244,244,1);
border-radius:8px;
display: flex;
flex-direction: column;
padding-left: 30px;
padding-bottom: 30px;
box-sizing: border-box;
}
.answr_parent_top{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 30px;
  box-sizing: border-box;
  
}
.send_button{
width:125px;
height:56px;
background:rgba(84,93,255,1);
border-radius:37px;
display: flex;
align-items: center;
justify-content: center;
color: #fff;
font-size: 33px;
margin-left: 40px;
}
.Census_right_tab_right{
  display: flex;
  align-items: center;
  padding-right: 80px;
  box-sizing: border-box;
}
.Census_right_tab_right_image{
  display: flex;
  align-items: center;
font-size:29px;
font-weight:500;
color:rgba(32,32,32,1);
margin-left: 41px;
}
.Census_right_tab_right_image .el-image{
  width: 35px;
  height: 35px;
  margin-right: 4px;
}
.answr_parent_top_left{
  width:91px;
height:43px;
background:rgba(84,93,255,1);
border-radius:0px 0px 8px 8px;
display: flex;
align-items: center;
justify-content: center;
color: #fff;
font-size: 25px;
}
.answr_parent_top .el-image{
  width: 23px;
  height: 23px;
}
.answer_rate{
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 25px;
  color: #00AD56;
  margin-top: 15px;
  margin-bottom: 30px;
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
  padding: 27px 20px;
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
  height: 75vh;
  border-radius: 18px;
  padding: 20px 40px;
  box-sizing: border-box;
  margin-right: -20px;
background:rgba(255,255,255,1);
box-shadow:0px 9px 28px 0px rgba(27,27,78,0.1);
border-radius:19px;
}
.student_view_left > span {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 18px;
}
.student_view_left_scroll {
  width: 100%;
  height: 65vh;
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
  border-radius: 18px;
  padding: 20px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
height:75vh;
background:rgba(255,255,255,1);
box-shadow:0px 9px 28px 0px rgba(27,27,78,0.1);
border-radius:19px;
}
.student_view_right_scroll {
  height: 65vh;
}
.list_view_scroll,
.list_view_scroll_other {
  height: 88vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding:18px 18px 28px 19px ;
  box-sizing: border-box;
  border: 1px solid #f3f3f3;
}
.list_view_scroll_other_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list_view_scroll_other_title_fp{
  font-size: 25px;
  width: 400px;
  overflow: hidden;
  min-height: 40px;
  display: flex;
  align-items: center;
  margin-right: 60px;
  line-height: 1.5;
}
.list_view_scroll_other_text {
  display: flex;
  align-items: center;
  height: 100%;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background: #BDBDBD;
  justify-content: center;
  font-size: 25px;
  color: #fff;
  margin-right: 19px;
}
.list_view_scroll_number_avtive{
  background: rgba(84, 93, 255, 1) !important;

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
  font-size: 25px;
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
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
  padding-left: 70px;
  box-sizing: border-box;
}
.Census_right_tab_left{
  display: flex;
  align-items: center;
}
.Census_right_tab_left > div {
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
 .Census .el-dialog{
  /* width: auto; */
}
.knowledge_view{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.knowledge_view>div{
background:rgba(242,242,255,1);
border-radius:4px;
border:1px solid rgba(204,207,255,1);
display: flex;
align-items: center;
justify-content: center;
color: #888CD3;
font-size: 22px;
padding: 10px 14px;
box-sizing: border-box;
margin-right: 20px;
margin-bottom: 20px;

}
.knowledge_view>div .el-image{
  width: 20px;
  height: 20px;
  margin-left: 20px;
}


.list_view_scroll_title {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.answer_center::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.answer_center {
  display: flex;
  width: 100%;
  max-height: 60vh;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 5px;
  /* align-items: center; */
}
.answer_center_top {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}
.answer_center_top > span {
  font-size: 24px;
  font-weight: 700;
  color:  #202020;
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
.right_answer_view{
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;

}
.right_answer_view>span{
  font-size: 33px;
  color: #202020;
  margin-right: 15px;
}
.right_answer_view>p{
  display: flex;
  align-items: center;
  color: #00ad56;
  font-size: 33px;
}
.right_answer_view>p span{
  margin-right: 15px;
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
  height: 19px;
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
.Census_right .el-checkbox{
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  justify-content: space-between;
}
.Census_right .el-checkbox__label{
  width: 100%;
}
.stundet_msg{
  display: flex;
  width:407px;
height:602px;
background:rgba(245,246,248,1);
border-radius:33px;
border:1px solid rgba(219,220,229,1);
position: relative;
flex-direction: column;
padding-top: 150px;
box-sizing: border-box;
margin-left: 41px;
}
.stundet_msg_top{
  display: flex;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translate(-50%,0);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stundet_msg_top .el-image{
  width: 130px;
  height: 130px;
  margin-bottom: 15px;
  border-radius: 50%;
}
.poeple_view_item > div .el-image {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.push_text_des_view input{
  font-size: 24px;
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
  /* justify-content: center; */
}
.web_view{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #66BD6A;
  margin-left: 20px;
}
.web_error{
  background: #fa6060 !important;
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
  flex-wrap: wrap;
  color: #bdbdbd;
  font-size: 26px;
  padding-left: 55px;
  box-sizing: border-box;
}
.all_cout p {
  margin-right: 15px;
  line-height: 1.5;
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
.eclass{
  font-size: 30px;
  color: #fa6060 !important ;
  font-weight: bold;
 
}
.rclass{
  font-size: 30px;

  color: #00AD56 !important;
  

}
.eborder_class{
   border: 4px solid #fa6060  !important;
}
.rborder_class{
   border: 4px solid #00AD56  !important;
}
/* 学生弹出框 */

.student_view_page {
  display: flex;
}
 .student_view_page .student_view_left {
  width: 727px;
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
  padding: 0 30px;
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
  width: 813px;
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
.student_view_left_msg{
  width: 450px;
  display: flex;
  flex-direction: column;
}
.student_view_right_msg{
  display: flex;
  flex-direction: column;
  width: 813px;
  align-items: center;
  padding-left: 50px;
  box-sizing: border-box;
}
 .student_view_page .student_scroll_view {
  width: 100%;
  height: 40vh;
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
.stundet_title{
  width: 100%;
  display: flex;
  border-left: 9px solid #FA7272;
  padding-left: 30px;
  box-sizing: border-box;
  font-size: 33px;
  margin-bottom: 100px;
}
.push_title{
font-size:33px;
color:rgba(32,32,32,1);
margin-bottom: 14px;
}
.push_text{
font-size:27px;
color:rgba(32,32,32,1);
margin-bottom: 17px;
}
.push_text_des{
font-size:25px;
color:rgba(32,32,32,1);
margin-bottom: 20px;
}
.push_text_des_view{
  display: flex;
  align-items: center;
}
.des_action{
  background: #66BD6A !important;
  color: #fff !important;
}
.push_text_des_view p{
  width:48px;
height:48px;
background:rgba(233,233,233,1);
border-radius:7px;
display: flex;
align-items: center;
justify-content: center;
color: #AFAFAF;
font-size: 25px;
margin-right: 14px;
}
.push_text_des_view .el-input,.push_text_des_view input{
  width:171px;
height:48px;
background:rgba(233,233,233,1);
border-radius:7px;
}
.list_view_scroll_top_left{
  display: flex;
  align-items: center;
 
}
.dclass{
  width: 1262px !important;
}
.dclass .el-dialog__body{
  padding-left: 0;
}
.list_view_scroll_top{
  display: flex;
  align-items: center;
   width: 100%;
  justify-content: space-between;

  /* margin-bottom: 30px; */
}
.bottom_top{
  margin-bottom: 30px;
}
</style>
