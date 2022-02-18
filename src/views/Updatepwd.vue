<template>
  <div class="user-box">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="userFormVisible"
      @close="resetForm('user')"
    >
      <el-form :model="user" :rules="rules" ref="user">
        <el-form-item label="姓名" prop="ausername" label-width="50px">
          <el-input v-model="user.ausername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="apassword" label-width="50px">
          <el-input v-model="user.apassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="asex" label-width="50px">
          <el-input v-model="user.asex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="aphone" label-width="50px">
          <el-input v-model="user.aphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="aaddress" label-width="50px">
          <el-input v-model="user.aaddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="ajobnumber" label-width="50px">
          <el-input v-model="user.ajobnumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="aposition" label-width="50px">
          <el-input v-model="user.aposition" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('user')">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      users: [],
      ruleForm: {
        aid:'',
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getUser();
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUser() {
      let admin = JSON.parse(sessionStorage.getItem("user"));
      this.ruleForm.aid = admin.aid;
    },
    submitForm(formName) {
      // 表单验证
      //console.log(this.$refs['userForm']);
      this.$refs["ruleForm"].validate((valid) => {
        console.log(this.ruleForm.aid);
        //return false;
        if (valid) {
          let id = this.ruleForm.aid;
          if (id) {
            this.$axios
              .post("/api/Admin/updateAdminPwdById", this.ruleForm)
              .then((res) => {
                if (res.data.code == 200) {
                    this.$message({
                      type: "success",
                      message: "修改成功!",
                    });
                    this.$router.replace({ path: '/login' })
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.message,
                  });
                }
              });
          } else {
            this.$notify.error({
              title: "错误",
              message: "当前用户。",
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  .tool-box {
    padding: 10px 10px;
    border-bottom: 1px solid #eee;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
