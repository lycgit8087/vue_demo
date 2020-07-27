<!-- back -->
<template>
  <div class="html_view" ref="html_scroll"  v-infinite-scroll="html_view_scroll"
              style="overflow:auto" >
      <p class="html_view_title" v-if="title" @click="scroll_it" >{{title}}</p>
      <p class="html_view_des" v-if="des" >{{des}}</p>

       <div v-for="item in content" :key="item.tcid" class="qas_view">
        <p class="exam_list_left_title" v-if="item.partname" >{{item.partname}}</p>
        <div v-for="qitem in item.qas" :key="qitem.id" :id="qitem.id" >
          <p class="exam_list_left_title_item" v-if="qitem.title&&content_type!=4" >{{qitem.title}}</p>
          <div class="html_div" v-html="qitem.content"></div>
          <div class="right_text" v-if="content_type==1" >
            <span class="right_text_left" >【正确答案】：</span>
            <p class="right_text_right" > <span v-for="(aitem,aindex) in qitem.answers" :key="aindex" >{{aitem.ranswer}}</span> </p>
          </div>

           <div class="right_text" v-if="content_type==1" >
            <span class="right_text_left"  >【解析】：</span>
            <p class="right_text_right"  v-html="qitem.qri" ></p>
          </div>
        </div>
      </div>
      
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import $ from "jquery";

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "html_view",
  components: {},
  data() {
    //这里存放数据
    return {
      backIcon: require("../assets/back_icon.png"),
      indexIcon: require("../assets/index_icon.png"),
      route_name:"",
      is_change:false,
    };
  },
   props: {
    content:{
      type:Array,
      default() {
        return []
      }
    },
    content_type:{
      type:Number,
      default:0//  0:只是显示    1:显示解析以及做题情况  2:显示做题情况  3:单题显示
    },
    content_num:{
      type:Number,
      default:0//  0:只是显示    1:显示解析以及做题情况  2:显示做题情况  3:单题显示
    },
    des:{
      type:String,
      default() {
        return ""
      }
    },
    title:{
      type:String,
      default() {
        return ""
      }
    }
 },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
      content(val){
        let {content_type}=this
          if(val.length==0)return
           val=this.info(val)
           if(content_type==0){
             this.return_data()
           }else if(content_type==2||content_type==1){
             setTimeout(()=>{
             this.set_class()

             },500)
           }

      },
  },
  //方法集合
  methods: {
    html_view_scroll(){

    },
    scroll_it(id){

      document.getElementById(`${id}`).scrollIntoView({block: "start", behavior : "smooth"})

    },
     // 设置正确或者错误
    set_class(params) {
      let { content } = this;
      let select_arr =[] ;
          let success_arr = [];
          console.log(content)
      for(let i in content){
        for(let j in content[i].qas){
          for(let q in content[i].qas[j].answers){
            let type=content[i].qas[j].answers[q].type
            if(type==4){
              let id=content[i].qas[j].answers[q].id,
                 left_line_data=[],right_line_data=[],
                  uanswer=content[i].qas[j][`uanswer_${id}`],
                  answer=content[i].qas[j][`answer_${id}`];
               let  uanswer_arr=uanswer.split(","),
                    answer_arr=answer.split(",")
                    // 正确选择
                    for(let a in answer_arr){
                      let all_line=answer_arr[a].split("")
                        let o_arr=all_line.filter((item,index)=>index!=0)

                        left_line_data.push({value:all_line[0],text:o_arr.join(",")})

                    }
                    success_arr.push({
                      child_id:id,
                      line_data:left_line_data
                    })
                

                  // 用户选择

                    for(let u in uanswer_arr){
                      let all_line=uanswer_arr[u].split("")
                        let o_arr=all_line.filter((item,index)=>index!=0)
                        let f_arr=all_line.filter((item,index)=>index==0)
                        right_line_data.push({value:f_arr.join(","),text:o_arr.join(",")})

                    }
                    select_arr.push({
                      child_id:id,
                      line_data:right_line_data
                    })
                    }else if(type==2){
                      let ranswer=content[i].qas[j].answers[q].ranswer.split(","),
                          uanswer=content[i].qas[j].answers[q].uanswer.split(","),
                          id=content[i].qas[j].answers[q].id;
                          if(uanswer.length!=0){
                            let c_arr = $(`.check_qas_view_more`);
                        for(let v=0;v<c_arr.length;v++){
                          if(c_arr[v].id==id){
                            for(let u in uanswer ){
                              let num=ranswer.findIndex(item=>item==uanswer[u])
                              if(num!=-1){
                                let value_num=content[i].qas[j].answers[q].content.options.findIndex(item=>item.value==uanswer[u])
                                
                                c_arr[v].childNodes[value_num].className =
                        "oitem_item_none rborder_class"

                              }else{
                                let value_num=content[i].qas[j].answers[q].content.options.findIndex(item=>item.value==uanswer[u])
                                c_arr[v].childNodes[value_num].className =
                        "oitem_item_none eborder_class"
                              }
                              
                            }

                          }
                        }

                          }
                
                    }
              
            }
            
          }
        }
        // console.log(success_arr)
        // console.log(select_arr)
      

          //连线题
          

          for (let i in select_arr) {
            for (let j in success_arr) {
              if (select_arr[i].child_id == success_arr[j].child_id) {
                let c_id = select_arr[i].child_id;
                let select_l_data = select_arr[i].line_data;
                let success_l_data = success_arr[j].line_data;

                var c = document.getElementById(`${c_id}_myCanvas`);
                let all_canvas= $("canvas")
               
                let view_width = $(`.Connection_view_center_${c_id}`)[0]
                    .clientWidth,
                  view_height = $(`.Connection_view_center_${c_id}`)[0]
                    .clientHeight;
                c.width = view_width;
                c.height = view_height;
                var canvas = c.getContext("2d");
                let color_text = "#000",
                  left_top = 0,
                  right_top = 0;
                for (let k in select_l_data) {
                  for (let l in success_l_data) {
                    if (select_l_data[k].value == success_l_data[l].value) {
                      if (select_l_data[k].text == success_l_data[l].text) {
                        color_text = "green";
                        
                        left_top =
                          $(`.left_${k}_${c_id}`).position().top +
                          $(`.left_${k}_${c_id}`)[0].clientHeight / 2;
                        right_top =
                          $(
                            `.right_${parseInt(
                              success_l_data[parseInt(l)].text
                            ) - 1}_${c_id}`
                          ).position().top +
                          $(
                            `.right_${parseInt(
                              success_l_data[parseInt(l)].text
                            ) - 1}_${c_id}`
                          )[0].clientHeight /
                            2;
                        this.draw_line(
                          canvas,
                          view_width,
                          left_top,
                          right_top,
                          color_text
                        );
                      } else if(select_l_data[k].text.length!=0) {
                        color_text = "red";
                        left_top =
                          $(`.left_${k}_${c_id}`).position().top +
                          $(`.left_${k}_${c_id}`)[0].clientHeight / 2;
                        right_top =
                          $(
                            `.right_${parseInt(
                              select_l_data[parseInt(k)].text
                            ) - 1}_${c_id}`
                          ).position().top +
                          $(
                            `.right_${parseInt(
                              select_l_data[parseInt(k)].text
                            ) - 1}_${c_id}`
                          )[0].clientHeight /
                            2;
                        this.draw_line(
                          canvas,
                          view_width,
                          left_top,
                          right_top,
                          color_text
                        );
                      }
                    }
                  }
                }
              }
            }
          }
      
    },
    updateIt(){
      this.$emit("updateit") 
    },
    return_data(){
      let {content}=this
      this.$emit("get_data",content) 

    },
     draw_line(canvas, width, left_top, right_top, color) {
      canvas.beginPath();
      canvas.lineCap = "round";
      canvas.strokeStyle = color;
      canvas.lineWidth = 3;
      canvas.fillStyle = color;
      canvas.moveTo(0, left_top);
      canvas.lineTo(width, right_top);
      canvas.stroke();
    },
    info(data){
      let {content_type,content_num}=this
      console.log(data)
      let plist_arr =[],plist=[]
         plist_arr =[]
        plist=[
        {content:data}
      ]
      let num=content_num==0?1:content_num
      
      for(let p in plist){

          for(let i in plist[p].content){
      for (let j in plist[p].content[i].qas) {
        if(content_type==1){
          plist[p].content[i].qas[j].qri=this.$till.htmlspecialchars_decode(plist[p].content[i].qas[j].qri)
        }
            plist[p].content[i].qas[j].title =
              num + ". " + plist[p].content[i].qas[j].title;
            plist[p].content[i].qas[j].num = num;
            plist[p].content[i].qas[j].step = [
              i,
              j,
              plist[p].content[i].qas[j].num - 1
            ].join(",");
            num++;
            plist[p].content[i].qas[
              j
            ].content = this.$till.htmlspecialchars_decode(
              plist[p].content[i].qas[j].content
            );
            for (let k in plist[p].content[i].qas[j].answers) {
              let html_text = "";
              let is_class_change=0,
                  type_num=plist[p].content[i].qas[j].answers[k].type,
                 answer_id=plist[p].content[i].qas[j].answers[k].id,
                 ranswer="",uanswer="";
              if (
                 type_num== 1 ||type_num == 2
              ) {
                
                for (let o in plist[p].content[i].qas[j].answers[k].content
                  .options) {
                    if(content_type==1){
                     ranswer= plist[p].content[i].qas[j][`answer_${answer_id}`]
                        uanswer=plist[p].content[i].qas[j][`uanswer_${answer_id}`]
                       let options_value=plist[p].content[i].qas[j].answers[k].content.options[o].value;
                        if(uanswer.length==0){
                          is_class_change=0
                        }else{
                          if(uanswer==options_value){
                          is_class_change=ranswer==uanswer?1:2
                          }else{
                          is_class_change=0

                          }
                        }

                        if(type_num==2){
                          if(uanswer.length==0){
                              is_class_change=0
                          }else{
                            let r_arr=ranswer.split(","),u_arr=uanswer.split(",")
                            for(let r in r_arr){
                              for(let u in u_arr){
                                if(u_arr[u]==options_value&&r_arr[r]==options_value){
                                  if(r_arr[r]==u_arr[u]){
                                  is_class_change=1

                                  }else{
                                  is_class_change=2

                                  }
                                }
                              }
                            }

                          }
                        }
                    }
                       
                  if (
                    plist[p].content[i].qas[j].answers[k].content.options[
                      o
                    ].text.indexOf("img:") != -1
                  ) {
                    plist[p].content[i].qas[j].answers[k].content.options[
                      o
                    ].url = this.$till.change_file_url(
                      plist[p].content[i].qas[j].answers[k].content.options[
                        o
                      ].text.substring(5)
                    );
                    html_text += `<div class="oitem_item_none ${is_class_change==0?'':is_class_change==1?'rborder_class':'eborder_class'} " data-type='${type_num}' ><span>${plist[p].content[i].qas[j].answers[k].content.options[o].value}</span> <img src="${plist[p].content[i].qas[j].answers[k].content.options[o].url}"></img></span>
                 </div>`;
                  } else {
                    html_text += `<div class="oitem_item_none ${is_class_change==0?'':is_class_change==1?'rborder_class':'eborder_class'} " data-type='${type_num}' ><span>${plist[p].content[i].qas[j].answers[k].content.options[o].value}</span> <span>${plist[p].content[i].qas[j].answers[k].content.options[o].text}</span></span>
                 </div>`;
                  }
                }
                let allhtml = `<div class="check_qas_view ${
                  type_num == 2
                    ? "check_qas_view_more"
                    : "check_qas_view_one"
                } " id="${
                  answer_id
                }">${html_text}</div>`;
                plist[p].content[i].qas[j].content = plist[p].content[i].qas[
                  j
                ].content.replace(
                  `卍${answer_id}卍`,
                  allhtml
                );
              } else if (type_num == 3) {//填空题
                if(content_type==1){
                  
                   ranswer= plist[p].content[i].qas[j][`answer_${answer_id}`]
                      uanswer=plist[p].content[i].qas[j][`uanswer_${answer_id}`]
                        if(uanswer.length==0){
                          is_class_change=0
                        }else{
                          is_class_change=ranswer==uanswer?1:2
                         
                        }
                }
               
                plist[p].content[i].qas[j].content = plist[p].content[i].qas[
                  j
                ].content.replace(
                  `卍${answer_id}卍`,
                  `<input id='${answer_id}' class= " exam_input ${is_class_change==0?'':is_class_change==1?'rclass':'eclass'}" data-type='${type_num}'  data-aformat="${plist[p].content[i].qas[j].answers[k].content.aformat}"  disabled   value="${uanswer}" >`
                );
              } else if (type_num == 4) {
                let line_html = "",
                  all_line_html = "",
                  left_html = "",
                  right_html = "",
                  canvas_html = "";
                let top_arr =
                  plist[p].content[i].qas[j].answers[k].content.options;
               
                let left_arr = [],
                  right_arr = [];
                for (let g in top_arr) {
                  left_arr.push({
                    value:
                      top_arr[g].value.indexOf("img:") != -1
                        ? this.$till.change_file_url(
                            top_arr[g].value.substring(5)
                          )
                        : top_arr[g].value,
                    num: g
                  });
                  left_html += `<p data-sort="${g}" class="left_${g}_${
                    answer_id
                  }" data-type='${
                    type_num
                  }' >${
                    top_arr[i].value.indexOf("img:") != -1
                      ? `<img src='${this.$till.change_file_url(
                          top_arr[g].value.substring(5)
                        )}'>`
                      : `<span>${top_arr[g].value}</span>`
                  }</p>`;
                  right_html += `<p data-sort="${g}" class="right_${g}_${
                    answer_id
                  }" data-type='${
                    type_num
                  }' >${
                    top_arr[i].text.indexOf("img:") != -1
                      ? `<img src='${this.$till.change_file_url(
                          top_arr[g].text.substring(5)
                        )}'>`
                      : `<span>${top_arr[g].text}</span>`
                  }</p>`;

                  right_arr.push({
                    value:
                      top_arr[g].text.indexOf("img:") != -1
                        ? this.$till.change_file_url(
                            top_arr[g].text.substring(5)
                          )
                        : top_arr[g].text,
                    num: g
                  });
                }
                 canvas_html = ` <div class=" Connection_view_center Connection_view_center_${plist[p].content[i].qas[j].answers[k].id}" data-id="${plist[p].content[i].qas[j].answers[k].id}"  data-type='${plist[p].content[i].qas[j].answers[k].type}'  > <canvas id="${plist[p].content[i].qas[j].answers[k].id}_myCanvas"  data-it="${plist[p].content[i].qas[j].answers[k].id}"   ></canvas> </div>  `;
                left_html = `<div class="Connection_view_left" data-id="${plist[p].content[i].qas[j].answers[k].id}" data-type='${plist[p].content[i].qas[j].answers[k].type}' >${left_html}</div>`;
                right_html = `<div class="Connection_view_right" data-id="${plist[p].content[i].qas[j].answers[k].id}" data-type='${plist[p].content[i].qas[j].answers[k].type}' >${right_html}</div>`;
                line_html = `<div class="Connection_view" data-id="${
                  plist[p].content[i].qas[j].answers[k].id
                }" data-type='${
                  plist[p].content[i].qas[j].answers[k].type
                }' >${left_html + canvas_html + right_html}</div>`;
                
                plist[p].content[i].qas[j].answers[k].left_arr = left_arr;
                plist[p].content[i].qas[j].answers[k].right_arr = right_arr;
                plist[p].content[i].qas[j].answers[k].line_list = [];

                plist[p].content[i].qas[j].content = plist[p].content[i].qas[
                  j
                ].content.replace(
                  `卍${answer_id}卍`,
                  line_html
                );
                
              }
            }

            
            plist[p].content[i].qas[j].content = plist[p].content[i].qas[
              j
            ].content.replace(/卍.*?卍/g, "");

            plist_arr.push(plist[p].content[i].qas[j]);
          }
          }
           }
           
          return plist
    },
    
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.route_name=this.$route.name
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let {content,content_type}=this
   this.info(content)
   if(content_type==0){
     this.return_data()
   }

  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {
    
  }, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  >
