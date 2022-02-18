<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">
        <!-- 最后一级菜单(可以点击那个菜单) -->
      <el-menu-item v-if="navMenu.child<=0 && navMenu"
                    :key="navMenu.id" :index="navMenu.name" 
                    :route="navMenu.path"
                   >
        <i :class="navMenu.icon"></i>
        <span slot="title">{{navMenu.name}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单（下拉菜单） -->
      <el-submenu v-if="navMenu.child.length>0 && navMenu"
                  :key="navMenu.id" :index="navMenu.name"
                  :route="navMenu.path">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span> {{navMenu.name}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.child"></NavMenu>
      </el-submenu>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    data() {
      return {
        currentPath: location.pathname
      }
    },
    methods: {}
  }
</script>

<style>
</style>
