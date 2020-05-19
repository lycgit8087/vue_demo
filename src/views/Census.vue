<template>
  <div class="Census">
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
          <el-image :src="BookImage"></el-image>
          <span>答案解析</span>
        </div>

        <!-- 人员显示 -->
        <div class="poeple_view">
          <span>答错学生 12</span>
          <div class="poeple_view_item">
            <div v-for="i in 10" :key="i">
              <el-image :src="BookImage"></el-image>
              <span  >张郃</span>
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
      answer_toggle: true,
      BookImage: require("../assets/open_book.png"),
      p_html:'<span style="font-size:30px" >张郃</span>'
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style  >
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
.answer_konw img {
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

.poeple_view_item > div img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>
