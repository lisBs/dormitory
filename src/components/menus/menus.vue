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
    <NavMenu :navMenus="menuData"></NavMenu>
  </el-menu>
</template>

<script>
import Vue from 'vue'
import NavMenu from "./NavMenu.vue";
export default {
  components: {
    NavMenu: NavMenu
  },
  props: ['isCollapse'],
  data () {
    return {
      menuData: [],
      currentPath: location.pathname
    }
  },
  mounted() {
    this.getUsers();
  },
  methods:{
    getUsers() {
      let  loginType  = JSON.parse(sessionStorage.getItem('loginType'))
      this.$axios
        .get(
          "/api/Menu/adminMenu?type="+loginType
        )
        .then((res) => {
          console.log("res.data=");
          console.log(res.data);
          if (res.data.code == 200) {
            this.menuData = res.data.data;
            console.log(this.currentPath);
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
