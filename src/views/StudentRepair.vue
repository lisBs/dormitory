<template>
  <div class="user-box">
    <el-card title="报修申请">
    <div slot="header" class="clearfix"> 
      <span>报修申请</span> 
        <el-button style="float: right; padding: 3px 0 ;" type="text">操作按钮</el-button>
    </div>
    <el-form ref="form" :model="repairlist" label-width="90px">
      <el-form-item label="报修人" prop="repairpeople">
        <el-input v-model="repairlist.repairpeople"></el-input>
      </el-form-item>
      <el-form-item label="学生学号" prop="sno">
        <el-input v-model="repairlist.sno"></el-input>
      </el-form-item>
      <el-form-item label="紧急情况" prop="repairemergency">
        <el-select v-model="repairlist.repairemergency" placeholder="请选择">
          <el-option
           v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报修楼栋" prop="repairdormibuilding">
       <el-select v-model="repairlist.repairdormibuilding" placeholder="请选择">
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
      <el-form-item label="报修宿舍" prop="repairdormitory">
        <el-input v-model="repairlist.repairdormitory"></el-input>
      </el-form-item>
      
      <!-- <el-form-item label="报修问题" prop="repairder">
        <el-input v-model="repairlist.repairder"></el-input>
      </el-form-item> -->
      <el-form-item label="报修问题" prop="repairder">
          <quill-editor ref="TextEditor"
              v-model="repairlist.repairder"
              :options="editorOption">
          </quill-editor>
      </el-form-item>
      <el-form-item style="margin-top: 60px;">
        <el-button type="primary" @click="submitUser('form')">申请</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      repairlists: [],
      BuildingOptions: [],
      options: [
          {
          value: '1',
          label: '急'
        }, {
          value: '2',
          label: '好急'
        },{
          value: '3',
          label: '急中急'
        }], 
        value: '',
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
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["clean"],
          ],
        },
        placeholder: "请输入报修问题...",
        theme: "snow",
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

    getUser(){
      let  admin  = JSON.parse(sessionStorage.getItem('user'))
      this.user = admin;
    },
    submitUser(formName) {
      // 表单验证
      this.$refs["form"].validate((valid) => {
            this.$axios
              .post("/api/Dormitoryrepair/addDormitoryRepair", this.repairlist)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "报修成功!",
                  });
                  this.$router.push({ path: '/studentrepair' })
                }else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.message,
                  });
                }
              });
      });
    }
  },
  components: {
    quillEditor,
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
   .quill-editor {
    height: 200px;
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .biux{
    margin: 20px 88px;
  }
}
</style>