/* //@import url(); 引入公共css类 */
.html_view::-webkit-scrollbar,.Connection_view::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.html_view{
    width: 100%;
    max-height: 100vh;
    padding-top: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.html_view_title{
  font-size: 0.197917rem;
    font-weight: 400;
    color: rgba(32, 32, 32, 1);
    margin-bottom: 0.135417rem;
    width: 100%;
    text-align: center;
    margin-top: 30px;
}
.html_view_des{
      font-size: 0.151042rem;
    font-weight: 400;
    color: rgba(135, 139, 148, 1);
    margin-bottom: 0.130208rem;
    width: 100%;
    text-align: center;
}
.oitem_item_none {
  display: flex;
  min-width: 500px;
  min-height: 74px;
  background: rgba(255, 255, 255, 1);
  border-radius: 9px;
  border: 4px solid rgba(189, 189, 189, 1);
  margin-bottom: 19px;
  font-size: 25px;
  padding: 10px 0;
  box-sizing: border-box;
  padding-right: 10px;
  align-self: flex-start;
}
.oitem_item_none span:nth-child(1) {
  width: 68px;
  border-right: 4px solid #bdbdbd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #545dff;
  margin-right: 10px;
}
.oitem_item_none span:nth-child(2) {
  padding: 0 30px;
  box-sizing: border-box;
}
.oitem_item_none img {
  max-width: 90%;
}
.check_qas_view {
  /* width: 50vw; */
  margin-top: 50px;
  display: flex;
  flex-direction: column;
}

.exam_list_left_title {
  font-size: 32px;
  font-weight: bold;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 18px;
}
.exam_list_left_title_item{
  /* padding-left: 15px; */
  box-sizing: border-box;
  font-size: 28px;
  font-weight: 600;
  color: rgba(32, 32, 32, 1);
  margin-bottom: 20px;
  margin-top: 10px;
}
.right_text{
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;

}
.exam_input{
      display: inline-block;
    border: 2px solid #bdbdbd;
    width: 200px;
    padding: 5px 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 25px;
    margin: 0 10px;
    text-align: center;
    font-weight: 700;
    color: #000;
}
.right_text_left{
  font-size: 24px;
  color: #545DFF;
  margin-right: 10px;
  width: 200px;
  line-height: 2;
}
.right_text_right{
  font-size: 24px;
  color: #202020;
  line-height: 2;
  width: 800px;

}
.right_text_right span{
  margin-right: 15px;
}
.eborder_class {
  border: 8px solid #fa6060 !important;
  box-sizing: border-box;
}
.rborder_class {
  border: 8px solid #00ad56 !important;
  box-sizing: border-box;
}
.Connection_view {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 40px;
  overflow-y: scroll;
  /* position: relative; */
}
.Connection_view img {
  max-width: 200px;
  max-height: 200px;
}
.Connection_view_center {
  width: 100%;
  display: flex;
  justify-content: space-between !important;
  flex-direction: row !important;
  position: relative;
}
.Connection_view_center p {
  opacity: 0;
}
.Connection_view_center > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
canvas {
  display: block;
  position: absolute;

  /* pointer-events: none; */
  top: 0;
  left: 0;
  z-index: 6;
  width: 100%;
  height: 100%;
}
.Connection_view > div,
.Connection_view_center_right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.Connection_view_left > p,
.Connection_view_center_left > p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  box-sizing: border-box;
  font-size: 40px;
}

.eclass {
  font-size: 40px;
  color: #fa6060 !important ;
  font-weight: bold;
  box-sizing: border-box;
}
.rclass {
  font-size: 40px;
  color: #00ad56 !important;
  box-sizing: border-box;
}
.bot_view div {
  width: 407px;
  height: 126px;
  border-radius: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 43px;
}

.Connection_view_right > p,
.Connection_view_center_right > p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  box-sizing: border-box;
  font-size: 40px;
}
.Connection_view_left > p span,
.Connection_view_center_left > p span,
.Connection_view_right > p span,
.Connection_view_center_right > p span {
  height: 90px;
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>