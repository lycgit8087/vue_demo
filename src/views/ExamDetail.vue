<template>
  <div class='ExamDetail'>
      <div class="ExamDetail_left" >
          <back></back>
          <p class="ExamDetail_left_title" >答题卡</p>
          <div class="ExamDetail_left_list" v-infinite-scroll="left_load" style="overflow:auto"  >
              <div v-for="item in 10" :key="item"  >
                  <p>基础知识</p>
                  <div class="ExamDetail_left_list_item" >
                      <p v-for="i in 10" :key="i" >{{i}}</p>
                  </div>

              </div>



          </div>

      </div>
      <div class="ExamDetail_right" v-infinite-scroll="right_load" style="overflow:auto"  >
          

      </div>


  </div>
</template>

<script>
export default {
  name: 'ExamDetail',
  data(){
    return {}
  },
  components: {},
  created(){},
  mounted(){},
  methods: {
      left_load(){

      },
      right_load(){
          
      }

  }
}
</script>
<style  >

.ExamDetail{
    display: flex;
    height: 100vh;
}
.ExamDetail_left{
    width: 702px;
    height: 100vh;
    background: #F8F8FF;
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.ExamDetail_left_title{
font-size:38px;
font-weight:500;
color:rgba(32,32,32,1);
margin-bottom: 50px;
}
.ExamDetail_right{
    width: 1218px;
    height: 100vh;
    padding: 76px 56px;
    box-sizing: border-box;
}
.ExamDetail_left_list{
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
}
.ExamDetail_left_list>div{
    display: flex;
    flex-direction: column;
}
.ExamDetail_left_list>div>p{
font-size:32px;
font-weight:400;
color:rgba(32,32,32,1);
margin-bottom: 27px;
}
.ExamDetail_left_list_item{
    display: flex;
    flex-wrap: wrap;
}
.ExamDetail_left_list_item>p{
    width:76px;
height:76px;
background:rgba(255,255,255,1);
border:2px solid rgba(135,139,148,1);
display: flex;
align-items: center;
justify-content: center;
color: #4B4B4B;
font-size: 34px;
border-radius: 50%;
margin-bottom: 27px;
margin-right: 27px;

}
.ExamDetail_left_list::-webkit-scrollbar,.ExamDetail_right::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
</style>
