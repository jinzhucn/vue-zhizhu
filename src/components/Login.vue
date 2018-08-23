<template>
  <div
    class='login-wrapper'
    v-loading='loading'
    element-loading-text='拼命登录中'>
    <div class='login-form'>
      <div class='logo-wrapper'>
        <img src='../assets/images/logo.png'>
        <div class='logo-title'>智猪管理系统</div>
      </div>
      <el-form
        :model='form'
        status-icon
        :rules="rules"
        ref='form'>
        <el-form-item prop='username'>
          <img class='icon' src='../assets/images/username.png'>
          <el-input v-model='form.username' placeholder='请输入用户名'></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <img class='icon' src='../assets/images/password.png'>
          <el-input
            v-model='form.password'
            type='password'
            placeholder='请输入密码'
            @keyup.enter.native="submitForm('form')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { axiosByJson } from '../axios/index';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login();
        }
      });
    },
    login() {
      this.loading = true;
      axiosByJson.post('getAdministrator', {
        username: this.form.username,
        password: this.form.password,
      }).then(({ data: { code, msg, data } }) => {
        this.loading = false;
        if (code !== 1) {
          this.$message.error(msg);
        } else {
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('password', data.password);
          this.$router.replace('/index/student');
        }
      });
    },
  },
};
</script>

<style scoped>
  .login-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/background.jpg");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-form {
    width: 260px;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-title {
    color: #fff;
    font-size: 20px;
  }

  .icon {
    position: absolute;
    top: 10px;
    left: 5px;
    z-index: 101;
    width: 20px;
    height: 20px;
  }

  button {
    width: 100%;
  }
</style>
