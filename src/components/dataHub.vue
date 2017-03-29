<template>
  <div>
    <el-menu theme="dark" :default-active="hubActiveTab" mode="horizontal" @select="setIndex">
      <router-link to="/dataHub/reqList">
        <el-menu-item index="1">请求拦截</el-menu-item>
      </router-link>
      <router-link to="/dataHub/apiList">
        <el-menu-item index="2">响应拦截</el-menu-item>
      </router-link>
    </el-menu>
    <router-view class="main_content"></router-view>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  export default{
    computed: {
      ...mapState({
        isLogin: "isLogin",
        hubActiveTab: "hubActiveTab"
      }),
    },
    methods: {
      ...mapMutations(["SET_DATA_ACTIVE_TAB"]),
      /**
       * 简单的设置下active
       * @param key
       * @param keypath
       */
      setIndex(key, keypath){
        this.SET_DATA_ACTIVE_TAB(keypath[0])
      }
    },
  }
</script>
