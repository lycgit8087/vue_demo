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

</style>
