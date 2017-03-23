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
      <div class="proxy_switch">
        <span>服务器开启状态</span>
        <el-switch
          v-model="proxy_switch"
          on-text="开启"
          @change="switchChange"
          off-text="关闭">
        </el-switch>
      </div>
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
        hubActiveTab: "hubActiveTab",
        proxy_switch: "proxy_switch"
      }),
    },
    methods: {
      ...mapMutations(["SET_DATA_ACTIVE_TAB", "SET_PROXY_STATE"]),
      setIndex(key, keypath){
        this.SET_DATA_ACTIVE_TAB(keypath[0])
      },
      switchChange(){
        this.SET_PROXY_STATE(!this.proxy_switch);
      },
    }
  }
</script>
