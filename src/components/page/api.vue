<template>
  <div>
    <el-menu theme="dark" :default-active="hubActiveTab" mode="horizontal" @select="setIndex">
      <template v-for="item in routerMap">
        <router-link :to="item.url">
          <el-menu-item :index="item.index">{{item.name}}</el-menu-item>
        </router-link>
      </template>
    </el-menu>
    <router-view class="main_content"></router-view>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex';
  export default{
    computed: {
      ...mapState({
        hubActiveTab: "hubActiveTab"
      }),
    },
    data(){
      return {
        routerMap: [{
          url: '/api/reqList',
          index: '1',
          name: '请求拦截'
        }, {
          url: '/api/resList',
          index: '2',
          name: '响应拦截'
        }]
      }
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
      },
      /**
       * 初始化Tab
       */
      initTab(){
        const url = location.href.split("#")[1];
        _.forEach(this.routerMap, (item) => {
          if (item.url === url) {
            this.SET_DATA_ACTIVE_TAB(item.index);
            return false;
          }
        })
      }
    },
    mounted(){
      this.initTab();
    }
  }
</script>
