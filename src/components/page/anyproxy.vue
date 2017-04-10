<template>
  <div class="main_content_wrapper" style="padding: 20px;">
    <div class="main_content">
      <div class="proxy_form">
        <el-form :model="proxy_form" :rules="rules" ref="proxy_form" label-width="200px">
          <el-form-item label="拦截url" prop="url">
            <el-input v-model="proxy_form.url"></el-input>
          </el-form-item>
          <el-form-item label="代理端口" prop="port">
            <el-input v-model.number="proxy_form.port" type="number" disabled></el-input>
          </el-form-item>
          <el-form-item label="AnyProxy端口" prop="anyproxy_port">
            <el-input v-model.number="proxy_form.anyproxy_port" type="number" disabled></el-input>
          </el-form-item>
          <el-form-item label="ws通信端口" prop="ws_port">
            <el-input v-model.number="proxy_form.ws_port" type="number" disabled></el-input>
          </el-form-item>
          <el-form-item label="ForceProxyHttps" prop="forceProxyHttps">
            <el-switch on-text="开启" off-text="关闭" :width="60" v-model="proxy_form.forceProxyHttps" disabled></el-switch>
            <span>需配CA,详情：<a href="http://anyproxy.io/4.x/#配置帮助" target="_blank">AnyProxy设置</a>,暂时只开放拦截url设置</span>
          </el-form-item>
          <el-form-item label="限速值(默认不限速 kb/s)" prop="throttle">
            <el-input v-model.number="proxy_form.throttle" type="number" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large"  @click="submitForm('proxy_form')" :disabled="loading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {_getProxy, _setProxy} from '../../javascript/getData'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        loading: false,
        proxy_form: {
          url: '',
          ws_port:null,
          port: null,
          anyproxy_port: null,
          forceProxyHttps: false,
          throttle: null
        },
        rules: {
          url: [
            {type: 'string', required: true, message: '请输入需要代理的url', trigger: 'blur'}
          ],
          port: [
            {type: 'number', required: true, message: '请输入正确的代理目标端口', trigger: 'blur'},
          ],
          ws_port: [
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
