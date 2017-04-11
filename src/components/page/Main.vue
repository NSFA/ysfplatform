<template>
  <div class="main_page">
    <menu_left></menu_left>
    <router-view class="view-page"></router-view>
  </div>
</template>

<script>
  import menu_left from '../layout/menu.vue'
  export default {
    components: {
      menu_left
    }
  }
</script>
