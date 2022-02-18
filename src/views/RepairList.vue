<template>
  <div class="repairlist-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
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
    <el-table :data="repairlists" style="width: 100%">
      
      <el-table-column sortable align="center" type="selection" width="55"> </el-table-column>
      <el-table-column sortable align="center" prop="repairpeople" label="报修人" width="100"> </el-table-column>
      <el-table-column sortable align="center" prop="sno" label="学生学号" width="100"></el-table-column>
      <el-table-column sortable align="center" prop="repairdormibuilding" label="报修楼栋" width="100"> </el-table-column>
      <el-table-column sortable align="center" prop="repairdormitory" label="报修宿舍" width="100"></el-table-column>

      <el-table-column sortable align="center" prop="repairder" label="报修问题" width="100"> </el-table-column>
      <el-table-column sortable align="center" prop="repairemergency" label="紧急情况" width="100">
         <template slot-scope="scope">
          <span :class="scope.row.repairemergency == 1 ? 'font-class-green': scope.row.repairemergency == 2 ? 'font-class-bule' : 'font-class-red' ">
            {{scope.row.repairemergency == "1"?'急':scope.row.repairemergency=="2"?"好急":'急中急'}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="repairtime" label="报修时间" width="160"></el-table-column>
      <el-table-column sortable align="center" prop="repairendtime" label="修理完成时间" width="160"></el-table-column>
      <el-table-column sortable align="center" prop="dorepairpeople" label="维修人员" width="100"></el-table-column>
      <el-table-column sortable align="center" prop="dorepairtime" label="开始维修时间" width="160"></el-table-column>
      <el-table-column sortable align="center" prop="repairnumbers" label="报修单号" width="100"></el-table-column>
      <el-table-column label="状态" sortable>
        <template slot-scope="scope">
         <span :class="scope.row.isacceptance == 0 ? 'font-class-bule' : scope.row.isacceptance == 1 ? 'font-class-red':'font-class-green'"> 
           {{  scope.row.isacceptance == 0 ? '未受理' :scope.row.isacceptance == "1" ?'已受理':'已完成' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            :disabled="scope.row.isacceptance == 0 ? false:true"
            @click="handleEdit(scope.$index, scope.row)"
            >指派维修</el-button
          >
          <el-button
            size="mini"
            type="primary"
            plain
            :disabled="(scope.row.isacceptance != 1)"
            @click="handleEnd(scope.row)"
            >标记完成</el-button
          >
          <el-button
            class="butt"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >记录删除</el-button
          >
          <el-button
            class="butt"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >记录删除</el-button
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
      title="指派维修人员"
      :visible.sync="repairlistFormVisible"
      top="10vh"
      @close="resetForm('repairlist')"
    >
      <el-form :model="repairlist" ref="repairlist" :rules="rules">
        <el-form-item label="维修人员" prop="dorepairpeople" label-width="80px">
          <el-input v-model="repairlist.dorepairpeople" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repairlistFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('repairlist')"
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
      repairlists: [],
      repairlist: {
        id:'',
        repairPeople:'',//报修人
        repairDormiBuilding: "",//报修楼栋
        repairDormitory: "",//报修宿舍
        repairDer: "",//报修问题
        repairEmergency: "",//紧急情况：1：一般紧急，2:中度紧急，3：重度紧急
        repairTime: "",//报修时间
        repairEndTime: "",//报修结束时间
        isAcceptance: "",//是否已受理
        doRepairPeople: "",//维修人员
        dorepairTime: "",//维修开始时间
        repairNumbers: "",//维修单号
        sno:"",//学号
      },
      keyWorld:"",
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      repairlistFormVisible: false,
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
    this.getrepairlists();
  },
  methods: {
    getrepairlists() {
      this.$axios
        .get(
          "/api/Dormitoryrepair/selectAllDormitoryRepair?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize +
            "&keyWorld=" + this.keyWorld
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.repairlists = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getrepairlists(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getrepairlists(this.currentPage, this.pageSize);
    },
    //上传图片
    handleSuccess(res, file) {
      this.$message({
        type: "info",
        message: "图片上传成功",
        duration: 6000,
      });
      this.repairlist.spicture = res;
      console.log(this.repairlist);
      console.log(res);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `请勿频繁上传图片操作，您已经选择 ${files.length} 个文件，真的需要重新上传，请刷新页面`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleEnd(row){
      this.repairlist = Object.assign({}, row);
            this.$axios
              .post(
                "/api/Dormitoryrepair/updateDormitoryDoRepairSuccess",this.repairlist)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "标记完成!",
                  });
                 // this.$router.push({ path: '/repairlist' })
                 this.getrepairlists(this.currentPage, this.pagesize);
                 //location.reload();
                } 
                else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          this.repairlistFormVisible = false;
    },
    handleEdit(index, row) {
      //点击修改将这一行（row）的数据传递给repairlist
      this.repairlist = Object.assign({}, row);
      this.repairlistFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["repairlist"].validate((valid) => {
        if (valid) {
          console.log(this.repairlist);
            this.$axios
              .post(
                "/api/Dormitoryrepair/updateDormitoryDoRepair",this.repairlist)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "指派成功!",
                  });
                 // this.$router.push({ path: '/repairlist' })
                 this.getrepairlists(this.currentPage, this.pagesize);
                 //location.reload();
                } 
                else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          this.repairlistFormVisible = false;
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.repairlists.splice(index, 1);
          this.$axios
            .post(
              "/api/repairlist/deleterepairlist",
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
      this.repairlist = Object.assign({}, this.userBackup);
      this.repairlistFormVisible = true;
    },
    handleSearch(){
      this.getrepairlists();
    }
  },
};
</script>

<style lang="scss" scoped>
.repairlist-box {
  width: 100%;
  .el-pagination {
    margin-top: 20px;
  }
  .quill-editor {
    height: 300px;
    margin-bottom: 20px;
  }
}

.font-class-red {
    color: red !important;
  }
  .font-class-green {
    color: lightgreen !important;
  }
  .font-class-bule {
    color: skyblue !important;
  }
  .butt{
    margin-top: 15px;
  }
</style>
