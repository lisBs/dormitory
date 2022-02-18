<template>
  <div class="user-box">
    <el-form ref="form" :model="user" label-width="90px">
      <el-form-item label="管理员名称" prop="ausername">
        <el-input v-model="user.ausername"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="asex">
        <el-input v-model="user.asex"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="ajobnumber">
        <el-input v-model="user.ajobnumber"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="aphone">
        <el-input v-model="user.aphone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="aaddress">
        <el-input v-model="user.aaddress"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUser('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      user: {
        aid:'',
        ausername: "",
        apassword: "",
        asex: "",
        aphone: "",
        aaddress: "",
        ajobnumber: "",
        aposition: "",
      },
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      userFormVisible: false,
      dialogTitle: "",
      rules: {
        ausername: [
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

    getUser(){
      let  admin  = JSON.parse(sessionStorage.getItem('user'))
      this.user = admin;
    },
    submitUser(formName) {
      // 表单验证
      //console.log(this.$refs['userForm']);
      this.$refs["form"].validate((valid) => {
        console.log(this.user.aid);
        //return false;
        if (valid) {
          let id = this.user.aid;
          if (id) {
            this.$axios
              .post("/api/Admin/updateAdmin", this.user)
              .then((res) => {
                if (res.data.code == 200) {
                  setTimeout(() => {
                  sessionStorage.setItem( "user",JSON.stringify(res.data.data));
                  location.reload();
                }, 500),
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                }else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.message,
                  });
                }
              });
          }else{
            this.$notify.error({
                    title: "错误",
                    message: "当前用户不存在，请联系管理员。",
                  });
          } 
        }
      });
    }
  }
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
