<!-- back -->
<template>
  <div class="html_view"  v-infinite-scroll="html_view_scroll"
              style="overflow:auto" >

       <div v-for="item in content" :key="item.tcid" class="qas_view">
        <p class="exam_list_left_title">{{item.partname}}</p>
        <div v-for="qitem in item.qas" :key="qitem.id">
          <p class="exam_list_left_title_item">{{qitem.title}}</p>
          <div class="html_div" v-html="qitem.content"></div>
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
      content:[{"partname":"分区名称1","count":3,"qas":[{"id":"15935746986390","answers":[{"name":"单选项","type":"1","content":{"options":[{"text":"2","value":"A"},{"text":"3","value":"B"}]},"id":"15935758304220"}],"type":"1","code":"746d0a8b63ec4f1fbba166a933ac2843","content":"<div class=\"p_class\" ><p class=\"p_class\" style=\"margin-bottom:10px\" >aoe</p><p class=\"p_class\" style=\"margin-bottom:10px\" ><div class=\"check_qas_view\"><div class=\"oitem_item\"><span>A</span> <span>2</span></span>\n                 </div><div class=\"oitem_item\"><span>B</span> <span>3</span></span>\n                 </div></div></p></div>","title":"1. XX 测试使用","cjson":[{"text":"aoe","type":"str"},{"text":"*n*","type":"str"},{"s":"1","options":{"A":"2","B":"3"},"type":"qas","af":"","id":"15935758304220"},{"text":"*n*","type":"str"},{"text":"","type":"str"}],"score":"16","num":1},{"id":"15935758961970","answers":[{"name":"单选项","type":"1","content":{"options":[{"text":"11","value":"A"},{"text":"嘴唇","value":"B"}]},"id":"15935759432040"}],"type":"1","code":"7926f065947a440a86f4b1a54634416a","content":"<div class=\"p_class\" ><p class=\"p_class\" style=\"margin-bottom:10px\" >yyy</p><p class=\"p_class\" style=\"margin-bottom:10px\" ><div class=\"check_qas_view\"><div class=\"oitem_item\"><span>A</span> <span>11</span></span>\n                 </div><div class=\"oitem_item\"><span>B</span> <span>嘴唇</span></span>\n                 </div></div></p></div>","title":"2. FF 测试使用","cjson":[{"text":"yyy","type":"str"},{"text":"*n*","type":"str"},{"s":"1","options":{"A":"11","B":"嘴唇"},"type":"qas","af":"","id":"15935759432040"},{"text":"*n*","type":"str"},{"text":"","type":"str"}],"score":"16","num":2},{"id":"15935746232790","answers":[{"name":"单选项","type":"1","content":{"options":[{"text":"nao","value":"A"},{"text":"biàn","value":"B"},{"text":"pá","value":"C"},{"text":"44","value":"D"}]},"id":"15935756257000"}],"type":"1","code":"1a576c87d38345a19b9609eb296dd7d6","content":"<div class=\"p_class\" ><p class=\"p_class\" style=\"margin-bottom:10px\" >电 （脑）（）</p><p class=\"p_class\" style=\"margin-bottom:10px\" ><div class=\"check_qas_view\"><div class=\"oitem_item\"><span>A</span> <span>nao</span></span>\n                 </div><div class=\"oitem_item\"><span>B</span> <span>biàn</span></span>\n                 </div><div class=\"oitem_item\"><span>C</span> <span>pá</span></span>\n                 </div><div class=\"oitem_item\"><span>D</span> <span>44</span></span>\n                 </div></div></p><p class=\"p_class\" style=\"margin-bottom:10px\" ><br/></p></div>","title":"3. FF 测试使用 （电脑）","cjson":[{"text":"电 （脑）（）","type":"str"},{"text":"*n*","type":"str"},{"s":"1","options":{"A":"nao","D":"44","B":"biàn","C":"pá"},"type":"qas","af":"","id":"15935756257000"},{"text":"*n*","type":"str"},{"text":"*n*","type":"str"},{"text":"*n*","type":"str"},{"text":"","type":"str"}],"score":"16","num":3}],"partscore":48}]
    };
  },
   props: {
    list: Array,
    selectValue: Object
 },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
      content(val){
          console.log(val)
      },
  },
  //方法集合
  methods: {
    html_view_scroll(){

    },
    updateIt(){
      this.$emit("updateit") 
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.route_name=this.$route.name
    console.log(123)
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
      console.log(1235745)
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
    height: 50vh;
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
</style>