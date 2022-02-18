<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="small"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="mulDelete"
            >批量删除</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="users"
      @selection-change="selectChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column sortable prop="acreatetime" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="ausername" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="asex" label="性别" width="180"> </el-table-column>
      <el-table-column prop="ajobnumber" label="工号" width="180">
      </el-table-column>
      <el-table-column prop="aphone" label="手机" width="180">
      </el-table-column>
      <el-table-column prop="aaddress" label="地址"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.aid)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 3, 4, 10]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      user: {
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
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 1,
      // params:{
      //   currentPage:"1",
      //   pageSize:"2"
      // },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      // this.loading = true
      // this.$http('/api/Admin/adminCenter',{currentPage:this.currentPage,pageSize:2}).then((res) => {
      //   this.users = res.data
      //   console.log(res.data);
      // }).catch((err) => {
      //   console.error(err)
      // })

      this.$axios
        .get(
          "/api/Admin/selectAllAdmins?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((res) => {
          //console.log(this.params);
          //return false;
          //console.log("currentPage=" + this.currentPage);
          //console.log("pageSize=" + this.pageSize);
          console.log(res.data);
          if (res.data.code == 200) {
            //console.log("200");
            this.users = res.data.data.list;
            this.total = res.data.data.total;
            // this.pageSize = res.data.obj.pageSize;
            // this.currentPage = res.data.obj.pageNum;
            //console.log("currentPage=" + this.currentPage);
            //console.log("pageSize=" + this.pageSize);
          } 
          // else {
          //   this.$notify.error({
          //     title: "错误",
          //     message: res.data.msg,
          //   });
          // }
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      console.log("每页显示");
      this.pageSize = val;
      this.getUsers(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        console.log("页码显示");
        this.currentPage = val;
        this.getUsers(this.currentPage, this.pageSize);
    },

    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.user = Object.assign({}, row);
      this.userFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      //console.log(this.$refs['userForm']);
      this.$refs["user"].validate((valid) => {
        console.log(this.user.aid);
        //return false;
        if (valid) {
          let id = this.user.aid;
          if (id) {
            this.$axios
              .post("/api/Admin/updateAdmin", this.$Qs.stringify(this.user))
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                  location.reload();
                }else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.message,
                  });
                }
              });
          } else {
            this.$axios
              .post(
                "/api/Admin/addAdmin",
                this.$Qs.stringify({
                  ausername: this.user.ausername,
                  apassword: this.user.apassword,
                  asex: this.user.asex,
                  aphone: this.user.aphone,
                  aaddress: this.user.aaddress,
                  ajobnumber: this.user.ajobnumber,
                  aposition: this.user.aposition,
                })
              )
              .then((res) => {
                if (res.data.code == 200) {
                  console.log("成功");
                  this.users.unshift(this.user);
                  location.reload();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          }
          this.userFormVisible = false;
          this.$message({
            type: "success",
            message: id ? "修改成功！" : "新增成功！",
          });
        }
      });
    },
    handleDelete(index, row) {
      console.log("index:" + index);
      console.log("row:" + row);
      this.$confirm(`确定删除用户吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.users.splice(index, 1);
          this.$axios
            .post(
              "/api/Admin/deleteAdmin",
              this.$Qs.stringify({
                aid: row,
              })
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.message,
                });
              }
            });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    mulDelete() {
      let len = this.multipleSelection.length;
      console.log("multipleSelection:" + this.multipleSelection);
      console.log("len:" + len);
      if (len === 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项！",
        });
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: `成功删除了${len}条数据！`,
            });
          })
          .catch(() => {
            console.log("取消删除");
          });
      }
    },
    selectChange(val) {
      this.multipleSelection = val;
    },
    handleAdd() {
      this.dialogTitle = "新增";
      this.user = Object.assign({}, this.userBackup);
      this.userFormVisible = true;
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
