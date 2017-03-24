<template>
  <div>
    <el-menu theme="dark" default-active="1" mode="horizontal">
      <el-menu-item index="1">AnyProxy设置</el-menu-item>
      <switchChange></switchChange>
    </el-menu>
    <div class="main_content">
      <div class="proxy_form">
        <el-form :model="proxy_form" :rules="rules" ref="proxy_form" label-width="200px">
          <el-form-item label="代理端口" prop="port">
            <el-input v-model.number="proxy_form.port" type="number"></el-input>
          </el-form-item>
          <el-form-item label="AnyProxy端口" prop="anyproxy_port">
            <el-input v-model.number="proxy_form.anyproxy_port" type="number"></el-input>
          </el-form-item>
          <el-form-item label="ForceProxyHttps" prop="forceProxyHttps">
            <el-switch on-text="" off-text="" v-model="proxy_form.forceProxyHttps"></el-switch>
            <span>需要配置CA,详情见<a href="http://anyproxy.io/4.x/#配置帮助" target="_blank">AnyProxy设置</a></span>
          </el-form-item>
          <el-form-item label="限速值(默认不限速 kb/s)" prop="throttle">
            <el-input v-model.number="proxy_form.throttle" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('proxy_form')" :disabled="loading">保存</el-button>
            <el-button @click="resetForm('proxy_form')" :disabled="loading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {_getProxy, _setProxy} from '../javascript/getData'
  import {mapState, mapMutations} from 'vuex'
  import switchChange from './switchChange'

  export default {
    computed: {
      ...mapState(['proxy_switch'])
    },
    components: {
      switchChange
    },
    data() {
      return {
        loading: false,
        proxy_form: {
          port: null,
          anyproxy_port: null,
          forceProxyHttps: false,
          throttle: ''
        },
        rules: {
          port: [
            {type: 'number', required: true, message: '请输入正确的代理目标端口', trigger: 'blur'},
          ],
          anyproxy_port: [
            {type: 'number', required: true, message: '请输入正确的AnyProxy目标端口', trigger: 'blur'},
          ]
        }
      };
    },
    methods: {
      /**
       * 提交设置表单
       * @param formName
       */
      submitForm(formName) {
        if (this.proxy_switch) {
          this.$notify.warning({
            message: "请关闭服务器后再进行编辑"
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            _setProxy(this.proxy_form).then((res) => {
              this.loading = false;
              let data = res.data;
              this.$notify({
                showClose: true,
                message: data.msg,
                type: data.code === 200 ? 'success' : 'error',
                offset: 50
              });
            })
          }
        });
      },
      /**
       * 重置表单信息
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted(){
      /**
       * 初始化表单信息
       */
      _getProxy().then((res) => {
        let data = res.data;
        if (data.code === 200) {
          _.assign(this.$data["proxy_form"], data.result);
        }
      });
    }
  }

</script>
