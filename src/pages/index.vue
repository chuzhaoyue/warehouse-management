<template>
  <el-container class="wrapper">
    <el-aside class="sidebar ele_menu" width="12rem">
      <el-header height="3rem" class="left-header">食品仓库管理</el-header>
      <el-menu class="el-menu-vertical-demo ele_fontsize_9" router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu v-for="firstMenu in menuList" :key="firstMenu.path" :index="firstMenu.path">
          <template slot="title">
            <i :class="firstMenu.icon"></i>
            <span>{{firstMenu.name}}</span>
          </template>
          <el-menu-item v-for="secondMenu in firstMenu.children" :key="secondMenu.path" :index="secondMenu.path">{{secondMenu.name}}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="3rem" class="right-header">
        <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item v-for="(item, index) in this.breadcrumb" :to="item.path" :key="index">{{ item.meta }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      menuList: [
        {
          name: '基础信息',
          icon: 'el-icon-user',
          path: '/basic',
          children: [{ name: '员工管理', path: '/basic/staff-list' }]
        },
        {
          name: '仓库管理',
          icon: 'el-icon-edit-outline',
          path: '/warehouse',
          children: [
            { name: '库存信息', path: '/warehouse/stock' },
            { name: '入库信息', path: '/warehouse/in-list' },
            { name: '出库信息', path: '/warehouse/out-list' }
          ]
        }
      ]
    }
  },
  computed: {
    breadcrumb () {
      if (this.$route.name === 'home') {
        return [{ path: '/', meta: '首页' }];
      }
      return this.$route.matched.map(function (item) {
        if (!item.path) {
          item.path = '/';
        }
        return item;
      })
    }
  },
  methods: {
  }
};
</script>

<style scoped>
.wrapper {
  height: 100%;
}
.wrapper > .el-aside {
  color: #333;
  background-color: #545c64;
  overflow: hidden;
}
.wrapper > .el-aside > .el-menu{
  width: 12rem;
}
.wrapper > .el-container {
  height: 100%;
}
.el-header {
  line-height: 3rem;
  border-bottom: 1px solid #eee;
}
.left-header {
  background-color: #545c64;
  text-align: center;
  color: #fff;
  font-size: 1.36rem;
  font-weight: bolder;
}
.right-header {
  background-color: #fff;
  color: #333;
}
.bread {
  height: 0px;
  line-height: 3rem;
  font-size: 0.8rem;
}
.wrapper > .el-container > .el-main {
  height: 100%;
  padding: 15px;
}
</style>