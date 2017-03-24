<template>
  <div class="main_page">
    <pagination></pagination>
    <router-view class="view-page"></router-view>
  </div>
</template>

<script>
  import pagination from './pagination.vue'
  import {_getInfo} from '../javascript/getData'
  import {mapMutations} from 'vuex'
  export default {
    components: {
      pagination
    },
    methods:{
      ...mapMutations(['SET_INIT_INFO'])
    },
    mounted(){
      /**
       * 初始化服务器状态
       */
      _getInfo().then((res) => {
        let data = res.data && res.data.result;
        this.SET_INIT_INFO(data)
      })
    }
  }
</script>
