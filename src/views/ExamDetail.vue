<template>
  <div class="ExamDetail">
    <div class="ExamDetail_left">
      <back></back>
      <p class="ExamDetail_left_title">答题卡</p>
      <div class="ExamDetail_left_list" v-infinite-scroll="left_load" style="overflow:auto">
        <div v-for="item in content" :key="item.partname">
          <p>{{item.partname}}</p>
          <div class="ExamDetail_left_list_item">
            <p v-for="(qitem,index) in item.qas" :key="index">{{index+1}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="ExamDetail_right" v-infinite-scroll="right_load" style="overflow:auto">
      <p class="ExamDetail_right_title">{{plist.title}}</p>
      <p class="ExamDetail_right_text">分数：{{plist.count}}分 时间：{{plist.qminute}}分钟</p>

      <div v-for="item in content" :key="item.tcid" class="qas_view" >
        <p class="exam_list_left_title">{{item.partname}}</p>
        <div v-for="qitem in item.qas" :key="qitem.id"  >
            <p class="exam_list_left_title" >{{qitem.title}}</p>
        <div v-html="qitem.content"></div>

        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExamDetail",
  data() {
    return {
        centerDialogVisible:false,
      pid: 0,
      content: [],
      plist:{}
    };
  },
  components: {},
  created() {
    this.pid = this.$route.query.pid;
    this.GetInfo();
  },
  mounted() {},
  methods: {
    async GetInfo() {
      let { pid } = this;
      await this.$post("paper_list", "/?c=api", {
        pids: pid,
        is_content: 1
      }).then(res => {
        let plist = res.data[0];
        let count = 0;
        let {content}=plist
        if (plist.content.length) {
          for (let i in plist.content) {
            count += plist.content[i].partscore;
          }
        }
          for (let i in content) {
              for(let j in content[i].qas){
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

    htmlspecialchars_decode(str) {
      if (str.length == 0) return str;
      str = str.replace(/&amp;/g, "&");
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      str = str.replace(/&quot;/g, "'");
      str = str.replace(/&#039;/g, "'");

      str = str.replace(/\<p/gi, '<p class="p_class" style="margin-bottom:10px" ');
      str = str.replace(/\<span/gi, '<span class="span_class" ')

      // if (fistindex == "https://api-sf.imofang.cn/app.aspx?") {
        if (str.indexOf("src='/files") != -1) {
        //   str = str.replace(/src='/g, `src='http://sc.imofang.cn`);
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
.qas_view{
    width: 100%;
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
.exam_list_left_title{
font-size:32px;
font-weight:400;
color:rgba(32,32,32,1);
margin-bottom: 18px;
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
</style>
