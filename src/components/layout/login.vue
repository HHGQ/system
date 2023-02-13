<template>
  <div class="login_container" id="login">
    <el-form ref="form" :model="formData" label-width="80px" style="margin: 57px 0 0 0px;">
      <el-form-item label="用户名: ">
        <el-input v-model="formData.username" placeholder="请输入用户名" style="width: 377px;"></el-input>
      </el-form-item>
      <el-form-item label="密码: ">
        <el-input v-model="formData.password" placeholder="请输入密码" show-password style="width: 377px;" @keydown.native="loginBtn"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 377px;" @click="loginBtn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    id: String,
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
      }
    }
  },
  mounted() {
    console.log(this.$route)
    console.log(this.$route.params.id)
  },
  methods: {
    loginBtn() {
      if (this.formData.username == 'admin' && this.formData.password == 'admin') {
        this.$router.push('/main')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login_container {
  width: 500px;
  height: 287px;
  border: 1px solid #80808059;
  margin: 11% 37%;
}
</style>
