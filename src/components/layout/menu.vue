<template>
  <div class="menu_left" :style="{width:widthPoint+'px'}">
    <div class="head div-item" @click="changeMenuType">
      <span v-if="menu_type === 1">测试代理平台<i class="el-icon-d-arrow-left" style="padding-left: 10px"></i></span>
      <span v-else><i class="el-icon-d-arrow-right"></i></span>
    </div>
    <ul :class="[menu_type === 1 ? 'menu_normal' : 'menu_small']">
      <template v-for="x in routersMap">
        <el-tooltip class="item" effect="dark" :content="x.name" placement="right" :disabled="menu_type === 1">
          <router-link :to="x.link">
            <li :class="{ zel: activeTab === x.id }" @click="SET_ACTIVE_TAB(x.id)">
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
        return this.menu_type === 1 ? 180 : 50
      }
    },
    data(){
      return {
        menu_type: 1,
        routersMap: [
          {
            id: 1,
            name: '拦截设置',
            link: '/anyproxy',
            icon: 'el-icon-menu'
          }, {
            id: 2,
            name: '信息监控',
            link: '/adminInfo',
            icon: 'el-icon-view'
          }, {
            id: 3,
            name: 'API设置',
            link: '/dataHub',
            icon: 'el-icon-setting'
          }, {
            id: 4,
            name: '使用指南',
            link: '/guide',
            icon: 'el-icon-star-on'
          },
        ]
      }
    },
    methods: {
      ...mapMutations(["SET_ACTIVE_TAB"]),
      changeMenuType(){
        this.menu_type = this.menu_type === 1 ? 0 : 1;
      }
    },
    mounted(){
      if (!_getCookie('login')) {
        this.$router.push('/login');
      }
    }
  }
</script>
