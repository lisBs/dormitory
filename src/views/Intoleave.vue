<template>
  <div class="Intoleave-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="Intoleaves"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        sortable
        prop="ileavejobnum"
        label="宿管员编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="istudentnum"
        label="学生学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="istudentname"
        label="学生姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="istudormitorynum"
        label="学生宿舍"
        width="180">
      </el-table-column>
      <el-table-column
        prop="intotime"
        label="进入时间"
        width="180">
      </el-table-column>

      <el-table-column
        prop="iway"
        label="入访原因">
      </el-table-column>

      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{  scope.row.comebacklate==true ? '晚归' : '正常' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[1, 3, 4, 6]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="IntoleaveFormVisible" @close="resetForm('Intoleave')">
      <el-form :model="Intoleave" :rules="rules" ref="Intoleave">
        <el-form-item label="宿管员编号" prop="ileavejobnum" label-width="90px">
          <el-input v-model="Intoleave.ileavejobnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生学号" prop="istudentnum" label-width="90px">
          <el-input v-model="Intoleave.istudentnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生名字" prop="istudentname" label-width="90px">
          <el-input v-model="Intoleave.istudentname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生宿舍号" prop="istudormitorynum" label-width="90px">
          <el-input v-model="Intoleave.istudormitorynum" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="进入时间" prop="intotime" label-width="90px">
          <el-input v-model="Intoleave.intotime" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="入访日期" label-width="90px">
           <el-date-picker
            v-model="Intoleave.intotime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item> 
          <el-form-item label="是否晚归" prop="comebacklate" label-width="90px">
            <el-radio-group v-model="Intoleave.comebacklate">
              <el-radio  :label="true">是</el-radio>
              <el-radio  :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入访原因" prop="iway" label-width="90px">
          <el-input v-model="Intoleave.iway" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="IntoleaveFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitIntoleave('Intoleave')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Intoleaves: [],
      Intoleave: {
        ileavejobnum: '',
        istudentnum: '',
        istudentname: '',
        istudormitorynum: '',
        intotime: '',
        comebacklate: 1,
        iway: ''
      },
      IntoleaveBackup: Object.assign({}, this.Intoleave),
      multipleSelection: [],
      radio: '1',
      IntoleaveFormVisible: false,
      dialogTitle: '',
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 1,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getIntoleaves()
  },
  
  methods: {
    getIntoleaves() {
      this.$axios
        .get(
          "/api/IntoLeave/selectAllIntoLeave?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((res) => {
          if (res.data.code == 200) {
            console.log("res.data="+res.data.data);
            this.Intoleaves = res.data.data.list;
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getIntoleaves(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getIntoleaves(this.currentPage, this.pageSize);
    },
    
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.Intoleave = Object.assign({}, row)
      console.log(row);
      //this.Intoleave.comebacklate = row == false ? 0 : 1;
      //console.log(this.Intoleave);
      this.IntoleaveFormVisible = true
      this.rowIndex = index
    },
    submitIntoleave (formName) {
      // 表单验证
      //console.log(this.$refs['IntoleaveForm']);
      this.$refs['Intoleave'].validate((valid) => {
        //console.log(this.Intoleave.iid);
        //return false;
        if (valid) {
          let id = this.Intoleave.iid
          console.log(id);
          if (id) {
            this.$axios.post("/api/IntoLeave/updateIntoLeave",this.Intoleave).then((res) => {
              console.log(this.Intoleave);
              //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  //location.reload();
                  this.getIntoleaves(this.currentPage, this.pageSize);
                }else{
                    this.$notify.error({
                      title: '错误',
                      message: res.data.message
                    });
                }
            })

          } else {
            console.log(this.Intoleave.intotime);
            ///return false;
            this.$axios.post("/api/IntoLeave/addIntoLeave",this.Intoleave).then((res) => {
              if (res.data.code == 200) {
                console.log("成功");
                //this.Intoleaves.unshift(this.Intoleave)
                this.getIntoleaves(this.currentPage, this.pageSize);
              }else{
                  this.$notify.error({
                    title: '错误',
                    message: res.data.msg
                  });
              }
            }); 
          }
          this.IntoleaveFormVisible = false
          // this.$message({
          //   type: 'success',
          //   message: id ? '修改成功！' : '新增成功！'
          // })
        }
      })
    },
    handleDelete (index, row) {
       
      this.$confirm(`确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Intoleaves.splice(index, 1)
        // console.log(row.iid);
        // return false;
          this.$axios.post("/api/IntoLeave/deleteIntoLeave",this.$Qs.stringify( {
                iid: row.iid
           })).then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }else{
                  this.$notify.error({
                    title: '错误',
                    message: res.data.message
                  });
              }
          })
        }).catch(() => {
        console.log('取消删除')
      })
    },
    resetForm (formName) {
      this.$refs[formName].clearValidate()
    },
    mulDelete () {
      let len = this.multipleSelection.length
      console.log("multipleSelection:"+this.multipleSelection);
      console.log("len:"+len);
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项！'
        })
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除了${len}条数据！`
          })
        }).catch(() => {
          console.log('取消删除')
        })
      }
    },
    selectChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.dialogTitle = '新增'
      this.Intoleave = Object.assign({}, this.IntoleaveBackup)
      this.IntoleaveFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .Intoleave-box {
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
