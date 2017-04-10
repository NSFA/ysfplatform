<template>
  <div class="main_page">
    <pagination></pagination>
    <router-view class="view-page"></router-view>
  </div>
</template>

<script>
  import pagination from '../layout/pagination.vue'
  export default {
    components: {
      pagination
    }
  }
</script>
