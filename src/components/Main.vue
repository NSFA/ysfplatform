<template>
  <div class="main_page">
    <pagination></pagination>
    <router-view class="view-page"></router-view>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import pagination from './pagination.vue';

  export default {
    components: {
      pagination
    },
    computed: {
      ...mapState(["isLogin"])
    },
    mounted(){
      if (!this.isLogin) this.$router.push('/login')
    }
  }
</script>
