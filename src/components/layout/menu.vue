<template>
  <div class="menu_left" :style="{width:widthPoint+'px'}">
    <div class="head div-item" @click="changeMenuType">
      <span v-if="menu_type">测试代理平台<i class="el-icon-d-arrow-left" style="padding-left: 10px"></i></span>
      <span v-else><i class="el-icon-d-arrow-right"></i></span>
    </div>
    <ul :class="[menu_type? 'menu_normal' : 'menu_small']">
      <template v-for="x in routersMap">
        <el-tooltip class="item" effect="dark" :content="x.name" placement="right" :disabled="!!menu_type">
          <router-link :to="x.link">
            <li :class="{ zel: activeTab === x.id }" @click="setTab(x.id)">
              <i class="icon-li" :class="x.icon"></i><span class="list_title">{{x.name}}</span>
            </li>
          </router-link>
        </el-tooltip>
      </template>
    </ul>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex';
  import {_getCookie}  from "../../javascript/util";
  export default {
    name: "menu_left",
    computed: {
      ...mapState(["isLogin", "activeTab", "widthPoint"]),
      widthPoint(){
        return this.menu_type ? 180 : 50
      }
    },
    data(){
      return {
        menu_type: 1,
        routersMap: [
          {
            id: 1,
            name: '拦截设置',
            link: '/proxy',
            icon: 'el-icon-menu'
          }, {
            id: 2,
            name: '信息监控',
            link: '/monitoring',
            icon: 'el-icon-view'
          }, {
            id: 3,
            name: 'API设置',
            link: '/api',
            icon: 'el-icon-setting'
          }, {
            id: 4,
            name: '使用指南',
            link: '/guide',
            icon: 'el-icon-star-on'
          },
          {
            id: 5,
            name: '更新记录',
            link: '/updateRecord',
            icon: 'el-icon-date'
          }
        ]
      }
    },
    methods: {
      ...mapMutations(["SET_ACTIVE_TAB"]),

      /**
       * 边栏状态
       */
      changeMenuType(){
        this.menu_type = !this.menu_type;
      },

      /**
       * 设置active
       * @param id
       */
      setTab(id){
        this.SET_ACTIVE_TAB(id);
        id === 3 && this.$store.commit('SET_DATA_ACTIVE_TAB', "1");
      },

      /**
       * 初始化active
       */
      initTab(){
        const url = location.href.split("#")[1];
        _.forEach(this.routersMap, (item) => {
          if (url.indexOf(item.link) > -1) {
            this.SET_ACTIVE_TAB(item.id);
            return false;
          }
        })
      }
    },

    mounted(){
      if (!_getCookie('login')) {
        this.$router.push('/login');
        return;
      }
      this.initTab();
    }
  }
</script>
