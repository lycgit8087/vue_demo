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
            >{{index+1}}</p>
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
             <span  >{{oitem.value}}</span>  <span>{{oitem.text}}</span>  
            </div>
          </div>
          </div>
        </div>
      </div>
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
          <el-image :src="BookImage">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

          </el-image>
          <span>答案解析</span>
        </div>

        <div class="answer_qri" v-show="right_toggle" v-html="qri" ></div>
       

        <!-- 人员显示 -->
        <div class="poeple_view">
          <span>答错学生 {{ns_data.length}}</span>
          <div class="poeple_view_item">
            <div v-for="item in ns_data" :key="item.name">
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
export default {
  name: "ExamDetail",
  data() {
    return {
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
      answer_data:[]
    };
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    this.GetInfo();
  },
  mounted() {},
  methods: {
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
           num++
            content[i].qas[j].content = this.htmlspecialchars_decode(
              content[i].qas[j].content
            );
          }
        }
        plist.count = count;
        this.content = content;
        this.plist = plist;
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
        pid: pid
      }).then(res => {
        res.qas_content = this.htmlspecialchars_decode(res.content);
        this.qas_content = res.qas_content;
        this.ns_data = res.ns_data;
        this.ys_data = res.ys_data;
        this.rq_rate = res.rq_rate;
        this.rq_title = res.title;
        if(res.qri){
          res.qri = this.htmlspecialchars_decode(res.qri);
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

    htmlspecialchars_decode(str) {
      if (str.length == 0) return str;
      str = str.replace(/&amp;/g, "&");
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      str = str.replace(/&quot;/g, "'");
      str = str.replace(/&#039;/g, "'");

      str = str.replace(
        /\<p/gi,
        '<p class="p_class" style="margin-bottom:10px" '
      );
      //  str = str.replace(
      //   /\<p\/>/gi,
      //   '</div> '
      // );
      str = str.replace(/\<span/gi, '<span class="span_class" ');

      // if (fistindex == "https://api-sf.imofang.cn/app.aspx?") {
      if (str.indexOf("src='/files") != -1) {
          str = str.replace(/src='/, `src='http://sc.imofang.cn`)
      } else {
        // str = str.replace(/src='/g, `src='${uploadurl}`);
        // str = str.replace(/src='/g, `src='https://files.imofang.cn/`);
      }
      // } else {
      // }
      str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
      return str;
    },
    left_load() {},
    right_load() {}
  }
};
</script>
<style  >
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
.qas_view {
  width: 100%;
}
.oitem_item{
  display: flex;
  align-items: center;
  font-size: 30px;
  height: 60px;

}
.oitem_item span{
  margin-right: 30px;
}
.check_qas_view_parent{
  width: 100%;
}
.check_qas_view{
  margin-bottom: 60px;
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
.ExamDetail_right::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.html_div {
  /* padding-left: 30px; */
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 26px;
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
