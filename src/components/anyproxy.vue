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
            <el-input v-model="proxy_form.port" type="number"></el-input>
          </el-form-item>
          <el-form-item label="AnyProxy端口" prop="port">
            <el-input v-model="proxy_form.anyproxy_port" type="number"></el-input>
          </el-form-item>
          <el-form-item label="ForceProxyHttps" prop="forceProxyHttps">
            <el-switch on-text="" off-text="" v-model="proxy_form.forceProxyHttps"></el-switch>
          </el-form-item>
          <el-form-item label="限速值(默认不限速 kb/s)" prop="throttle">
            <el-input v-model="proxy_form.throttle" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('proxy_form')">保存</el-button>
            <el-button @click="resetForm('proxy_form')">重置</el-button>
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
    components: {
      switchChange
    },
    data() {
      return {
        proxy_form: {
          port: '',
          anyproxy_port: '',
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted(){
      _getProxy().then((res) => {
        let data = res.data;
        if (data.code === 200) {
          _.assign(this.$data["proxy_form"], data.result);
        }
      });
    }
  }

</script>
