<template>
  <div class="login_form_wrapper">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="login_form">
      <el-form-item label="账号" prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="记住密码" prop="savePass">
        <el-switch v-model="loginForm.savePass"></el-switch>
        <el-button type="primary" size="large" @click="submitForm('loginForm')" style="margin-left: 25px">登录</el-button>
        <el-button size="large" @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {_getLocalStorage, _saveLocalStorage, _clearStorage, _getCookie}  from "../../javascript/util";
  import  {_login} from "../../javascript/getData";
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          account: '',
          password: '',
          savePass: false
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      /**
       * 提交登录信息
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _login(this.loginForm).then((res) => {
              let data = res.data;
              if (data.code === 200) {
                this.loginForm.savePass && this.saveLoginInfo();
                this.$router.push('/');
              } else {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'error'
                })
              }
            })
          }
        });
      },
      /**
       * 重置表单
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 保存登录信息
       */
      saveLoginInfo(){
        ["account", "password", "savePass"].forEach((item) => {
          _saveLocalStorage(item, this.loginForm[item]);
        });
      }
    },
    mounted(){
      if (_getCookie('login')) {
        this.$router.push('/');
      }
      if (_getLocalStorage("account") && _getLocalStorage("password")) {
        this.loginForm.account = _getLocalStorage("account");
        this.loginForm.password = _getLocalStorage("password");
        this.loginForm.savePass = JSON.parse(_getLocalStorage("savePass"));
      }
      document.body.addEventListener('keydown', (e) => {
        const event = e || window.event;
        if (event.keyCode === 13) {
          this.submitForm('loginForm');
        }
      });
    }
  }
</script>
