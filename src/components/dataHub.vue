<template>
  <div>
    <el-menu theme="dark" :default-active="hubActiveTab" mode="horizontal" @select="setIndex">
      <router-link to="/dataHub/userInfo">
        <el-menu-item index="1">客户信息</el-menu-item>
      </router-link>
      <router-link to="/dataHub/adminInfo">
        <el-menu-item index="2">管理员信息</el-menu-item>
      </router-link>
      <router-link to="/dataHub/terminalInfo">
        <el-menu-item index="3">终端信息</el-menu-item>
      </router-link>
      <router-link to="/dataHub/unknowInfo">
        <el-menu-item index="4">未识别人员信息</el-menu-item>
      </router-link>
      <router-link to="/dataHub/analyzeInfo">
        <el-menu-item index="5">分析结果</el-menu-item>
      </router-link>
      <router-link to="/dataHub/pictureInfo">
        <el-menu-item index="6">图片表</el-menu-item>
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
