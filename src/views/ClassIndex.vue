<!-- CLassIndex -->
<template>
  <div class="CLassIndex">
    <back @loginit='open_login' @updateit="clear_data" ></back>
    <div class="CLassIndex_Left">

      <div @click="change_tab" class="class_tab_view"  >
      <div :class="tab_index==0?'class_tab_view_active':''" >
        <el-image :src="tab_index==0?classTimeActionIcon:classTimeIcon" fit="cover"   >
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>

            </el-image>

      <p>
        <span>备</span>
        <span>课</span>
        <span>日</span>
        <span>历</span>

        </p>
      </div>

      <div :class="tab_index==1?'class_tab_view_active':''" >
        <el-image :src="tab_index==1?teachActionIcon:teachIcon" fit="cover"   >
                 <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            </el-image>

      <p> 
         <span>教</span>
        <span>材</span>
        <span>目</span>
        <span>录</span>
        </p>
      </div>
      
      
    </div>
      <!-- 教学日历 -->
      <div class="CLassIndex_Left_one" v-show="tab_index==0" >
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

      <!-- 教学目录 -->

      <div class="CLassIndex_Left_two" v-show="tab_index==1" >


          <div class="sub_list_title" >按教材目录筛选</div>
      <div class="picker_view">
      
        <!-- 年级班级选择器 -->
        <el-cascader
          v-model="class_value"
          :options="class_arr"
          @change="handleChangeClass"
          placeholder="年级/班级"
        ></el-cascader>

        <!-- 科目选择器 -->
        <el-cascader
          v-model="sub_value"
          :options="sub_arr"
          @change="handleChangeSub"
          placeholder="科目"
        ></el-cascader>
      </div>
      <div class="sub_center" v-infinite-scroll="sub_scroll" style="overflow:auto" >



                <el-tree
          :data="subject_tree"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          check-on-click-node
          :props="defaultProps"
          @check-change='changeitem'
          >
        </el-tree>


      </div>
      
      <!-- <div slot="footer">
        <el-button
          type="danger"
          @click="cancle_data"

          class="send_cancle"
        >取消</el-button>

        <el-button
          type="primary"
          @click="confrm_data"
          class="send_confrm"
        >确定</el-button>
      </div> -->


      </div>
    </div>

    <div class="CLassIndex_Right">
      <!-- 教师头部信息 -->
      <div class="CLassIndex_Right_Top">
        <div class="CLassIndex_Right_Top_Left">
          <el-image :src="HeadImage" fit="cover">
            <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
          </el-image>
          <div class="CLassIndex_Right_Top_Msg">
            <p>{{UserInfo.name}}</p>
            <!-- <p class="ResetLogin"  >退出登录</p> -->

            <!-- <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        设置<i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1" >清空缓存</el-dropdown-item>
          <el-dropdown-item command="0" >退出登录</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown> -->
          </div>
        </div>

        <!-- <el-button type="primary" @click="SeeSubject" >教材目录</el-button> -->

      </div>
       <!-- 时间筛选 -->
        <!-- <el-date-picker
          v-model="time_value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy/MM/dd"
        ></el-date-picker> -->

    

      <!-- 标题 -->
      <div class="ListTitle">
        <p class="ListTitle_now_data"  >备课列表</p>
        </div>

      <!-- 列表内容 -->

      <div
        class="ListView"
        v-infinite-scroll="load"
        style="overflow:auto"
      >
        <!-- <el-scrollbar  class="scroll_view"> -->
        <div
          class="ListItem"
          v-for="item in (tab_index==0?list_data:teachlist)"
          :key="item.plid"
          @click="TOExamList(item.plid,item.class_id)"
        >
          <div>
            <div class="ListParentChildViewTop">
              <p>{{item.acname}}</p>
              <p>{{item.day_time}}</p>
            </div>
            <div class="ListParentChildViewBot">
              <p>{{item.spctitle}}</p>
              <p>{{item.gname+item.cname}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    

      <!-- 章节选择 -->

       <!-- 试题发送 -->

      <el-dialog
        :visible.sync="login_toggle"
        title="提示"
        center
        custom-class="index_dialog"
      >
        <div class="login_view">
          是否退出登录
          
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" class="send_cancle" @click="open_login">取消</el-button>

          <el-button type="primary" class="send_confrm" @click="BackLogin">确定</el-button>
        </span>
      </el-dialog>
     


  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';


export default {
  //import引入的组件需要注入到对象中才能使用
  name: "ClassIndex",
  components: {},
  data() {
    //这里存放数据
    return {
       defaultProps: {
          children: 'children',
          label: 'label'
        },
      is_search:false,
      teachlist:[],
      value: "",
      TabIcon: require("../assets/tab_icon.png"),
      teachIcon: require("../assets/teach.png"),
      teachActionIcon: require("../assets/teach_active.png"),
      classTimeIcon: require("../assets/classtime.png"),
      classTimeActionIcon: require("../assets/classtime_active.png"),
      grade:0,
      websock:null,
      login_toggle:false,
      sub_arr:[],
      sub_value:"",
      HeadImage: "",
      answer_toggle:true,
      sub_toggle:false,
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
      is_post:false,
      is_clear:false,
      now_mouth:'',
      list_data: [],
      ids: [],
      props: { multiple: true },
      subject_arr: [],
      subList:[],
      subject_tree:[],
      push_sub_value:-1,
      cout_num:0,
      websock_view:"",
      tab_index:0
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
      let { list_data, listarr,ids,is_post } = this;
      this.star_time = this.$till.get_time(Date.parse(val), "Y/M/01");
      this.end_time = this.getMonthDay(val);
      this.value = this.$till.get_time(Date.parse(val), "Y/M/D");
      this.now_mouth=this.$till.get_time(Date.parse(val), "M")
      this.is_search=true
      if (
        this.$till.get_time(Date.parse(val), "Y/M") !=
        this.$till.get_time(Date.parse(oldval), "Y/M")
      ) {
        this.list_data = [];
        this.time_arr=this.GetAllMouth(val)
        this.GetPrepareLessonList();
      } else {
        list_data =listarr.filter(item => item.time == this.value);
        this.list_data = list_data;
      }
    },
    ids(val,oldval){
      if(val.length!=oldval.length){
        if(val.length==0){
          this.teachlist=[]
        }else{
        this.get_teach_list()

        }

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
    sub_value(val) {
      let {subList,list_data}=this
      if(subList.length==0)return  
      let num=subList.findIndex(item=>item.id==val)
      let arr=subList[num]
      this.teachlist=[]
      this.subject_tree=this.ChangeSubject_arr(arr.subject_data)
    },
    class_value(val){
      if(val.length==0) return
      let { class_value,class_arr,sub_arr } = this;
      let value=val,subject_data=[]
      sub_arr=[]
      let arr=class_arr.filter(item=>item.value==value)
      arr=arr[0]
      this.grade=arr.gid
      subject_data=arr.subject_data
      for(let i in subject_data){
          sub_arr.push({
            value:subject_data[i].id,
            label:subject_data[i].name
          })
      }
      this.sub_arr=sub_arr
      this.subject_tree=[]
      this.sub_value=""
      this.class_value = value;
      this.teachlist=[]
      this.GetSubject()
    },
    push_sub_value(val){
       let {subList}=this
       if(subList.length==0||val==-1)return
      let num=subList.findIndex(item=>item.id==val)
      let arr=subList[num]
      this.subject_tree=this.ChangeSubject_arr(arr.subject_data)
      this.sub_value=val.toString()

    },
    
  },
  //方法集合
  methods: {
    sub_scroll(){

    },
    change_tab(){
      
      let index=this.tab_index
      if(index==0){
        index=1
        this.teachlist=[]
        this.init_sub_data()
      }else{
        index=0
      }
      this.tab_index=index
    },

   async handleCommand(command){
      if(command==0){
          this.BackLogin()
      }else{
       
      }
    },
    open_login(){
      let {login_toggle}=this
      this.login_toggle=!login_toggle
    },
   async clear_data(){
       localStorage.setItem("user_local","")
         
       await this.GetUserInfo()
       await this.set_user_local()
       await this.GetPrepareLessonList()
       
    },

   

    initWebSocket (token) {
      let websock=this.$store.state.websocket
      let self=this
      if(websock==null){
         // ws地址 -->这里是你的请求路径
      var ws=  `wss://wss.imofang.cn:1818/?token=${token}`;
      websock = new WebSocket(ws)
      websock.onmessage = function (e) {
         console.log(e.data)
        let data=JSON.parse(e.data)
        if(data.hasOwnProperty('response_msg')){
        }else{
           self.$store.dispatch('change_web_type',data.msg.mode)
        }
      }
      websock.onclose = function (e) {
         console.log("websocket关闭")
        self.$store.dispatch('change_web_num',0)
        //  判断重连
        self.open_web()
       
        
      }
      websock.onopen = function () {
        console.log("websocket开启")
        self.$store.dispatch('change_web_num',1)
      }

      // 连接发生错误的回调方法
      websock.onerror = function () {
        console.log('WebSocket连接发生错误')
        self.$store.dispatch('change_web_num',0)
          //  判断重连
        self.open_web()
      }
      this.$store.dispatch('change_websocket',websock)
      this.websock_view=websock
      }
 
},

    clear_screen(){
      this.$refs.tree.setCheckedKeys([]);
      this.confrm_data()
    },
    open_web(){
      let self=this
         // 重连
        if(self.$route.name=="Census"){
          self.$store.dispatch('change_websocket',null)
           self.$post("user_info", "/?c=api", {}).then(res => {
        
          self.initWebSocket(res.ws_token)
          });
        }
    },
    // 获取选中数据
    confrm_data(){
      
    },

    // 取消
    // cancle_data(){
    //   this.sub_toggle=false
    //   this.push_sub_value=-1
    // },
    // 设置默认选择项
    init_sub_data(){
      let {list_data,class_arr}=this
      if(list_data.length==0){
      this.grade=class_arr[0].gid
      this.class_value=class_arr[0].value
      this.sub_value=""
      this.subject_tree=[]

      }else{
        list_data=list_data[0]
      this.grade=list_data.gid
      this.class_value=list_data.class_id
      this.push_sub_value=list_data.subject_id
      }
      
      
      
    },
    // 查看备课记录
    // SeeSubject(){
    //   let {sub_toggle}=this
    //   this.init_sub_data()
    // },

    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    handleChangeClass() {
      let { class_value} = this;
      let value=class_value.join(",")
      this.class_value = value;
    },

    handleChangeSub(){
      let { sub_value } = this;
      this.sub_value = sub_value.join(",");
    },
    // 
    TOExamList(plid, class_id) {
     this.$store.dispatch('change_class_id',class_id)
      this.$router.push({
        name: "ExamList",
        query: { plid: plid, class_id: class_id }
      });
    },
    BackLogin() {

      if(this.websock_view!=''){
        this.websock_view.close()

      }
      this.open_login()
      this.$store.dispatch('change_websocket',null)
      localStorage.setItem("token", "");
      localStorage.setItem("user_local","")
      this.$router.replace({ name: "Login"});
      

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
        this.initWebSocket(res.ws_token)
        // this.init_web(res.ws_token)

        let { belong_data, subject_data } = res;
        this.$store.dispatch("change_sid", res.sid);
        this.$store.dispatch("change_org_id", res.org_id);
        this.HeadImage = this.$till.change_file_url(res.avatar);
        for (let i in belong_data) {
          class_arr.push({
            value: belong_data[i].id,
            label: belong_data[i].name,
            gid:belong_data[i].gid,
            subject_data:belong_data[i].subject_data
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

    ChangeSubject_arr(data) {
      for (let i in data) {
        data[i].label = data[i].name;
        data[i].value = data[i].id;
        if (data[i].hasSubList) {
          data[i].children = this.ChangeSubject_arr(data[i].subList);
        }
      }

      return data;
    },
    // 获取章节信息
    async GetSubject() {
      let { UserInfo,grade,class_value,push_sub_value } = this;
      let jarr = await this.$post("chapter_list", "/?c=api", {
          grade: grade,
          class: class_value
        });
      this.subList=jarr.data
      if(push_sub_value!=-1){
        this.sub_value= push_sub_value.toString() 
      }
    },
    isNowYear(){
      let {value}=this
      let now_year=this.$till.get_time(Date.parse(new Date()), "Y")
      let value_year=this.$till.get_time(value, "Y")
      return now_year==value_year
      
    },
    set_user_local(){
      let {UserInfo}=this
      let user_local_data=localStorage.getItem("user_local")
      let now_time=Date.parse(new Date())
       let udata={
        sid:UserInfo.sid,
        page_data:[],
        local_time: Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)) 
      }
      if(user_local_data){
        user_local_data=JSON.parse(user_local_data)
        if(now_time>udata.local_time){
          
        localStorage.setItem("user_local","")
        }
      }else{
        localStorage.setItem("user_local",JSON.stringify(udata))
      }
    },
    changeitem(data){
       let ids_arr=this.$refs.tree.getCheckedKeys()
        this.ids=ids_arr
    },

    async get_teach_list(){
      let {
        UserInfo,
        class_value,
        star_time,
        end_time,
        ids,
        value,
        list_data,
        time_arr,
        is_clear,
        is_search
      } = this;
      await this.$post("module_api", "/?c=api", {
        module_tag: "gfteachingplan",
        module_action: "get_prepare_lesson_list",
        org_id: UserInfo.org_id,
        staff_id: UserInfo.sid,
        class_id: class_value,
        chapters: ids.join(","),
        begin_date: "",
        end_date: ""
      }).then(res=>{

         let listarr = res.data;
        let is_now_year=this.isNowYear()
        if (listarr.length) {
          for (let i in listarr) {
            listarr[i].time = this.$till.get_time(
              listarr[i].ptime * 1000,
              "Y/M/D"
            );
            if(is_now_year){
                listarr[i].day_time =this.$till.get_time(
              listarr[i].ptime * 1000,
              "M-D h:m"
            )
            }else{
              listarr[i].day_time =this.$till.get_time(
              listarr[i].ptime * 1000,
              "Y-M-D h:m"
            )
            }
          }
        }
        this.teachlist = listarr;

      })
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
        is_clear,
        is_search
      } = this;
      
      await this.$post("module_api", "/?c=api", {
        module_tag: "gfteachingplan",
        module_action: "get_prepare_lesson_list",
        org_id: UserInfo.org_id,
        staff_id: UserInfo.sid,
        class_id: class_value,
        chapters: "",
        begin_date: star_time,
        end_date: end_time
      }).then(res => {
        let listarr = res.data;
        let is_now_year=this.isNowYear()
        if (listarr.length) {
          for (let i in listarr) {
            listarr[i].time = this.$till.get_time(
              listarr[i].ptime * 1000,
              "Y/M/D"
            );
            if(is_now_year){
                listarr[i].day_time = this.$till.get_time(
              listarr[i].ptime * 1000,
              "h:m"
            );
            }else{
              listarr[i].day_time =this.$till.get_time(
              listarr[i].ptime * 1000,
              "Y-M-D h:m"
            )
            }
          }
          
          list_data = listarr.filter(item => item.time == value);
        }
        for(let i in time_arr){
          time_arr[i].data=listarr.filter(item => item.time == time_arr[i].day)
        }
        this.time_arr=time_arr
        this.listarr = listarr;
        this.list_data =list_data;
      });
    }
  },


  //生命周期 - 创建完成（可以访问当前this实例）
  async created() {
    let {class_arr}=this
    if(class_arr.length!=0)return
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
    await this.set_user_local()
    let user_local_data= JSON.parse(localStorage.getItem("user_local"))
    
    if(user_local_data.is_file_leave){
      let {plid,class_id}=user_local_data.query
      this.$store.dispatch('change_class_id',class_id)
      this.$router.push({
        name: "ExamList",
        query: { plid: plid, class_id: class_id }
      });
      user_local_data.is_file_leave=false
      user_local_data.query={}
      localStorage.setItem("user_local",JSON.stringify(user_local_data))

    }

    await this.GetPrepareLessonList();
    
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后\
  beforeRouteLeave(to, from, next) {
        // 设置下一个路由的 meta
        if(to.name=="Login"){
           this.$store.dispatch('change_keep_alive', []) 
          this.$destroy();
        }else{
           this.$store.dispatch('change_keep_alive', ['ClassIndex'])
        }
        next();
    },
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {
  }, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style >
/* //@import url(); 引入公共css类 */
/* @import url('../style/style.css'); */
 .is-selected {
  color: #1989fa !important;
}
.el-calendar{
  width: 724px;
}
.CLassIndex .el-checkbox__inner{
  border: 2px solid #DCDFE6;
}
.class_tab_view{
 width:80px;
height:424px;
background:rgba(255,255,255,1);
border-radius:0px 15px 15px 0px;
border:1px solid rgba(216,216,216,1);
margin-right: 35px;
margin-top: 170px;
}
.class_tab_view>div{
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.class_tab_view>div:nth-child(1){
border-radius:0px 15px 0px 0px;
}
.class_tab_view>div:nth-child(2){
border-radius:0px 0px 15px 0px;
}
.class_tab_view>div p{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  font-size: 28px;
}
.class_tab_view>div p span{
  margin-top: 5px;
}
.class_tab_view .el-image{
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
}
.class_tab_view_active{
  background: #545DFF;
  color: #fff;
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
  padding: 80px 75px 0px 0px;
  box-sizing: border-box;
  height: 100vh;
}
.CLassIndex_Left {
  width: 857px;
  display: flex;
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
.CLassIndex_Right_Top .el-image {
  width: 120px;
  height: 120px;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  margin-right: 19px;
}
.image-slot{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
[class*=" el-icon-"], [class^=el-icon-]{
  font-size: 30px;
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
  margin-bottom: 10px;
}
/* .CLassIndex_Right_Top_Msg p:nth-child(2) {
  font-size: 24px;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
} */
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
  justify-content: space-between;
  padding-left: 14px;
  font-size: 30px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 30px;
  margin-left: 86px;
}
.ListTitle_all_data{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ListTitle_all_data>div p:nth-child(2){
  color: #545dff;
  margin-left: 30px;
}
.ListTitle_all_data_left{
  display: flex;
  align-items: center;
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
  border:1px solid #F0F0F0
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
  min-height: 50vh;
}
.ListView::-webkit-scrollbar,.sub_center::-webkit-scrollbar {
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
.sub_center{
  max-height: 80vh;
}
.sub_center .el-tree-node__content{
  height: auto;
  margin-bottom: 15px;
}
 .el-dialog{
  margin-top: 0vh !important;
  border-radius: 15px !important;
}
.el-dialog__wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 40px !important;
  height:40px !important;
}
.login_view{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;

}
.ListParentChildViewTop p:nth-child(2) {
  font-size: 28px;
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
.CLassIndex  .send_cancle{
 width: 180px;
  height: 72px;
  font-size: 24px !important ;
}
.CLassIndex .send_confrm{
     width: 180px;
  height: 72px;
  font-size: 24px !important ;
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
.sub_list_title{
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  margin-left: 30px;
}
/* .el-tag .el-icon-close{
  width: 10px;
  height: 10px;
} */

.CLassIndex_Right_Top .el-button{
  height: 70px;
  width: 200px;
  margin-left: 20px;
  border-radius: 5px;
  font-size: 32px;
}

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
  font-size: 24px;
  font-weight: 400;
  color: rgba(164, 169, 255, 1);
}
.picker_view {
  display: flex;
  align-items: center;
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
 .el-cascader-menu{
  min-width: 350px !important;
}
.el-cascader-node {
  height: 90px !important;
  font-size: 30px !important;
  font-weight: normal !important;
}
.el-cascader-node.in-active-path {
  font-weight: normal !important;
}
.el-cascader-node.is-active {
  font-weight: normal !important;
}
.el-cascader-node__label {
  padding-left: 30px !important;
}
.el-cascader-menu__wrap{
  height: 350px !important;
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
.index_dialog{
  width: auto;
}
.index_dialog .el-dialog__title{
  font-size: 33px;
  font-weight: 700;
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
  color: #333;
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
.CLassIndex_Right_Top_Msg .el-dropdown-link{
  width: 100px !important;
  height: 50px !important;
  display: flex;
  align-items: center;
  font-size: 26px !important;
  color:#545DFF !important;
  /* background: #545DFF ; */
  border-radius: 5px !important;
}
.CLassIndex_Right_Top_Msg{

}
.el-dropdown-menu__item{
  height: 90px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px !important;
}
.el-calendar-table td.is-selected{
  /* background: none !important; */
}
.el-backtop, .el-calendar-table td.is-today{
  /* color: #333 !important; */
}
.el-tree-node__content .el-tree-node__label{
  font-size: 26px;
  font-weight: bold;
}
.el-tree-node__children .el-tree-node__label{
  font-size: 24px;
  font-weight: normal;
}
</style>