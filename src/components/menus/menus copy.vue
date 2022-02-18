
<!--
<template>
  <el-menu
    class="menu-nav"
    router
    :default-active="currentPath"
    background-color="#20222A"
    text-color="rgba(255,255,255,.8)"
    active-text-color="#ffd04b"
    :collapse="isCollapse">
    <el-menu-item index="/console">
      <i class="el-icon-location"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="/users">
      <i class="el-icon-menu"></i>
      <span slot="title">宿管员</span>
    </el-menu-item>
    <el-menu-item index="/student">
      <i class="el-icon-document"></i>
      <span slot="title">学生管理</span>
    </el-menu-item>
    <el-submenu>
      <template slot="title">
        <i class="el-icon-info"></i>
        <span>宿舍管理</span>
      </template>
      <el-menu-item index="/dormitorybuilding">宿舍楼设置</el-menu-item>
      <el-menu-item index="/dormitory">宿舍号设置</el-menu-item>
      <el-menu-item index="/intoleave">晚归登记</el-menu-item>
      <el-menu-item index="/outleave">外出登记</el-menu-item>
      <el-menu-item index="/visitors">来访人登记</el-menu-item>
    </el-submenu>

    <el-submenu index="/setting">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>设置</span>
      </template>
      <el-menu-item index="/profile">基本资料 </el-menu-item>
      <el-menu-item index="/updatepwd">修改密码 </el-menu-item>
    </el-submenu>
    <el-menu-item index="/echarts">
      <i class="el-icon-share"></i>
      <span slot="title">图表</span>
    </el-menu-item>
  </el-menu>
</template>
-->

<template>
    <div>
      <template v-for="item in data">
        
        <template v-if="item.child && item.child.length>0">
           <el-submenu :index="item.path"
                          :key="item.id">
                <template slot="title"> {{item.name}}</template>
                <template v-for="child in item.child">
                  <el-menu-item :index="child.path" :key="child.id">{{child.name}}</el-menu-item>
                </template>
           </el-submenu>
        </template>
          
        <template v-else>
              <el-menu-item :index="item.path" :key="item.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
        </template>
      </template>
    </div>
</template>


<script>
import Vue from 'vue'
export default {
  props: ['isCollapse'],
  data () {
    return {
      data:[],
      menus: [],
      currentPath: location.pathname
    }
  },
  mounted() {
    this.getUsers();
  },
  methods:{
    getUsers() {
      this.$axios
        .get(
          "/api/Menu/adminMenu?type=0"
        )
        .then((res) => {
          console.log("res.data=");
          console.log(res.data);
          if (res.data.code == 200) {
            this.data = res.data;
          } 
        });
    }
  }
}

</script>

<style lang="scss" scoped>
  .el-menu {
    border: none;
  }
  .menu-nav:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
