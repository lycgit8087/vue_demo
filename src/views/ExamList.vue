<!-- ExamList -->
<template>
  <div class="ExamList" @click.stop="hide_com" >
    <div class="exam_list_left">
      <back @updateit="GetInfo" ></back>
      <p  class="exam_title"  >{{sub_title}}</p>
      <div class="left_view" v-infinite-scroll="left_scroll" style="overflow:auto">
        <div v-for="item in tcontents" :key="item.tcid">
          <p v-if="item.tctype==1&&item.tcorder==0" class="exam_list_left_title">教学过程</p>
          <p v-if="item.tctype==0&&item.tcorder==0" class="exam_list_left_title">教学准备</p>


          <p :class="item.tctype==2?'exam_list_left_title':'exam_list_left_des_text'">{{item.tctitle}}</p>
          <div v-if="item.fcname" class="video_view" >
              <video :src="item.fpath"   controls="controls" ></video>
          </div>
          <div v-html="item.tccontent" @click="htm_check($event)" ></div>
        </div>
      </div>
    </div>
    <div class="exam_list_right" v-infinite-scroll="right_scroll" style="overflow:auto"  >
      <!-- :preview-src-list="getSrcList(index)" -->
      <viewer :images="srcList"           
            class="viewer" ref="viewer"
            @inited="inited" >
           <img v-for="src in srcList" :src="src" :key="src" class="view_image">
      </viewer>

      <!-- <el-button type="primary" @click="scaleIt">放大</el-button>
      <el-button type="primary" @click="smallit">缩小</el-button> -->

      <!-- 附件 -->
      <div class="file_list" v-if="files.length!=0" >
        <p>附件</p>
        <div class="file_list_view"  >
          <!--  -->
          <div class="file_list_view_top"  @click.stop="show_it(index)"   v-for="(item,index) in files" :key="index" >
            <div  class="file_list_view_item"  >
                <div class=" file_list_view_item_child ">
                    <el-image :src="item.url" fit="cover"    v-if="item.type_num==0">
                      
                        <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>

                    </el-image>
                    <!-- @click="see_file(item.fpath,item.type_num)" -->
                    <el-image   :src="item.url" fit="cover"   v-if="item.type_num!=0"  >
                        <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                    </el-image>
                    <p   class="file_name" >{{item.fcname}}</p>
                    <!-- <a   v-if="item.type>2&&item.type!=6" :href="item.fpath" :download="item.fcname" target="_self"  ></a>
                    <p   v-if="item.type==6" class="ppt_view" @click="check_file(item.fpath,item.type_num,item.method_text)" ></p> -->
                </div>
            </div>

            <div class="pos_view" v-show="item.is_show" >
                <p @click.stop="handleCommand(litem.type)" v-for="litem in item.list_arr" :key="litem.text" >{{litem.text}}</p>

            </div>
            </div>
        

        </div>
      </div>

      <!-- 试题 -->
      <div class="exam_list_view" v-if="paper_list.length!=0" >
        <p>试题</p>
        <div class="scroll_view" >
          <div class="exam_list_view_item" v-for="(item,index) in paper_list" :key="item.pid">
            <el-image :src="file_image" fit="cover">
               <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            </el-image>
            <div class="exam_list_view_item_right">
              <p class="exam_list_view_item_right_title">{{item.title}}</p>
              <p class="exam_list_view_item_right_num">共{{item.qcount}}题</p>
              <div class="exam_list_view_item_right_edit">
                <el-button type="primary" @click="SeeIt(item.pid,index)">查看</el-button>
                <el-button type="primary" @click="SendIt(item.pid)">发送</el-button>
                <el-button type="primary" @click="SeeData(item.pid)">数据</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--  查看  -->
      <el-dialog :visible.sync="centerDialogVisible" center>
        <div class="see_dialog_center">
          <span class="see_dialog_center_title">
            {{plist.title}}
          </span>
          <span class="see_dialog_center_text">总分{{plist.count}}分</span>
          <span class="see_dialog_center_tree">共分为{{plist.datalength}}个部分：</span>

          <div class="see_item" v-for="item in plist.content" :key="item.partname">
            <span>{{item.partname}}</span>
            <span>{{item.partscore}}分</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="see" @click="ToExamDetail">点击查看</el-button>
        </span>
      </el-dialog>

      <!-- 试题发送 -->

      <el-dialog
        :visible.sync="send_toggle"
      >
        <div class="send_dialog_center">
          <div class="send_dialog_center_check">
            <span>{{prepare_lesson_data.cname}}</span>
            <el-checkbox v-model="checked" border size="medium">全选</el-checkbox>
          </div>

          <div class="people_view">
            <div
              class="people_view_item"
              v-for="(item,index) in people_arr"
              :key="item.name"
              @click="check_now(index)"
            >
              <div class="people_view_item_image">
                <el-image :src="item.avatar" fit="cover">
                   <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
                </el-image>
                <el-image v-if="item.is_check" :src="CheckedImage">
                   <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
                </el-image>
                <div v-if="!item.is_check" class="image_bg"></div>
              </div>
              <span :class="item.is_check?'action_text':'span_text'">{{item.sname}}</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" class="send_cancle" @click="close_send">取消</el-button>

          <el-button type="primary" class="send_confrm" @click="send_data">发送</el-button>
        </span>
      </el-dialog>

      <!-- 发送成功 -->
      <el-dialog :visible.sync="send_success" :show-close="false">
        <div class="send_success_center">
          <el-image :src="SuccessImage">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <span class="success_text">发送成功</span>
          <el-button type="primary" class="to_see_data" @click="to_see_data">查看数据</el-button>
          <div class="back_index" @click="BackIndex">关闭</div>
        </div>
      </el-dialog>

      <!-- 视频 音频 弹出框 -->
      <el-dialog :visible.sync="file_toggle"  >

        <div class="video_file_view" >
              <video :src="file_url" v-if="file_type==1"  controls="controls" ></video>
              <audio :src="file_url" v-if="file_type==2" controls="controls"  ></audio>
        </div>

      </el-dialog>

    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
  import WordIcon from '../assets/word_icon.png';
  import VideoIcon from '../assets/video_icon.png';
  import PPtIcon from '../assets/ppt_icon.png';
  import ImageIcon from '../assets/image_icon.png';
  import PdfIcon from '../assets/pdf_icon.png';
  import AudioIcon from '../assets/audio_icon.png';
  import XlsIcon from '../assets/xls_icon.png';
  import RarIcon from '../assets/rar_icon.png';





