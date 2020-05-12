<template>
  <div class='shop'>
      <div>{{reversedMessage.num}}</div>
      <el-button @click="add_a" >add a {{this.$store.state.num}}</el-button>
      <el-button @click="add_b" >add b {{b}}</el-button>
      <el-calendar v-model="value">
      </el-calendar>
       <router-link :to="{ path: '/hello' }" tag="div">hello</router-link>
  </div>
</template>

<script>
export default {
  name: 'shop',
  data(){
    return {
        list:[
            {text:1},
            {text:2},
            {text:3},

        ],
        a:1,
        b:2,
        value:new Date()
    }
  },
  computed : {
    reversedMessage(){
      let obj={
        num:this.$store.state.num*this.b
      }
      return obj
    }
  },
  components: {},
  created(){
      console.log(this.$store.state.num)
       var data = {
                encrypted_data: "mN/sdaasPN/VbwZtsz+jIbOS7kSp8kYYGy2TZc1D31pRty+5wk7uV/iaKQpeuG32G9/WMKXKO6d/chOcEwRF61Jw3H3h/8ch6SOYVrXWpIBnQfqxGOUEqtlpinsun9PQDlexSPOBK8wk4PJ+6xrPb76lvNch6Kom5AVRMgB49pZ+6cPjFsUAr+LRrbe1NCotCOOOhV3IAbGQ7v63IAMJwFKNMQt4EWVQj4QbjNy1ZRCwlDF/0YpdIIxzplx0pIPYsQZMHmLkNSN3P1jdzexGRlfG7m18UqeYbuja63Z9v5CA3Mjymf7OgzU3ii5dlKV31sgVfU411NbnnVcMiNvjNOKedMlNUdntUPcTgcncCy+zKyih0cD8GvfZddwssCZfevqC1y19c6Wcg7kGdZkCtBzW9RrqmC01/vVax6+aSos/7koVDhczmNtwhyawGN/GiXrF1UREPs7BgGFqTQw2AHBGNT+vTI17YrSBgGtYQ/xwoH79JHHrJbgZqgyH73FumeNkfRVWJ+7G8uyROD6WYmxgvWrFa4FSz3C7UUPAVFY=",
                iv: "P8D5GMpRHJURkSNCCkxAjA==",
                jscode: "043Mw93l1X89Lq0aYM2l1Ihh3l1Mw932",
                mode: "wxapp",
                modules:"smartcube",
                token_type:"module",
              }
      this.$get_token("/api?c=api",data).then(res=>{
          console.log(res)
      })

      this.$post("post_list","/api?c=api",{id:151})
      .then(res=>{
        console.log(res)
      })
  },
  mounted(){},
  methods: {
      click_me(e){
          console.log(e)
          console.log(e.srcElement.dataset.text)
      },
      push_me(){
          console.log(21234)
      },
      add_a(){
        this.$store.dispatch('add',10)
      },
       add_b(){
        let b=this.b
        this.b=b+1
      },


  }
}
</script>
<style  >
  .aaa{
    display: flex;
    color: red;
  }
  .el-calendar-table td{
    border: none;
    width: 60px;
  }
  .el-calendar-table .el-calendar-day{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 60px;
    padding: 0;
    margin: 0;
    /* height: auto; */
  }
  .el-calendar-table{
    width: auto;
  }
  .el-calendar-table tr td:first-child{
    border: none;
  }
  .el-calendar-table tr:first-child td{
    border: none;
  }
  .el-calendar-table thead th{
    text-align: center;
  }
  .el-calendar__body{
    padding: 0;
  }
  tbody{
    border: none;
  }
</style>
