<template>
  <div class="dormitory-box">
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
          </div>
      </el-col>
    </el-row>
    <el-table :data="dormitorys" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="ddormitorynum" label="宿舍号" width="380"></el-table-column>
      <el-table-column prop="dbuildingnumber" label="宿舍楼栋" width="380">栋</el-table-column>
      <el-table-column prop="dliveNumber" label="宿舍居住人数" width="380">人间
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
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[2, 3, 4, 6]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      title="编辑"
      :visible.sync="dormitoryFormVisible"
      top="10vh"
      @close="resetForm('dormitory')"
    >
      <el-form :model="dormitory" ref="dormitory" :rules="rules">
        <el-form-item label="宿舍号" prop="ddormitorynum" label-width="80px">
          <el-input v-model="dormitory.ddormitorynum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍楼栋" prop="dbuildingnumber" label-width="80px">
          <el-input v-model="dormitory.dbuildingnumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍类型" prop="dliveNumber" label-width="80px">
          <!-- <el-input
            v-model="dormitory.dliveNumber"
            autocomplete="off"
          ></el-input> -->
          <el-select v-model="dormitory.dliveNumber" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dormitoryFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('dormitory')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入富文本编辑器所需样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
        options: [
          {
          value: '2',
          label: '四人间'
        }, {
          value: '8',
          label: '八人间'
        }], 
        value: '',

      dormitorys: [],
      dormitory: {
       did:'',
       ddormitorynum:'',
       dBuildingnumber:'',
       dLiveNumber:''
      },
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      dormitoryFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 2,
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 5,
            max: 25,
            message: "长度在 5 到 25 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {
    quillEditor,
  },
  mounted() {
    this.getdormitorys();
  },
  methods: {
    getdormitorys() {
      this.$axios
        .get(
          "/api/Dormitory/selectAllDormitory?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.dormitorys = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getdormitorys(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getdormitorys(this.currentPage, this.pageSize);
    },

    handleEdit(index, row) {
      //点击修改将这一行（row）的数据传递给dormitory
      this.dormitory = Object.assign({}, row);
      this.dormitoryFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["dormitory"].validate((valid) => {
        if (valid) {
          let id = this.dormitory.did;
          //return false;
          if (id) {
            this.$axios
              .post(
                "/api/Dormitory/updateDormitory",this.dormitory)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                 // this.$router.push({ path: '/dormitory' })
                 this.getdormitorys(this.currentPage, this.pagesize);
                  //location.reload();
                } 
                else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          } else {
            //console.log(this.dormitory.spicture);
            this.$axios
              .post("/api/Dormitory/addDormitory",this.dormitory)
              .then((res) => {
                if (res.data.code == 200) {
                  console.log("成功");
                  //this.dormitorys.unshift(this.dormitory);
                  this.getdormitorys(this.currentPage, this.pagesize);
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          }
          this.dormitoryFormVisible = false;
          // this.$message({
          //   type: "success",
          //   message: id ? "修改成功！" : "新增成功！",
          // });
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确定删除学生 【${row.sname}】 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dormitorys.splice(index, 1);
          this.$axios
            .post(
              "/api/Dormitory/deleteDormitory",
              this.$Qs.stringify({
                did: row.did,
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
    selectChange(val) {
      this.multipleSelection = val;
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    handleAdd() {
      this.dialogTitle = "新增";
      this.dormitory = Object.assign({}, this.userBackup);
      this.dormitoryFormVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dormitory-box {
  width: 100%;
  .el-pagination {
    margin-top: 20px;
  }
  .tool-box {
      padding: 10px 10px;
      border-bottom: 1px solid #eee;
    }
  .quill-editor {
    margin-bottom: 20px;
  }
}
</style>
