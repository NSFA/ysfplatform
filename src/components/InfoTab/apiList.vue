<template>
  <div>
    API 列表
    <jsoneditor @getjson="getjson"></jsoneditor>
  </div>
</template>

<script>
  import jsoneditor from '../editor.vue'
  export default{
    components: {
      jsoneditor
    },
    data(){
      return {}
    },
    methods:{
      getjson(info){
       console.log(info)
      }
    }
  }
</script>
