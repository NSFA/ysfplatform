<template>
  <div class="proxy_switch">
    <span>服务器状态</span>
    <el-switch
      v-model="proxy_switch"
      on-text="开启"
      :disabled="loading"
      @change="switchChange"
      off-text="关闭">
    </el-switch>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import {_setServerStatus} from '../javascript/getData'
  export default {
    name: 'switchChange',
    computed: {
      ...mapState({
        proxy_switch: "proxy_switch"
      }),
    },
    data(){
      return {
        loading: false
      }
    },
    methods: {
      ...mapMutations(["SET_PROXY_STATE"]),
      setLoading(methods){
        this.loading = !this.loading;
      },
      switchChange(){
        this.setLoading();
        _setServerStatus({status: !this.proxy_switch}).then((res) => {
          let data = res.data;
          this.setLoading();
          this.SET_PROXY_STATE(data.code === 200 ? !this.proxy_switch : this.proxy_switch)
          this.$notify({
            showClose: true,
            message: data.msg,
            type: data.code === 200 ? 'success' : 'error',
            offset: 50
          });
        })
      }
    }

  }
</script>
