<template>
  <div class="building-box">
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
            type="success"
            icon="el-icon-circle-plus-outline"
            size="small"
            > <a href="/api/building/downloadAll" style="color:white;">导出</a> </el-button
          >
            <!-- @click="handleDownload" -->
            <el-button> 
            <el-upload
                class="upload-demo"
                action="/api/building/importExcel"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-remove="beforeRemove"
                multiple
                :on-change="onChange"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :show-file-list="isShow"
                >
                <el-button size="small" type="primary">导入</el-button>
              </el-upload>
            </el-button >
          </div>
          
      </el-col>
    </el-row>
    <el-table :data="buildings" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="buildingNum" label="宿舍楼号" width="380"></el-table-column>
      <el-table-column prop="buildingName" label="宿舍楼名称" width="380"></el-table-column>
      <el-table-column prop="layers" label="宿舍楼层层数" width="380">
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
      :page-sizes="[7, 10, 15, 20]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      title="编辑"
      :visible.sync="buildingFormVisible"
      top="10vh"
      @close="resetForm('building')"
    >
      <el-form :model="building" ref="building" :rules="rules">
        <el-form-item label="宿舍楼号" prop="buildingNum" label-width="80px">
          <el-input v-model="building.buildingNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍楼名" prop="buildingName" label-width="80px">
          <el-input v-model="building.buildingName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍楼层层数" prop="layers" label-width="80px">
          <el-input
            v-model="building.layers"
            autocomplete="off"
          ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buildingFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('building')"
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
      fileList: [],
      buildings: [],
      building: {
       id:'',
       buildingNum:'',
       buildingName:'',
       layers:''
      },
      isShow:true,
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      buildingFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 7,
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
    this.getbuildings();
  },
  methods: {
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleAvatarSuccess(res, file,fileList){
        this.$message({
                    duration: 7000,
                    type: "success",
                    message: res.msg,
                  });
        this.getbuildings(this.currentPage, this.pageSize);
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
        
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    getbuildings() {
      this.$axios
        .get(
          "/api/building/selectAllBuilding?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.buildings = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getbuildings(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getbuildings(this.currentPage, this.pageSize);
    },

    handleEdit(index, row) {
      //点击修改将这一行（row）的数据传递给building
      this.building = Object.assign({}, row);
      this.buildingFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["building"].validate((valid) => {
        if (valid) {
          let id = this.building.id;
          //return false;
          if (id) {
            this.$axios
              .post(
                "/api/building/updateBuilding",this.building)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                 // this.$router.push({ path: '/building' })
                 this.getbuildings(this.currentPage, this.pagesize);
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
            //console.log(this.building.spicture);
            this.$axios
              .post("/api/building/addBuilding",this.building)
              .then((res) => {
                if (res.data.code == 200) {
                  console.log("成功");
                  //this.buildings.unshift(this.building);
                  this.getbuildings(this.currentPage, this.pagesize);
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          }
          this.buildingFormVisible = false;
          // this.$message({
          //   type: "success",
          //   message: id ? "修改成功！" : "新增成功！",
          // });
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确定删除 【${row.buildingName}】 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.buildings.splice(index, 1);
          this.$axios
            .post(
              "/api/building/deleteBuilding",
              this.$Qs.stringify({
                id: row.id,
              })
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getbuildings(this.currentPage, this.pagesize)
                
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
    handleDownload() {
          this.$axios.get("/api/building/downloadAll").then((res) => {
              // if (res.data.code == 200) {
              //   this.$message({
              //     type: "success",
              //     message: "正在下载!",
              //   });
              //   this.getbuildings(this.currentPage, this.pagesize)
                
              // } else {
              //   this.$notify.error({
              //     title: "错误",
              //     message: res.data.message,
              //   });
              // }
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
      this.building = Object.assign({}, this.userBackup);
      this.buildingFormVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.building-box {
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
