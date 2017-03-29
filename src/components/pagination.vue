<template>
  <div class="pagination_left" :style="{width:widthPoint+'px'}">
    <div class="head div-item" @click="changePaginationType">
      <span v-if="pagination_type === 1">Mock API<i class="el-icon-d-arrow-left" style="padding-left: 10px"></i></span>
      <span v-else><i class="el-icon-d-arrow-right"></i></span>
    </div>
    <ul :class="[pagination_type === 1 ? 'pagination_normal' : 'pagination_small']">
      <router-link to="/anyproxy">
        <li :class="{ zel: activeTab === 1 }" @click="SET_ACTIVE_TAB(1)">
          <i class="el-icon-menu icon-li"></i><span class="list_title">AnyProxy</span>
        </li>
      </router-link>
      <router-link to="/adminInfo">
        <li :class="{ zel: activeTab === 2 }" @click="SET_ACTIVE_TAB(2)">
          <i class="el-icon-view icon-li"></i><span class="list_title">信息监控</span>
        </li>
      </router-link>
      <router-link to="/dataHub">
        <li :class="{ zel: activeTab === 3 }" @click="SET_ACTIVE_TAB(3),setHubTab()">
          <i class="el-icon-setting icon-li"></i><span class="list_title">拦截设置</span>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import {_getCookie}  from "../javascript/util";

  export default {
    name: "pagination",
    computed: {
      ...mapState(["username", "isLogin", "activeTab", "widthPoint"]),
      widthPoint(){
        return this.pagination_type === 1 ? 180 : 50
      }
    },
    data(){
      return {
        pagination_type: 1,
      }
    },
    methods: {
      ...mapMutations(["SET_ACTIVE_TAB", "SET_DATA_ACTIVE_TAB"]),
      setHubTab(){
        this.SET_DATA_ACTIVE_TAB("1");
      },
      changePaginationType(){
        this.pagination_type = this.pagination_type === 1 ? 0 : 1;
      }
    },
    mounted(){
      if (!_getCookie('login')) {
        this.$router.push('/login');
      }
    }
  }
</script>
