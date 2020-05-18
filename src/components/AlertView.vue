<template>
  <div class='AlertView'  >
      <div class="top" v-for="item in list" :key="item.num" >{{item.text}}</div>

  </div>
</template>

<script>
export default {
  name: 'AlertView',
  data(){
    return {}
  },
   props: {
    list: Array,
    selectValue: Object
 },
  components: {},
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style  >
.AlertView{
    width: 100vw;
    height: 100vh;
    background: red;
        position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
}
</style>
