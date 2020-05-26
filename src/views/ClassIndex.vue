<!-- CLassIndex -->
<template>
  <div class="CLassIndex">
    <div class="CLassIndex_Left">
      <el-calendar v-model="value" :first-day-of-week="1">
        <template slot="dateCell" slot-scope="{date, data}">
          <div >
            <div  >
              <div v-for="item in time_arr" :key="item.time">
                <div v-if="data.day.replace(/-/g,'/')==item.day">
                  <div
                    :class="item.data.length==0&&data.isSelected==false?'time_view':item.data.length==0&&data.isSelected?' time_view':item.data.length!=0&&data.isSelected?' time_view action_data ':'time_view has_data' "
                  >
                    
                  {{ data.day.split('-').slice(2).join('-') }}</div>
                </div>
                <!-- <div v-else >{{ data.day.split('-').slice(2).join('-') }}</div> -->
              </div>
            </div>
            <div  v-if='data.day.substring(data.day.indexOf("-")+1,data.day.lastIndexOf("-"))!=now_mouth' >
              <!-- {{data}} -->
              {{ data.day.split('-').slice(2).join('-') }}</div>

            <!-- {{ data.isSelected ? '✔️' : ''}} -->
          </div>
        </template>
      </el-calendar>
    </div>

    <div class="CLassIndex_Right">
      <!-- 教师头部信息 -->
      <div class="CLassIndex_Right_Top">
        <div class="CLassIndex_Right_Top_Left">
          <el-image :src="HeadImage" fit="cover"></el-image>
          <div class="CLassIndex_Right_Top_Msg">
            <p>{{UserInfo.name}}</p>
            <p>{{UserInfo.belong}}</p>
          </div>
        </div>

        <div class="ResetLogin" @click="BackLogin">退出登录</div>
      </div>

      <div class="picker_view">
        <!-- 时间筛选 -->
        <el-date-picker
          v-model="time_value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy/MM/dd"
        ></el-date-picker>

        <!-- 年级班级选择器 -->
        <el-cascader
          v-model="class_value"
          :options="class_arr"
          @change="handleChangeClass"
          placeholder="年级/班级"
        ></el-cascader>
        <!-- 科目章节 -->

        <el-cascader
          v-model="course_value"
          :options="subject_arr"
          @change="handleChangeCourse"
          placeholder="科目/章节"
          :props="props"
          collapse-tags
          clearable
        ></el-cascader>
      </div>

      <!-- 标题 -->
      <div class="ListTitle">备课列表</div>

      <!-- 列表内容 -->

      <div
        class="ListView"
        v-infinite-scroll="load"
        style="overflow:auto"
        v-loading="isloading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.1)"
      >
        <!-- <el-scrollbar  class="scroll_view"> -->
        <div
          class="ListItem"
          v-for="item in list_data"
          :key="item.plid"
          @click="TOExamList(item.plid,item.class_id)"
        >
          <div>
            <div class="ListParentChildViewTop">
              <p>{{item.acname}}</p>
              <p>{{item.time}}</p>
            </div>
            <div class="ListParentChildViewBot">
              <p>{{item.spctitle}} [课时{{item.classhour}}]</p>
              <p>{{item.gname+item.cname}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Cookies from "js-cookie";

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "CLassIndex",
  components: {},
  data() {
    //这里存放数据
    return {
      value: "",
      HeadImage: "",
      class_value: [],
      course_value: [],
      count: 10,
      loading: false,
      time_value: "",
      selet_value: "",
      isloading: false,
      star_time: "",
      end_time: "",
      class_arr: [],
      UserInfo: {},
      listarr: [],
      time_arr:[],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      is_clear:false,
      now_mouth:'',
      list_data: [],
      ids: [],
      props: { multiple: true },
      subject_arr: []
    };
  },
  //监听属性 类似于data概念
  computed: {
    noMore() {
      return this.count >= 20;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  //监控data中的数据变化
  watch: {
    value(val, oldval) {
      let { list_data, listarr } = this;
      this.star_time = this.$till.get_time(Date.parse(val), "Y/M/01");
      this.end_time = this.getMonthDay(val);
      this.value = this.$till.get_time(Date.parse(val), "Y/M/D");
      this.now_mouth=this.$till.get_time(Date.parse(val), "M")
      if (
        this.$till.get_time(Date.parse(val), "Y/M") !=
        this.$till.get_time(Date.parse(oldval), "Y/M")
      ) {
        this.list_data = [];
        this.time_arr=this.GetAllMouth(val)
        this.GetPrepareLessonList();
      } else {
        list_data = listarr.filter(item => item.time == this.value);
        this.list_data = list_data;
      }
    },
    time_value(val) {
      if(val){
        this.is_clear=true
        this.star_time = val[0];
      this.end_time = val[1];
      this.GetPrepareLessonList();
      }else{
        this.is_clear=false
        this.GetPrepareLessonList()
      }
      
    },
    class_value(val) {
      this.GetPrepareLessonList();
    }
  },
  //方法集合
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    handleChangeClass() {
      let { class_value } = this;
      this.class_value = class_value[0];
    },
    handleChangeCourse() {
      let arr = [];
      let { course_value } = this;
      for (let i in course_value) {
        for (let j in course_value[i]) {
          if (arr.indexOf(course_value[i][j]) == -1) {
            arr.push(course_value[i][j]);
          }
        }
      }
      arr.shift();
      this.ids = arr;
      this.GetPrepareLessonList();
    },
    TOExamList(plid, class_id) {
      this.$router.push({
        name: "ExamList",
        query: { plid: plid, class_id: class_id }
      });
    },
    BackLogin() {
      this.$Cookies.set("token", "");
      this.$router.replace({ name: "Login", params: { id: 101 } });
    },

    GetAllMouth(data){
      let end_day= parseInt(this.$till.get_time(this.getMonthDay(data),"D")) ,star_day=1,time_arr=[],star=this.$till.get_time(this.getMonthDay(data),"Y/M/01")
      for(let i =1;i<=end_day;i++){
        time_arr.push({
          day:this.$till.get_time(new Date(star).getTime(),`Y/M/${i<10?"0"+i:i}`),
          data:[]
        })

      }

      return time_arr

    },
    getMonthDay(startDate) {
      var date = new Date(startDate);
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var firstdate = year + "/" + month + "/01";
      var day = new Date(year, month, 0);
      var lastdate = year + "/" + month + "/" + day.getDate();
      return lastdate;
    },
    // 获取用户信息
    async GetUserInfo() {
      let class_arr = [],
        subject_arr = [];
      await this.$post("user_info", "/?c=api", {}).then(res => {
        this.UserInfo = res;
        let { belong_data, subject_data } = res;
        this.$store.dispatch("change_sid", res.sid);
        this.$store.dispatch("change_org_id", res.org_id);
        this.HeadImage = "https://files.imofang.cn" + res.avatar;
        for (let i in belong_data) {
          class_arr.push({
            value: belong_data[i].id,
            label: belong_data[i].name
          });
        }
        for (let i in subject_data) {
          subject_arr.push({
            value: subject_data[i].id,
            label: subject_data[i].name
          });
        }
        this.class_arr = class_arr;
        this.GetSubject(subject_arr);
      });
    },

    Subject_arr(data) {
      for (let i in data) {
        data[i].label = data[i].name;
        data[i].value = data[i].id;
        if (data[i].hasSubList) {
          data[i].children = this.Subject_arr(data[i].subList);
        }
      }

      return data;
    },
    async GetSubject(data) {
      let { UserInfo } = this;

      for (let i in data) {
        let jarr = await this.$post("chapter_list", "/?c=api", {
          schoolid: UserInfo.org_id,
          grade: 40,
          subject: data[i].value
        });
        if (jarr.data.length) {
          data[i].children = this.Subject_arr(jarr.data);
        } else {
          data[i].children = [];
        }
      }
      this.subject_arr = data;
    },
    

    // 获取备课列表
    async GetPrepareLessonList() {
      this.isloading = true;
      let {
        UserInfo,
        class_value,
        star_time,
        end_time,
        ids,
        value,
        list_data,
        time_arr,
        is_clear
      } = this;
      
    
      await this.$post("module_api", "/?c=api", {
        module_tag: "gfteachingplan",
        module_action: "get_prepare_lesson_list",
        org_id: UserInfo.org_id,
        staff_id: UserInfo.sid,
        class_id: class_value,
        chapters: ids.join(","),
        begin_date: star_time,
        end_date: end_time
      }).then(res => {
        let listarr = res.data;
        if (listarr.length) {
          for (let i in listarr) {
            listarr[i].time = this.$till.get_time(
              listarr[i].ptime * 1000,
              "Y/M/D"
            );
          }
          list_data = listarr.filter(item => item.time == value);
        }
        for(let i in time_arr){
          time_arr[i].data=listarr.filter(item => item.time == time_arr[i].day)
        }
        this.time_arr=time_arr
        this.listarr = listarr;
        this.list_data =is_clear? listarr:list_data;
        this.isloading = false;
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  async created() {
    await this.GetUserInfo();
    let { value, star_time, end_time } = this;
    if (value == "") {

    this.now_mouth=this.$till.get_time(Date.parse(new Date()), "M")
      value = this.$till.get_time(Date.parse(new Date()), "Y/M/D");
      star_time = this.$till.get_time(Date.parse(new Date()), "Y/M/01");
      end_time = this.getMonthDay(value);
    }
    this.time_arr=this.GetAllMouth(value)
    this.value = value;
    this.star_time = star_time;
    this.end_time = end_time;

    await this.GetPrepareLessonList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style >
/* //@import url(); 引入公共css类 */
/* @import url('../style/style.css'); */
.is-selected {
  color: #1989fa;
}
.el-tag {
  font-size: 26px;
}
.el-tag--small {
  height: auto;
  margin: 5px 10px;
}
.CLassIndex {
  display: flex;
  padding: 80px 75px 0px 50px;
  box-sizing: border-box;
  height: 100vh;
}
.CLassIndex_Left {
  width: 857px;
}
.CLassIndex_Right {
  display: flex;
  flex-direction: column;
  width: 1014px;
}
.CLassIndex_Left .el-button {
  font-size: 28px;
}

.CLassIndex_Right_Top {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-left: 86px;
  padding-right: 75px;
  box-sizing: border-box;
}
.CLassIndex_Right_Top_Left {
  display: flex;
}
.CLassIndex_Right_Top img {
  width: 120px;
  height: 120px;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  margin-right: 19px;
}
.CLassIndex_Right_Top_Msg {
  display: flex;
  flex-direction: column;
  height: 120px;
  justify-content: center;
}
.CLassIndex_Right_Top_Msg p:nth-child(1) {
  font-size: 36px;
  font-weight: 600;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 9px;
}
.CLassIndex_Right_Top_Msg p:nth-child(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
}
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
/* .el-tree-node>.el-tree-node__children{
   overflow:visible !important;
 } */
.scroll_view {
  height: 350px;
  width: 100%;
}
.ListTitle {
  display: flex;
  align-items: center;
  border-left: 15px solid #545dff;
  box-sizing: border-box;
  padding-left: 14px;
  font-size: 30px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 30px;
  margin-left: 86px;
}
.ListItem {
  width: 100%;
  height: 150px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 15px 0px rgba(27, 27, 78, 0.05);
  border-radius: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  display: flex;
}
.ListView {
  width: 100%;
  padding-left: 86px;
  box-sizing: border-box;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  padding-right: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 450px;
}
.ListView::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.ListItem > div {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 32px 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
}
.ListParentChildViewTop,
.ListParentChildViewBot {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.ListParentChildViewTop p:nth-child(1) {
  font-size: 36px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.el-checkbox__inner {
  width: 30px;
  height: 30px;
}
.ListParentChildViewTop p:nth-child(2) {
  font-size: 24px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.ListParentChildViewBot p:nth-child(1) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(135, 139, 148, 1);
}
.ListParentChildViewBot p:nth-child(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(135, 139, 148, 1);
}

/* 日历 */
.el-calendar__title {
  font-size: 26px !important;
}
.el-calendar-table td {
  border: none !important;
  width: 70px;
  /* height: 70px;
  border-radius: 50%; */
}
.el-calendar-table .el-calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  margin: 0;
  padding: 0 !important;
  font-size: 26px !important;
  /* height: auto; */
}
/* .el-calendar-table td.is-selected{
  background: #409EFF;
} */
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: rotate(45deg) scaleY(1.5) !important;
}
.el-checkbox__inner::after {
  height: 12px !important;
  width: 12px !important;
  top: 20% !important;
  left: 30% !important;
  transform: translate(-50%, -50%) !important;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  height: 3px !important;
  width: 20px !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
/* .el-tag .el-icon-close{
  width: 10px;
  height: 10px;
} */

.el-calendar__header {
  display: flex;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  margin-bottom: 80px;
  margin-top: 20px;
  border-bottom: none !important;
  /* height: 120px; */
  align-items: center;
}

.el-calendar-table tr td:first-child {
  border: none !important;
}
.el-calendar-table tr:first-child td {
  border: none !important;
}
.el-calendar-table thead th {
  text-align: center;
  height: 80px;
  font-size: 26px !important;
}
.el-calendar__body {
  padding: 0 !important;
}
.el-button {
  border: 1px solid #dcdfe6 !important;
  padding: 12px 20px;
  box-sizing: border-box;
}
tbody {
  border: none !important;
}
.ResetLogin {
  font-size: 30px;
  font-weight: 400;
  color: rgba(164, 169, 255, 1);
}
.picker_view {
  display: flex;
  align-items: center;
  margin-left: 86px;
  margin-bottom: 30px;
}
.picker_view .el-date-editor--daterange.el-input__inner {
  width: 600px !important;
  /* height: 100px; */
  padding: 5px 10px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  font-size: 26px !important;
}
.picker_view .el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.el-date-editor .el-range-separator {
  width: auto !important;
}
.picker_view .el-date-editor .el-range__icon {
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.picker_view .el-date-range-picker__header {
  height: 60px !important;
}
.picker_view .el-input__inner {
  height: 70px !important;
  font-size: 26px !important;
}
.picker_view .el-cascader .el-input .el-icon-arrow-down {
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.el-cascader-node {
  height: 60px !important;
  font-size: 26px !important;
  font-weight: normal !important;
}
.el-cascader-node.in-active-path {
  font-weight: normal !important;
}
.el-cascader-node.is-active {
  font-weight: normal !important;
}
.el-cascader-node__label {
  padding-left: 20px !important;
}
.picker_view .el-cascader {
  margin-left: 30px !important;
}
.picker_view .el-picker-panel__shortcut {
  font-size: 26px !important;
}
/* .el-date-range-picker.has-sidebar{
  width: 1000px;
} */
.el-picker-panel [slot="sidebar"],
.el-picker-panel__sidebar {
  width: 150px !important;
}
.el-picker-panel__shortcut {
  font-size: 20px !important;
  height: 50px !important;
  display: flex;
  align-items: center;
}
.el-picker-panel [slot="sidebar"] + .el-picker-panel__body,
.el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 150px !important;
}
.el-date-editor .el-range__close-icon {
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.el-date-table {
  font-size: 26px !important;
}
.el-date-table td span {
  height: 60px !important;
  width: 60px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.el-date-table td,
.el-date-table td div {
  height: 70px !important;
  width: 70px !important;
}
.el-date-table td div {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-date-table td {
  height: 70px !important;
  width: 70px !important;
  padding: 0;
  /* display: flex; */
  align-items: center;
}
.el-date-range-picker .el-picker-panel__body {
  display: flex;
}
.el-picker-panel__body-wrapper {
  width: 1100px !important;
}
.el-date-range-picker__content {
  width: auto !important;
}
.el-date-range-picker.has-sidebar {
  width: auto !important;
}
.el-date-range-picker__header {
  height: 40px !important;
  margin-bottom: 20px !important;
}
.el-date-table th {
  text-align: center;
  font-size: 26px !important;
}
.el-date-range-picker__header div {
  font-size: 26px !important;
  display: flex;
  height: 40px !important;
  align-items: center;
  justify-content: center;
}
.el-picker-panel__icon-btn {
  font-size: 26px !important;
}
.el-picker-panel [slot="sidebar"],
.el-picker-panel__sidebar {
  font-size: 26px !important;
}
.el-select-dropdown__item {
  font-size: 26px;
  height: 60px;
  display: flex;
  align-items: center;
}
.el-select-dropdown__wrap {
  height: 300px;
}
.has_data {
  border: 2px solid rgba(253, 104, 125, 1);
}
.time_view {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 50%;
}
.action_data{
  background: #545DFF;
  color: #fff;
}
.el-calendar-table td.is-selected{
  background: none !important;
}
.el-backtop, .el-calendar-table td.is-today{
  color: none !important;
}
</style>