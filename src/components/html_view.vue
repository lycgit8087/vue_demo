<!-- back -->
<template>
  <div class="html_view"  v-infinite-scroll="html_view_scroll"
              style="overflow:auto" >
      <p class="html_view_title" >{{title}}</p>
      <p class="html_view_des" >{{des}}</p>

       <div v-for="item in content" :key="item.tcid" class="qas_view">
        <p class="exam_list_left_title">{{item.partname}}</p>
        <div v-for="qitem in item.qas" :key="qitem.id">
          <p class="exam_list_left_title_item">{{qitem.title}}</p>
          <div class="html_div" v-html="qitem.content"></div>
          <div class="right_text" >
            <span class="right_text_left" >【正确答案】：</span>
            <p class="right_text_right" > <span v-for="(aitem,aindex) in qitem.answers" :key="aindex" >{{aitem.ranswer}}</span> </p>
          </div>

           <div class="right_text" >
            <span class="right_text_left" >【解析】：</span>
            <p class="right_text_right"  v-html="qitem.qri" ></p>
          </div>
        </div>
      </div>
      
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: "Back",
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
      default:0
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
          if(val.length==0)return
          
           val=this.info(val)
          console.log(val)

      },
  },
  //方法集合
  methods: {
    html_view_scroll(){

    },
     // 设置正确或者错误
    set_class(params) {
      let { exam_num, plist_arr, right_data, local_data } = this;
      let new_select_arr = [],
        new_success_arr = [];
      (new_select_arr = params.select_answer),
      (new_success_arr = params.success_answer);
      
      let answer_data = plist_arr[exam_num].answers;
      // 选择
      // 正确

      // 答案项

      for (let l in answer_data) {
        let type = answer_data[l].type;
        if (type == 1) {
          //单选题
          let select_arr = new_select_arr.filter(item => item.type == 1);
          let success_arr = new_success_arr.filter(item => item.type == 1);

          let c_arr = $(`.check_qas_view_one`);
          for (let i = 0; i < c_arr.length; i++) {
            for (let j in select_arr) {
              for (let o in success_arr) {
                if (
                  select_arr[j].child_id == c_arr[i].id &&
                  success_arr[o].child_id == c_arr[i].id
                ) {
                  // 用户没有选择
                  if (select_arr[j].value.length == 0) {
                    //   let s_arr = plist_arr[exam_num].answers.filter(
                    //   item => item.id == select_arr[j].child_id
                    // );
                    // let s_num = s_arr[0].content.options.findIndex(
                    //   item => item.value == success_arr[o].value
                    // );
                    // c_arr[i].childNodes[s_num].className =
                    //   "oitem_item_none rborder_class";
                  } else {
                    let s_arr = plist_arr[exam_num].answers.filter(
                      item => item.id == select_arr[j].child_id
                    );
                    let num = select_arr[j].num
                      ? select_arr[j].num
                      : s_arr[0].content.options.findIndex(
                          item => item.value == select_arr[j].value
                        );
                    // 用户有选择
                    if (select_arr[j].value == success_arr[o].value) {
                      c_arr[i].childNodes[num].className =
                        "oitem_item_none rborder_class";
                    } else {
                      c_arr[i].childNodes[num].className =
                        "oitem_item_none eborder_class";
                      let s_num = s_arr[0].content.options.findIndex(
                        item => item.value == success_arr[o].value
                      );
                      c_arr[i].childNodes[s_num].className =
                        "oitem_item_none rborder_class";
                    }
                  }
                }
              }
            }
          }
        } else if (type == 2) {
          //多选题
          let select_arr = new_select_arr.filter(item => item.type == 2);
          let success_arr = new_success_arr.filter(item => item.type == 2);
          let c_arr = $(`.check_qas_view_more`);

          let new_select_arr_push = [],
            new_success_arr_push = [];
          // 用户选择
          for (let i in select_arr) {
            select_arr[i].num = select_arr[i].num.split(",");
            select_arr[i].value = select_arr[i].value.split(",");
            for (let j in select_arr[i].value) {
              new_select_arr_push.push({
                type: type,
                child_id: select_arr[i].child_id,
                value: select_arr[i].value[j],
                num: select_arr[i].num[j]
              });
            }
          }
          // 正确答案
          // 用户选择
          for (let i in success_arr) {
            success_arr[i].num = success_arr[i].num.split(",");
            success_arr[i].value = success_arr[i].value.split(",");
            for (let j in success_arr[i].value) {
              new_success_arr_push.push({
                type: success_arr[i].type,
                child_id: success_arr[i].child_id,
                value: success_arr[i].value[j],
                num: success_arr[i].num[j]
              });
            }
          }

          select_arr = new_select_arr_push;
          success_arr = new_success_arr_push;

          // 多选题加载
          for (let p = 0; p < c_arr.length; p++) {
            for (let j in select_arr) {
              for (let o in success_arr) {
                if (
                  select_arr[j].child_id == c_arr[p].id &&
                  success_arr[o].child_id == c_arr[p].id
                ) {
                  // 用户没有选择
                  if (select_arr[j].value.length == 0) {
                    //   let s_arr = plist_arr[exam_num].answers.filter(
                    //   item => item.id == select_arr[j].child_id
                    // );
                    // let s_num = s_arr[0].content.options.findIndex(
                    //   item => item.value == success_arr[o].value
                    // );
                    // c_arr[i].childNodes[s_num].className =
                    //   "oitem_item_none rborder_class";
                  } else {
                    let s_arr = plist_arr[exam_num].answers.filter(
                      item => item.id == select_arr[j].child_id
                    );
                    let num = select_arr[j].num
                      ? select_arr[j].num
                      : s_arr[0].content.options.findIndex(
                          item => item.value == select_arr[j].value
                        );
                    if (select_arr[j].value == success_arr[o].value) {
                      c_arr[p].childNodes[num].className =
                        "oitem_item_none rborder_class";
                    } else {
                      c_arr[p].childNodes[num].className =
                        "oitem_item_none eborder_class";

                      let s_num = s_arr[0].content.options.findIndex(
                        item => item.value == success_arr[o].value
                      );
                      c_arr[p].childNodes[s_num].className =
                        "oitem_item_none rborder_class";
                    }
                  }
                }
              }
            }
          }
        } else if (type == 3) {
          //填空题
          let select_arr = new_select_arr.filter(item => item.type == 3);
          let success_arr = new_success_arr.filter(item => item.type == 3);

          for (let i in select_arr) {
            for (let j in success_arr) {
              if (select_arr[i].child_id == success_arr[j].child_id) {
                if (select_arr[i].value.length == 0) {
                  // let child_id = success_arr[i].child_id;
                  // $(`#${child_id}`)[0].value = success_arr[j].value;
                } else {
                  if (select_arr[i].value == success_arr[j].value) {
                    let child_id = select_arr[i].child_id;
                    $(`#${child_id}`)[0].value = success_arr[j].value;
                    $(`#${child_id}`)[0].className = "rclass";
                  } else {
                    let child_id = select_arr[i].child_id;
                    $(`#${child_id}`)[0].value = select_arr[i].value;
                    $(`#${child_id}`)[0].className = "eclass";
                  }
                }
              }
            }
          }
        } else if (type == 4) {
          //连线题
          let select_arr = new_select_arr.filter(item => item.type == 4);
          let success_arr = new_success_arr.filter(item => item.type == 4);

          for (let i in select_arr) {
            for (let j in success_arr) {
              if (select_arr[i].child_id == success_arr[j].child_id) {
                let c_id = select_arr[i].child_id;
                let select_l_data = select_arr[i].line_data;
                let success_l_data = success_arr[j].line_data;

                var c = document.getElementById(`${c_id}_myCanvas`);

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
                      } else {
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
        }
      }
    },
    updateIt(){
      this.$emit("updateit") 
    },
    info(data){
      let {content_type}=this
      console.log(content_type)
      let plist_arr =[]
      let plist=[
        {content:data}
      ]
      let num=0
      for(let p in plist){

          for(let i in plist[p].content){
      for (let j in plist[p].content[i].qas) {
          
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
              if (
                plist[p].content[i].qas[j].answers[k].type == 1 ||
                plist[p].content[i].qas[j].answers[k].type == 2
              ) {
                for (let o in plist[p].content[i].qas[j].answers[k].content
                  .options) {
                    let ranswer=plist[p].content[i].qas[j].answers[k].ranswer,
                        uanswer=plist[p].content[i].qas[j].answers[k].uanswer,
                        options_value=plist[p].content[i].qas[j].answers[k].content.options[o].value,
                         is_class_change=0
                        if(uanswer.length==0){
                          is_class_change=0
                        }else{
                          if(uanswer==options_value){
                          is_class_change=ranswer==uanswer?1:2
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
                    html_text += `<div class="oitem_item_none ${is_class_change==0?'':is_class_change==1?'rborder_class':'eborder_class'} " data-type='${plist[p].content[i].qas[j].answers[k].type}' ><span>${plist[p].content[i].qas[j].answers[k].content.options[o].value}</span> <img src="${plist[p].content[i].qas[j].answers[k].content.options[o].url}"></img></span>
                 </div>`;
                  } else {
                    html_text += `<div class="oitem_item_none ${is_class_change==0?'':is_class_change==1?'rborder_class':'eborder_class'} " data-type='${plist[p].content[i].qas[j].answers[k].type}' ><span>${plist[p].content[i].qas[j].answers[k].content.options[o].value}</span> <span>${plist[p].content[i].qas[j].answers[k].content.options[o].text}</span></span>
                 </div>`;
                  }
                }
                let allhtml = `<div class="check_qas_view ${
                  plist[p].content[i].qas[j].answers[k].type == 2
                    ? "check_qas_view_more"
                    : "check_qas_view_one"
                } " id="${
                  plist[p].content[i].qas[j].answers[k].id
                }">${html_text}</div>`;
                plist[p].content[i].qas[j].content = plist[p].content[i].qas[
                  j
                ].content.replace(
                  `卍${plist[p].content[i].qas[j].answers[k].id}卍`,
                  allhtml
                );
              } else if (plist[p].content[i].qas[j].answers[k].type == 3) {
                plist[p].content[i].qas[j].content = plist[p].content[i].qas[
                  j
                ].content.replace(
                  `卍${plist[p].content[i].qas[j].answers[k].id}卍`,
                  `<input id='${plist[p].content[i].qas[j].answers[k].id}' data-type='${plist[p].content[i].qas[j].answers[k].type}'  data-aformat="${plist[p].content[i].qas[j].answers[k].content.aformat}"  disabled  class='exam_input' value="" >`
                );
              } else if (plist[p].content[i].qas[j].answers[k].type == 4) {
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
                    plist[p].content[i].qas[j].answers[k].id
                  }" data-type='${
                    plist[p].content[i].qas[j].answers[k].type
                  }' >${
                    top_arr[i].value.indexOf("img:") != -1
                      ? `<img src='${this.$till.change_file_url(
                          top_arr[g].value.substring(5)
                        )}'>`
                      : `<span>${top_arr[g].value}</span>`
                  }</p>`;
                  right_html += `<p data-sort="${g}" class="right_${g}_${
                    plist[p].content[i].qas[j].answers[k].id
                  }" data-type='${
                    plist[p].content[i].qas[j].answers[k].type
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

                canvas_html = ` <div class=" Connection_view_center Connection_view_center_${plist[p].content[i].qas[j].answers[k].id}" data-id="${plist[p].content[i].qas[j].answers[k].id}"  data-type='${plist[p].content[i].qas[j].answers[k].type}'  > <canvas id="${plist[p].content[i].qas[j].answers[k].id}_myCanvas"   ></canvas> </div>  `;
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
                  `卍${plist[p].content[i].qas[j].answers[k].id}卍`,
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
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  >
/* //@import url(); 引入公共css类 */
.html_view::-webkit-scrollbar {
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
  min-width: 50vw;
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
  align-items: center;
  margin-bottom: 15px;

}
.right_text_left{
  font-size: 24px;
  color: #545DFF;
  margin-right: 10px;
}
.right_text_right{
  font-size: 24px;
  color: #202020;
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
</style>