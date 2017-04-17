<template>
  <div class="main_content_wrapper" style="padding: 20px;">
    <div class="main_content">
      <div class="proxy_form">
        <el-form :model="proxy_form" :rules="rules" ref="proxy_form" label-width="200px">
          <el-form-item label="代理端口:" prop="port">
            {{proxy_form.port}}
          </el-form-item>
          <!--HTTPS暂时没必要-->
          <!--<el-form-item label="ForceProxyHttps" prop="forceProxyHttps">-->
          <!--<el-switch on-text="开启" off-text="关闭" :width="60" v-model="proxy_form.forceProxyHttps" disabled></el-switch>-->
          <!--<span>需配CA,<a href="http://anyproxy.io/4.x/#配置帮助" target="_blank">详情</a></span>-->
          <!--</el-form-item>-->
          <el-form-item label="拦截url:" prop="url">
            <el-input v-model="proxy_form.url"></el-input>
          </el-form-item>
          <el-form-item label="限速(kb/s)">
            <el-select
              v-model="proxy_form.throttle"
              allow-create
              placeholder="No throttling">
              <el-option
                v-for="item in throttleOptions"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('proxy_form')" :disabled="loading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {_getProxy, _setProxy} from '../../javascript/getData'
  export default {
    data() {
      return {
        loading: false,
        edit: false,
        throttleOptions: [
          {
            label: 'No throttling',
            value: 0
          },
          {
            label: 'GPRS(50kb/s)',
            value: 50
          },
          {
            label: 'Regular 2G(250kb/s)',
            value: 250
          },
          {
            label: 'Good 2G(450kb/s)',
            value: 450
          },
          {
            label: 'Regular 3G(750kb/s)',
            value: 750
          },
          {
            label: 'Good 3G(1.5Mb/s)',
            value: 1536
          },
          {
            label: 'Regular 4G(4Mb/s)',
            value: 4096
          },
          {
            label: 'DSL(2Mb/s)',
            value: 2048
          },
          {
            label: 'WiFi(30Mb/s)',
            value: 30720
          },
        ],
        proxy_form: {
          url: '',
          ws_port: null,
          port: null,
          anyproxy_port: null,
          throttle: null,
          forceProxyHttps: false,
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
              this.$message({
                showClose: true,
                message: data.msg,
                type: data.code === 200 ? 'success' : 'error',
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
