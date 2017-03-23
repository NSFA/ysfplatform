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
        <el-switch on-text="" off-text="" v-model="loginForm.savePass"></el-switch>
        <el-button type="primary" size="large" @click="submitForm('loginForm')" style="margin-left: 40px">登录</el-button>
        <el-button size="large" @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {_getLocalStorage, _saveLocalStorage, _clearStorage,_getCookie}  from "../javascript/util";
  import  {_login} from "../javascript/getData";
  import {mapState, mapMutations} from 'vuex';

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
                  message: data.result,
                  type: 'error'
                })
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      saveLoginInfo(){
        ["account", "password", "savePass"].forEach((item) => {
          _saveLocalStorage(item, this.loginForm[item]);
        });
      }
    },
    mounted(){
      if (_getCookie('loginStatus')) {
        this.$router.push('/');
      }
      if (_getLocalStorage("account") && _getLocalStorage("password")) {
        this.loginForm.account = _getLocalStorage("account");
        this.loginForm.password = _getLocalStorage("password");
        this.loginForm.savePass = JSON.parse(_getLocalStorage("savePass"));
      }
    }
  }
</script>

<style>
  .login_form_wrapper {
    width: 100%;
    height: 100%;
    background: url("../assets/bg-login.png") no-repeat center;
    background-size: cover;
  }

  .login_form {
    width: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
