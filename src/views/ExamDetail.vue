<template>
  <div class="ExamDetail">
    <div class="ExamDetail_left">
      <back></back>
      <p class="ExamDetail_left_title">答题卡</p>
      <div class="ExamDetail_left_list" v-infinite-scroll="left_load" style="overflow:auto">
        <div v-for="item in content" :key="item.partname">
          <p>{{item.partname}}</p>
          <div class="ExamDetail_left_list_item">
            <p
              v-for="(qitem,index) in item.qas"
              :key="index"
              @click="CheckQas(qitem.code,qitem.id)"
            >{{qitem.num}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="ExamDetail_right" v-infinite-scroll="right_load" style="overflow:auto">
      <p class="ExamDetail_right_title">{{plist.title}}</p>
      <p class="ExamDetail_right_text">分数：{{plist.count}}分 时间：{{plist.qminute}}分钟</p>

      <div v-for="item in content" :key="item.tcid" class="qas_view">
        <p class="exam_list_left_title">{{item.partname}}</p>
        <div v-for="qitem in item.qas" :key="qitem.id">
          <p class="exam_list_left_title_item">{{qitem.title}}</p>
          <div class="html_div" v-html="qitem.content"></div>
          <!-- 选择题答案项显示 -->
          <div v-if="qitem.type==1||qitem.type==2"  >
          <div class="check_qas_view" v-for=" aitem in  qitem.answers" :key="aitem.id" >
            <!-- <p>{{aitem.name}}</p> -->
            <div v-for="oitem in aitem.content.options " class="oitem_item" :key="oitem.value" >
             <span  >{{oitem.value}}</span> 
              <span v-if='oitem.text.indexOf("img:")==-1'  >{{oitem.text}}</span>  
                 <el-image v-else :src="oitem.url">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题目弹出框 -->
    <el-dialog :visible.sync="answer_toggle">
      <div class="answer_center" v-infinite-scroll="answer_load" style="overflow:auto" >
        <div class="answer_center_top">
          <span>{{rq_title}}</span>
         
        </div>
        <div class="html_div" v-html="qas_content"></div>
         <!-- 选择题答案项显示 -->
          <div v-if="qtype==1||qtype==2" class="check_qas_view_parent" >
          <div class="check_qas_view" v-for=" aitem in  answer_data" :key="aitem.id" >
            <!-- <p>{{aitem.name}}</p> -->
            <div v-for="oitem in aitem.content.options " class="oitem_item" :key="oitem.value" >
             <span  >{{oitem.value}}</span> 
              <span v-if='oitem.text.indexOf("img:")==-1' >{{oitem.text}}</span>
                <el-image v-else :src="oitem.url">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
            </div>
          </div>
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
  name: "ExamDetail",
  data() {
    return {
      bluetop,
      answericon,
      blackbot,
      bluebot,
      blacktop,
      closeIcon: require("../assets/detail_close_icon.png"),

      centerDialogVisible: false,
      BookImage: require("../assets/open_book.png"),
      pid: 0,
      content: [],
      right_toggle: false,
      plist: {},
      qas_content: "",
      answer_toggle: false,
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
      answer_data:[],
      error_toggle:true,
      success_toggle:true
    };
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    let is_local=this.$till.user_local(this.$route.name,this.$route.query.pid)
   if(!is_local){
     this.GetInfo();
   }else{
     let data=this.$till.get_local(this.$route.name,this.$route.query.pid)
      let {content,plist}=data
      this.content=content
      this.plist=plist
   }
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
    async SeeRight() {
      let { qas_code } = this;
      await this.$post("qa_answer", "/?c=api", {
        id: pid,
        code: qas_code
      });
      this.answer_toggle = true;
    },
    // 获取信息
    async GetInfo() {
      let { pid } = this;
      await this.$post("paper_list", "/?c=api", {
        pids: pid,
        is_content: 1
      }).then(res => {
        let plist = res.data[0];
        let count = 0;
        let num=1
        
        let { content } = plist;
        if (plist.content.length) {
          for (let i in plist.content) {
            count += plist.content[i].partscore;
          }
        }
        // NoToChinese
        for (let i in content) {
          for (let j in content[i].qas) {
           content[i].qas[j].title=num+". "+content[i].qas[j].title
           content[i].qas[j].num=num
           num++
            content[i].qas[j].content =  this.$till.htmlspecialchars_decode(
              content[i].qas[j].content
            );

            for(let k in content[i].qas[j].answers){
              if(content[i].qas[j].answers[k].type==1){
                for(let o in content[i].qas[j].answers[k].content.options){
                  if(content[i].qas[j].answers[k].content.options[o].text.indexOf("img:")!=-1){
                    content[i].qas[j].answers[k].content.options[o].url=this.$till.change_file_url(content[i].qas[j].answers[k].content.options[o].text.substring(5)) 
                  }
                }
              }
            }
          }
        }
        plist.count = count;
        this.content = content;
        this.plist = plist;

        // 设置缓存
        let page_data={
          content:content,
          plist:plist,
        }
       localStorage.setItem("user_local",JSON.stringify(this.$till.set_local(this.$route.name,this.$route.query.pid,page_data)))  

      });
      this.centerDialogVisible = true;
    },

    // 答案解析显示隐藏
    change_right_toggle(){
      let {right_toggle}=this
      this.right_toggle=!right_toggle
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
        res.qas_content =  this.$till.htmlspecialchars_decode(res.content);
        this.qas_content = res.qas_content;


        //选择题转换
        for(let i in res.answer_data){
          for(let o in res.answer_data[i].content.options){
               if(res.answer_data[i].content.options[o].text.indexOf("img:")!=-1){
                    res.answer_data[i].content.options[o].url=this.$till.change_file_url(res.answer_data[i].content.options[o].text.substring(5)) 
                  }
            
          }
        }


        // 答错
        for(let i in res.ns_data){
          res.ns_data[i].avatar=this.$till.change_file_url(res.ns_data[i].avatar)
        }

       // 答对
        for(let i in res.ys_data){
          res.ys_data[i].avatar=this.$till.change_file_url(res.ys_data[i].avatar)
        }

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
      let { content, qas_code } = this;
      this.is_change = true;
      this.is_change_next = true;
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
                this.is_change = false;
                this.is_change_next = false;
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
    answer_load(){

    },

   
    before() {
      let { content, qas_code } = this;
      this.is_change = true;
      this.is_change_before = true;
      

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
                this.is_change = false;
                this.is_change_before = false;

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

     NoToChinese(num) {
      if (!/^\d*(\.\d*)?$/.test(num)) {
        alert("Number is wrong!");
        return "Number is wrong!";
      }
      var AA = new Array(
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      );
      var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
      var a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";
      for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
          case 0:
            re = BB[7] + re;
            break;
          case 4:
            if (
              !new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])
            )
              re = BB[4] + re;
            break;
          case 8:
            re = BB[5] + re;
            BB[7] = BB[5];
            k = 0;
            break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
          re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
      }
      if (a.length > 1) {
        //加上小数部分(如果有小数部分)
        re += BB[6];
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
      }
      return re;
    },
    left_load() {},
    right_load() {}
  }
};
</script>
<style  >
.answer_rate{
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 25px;
  color: #00AD56;
  margin-top: 15px;
  margin-bottom: 30px;
}
.ExamDetail {
  display: flex;
  height: 100vh;
}
.ExamDetail_left {
  width: 702px;
  height: 100vh;
  background: #f8f8ff;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ExamDetail_left_title {
  font-size: 38px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 50px;
}

