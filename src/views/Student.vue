<template>
  <div class="student-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="small"
            @click="handleAdd"
            >新增</el-button>
           
            <el-input
              style="width:200px;margin-left:10px;"
              size="small"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              @change="handleSearch"
              v-model="keyWorld">
            </el-input>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
        </div>
      </el-col>
    </el-row>
    <el-table :data="students" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column sortable prop="sname" label="姓名" width="180"> </el-table-column>
      <el-table-column sortable prop="sno" label="学号" width="180"> </el-table-column>
      <el-table-column sortable prop="sdoritorynum" label="宿舍号" width="180">
      </el-table-column>
      <el-table-column sortable prop="ssex" label="性别" width="180"> </el-table-column>
      <el-table-column sortable prop="sphone" label="手机号" width="180">
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <img
            :src="'/api/upload/' + scope.row.spicture"
            width="40"
            height="40"
            class="head_pic"
          />
        </template>
      </el-table-column>
      <el-table-column sortable prop="sgrade" label="年级" width="180">
      </el-table-column>
      <el-table-column sortable prop="sclass" label="班级" width="180">
      </el-table-column>
      <el-table-column sortable prop="smajor" label="专业" width="180">
      </el-table-column>
      <el-table-column sortable prop="saddress" label="地址" width="180">
      </el-table-column>
      <el-table-column label="状态" sortable>
        <template slot-scope="scope">
          {{ scope.row.status ? "已发布" : "未发布" }}
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
      :visible.sync="studentFormVisible"
      top="10vh"
      @close="resetForm('student')"
    >
      <el-form :model="student" ref="student" :rules="rules">
        <el-form-item label="学生姓名" prop="sname" label-width="80px">
          <el-input v-model="student.sname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="sno" label-width="80px">
          <el-input v-model="student.sno" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号" prop="sdoritorynum" label-width="80px">
          <el-input
            v-model="student.sdoritorynum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="ssex" label-width="80px">
          <el-input v-model="student.ssex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="sphone" label-width="80px">
          <el-input v-model="student.sphone" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="头像" prop="spicture" label-width="80px">
          <el-input v-model="student.spicture" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="图片" label-width="80px" prop="spicture">
          <el-upload
            accept=".jpeg,.png,.jpg"
            class="upload-demo"
            name="file"
            action="/api/Upload/uploadImage"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :on-success="handleSuccess"
            :on-change="onChange"
            :on-exceed="handleExceed"
            :on-progress="handleIng"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="年级" prop="sgrade" label-width="80px">
          <el-input v-model="student.sgrade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="sclass" label-width="80px">
          <el-input v-model="student.sclass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="smajor" label-width="80px">
          <el-input v-model="student.smajor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="saddress" label-width="80px">
          <el-input v-model="student.saddress" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="日期" label-width="80px">
          <el-date-picker
            v-model="student.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="状态" label-width="80px">
          <el-switch
            v-model="student.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- <el-form-item>
          <quill-editor ref="TextEditor"
              v-model="student.content"
              :options="editorOption">
          </quill-editor>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="studentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('student')"
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
      students: [],
      student: {
        stuid:'',
        sname: "",
        sno: "",
        sdoritorynum: "",
        ssex: "",
        sphone: "",
        spicture: "",
        sgrade: "",
        sclass: "",
        smajor: "",
        saddress: "",
      },
      keyWorld:"",
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      studentFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 2,
      url: "/target/templeto1-1.0-SNAPSHOT/upload",
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "link"],
            ["image", "clean"],
          ],
        },
        placeholder: "请输入文章内容...",
        theme: "snow",
      },
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
    this.getstudents();
  },
  methods: {
    getstudents() {
      this.$axios
        .get(
          "/api/Student/selectAllStudent?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize +
            "&keyWorld=" +this.keyWorld
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.students = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getstudents(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getstudents(this.currentPage, this.pageSize);
    },
    handleIng(event, file, fileList){
      if(fileList.length>1){
        fileList.shift();
      }
    },
    //上传图片
    handleSuccess(res, file,fileList) {
      this.$message({
        type: "info",
        message: "图片上传成功",
        duration: 6000,
      });
      this.student.spicture = res;
      console.log(this.student);
      console.log(res);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
        this.fileList = [fileList[fileList.length - 1]]//这一步，是 展示最后一次选择文件
      }
    },
    handleExceed(files, fileList) {
      fileList.shift();
      this.$message.warning(
        `请勿频繁上传图片操作，您已经选择 ${files.length} 个文件，真的需要重新上传，请刷新页面`
      );
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleEdit(index, row) {
      //点击修改将这一行（row）的数据传递给student
      this.student = Object.assign({}, row);
      this.studentFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["student"].validate((valid) => {
        if (valid) {
          let id = this.student.stuid;
          console.log(this.student);
          //return false;
          if (id) {
            this.$axios
              .post(
                "/api/Student/updateStudent",this.student)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                 // this.$router.push({ path: '/student' })
                 this.getstudents(this.currentPage, this.pagesize);
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
            console.log(this.student.spicture);
            this.$axios
              .post("/api/Student/addStudent",this.student)
              .then((res) => {
                if (res.data.code == 200) {
                  console.log("成功");
                  //this.students.unshift(this.student);
                  this.getstudents(this.currentPage, this.pagesize);
                  beforeRemove();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          }
          this.studentFormVisible = false;
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
          this.students.splice(index, 1);
          this.$axios
            .post(
              "/api/Student/deleteStudent",
              this.$Qs.stringify({
                stuid: row.stuid,
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
      this.student = Object.assign({}, this.userBackup);
      this.studentFormVisible = true;
    },
    handleSearch(){
      this.getstudents();
    }
  },
};
</script>

<style lang="scss" scoped>
.student-box {
  width: 100%;
  .el-pagination {
    margin-top: 20px;
  }
  .tool-box {
      padding: 10px 10px;
      border-bottom: 1px solid #eee;
    }
  .quill-editor {
    height: 300px;
    margin-bottom: 20px;
  }
}
</style>