export default {
  //import引入的组件需要注入到对象中才能使用
  name: "ExamList",
  components: {},
  data() {
    //这里存放数据
    return {
      HeadImage: require("../assets/login_img.png"),
      file_image: require("../assets/file.png"),
      loading: true,
      video_url:"",
      file_arr: [
        {text:"jpg,jpeg,gif,png,bmp",url:ImageIcon,type:0,method:"InsertImage",list_arr:[{text:"打开",type:0},{text:"导入",type:1}]},
        {text:"3gpp,mp4,rm,rmvb,avi,3gp,mov,mtv",url:VideoIcon,type:1,method:"InsertVideo",list_arr:[{text:"打开",type:0},{text:"导入",type:1}]},
        {text:"doc,docx",url:WordIcon,type:3,method:"",list_arr:[{text:"下载",type:2}]},
        {text:"pptx,ppt",url:PPtIcon,type:6,method:"ImportPptx",list_arr:[{text:"导入",type:1}]},
        {text:"xlsx,xls",url:XlsIcon,type:3,method:"",list_arr:[{text:"下载",type:2}]},
        {text:"zip,rar",url:RarIcon,type:3,method:"",list_arr:[{text:"下载",type:2}]},
        {text:"pdf",url:PdfIcon,type:3,method:"",list_arr:[{text:"下载",type:2}]},
        {text:"mp3,aac,wma,ogg,m4a,flac,ape,wav,amr",url:AudioIcon,type:2,method:"InsertAudio",list_arr:[{text:"打开",type:0},{text:"导入",type:1}]},
      ],
      srcList:[],
      class_name:"",
      aa:123,
      centerDialogVisible: false,
      CheckedImage: require("../assets/check_it.png"),
      SuccessImage: require("../assets/send_success.png"),
      people_arr: [],
      list_arr: 6,
      see_list: [
        { text: "基础知识", num: 46 },
        { text: "基础知识1", num: 40 },
        { text: "基础知识2", num: 16 },
        { text: "基础知识3", num: 6 }
      ],
      files:[],
      paper_list: [],
      pid:0,
      prepare_lesson_data:{},
      plist:{
      },
      file_obj:{},
      file_type:0,
      class_id:0,
      send_toggle: false,
      tcontents: [],
      send_success: false,
      checked: true,
      send_loading: false,
      plid: 0,
      sub_title:"",
      file_toggle:false,
      file_index:0
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    checked() {
      let { people_arr } = this;
      let has_check = people_arr.filter(item => item.is_check == false);
      if (has_check.length) {
        for (let i in people_arr) {
          people_arr[i].is_check = true;
        }
      } else {
        for (let i in people_arr) {
          people_arr[i].is_check = false;
        }
      }
      this.people_arr = people_arr;
    },
    file_toggle(val){
      if(val==false){
        this.file_url=""
      }

    }
  },
  //方法集合
  methods: {
    show_it(index){
      index=parseInt(index)
      let {files}=this
      for(let i in files){
        files[i].is_show=false
        
      }
      for(let i in files){
        if( parseInt(i)==index){
        files[index].is_show=!files[index].is_show
          
        }
      }
    

      this.file_obj=files[index]
      this.file_index=index
      this.files=files
      this.$forceUpdate()
      
    },
    hide_com(){
        let {files,file_index}=this
        for(let i in files){
           files[i].is_show=false

        }
          this.files=files
          this.$forceUpdate()
        
     
    },
    handleCommand(command){
      let {files,file_obj,file_index}=this
      files[file_index].is_show=false
      this.files=files
      this.$forceUpdate()
      if(command==0&&file_obj.type_num==0){
        this.show_image(file_index)
      }else if(command==0&&(file_obj.type_num==1||file_obj.type_num==2)){
        this.see_file(file_obj.fpath,file_obj.type_num)
      }else if(command==1){
        this.check_file(file_obj.fpath,file_obj.type_num,file_obj.method_text)
      }else if(command==2&&file_obj.type_num>2) {
        var a = document.createElement('a');
            a.target = "_self";
            a.href =file_obj.fpath ;
            a.click();
      }
    },
   
    htm_check(e){
      if(e.target.tagName=="IMG"){
        let srcList=[e.target.src]
        this.srcList=srcList
      this.viewer.view(0)
        
      }
    },
    inited (viewer) {
      this.viewer = viewer
    },
    show_image(index){
      let {files,srcList}=this
      let image_arr=files.filter(item=>item.ftype==0)
      if(srcList.length!=image_arr.length){
        srcList=[]
       for(let i in image_arr){
          srcList.push(image_arr[i].fpath)
        }
        this.srcList=srcList
      }
      

      this.viewer.view(index)
   
    },

    see_file(url,type){
      let {files}=this

      if(type==6){
        this.check_file(url,type,"ImportPptx")
      }else{
        if(type==1||type==2){
          this.file_type=type
        this.file_toggle=true
        this.file_url=url
        }
        
      }
      

    },

    check_file(url,type,method_text){
       if(method_text=="")return
      let user_local_data= JSON.parse(localStorage.getItem("user_local"))
      let {plid,class_id}=this
      let query={
        plid,
        class_id
      }
      user_local_data.is_file_leave=true
      user_local_data.query=query
      localStorage.setItem("user_local",JSON.stringify(user_local_data))
      
     
      if(method_text=="ImportPptx"){
           window.external.InvokeMethod(JSON.stringify({
          method:method_text,
          args:JSON.stringify({
            url:url
          })
      }))
      }else{
           window.external.InvokeMethod(JSON.stringify({
          method:method_text,
          args:JSON.stringify({
            url:url,
            top:100,
            left:100
          })
      })) 
      }
      // 关闭窗口
      window.external.InvokeMethod(JSON.stringify({ "method": "CloseWindow" }))
    },

     scaleIt(){
       window.external.InvokeMethod(JSON.stringify({
          "method": "ResizeBrowserWindow", 
          "args": JSON.stringify({
             "frameWidth": 1920,
              "frameHeight": 1080, 
              "resizeDirection":
               "topLeftBottomRight"
              })}))
    },
    smallit(){
         window.external.InvokeMethod(JSON.stringify({
        method:"ResizeBrowserWindow",
        args:JSON.stringify({
          frameWidth:600,
          frameHeight:500,
          resizeDirection:"topLeftBottomRight"
        })
      }))
    },

    getSrcList(index){
      return this.srcList.slice(index).concat(this.srcList.slice(0,index))
    },

   async GetStudent(){
     let {class_id}=this
     let {org_id,url}=this.$store.state
     
        await this.$post("module_api", "/?c=api", {
          module_tag: "mclass",
        module_action: "student_lists",
        org_id: org_id,
        class_id: class_id,
      }).then(res=>{
        let list=res.data
        for(let i in list){
          list[i].avatar=url+list[i].avatar
          list[i].is_check=true
        }
        this.people_arr=list
      })
    },

    
   async SeeIt(pid,index) {
      this.pid=pid
      let data=this.$till.get_local(this.$route.name,this.$route.query.plid)
      if( JSON.stringify(data.paper_list[index].plist)!="{}" ){
         this.plist=data.paper_list[index].plist
         this.centerDialogVisible = true;
      }else{
        await this.$post("paper_list", "/?c=api", {
         pids:pid
      }).then(res=>{
        let plist=res.data
        if(plist.length){
          plist=plist[0]
         
          let count=0
          if(plist.content.length){
            for(let i in plist.content){
              count+=plist.content[i].partscore
            }
          }
          plist.count=count
          plist.datalength=plist.content.length

        }
        data.paper_list[index].plist=plist
        localStorage.setItem("user_local",JSON.stringify(this.$till.set_local(this.$route.name,this.$route.query.plid,data))) 
        this.plist=plist
      })
      this.centerDialogVisible = true;
      }
    },
   async SendIt(pid) {
     let {people_arr,}=this
     if(people_arr.length==0){

     await this.GetStudent()//获取学生列表

     }
      this.pid=pid
      this.send_toggle = true;
    },
    left_scroll(){

    },
    right_scroll(){

    },
    SeeData(id) {
      this.$router.push({ name: "Census",query:{pid:id} });
    },
    ToExamDetail(){
      let {pid}=this
      this.centerDialogVisible=false
      this.$router.push({ name: "ExamDetail",query:{pid:pid} });

    },
    to_see_data() {
        let {pid,people_arr}=this
      this.send_success=false

      this.$router.push({ name: "Census",query:{pid:pid} });

    },
    async GetInfo() {
      let { plid,file_arr } = this;
      await this.$post("module_api", "/?c=api", {
        module_tag: "gfteachingplan",
        module_action: "get_prepare_lesson",
        plid: plid
      }).then(res => {
        let { tcontents, prepare_lesson_data, files, paper_list } = res.data;
        let content_arr=[]
        for (let i in tcontents) {
          
          tcontents[i].tccontent =  this.$till.htmlspecialchars_decode(
            tcontents[i].tccontent
          );
          if(tcontents[i].fcname){
            tcontents[i].fpath= this.$till.change_file_url(tcontents[i].fpath)
          }
        }
        let type_zore=tcontents.filter(item=>item.tctype==0)
        let type_one=tcontents.filter(item=>item.tctype==1)
        let type_two=tcontents.filter(item=>item.tctype==2)
        let Image_arr=files.filter(item=>item.ftype==0)

        let srcList=[]
        tcontents=[...type_two,...type_zore,...type_one]
        for(let i in tcontents){

        }
        for(let i in files){
          files[i].fpath=this.$till.change_file_url(files[i].fpath)

          let fname=files[i].fpath.substring(files[i].fpath.lastIndexOf(".")+1,files[i].fpath.length)
          let num =file_arr.findIndex(item=>item.text.indexOf(fname)!=-1)
          
          files[i].url=file_arr[num].url
          files[i].type_num=file_arr[num].type
          files[i].method_text=file_arr[num].method
          files[i].list_arr=file_arr[num].list_arr
          files[i].is_show=false

        }
        this.tcontents = tcontents;
        this.sub_title=prepare_lesson_data[0].acname
        this.prepare_lesson_data=prepare_lesson_data[0]
        for(let i in Image_arr){
          srcList.push(Image_arr[i].fpath)
        }
        for(let i in paper_list){
          paper_list[i].plist={}
        }
        this.srcList=srcList
        this.files=files
        this.paper_list=paper_list
        let page_data={
          srcList:srcList,
          files:files,
          paper_list:paper_list,
          prepare_lesson_data:this.prepare_lesson_data,
          sub_title:this.sub_title,
          tcontents:this.tcontents,
        }
       localStorage.setItem("user_local",JSON.stringify(this.$till.set_local(this.$route.name,this.$route.query.plid,page_data)))  
      });
    },



    // 推送试题
    check_now(index) {
      let { people_arr } = this;
      people_arr[index].is_check = !people_arr[index].is_check;
      this.people_arr = people_arr;
    },
    send_data() {
      let {pid,people_arr}=this
      this.send_loading = true;
      let people_ids=[]
      for(let i in people_arr){
        if(people_arr[i].is_check){
          people_ids.push(people_arr[i].sid)
        }
      }
      this.$post("paper_push", "/?c=api", {
        pid: pid,
        students: people_ids.join(","),
      }).then(res => {
         this.send_loading = false;
        this.close_send();
        this.send_success = true;
      });
    },
    BackIndex() {
      this.send_success=false
      // this.$router.replace({ name: "ClassIndex" });
    },
    close_send() {
      this.send_toggle = !this.send_toggle;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
   let is_local=this.$till.user_local(this.$route.name,this.$route.query.plid)
    this.plid = this.$route.query.plid;
    this.class_id=this.$route.query.class_id;
   if(!is_local){
    this.GetInfo();//获取备课详情
   }else{
     let data=this.$till.get_local(this.$route.name,this.$route.query.plid)
     let {srcList,files,paper_list,prepare_lesson_data,sub_title,tcontents}=data
     this.srcList=srcList
     this.paper_list=paper_list
     this.files=files
     this.prepare_lesson_data=prepare_lesson_data
     this.sub_title=sub_title
     this.tcontents=tcontents
   }
    
   
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    
    
    
  },

  beforeRouteLeave(to, from, next) {
        // 设置下一个路由的 meta
        if(to.name=="ExamDetail"||to.name=="Census"){
          this.$store.dispatch('change_keep_alive', ['ClassIndex',"ExamList"])
        }else{
          this.$store.dispatch('change_keep_alive', ['ClassIndex'])
        }
        next();
    },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {
  }, //生命周期 - 销毁完成
  activated() {
  } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style >
/* //@import url(); 引入公共css类 */
/* @import url('../style/index.css'); */
.el-button--small,
.el-button--small.is-round {
  width: 576px;
  height: 94px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  font-size: 32px;
}
.el-message-box {
  width: auto;
}
.video_file_view video{
  width: 100%;
  height: 50vh;
}
.video_file_view audio{
  width: 100%;
}
.p_class{
  font-size: 26px !important;
  margin-bottom: 10px !important;
  line-height: 2;
}
.span_class{
  line-height:2 !important;
  font-size: 26px !important;

}
.ExamList {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: space-between;
}
.msg_text {
  color: rebeccapurple;
}
.exam_list_left {
  width: 1118px;
  height: 100%;
  background: #f8f8ff;
  padding: 100px 100px 30px 20px;
  box-sizing: border-box;
}
.exam_list_right {
  display: flex;
  padding: 54px 0px;
  width: 732px;
  height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
}
.file_list {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.el-tree-node > .el-tree-node__children {
  overflow: visible !important;
}

.file_list > p {
  font-size: 32px;
  font-weight: 500;
  color: rgba(0, 3, 54, 1);
  margin-bottom: 40px;
}
.file_list_view {
  display: flex;
  flex-wrap: wrap;
}
.file_list_view_item {
  display: flex;
  flex-direction: column;
  /* margin-right: 70px; */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  /* width: 25%; */
  position: relative;
  padding: 0 10px;
  box-sizing: border-box;
  /* height: 120px; */
}
.file_list_view_item>span{
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.file_name{
  width: 100%;
  text-align: center;
  font-size: 30px;
  white-space: normal;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;

}
.file_list_view_item a{
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.file_list_view_item .el-image {
  width: 54px;
  height: 54px;
  margin-bottom: 40px;
}
.exam_list_view {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  width: 100%;
}
.exam_list_view > p {
  font-size: 32px;
  font-weight: 500;
  color: rgba(0, 3, 54, 1);
  margin-bottom: 50px;
}

/* .file_list_view>span{
  display: flex;
  flex-wrap: wrap;
} */
.scroll_view {
  height: auto;
  width: 702px;
}
.scroll_view::-webkit-scrollbar ,.left_view::-webkit-scrollbar,.exam_list_right::-webkit-scrollbar{
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.exam_list_view_item {
  height: 200px;
  display: flex;
  /* width: 540px; */
  border-bottom: 2px solid #ecedf1;
  margin-bottom: 50px;
}
.exam_list_view_item .el-image {
  width: 61px;
  height: 61px;
  margin-right: 36px;
}
.exam_list_view_item_right {
  display: flex;
  flex-direction: column;
}
.exam_list_view_item_right_title {
  font-size: 25px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.exam_list_view_item_right_num {
  font-size: 22px;
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
  margin-top: 15px;
}
.ppt_view{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.exam_list_view_item_right_edit {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
}
.exam_list_view_item_right_edit .el-button {
  width: 90px;
  height: 50px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 9px;
  margin-right: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px !important;
}
.file_list_view_item_child{
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  height: 100%;
  width: 100%;
}
.el-button + .el-button {
  margin-left: 0 !important;
}
.exam_list_left .exam_list_left_title {
  font-size: 38px !important;
  font-weight: bold !important;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 30px;
  margin-top: 20px;
}
.exam_list_left_des_text{
  font-size: 30px;
  margin-bottom: 30px;
  margin-top: 30px;
  font-weight: 700;

}
.exam_list_left_text {
  font-size: 32px;
  font-weight: 500;
  color: rgba(32, 32, 32, 1);
}
.see {
  width: 576px;
  height: 94px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 18px;
  font-size: 32px !important;
}
.see_dialog_center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.see_dialog_center > span {
  width: 100%;
}
.see_dialog_center_title {
  font-size: 43px;
  font-weight: 500;
  color: rgba(13, 13, 13, 1);
  line-height: 61px;
  margin-bottom: 70px;
  display: flex;
  justify-content: center;
}
.see_dialog_center_text {
  font-size: 32px;
  font-weight: 400;
  color: rgba(13, 13, 13, 1);
  margin-bottom: 50px;
}
.see_dialog_center_tree {
  font-size: 32px !important;
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
  margin-bottom: 72px;
}
.el-dialog__headerbtn .el-dialog__close {
  font-size: 40px !important;
}
.see_item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 400;
  color: rgba(100, 100, 100, 1);
}
.send_cancle {
  width: 180px;
  height: 72px;
  /* background:rgba(253,104,125,1); */
  box-shadow: 0px 9px 27px 0px rgba(253, 104, 125, 0.3);
  border-radius: 9px;
  font-size: 24px !important;
  margin-right: 27px;
}
.send_confrm {
  width: 180px;
  height: 72px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 9px;
  font-size: 24px !important;
}
.send_dialog_center {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  box-sizing: border-box;
}
.exam_title{
  display: flex;
  width: 100%;
  font-size: 32px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-weight: bold;
}
.send_dialog_center_check {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}
.send_dialog_center_check > span {
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 32, 32, 1);
}
.el-dialog__body {
  padding-top: 50px;
}
.left_view {
  height: 85vh;
  padding-left: 20px;
  box-sizing: border-box;
}
/* .el-checkbox__inner{
  width: 30px;
  height: 30px;
}
.el-checkbox__inner::after{
   width: 5px;
  height: 5px;
} */
.send_dialog_center .el-checkbox__label {
  font-size: 24px;
}
.send_dialog_center .el-checkbox.is-bordered.el-checkbox--medium {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: auto;
}
.send_dialog_center .people_view {
  display: flex;
  flex-wrap: wrap;
}
.people_view_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  margin-right: 50px;
}
.people_view_item > span {
  font-size: 24px;
  font-weight: 400;
}
.people_view_item_image {
  display: flex;
  align-items: center;
  height: 90px;
  width: 90px;
  border-radius: 50%;
  position: relative;
  margin-bottom: 20px;
  justify-content: center;
}
.people_view_item_image .el-image:nth-child(1) {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  background: rgba(216, 216, 216, 0.4);
}
.file_list_view_top{
  width: 25%;
  position: relative;
}
.pos_view{
  width: 90%;
  position: absolute;
  border: 1px solid #f3f3f3;
  right: 0;
  top: 100%;
  border-radius: 10px;
  z-index: 5555;
  background: #fff;
  transform: translate(0%,-20%);
}
.pos_view>p{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #202020;
  

}
.pos_view::after{
    content: "";
    width: 0;
    height: 0;
  
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #f3f3f3;
    /* border-top-width: 0;
    border-bottom-color: #ebeef5; */
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translate(-50%,0%);
}
.people_view_item_image .el-image:nth-child(2) {
  width: 43px;
  height: 43px;
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translate(-50%, 0%);
}
.image_bg {
  width: 90px;
  height: 90px;
  background: rgba(216, 216, 216, 0.4);
  position: absolute;
  z-index: 66;
  border-radius: 50%;
}
.action_text {
  color: #202020;
}
.video_view{
  width: 100%;
  margin-bottom: 20px;

}
.video_view video{
  width: 50%;
}

.span_text {
  color: #878b94;
}
.send_success_center {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.send_success_center .el-image {
  width: 352px;
  height: 345px;
  margin-bottom: 10px;
}
.success_text {
  font-size: 43px !important;
  font-weight: 500;
  color: rgba(0, 173, 86, 1);
  margin-bottom: 88px !important;
}
.to_see_data {
  width: 576px;
  height: 94px;
  box-shadow: 0px 9px 27px 0px rgba(84, 93, 255, 0.3);
  border-radius: 18px;
  font-size: 32px !important;
}
.back_index {
  font-size: 32px;
  font-weight: 500;
  color: rgba(135, 139, 148, 1);
  display: flex;
  align-items: center;
  height: 94px;
  margin-top: 30px;
}
.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label {
  font-size: 30px !important;
}
.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__inner {
  width: 30px !important;
  height: 30px !important;
}
.el-checkbox__inner::after {
  height: 13px !important;
  width: 13px !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: rotate(45deg) scaleY(1.5) !important;
}
.view_image{
  display: none;
}
</style>