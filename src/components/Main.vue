<template>
  <div class="main_page">
    <pagination></pagination>
    <router-view class="view-page"></router-view>
  </div>
</template>

<script>
  import pagination from './pagination.vue';

  export default {
    components: {
      pagination
    }
  }
</script>
