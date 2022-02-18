<template>
  <div class="dormitoryrepair-box">
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
        </div>
      </el-col>
    </el-row>
    <el-table :data="dormitoryrepairs" style="width: 100%">
      
      <el-table-column sortable align="center" type="selection" width="55"> </el-table-column>
      <el-table-column sortable align="center" prop="repairpeople" label="报修人" width="100"> </el-table-column>
      <el-table-column sortable align="center" prop="repairdormibuilding" label="报修楼栋" width="100"> </el-table-column>
      <el-table-column sortable align="center" prop="repairdormitory" label="报修宿舍" width="100"></el-table-column>

      <el-table-column sortable align="center" prop="repairder" label="报修问题" width="100">
        <template slot-scope="scope">
          <div v-html="scope.row.repairder"></div>
        </template>
      </el-table-column>
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
      <el-table-column sortable align="center" prop="sno" label="学生学号" width="100"></el-table-column>
      
      <el-table-column label="状态">
        <template slot-scope="scope">
         <span :class="scope.row.isacceptance == 0 ? 'font-class-bule' : scope.row.isacceptance == 1 ? 'font-class-red':'font-class-green'"> 
            {{  scope.row.isacceptance == 0 ? '未受理' :scope.row.isacceptance == "1" ?'已受理':'已完成' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            :disabled="(scope.row.isacceptance != 0)"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            :disabled="(scope.row.isacceptance != 0)"
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
      :visible.sync="dormitoryrepairFormVisible"
      top="10vh"
      @close="resetForm('dormitoryrepair')"
    >
      <el-form :model="dormitoryrepair" ref="dormitoryrepair" :rules="rules">
        <el-form-item label="报修人" prop="repairpeople" label-width="80px">
          <el-input v-model="dormitoryrepair.repairpeople" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="sno" label-width="80px">
          <el-input v-model="dormitoryrepair.sno" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="紧急情况" prop="repairemergency" label-width="80px">
        <el-select  v-model="dormitoryrepair.repairemergency" placeholder="请选择">
          <el-option
           v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="报修楼栋" prop="repairdormibuilding" label-width="80px">
        <el-select v-model="dormitoryrepair.repairdormibuilding" placeholder="请选择">
            <el-option
                v-for="item in BuildingOptions"
                :key="item.id"
                :label="item.buildingNum"
                :value="item.buildingNum">
                <span style="float: left">{{ item.buildingNum }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.buildingName }}</span>
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修宿舍" prop="repairdormitory" label-width="80px">
          <el-input
            v-model="dormitoryrepair.repairdormitory"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="报修问题" prop="repairder" label-width="80px">
          <quill-editor ref="TextEditor"
              v-model="dormitoryrepair.repairder"
              :options="editorOption">
          </quill-editor>
      </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dormitoryrepairFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('dormitoryrepair')"
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
  //富文本框文件上传配置
    const uploadConfig = {
        action: '',  // 必填参数 图片上传地址
        methods: '',  // 必填参数 图片上传方式
        token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: 'img',  // 必填参数 文件的参数名
        size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
        accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
    };
    // 工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['clean'],                                      // remove formatting button
        ['link', 'image', 'video'],
    ];

    const handlers = {
        //重写图片上传
        image: function image() {
            let self = this;

            let fileInput = this.container.querySelector('input.ql-image[type=file]');
            if (fileInput === null) {
                fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                // 设置图片参数名
                if (uploadConfig.name) {
                    fileInput.setAttribute('name', uploadConfig.name);
                }
                // 可设置上传图片的格式
                fileInput.setAttribute('accept', uploadConfig.accept);
                fileInput.classList.add('ql-image');
                // 监听选择文件
                fileInput.addEventListener('change', function () {
                    let params = new FormData();
                    params.append('file', fileInput.files[0]);
                    axios.post(API.imgUpLoad, params, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then(function (res) {
                        if (res.status === 200) {
                            let length = self.quill.getSelection(true).index;
                            //写入图片
                            self.quill.insertEmbed(length, 'image', res.data.path);
                            self.quill.setSelection(length + 1)
                        } else {
                            self.$message.error(res.data.message);
                        }
                        fileInput.value = ''
                    })
                });
                this.container.appendChild(fileInput);
            }
            fileInput.click();
        }
    };
export default {
  data() {
    return {
      dormitoryrepairs: [],
      BuildingOptions: [],
      
      options: [
          {
          value: 1,
          label: '急'
        }, {
          value: 2,
          label: '好急'
        },{
          value: 3,
          label: '急中急'
        }], 
        value: '',
      dormitoryrepair: {
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
      editorOption: {
        modules: {
          toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: handlers,
                        }
          // toolbar: [
          //   ["bold", "italic", "underline", "strike"],
          //   ["clean"],
          // ],
        },
        placeholder: "请输入报修问题...",
        theme: "snow",
      },
      keyWorld:"",
      userBackup: Object.assign({}, this.user),
      multipleSelection: [],
      dormitoryrepairFormVisible: false,
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
    this.getdormitoryrepairs();
    this.getBuildingOptions();
  },
  methods: {
    
     getBuildingOptions() {
      this.$axios
        .get(
          "/api/building/selectAllDormitorys"
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.BuildingOptions = res.data.data;
            console.log(this.BuildingOptions)
          } 
        });
    },
    getdormitoryrepairs() {
      let user  = JSON.parse(sessionStorage.getItem('user'));
      this.$axios
        .get(
          "/api/Dormitoryrepair/selectDormitoryRepairBySno?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize +
            "&keyWorld=" +this.keyWorld+"&sno="+user.sno
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.dormitoryrepairs = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getdormitoryrepairs(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getdormitoryrepairs(this.currentPage, this.pageSize);
    },
    //上传图片
    handleSuccess(res, file) {
      this.$message({
        type: "info",
        message: "图片上传成功",
        duration: 6000,
      });
      this.dormitoryrepair.spicture = res;
      console.log(this.dormitoryrepair);
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
    handleEdit(index, row) {
      //点击修改将这一行（row）的数据传递给dormitoryrepair
      this.dormitoryrepair = Object.assign({}, row);
      this.dormitoryrepairFormVisible = true;
      this.rowIndex = index;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["dormitoryrepair"].validate((valid) => {
        if (valid) {
          let id = this.dormitoryrepair.id;
          console.log(this.dormitoryrepair);
          //return false;
          if (id) {
            this.$axios
              .post(
                "/api/Dormitoryrepair/updateDormitoryRepair",this.dormitoryrepair)
              .then((res) => {
                //console.log(this.user.aid);
                //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                 // this.$router.push({ path: '/dormitoryrepair' })
                 this.getdormitoryrepairs(this.currentPage, this.pagesize);
                  //location.reload();
                } 
                else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              });
          }
          this.dormitoryrepairFormVisible = false;
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
          this.dormitoryrepairs.splice(index, 1);
          this.$axios
            .post(
              "/api/dormitoryrepair/deletedormitoryrepair",
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
      this.dormitoryrepair = Object.assign({}, this.userBackup);
      this.dormitoryrepairFormVisible = true;
    },
    handleSearch(){
      this.getdormitoryrepairs();
    }
  },
};
</script>

<style lang="scss" scoped>
.dormitoryrepair-box {
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
    color: tomato !important;
  }
  .font-class-green {
    color: lightgreen !important;
  }
  .font-class-bule {
    color: skyblue !important;
  }
</style>