.answr_parent{
  width:100%;
min-height:297px;
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
.qas_view {
  width: 100%;
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
.check_qas_view_parent{
  width: 100%;
  
}
.check_qas_view{
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.ExamDetail_right {
  width: 1218px;
  height: 100vh;
  padding: 76px 56px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
.exam_list_left_title {
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 18px;
}
.exam_list_left_title_item{
  /* padding-left: 15px; */
  box-sizing: border-box;
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 20px;
  margin-top: 10px;
}

.ExamDetail_left_list {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.ExamDetail_left_list > div {
  display: flex;
  flex-direction: column;
}
.ExamDetail_left_list > div > p {
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 27px;
}
.ExamDetail_left_list_item {
  display: flex;
  flex-wrap: wrap;
}
.ExamDetail_left_list_item > p {
  width: 76px;
  height: 76px;
  background: rgba(255, 255, 255, 1);
  border: 2px solid rgba(135, 139, 148, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b4b4b;
  font-size: 34px;
  border-radius: 50%;
  margin-bottom: 27px;
  margin-right: 27px;
}
.ExamDetail_left_list::-webkit-scrollbar,
.ExamDetail_right::-webkit-scrollbar,.answer_center::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.html_div {
  /* padding-left: 30px; */
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 50px;
}
.answer_center {
  display: flex;
  width: 100%;
  max-height: 60vh;
  flex-direction: column;
  align-items: flex-start;
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
  justify-content: space-between;
  margin-top: 18px;
}
</style>
