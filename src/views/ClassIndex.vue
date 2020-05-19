<!-- CLassIndex -->
<template>
  <div class="CLassIndex">
    <div class="CLassIndex_Left">
      <el-calendar v-model="value">
        <template
    slot="dateCell"
    slot-scope="{date, data}">
    <p :class="data.isSelected ? 'is-selected' : ''">
      {{ data.day.split('-').slice(2).join('-') }}
       <!-- {{ data.isSelected ? '✔️' : ''}} -->
    </p>
  </template>

      </el-calendar>
    </div>

    <div class="CLassIndex_Right">
      <!-- 教师头部信息 -->
      <div class="CLassIndex_Right_Top">
        <div class="CLassIndex_Right_Top_Left">
          <el-image :src="HeadImage" fit="cover"></el-image>
          <!-- <el-avatar :size="size" :src="HeadImage"></el-avatar> -->
          <div class="CLassIndex_Right_Top_Msg">
            <p>嬴政</p>
            <p>数学老师 班主任1</p>
          </div>
        </div>

        <div class="ResetLogin" @click="BackLogin" >退出登录</div>
      </div>

      <!-- <alert-view :list="listarr" ></alert-view> -->
      <div class="picker_view" >
        <!-- 时间筛选 -->
          <el-date-picker
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>

    <!-- 选择器 -->
      <el-cascader
    v-model="value"
    :options="options"
    @change="handleChange"></el-cascader>

      </div>
    
      <!-- 标题 -->
      <div class="ListTitle">备课列表</div>

      <!-- 列表内容 -->

      <div class="ListView">
        <el-scrollbar  class="scroll_view">
          <ul class="ListParent">
            <li v-for="i in count" :key="i" class="ListItem" @click="TOExamList" >
              <div>
                <div class="ListParentChildViewTop">
                  <p>数的运算（一）</p>
                  <p>08:10</p>
                </div>
                <div class="ListParentChildViewBot">
                  <p>用数学“9加几” [课时2]</p>
                  <p>一年级105级</p>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>

        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "CLassIndex",
  components: {},
  data() {
    //这里存放数据
    return {
      value:Date.parse(new Date()) ,
      HeadImage: require("../assets/login_img.png"),
      count: 10,
      listarr:[{num:0,text:"123"}],
      loading: false,
      value2:"",
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
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
      value(val){
          console.log(Date.parse(val))
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
      handleChange(value) {
        console.log(value);
      },
    TOExamList(){
        this.$router.push({name:'ExamList',params:{id:101}})
    },
    BackLogin(){
        this.$router.replace({name:'Login',params:{id:101}})

    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
    color: #1989FA;
  }
.CLassIndex {
  display: flex;
  padding: 150px 75px 0px 50px;
  box-sizing: border-box;
  height: 100vh;
  
}
.CLassIndex_Left {
  width: 857px;
}
.CLassIndex_Right {
  display: flex;
  flex-direction: column;
  width: 930px;

}
.CLassIndex_Left .el-button{
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
.el-tree-node>.el-tree-node__children{
   overflow:visible !important;
 }
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
.ListView {
  width: 100%;
  padding-left: 86px;
  box-sizing: border-box;
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
.ListParent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  box-sizing: border-box;
  width: 100%;
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
  height: 70px;
  padding: 0;
  margin: 0;
  /* height: auto; */
}
/* .el-calendar-table td.is-selected{
  background: #409EFF;
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
.el-calendar-table .el-calendar-day {
  padding: 0 !important;
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
.picker_view{
  display: flex;
  align-items: center;
  margin-left: 86px;
  margin-bottom: 30px;
}
.picker_view .el-date-editor--daterange.el-input__inner{
  width: 400px !important;
  /* height: 100px; */
  padding: 5px 10px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  font-size: 26px !important;
}
.picker_view .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.picker_view .el-date-editor .el-range__icon{
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.picker_view .el-date-range-picker__header{
  height: 60px !important;
}
.picker_view .el-input__inner{
  height: 70px !important;
  font-size: 26px !important;
}
.picker_view .el-cascader .el-input .el-icon-arrow-down{
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.el-cascader-node{
  height: 60px !important;
  font-size: 26px !important;
  font-weight: normal !important;
}
.el-cascader-node.in-active-path{
  font-weight: normal !important;

}
.el-cascader-node.is-active{
  font-weight: normal !important;
}
.el-cascader-node__label{
  padding-left: 20px !important;
}
.picker_view .el-cascader{
  margin-left: 30px !important;
}
.picker_view .el-picker-panel__shortcut{
  font-size: 26px !important;
}
/* .el-date-range-picker.has-sidebar{
  width: 1000px;
} */
.el-picker-panel [slot=sidebar], .el-picker-panel__sidebar{
  width: 150px !important;
}
   .el-picker-panel__shortcut{
  font-size: 20px !important;
  height: 50px !important;
  display: flex;
  align-items: center;
}
.el-picker-panel [slot=sidebar]+.el-picker-panel__body, .el-picker-panel__sidebar+.el-picker-panel__body{
  margin-left: 150px !important;
}
.el-date-editor .el-range__close-icon{
  font-size: 26px !important;
  display: flex !important;
  align-items: center !important;
}
.el-date-table{
  font-size: 26px !important;
 
}
.el-date-table td span{
  height: 60px !important;
  width: 60px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.el-date-table td, .el-date-table td div{
  height: 70px !important;
  width: 70px !important;
 
}
.el-date-table td div{
   display: flex;
  align-items: center;
  justify-content: center;
}
.el-date-table td{
  height: 70px  !important;
  width: 70px  !important;
  padding: 0;
  /* display: flex; */
  align-items: center;
}
.el-date-range-picker .el-picker-panel__body{
  display: flex;

}
.el-picker-panel__body-wrapper{
  width: 1100px !important;
}
.el-date-range-picker__content{
  width: auto !important;
}
.el-date-range-picker.has-sidebar{
  width: auto !important;
}
.el-date-range-picker__header{
  height: 40px !important;
  margin-bottom: 20px !important;
}
.el-date-table th{
  text-align: center;
  font-size: 26px !important;
}
.el-date-range-picker__header div{
  font-size: 26px !important;
  display: flex;
  height: 40px !important;
  align-items: center;
  justify-content: center;
}
.el-picker-panel__icon-btn{
  font-size: 26px !important;
}
.el-picker-panel [slot=sidebar], .el-picker-panel__sidebar{
  font-size: 26px !important;
}
</style>