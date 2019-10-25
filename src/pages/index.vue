<template>
  <el-container class="wrapper">
    <el-aside class="sidebar" width="200px">
      <el-header class="left-header">食品仓库管理</el-header>
      <el-menu class="el-menu-vertical-demo" router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>基础信息</span>
          </template>
          <el-menu-item index="1-1" route="/basic/staff-list">员工管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>仓库管理</span>
          </template>
          <el-menu-item index="2-1" route="/warehouse/stock">库存信息</el-menu-item>
          <el-menu-item index="2-2" route="/warehouse/in-list">入库信息</el-menu-item>
          <el-menu-item index="2-3" route="/warehouse/out-list">出库信息</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="right-header">
        <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item v-for="(item, index) in this.breadcrumb" :to="item.path" :key="index">{{ item.meta }}</el-breadcrumb-item>
        </el-breadcrumb>
        <img class="mushroom" src="../assets/mushroom.png" alt="mushroom">
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
  height: 705px;
  border: 1px solid #eee;
}
.el-aside {
  color: #333;
  background-color: #545c64;
}
.el-header {
  line-height: 60px;
  border-bottom: 1px solid #eee;
}
.left-header {
  background-color: #545c64;
  text-align: center;
  color: #fff;
  font-size: 23px;
  font-weight: bolder;
}
.right-header {
  background-color: #fff;
  color: #333;
}
.bread {
  height: 0px;
  line-height: 60px;
}
.mushroom{
  float: right;
  width: 30px;
  height: 30px;
  margin: 15px 20px 15px auto;
}
</style>