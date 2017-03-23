<template>
  <div>
    <el-menu theme="dark" :default-active="hubActiveTab" mode="horizontal" @select="setIndex">
      <router-link to="/dataHub/apiList">
        <el-menu-item index="1">API列表</el-menu-item>
      </router-link>
      <router-link to="/dataHub/adminInfo">
        <el-menu-item index="2">AnyProxy界面</el-menu-item>
      </router-link>
      <switchChange></switchChange>
    </el-menu>
    <router-view class="main_content"></router-view>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import switchChange from './switchChange'
  export default{
    components: {
      switchChange
    },
    computed: {
      ...mapState({
        isLogin: "isLogin",
        hubActiveTab: "hubActiveTab"
      }),
    },
    methods: {
      ...mapMutations(["SET_DATA_ACTIVE_TAB"]),
      setIndex(key, keypath){
        this.SET_DATA_ACTIVE_TAB(keypath[0])
      }
    },
  }
</script>
