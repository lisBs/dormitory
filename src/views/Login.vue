<template>
  <div class="login-box">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="login-form"
    >
      <h3 class="title">系 统 登 录</h3>
      <el-form-item prop="number">
        <el-input
          v-model="loginForm.number"
          autocomplete="off"
          placeholder="账 号: admin"
          value="number"
          prefix-icon="el-icon-goods"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :type="textType"
          v-model="loginForm.password"
          @keyup.native.enter="login('loginForm')"
          autocomplete="off"
          value="password"
          placeholder="密 码: admin"
          prefix-icon="el-icon-time"
        >
       
          <i
            slot="suffix"
            class="el-input__icon el-icon-view btn-eye"
            @click="changeType"
          ></i>
        </el-input>
      </el-form-item>
       <el-radio v-model="loginForm.type" prop="type" name="type" label="0">管理员</el-radio>
       <el-radio v-model="loginForm.type" prop="type" name="type" label="1">学生</el-radio>
      <el-form-item v-show="showMsg" style="margin-bottom: 0">

        <span class="text-danger">提示：用户名或密码错误，请重试！</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="login('loginForm')"
          class="login-btn"
          v-loading="loading"
          >登 录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        number: "",
        password: "",
        type:"0",
      },
      rules: {
        number: [{ required: true, message: " ", trigger: "blur" }],
        password: [{ required: true, message: " ", trigger: "blur" }],
      },
      loading: false,
      showMsg: false,
      textType: "password",
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          console.log(this.loginForm.type);
           //this.$Qs.stringify(this.loginForm)：参数提交方式的Content-Type为：application/x-www-form-urlencoded
           //this.loginForm：参数提交方式的Content-Type：application/json
           //let data = new FormData(); data.append('a',1'); data.append('b',2); axios.post(url,data)   FormData()的提交方式为Content-Type: multipart/form-data
       
          var url = this.loginForm.type=="0"?"/api/Admin/adminLogin":"/api/Student/studentLogin";
          sessionStorage.setItem("loginType",JSON.stringify(this.loginForm.type));
          this.$axios
            .post(url,this.loginForm,this.loginForm.type)
            .then((res) => {
              //console.log(this.user.aid);
              //return false;
              if (res.data.code == 200) {
                //延迟两秒，演示登录按钮加载效果
                console.log("管理员信息=");
                console.log(res.data.data);
                setTimeout(() => {
                  this.loading = false;
                  sessionStorage.setItem(
                    "user",
                    //JSON.stringify(this.loginForm.ajobnumber)
                    JSON.stringify(res.data.data)
                  );
                  this.$router.replace({ path: "/console" });
                }, 2000),
                  this.$message({
                    type: "success",
                    message: "登录成功!",
                  });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg,
                });
                this.loading = false;
              }
            });
        } else {
          console.log("login failed");
          return false;
        }
      });
    },
    changeType() {
      this.textType = this.textType === "password" ? "text" : "password";
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #20222a;
  .login-form {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #f5f5f5;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .btn-eye {
      cursor: pointer;
    }
    .text-danger {
      color: #f56c6c;
    }
    .login-btn {
      margin: 35px 0 10px 0;
      width: 100%;
    }
  }
}
</style>
