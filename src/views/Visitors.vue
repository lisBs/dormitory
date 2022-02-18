<template>
  <div class="Visitors-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
        </div>
      </el-col>
    </el-row>
    
    <el-table
      :data="Visitorss"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        sortable
        prop="vintotime"
        label="来访开始时间"
        width="180">
      </el-table-column>
      <el-table-column
        sortable
        prop="vouttime"
        label="来访结束时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="vname"
        label="来访人姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="visitname"
        label="被访人姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="visitrelation"
        label="与被访人关系"
        width="180">
      </el-table-column>
      <el-table-column
        prop="visitdormitorynum"
        label="被访者宿舍号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="vway"
        label="来访原因"
        width="180">
      </el-table-column>

      <el-table-column
        prop="vphone"
        label="来访人电话" 
        width="180">
        
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
      :page-sizes="[7, 10, 20, 30]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="VisitorsFormVisible" @close="resetForm('Visitors')">
      <el-form :model="Visitors" :rules="rules" ref="Visitors">
        <el-form-item label="来访开始时间" label-width="100px">
           <el-date-picker
            v-model="Visitors.vintotime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来访结束时间" label-width="100px">
           <el-date-picker
            v-model="Visitors.vouttime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="来访人姓名" prop="vname" label-width="100px">
          <el-input v-model="Visitors.vname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="被访人姓名" prop="visitname" label-width="100px">
          <el-input v-model="Visitors.visitname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="与被访人关系" prop="visitrelation" label-width="100px">
          <el-input v-model="Visitors.visitrelation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="来访原因" prop="vway" label-width="100px">
          <el-input v-model="Visitors.vway" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="来访人电话" prop="vphone" label-width="100px">
          <el-input v-model="Visitors.vphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="被访者宿舍号" prop="visitdormitorynum" label-width="100px">
          <el-input v-model="Visitors.visitdormitorynum" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="VisitorsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitVisitors('Visitors')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Visitorss: [],
      Visitors: {
        vintotime: '',
        vname: '',
        vway: '',
        vphone: '',
        vouttime: '',
        visitname: '',
        visitrelation: '',
        visitdormitorynum: ''
      },
      VisitorsBackup: Object.assign({}, this.Visitors),
      multipleSelection: [],
      VisitorsFormVisible: false,
      dialogTitle: '',
      rowIndex: 9999,
      //当前页码
      currentPage: 1,
      total: 10,
      //默认每页数据量
      pageSize: 7,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getVisitorss()
  },
  
  methods: {
    getVisitorss() {
      this.$axios
        .get(
          "/api/Visitors/selectAllVisitors?currentPage=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.Visitorss = res.data.data.list;
            console.log(res.data.data.list);
            this.total = res.data.data.total;
          } 
        });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.getVisitorss(this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        this.getVisitorss(this.currentPage, this.pageSize);
    },
    
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.Visitors = Object.assign({}, row)
      console.log(row);
      //this.Visitors.comebacklate = row == false ? 0 : 1;
      //console.log(this.Visitors);
      this.VisitorsFormVisible = true
      this.rowIndex = index
    },
    submitVisitors (formName) {
      // 表单验证
      //console.log(this.$refs['VisitorsForm']);
      this.$refs['Visitors'].validate((valid) => {
        //console.log(this.Visitors.iid);
        //return false;
        if (valid) {
          let id = this.Visitors.iid
          console.log(id);
          if (id) {
            this.$axios.post("/api/Visitors/updateVisitor",this.Visitors).then((res) => {
              console.log(this.Visitors);
              //return false;
                if (res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  //location.reload();
                  this.getVisitorss(this.currentPage, this.pageSize);
                }else{
                    this.$notify.error({
                      title: '错误',
                      message: res.data.message
                    });
                }
            })

          } else {
            console.log(this.Visitors.intotime);
            ///return false;
            this.$axios.post("/api/Visitors/addVisitor",this.Visitors).then((res) => {
              if (res.data.code == 200) {
                console.log("成功");
                //this.Visitorss.unshift(this.Visitors)
                this.getVisitorss(this.currentPage, this.pageSize);
              }else{
                  this.$notify.error({
                    title: '错误',
                    message: res.data.msg
                  });
              }
            }); 
          }
          this.VisitorsFormVisible = false
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
        this.Visitorss.splice(index, 1)
        // console.log(row.iid);
        // return false;
          this.$axios.post("/api/Visitors/deleteVisitor",this.$Qs.stringify( {
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
      this.Visitors = Object.assign({}, this.VisitorsBackup)
      this.VisitorsFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .Visitors-box {
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
