<template>
  <div class='menu'>
    <el-menu
      :default-active="$route.path"
      router>
      <el-menu-item index="/index/student">
        <i class="fa fa-user-o"></i>
        学生信息
      </el-menu-item>
      <el-menu-item index="/index/repair">
        <i class="fa fa-wrench"></i>
        我的报修
      </el-menu-item>
      <el-menu-item index="/index/dormitory">
        <i class="fa fa-bed"></i>
        寝室管理
      </el-menu-item>
      <el-menu-item index="/index/problem">
        <i class="fa fa-server"></i>
        问题反馈
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Menu',
};
</script>

<style scoped>
  i.fa {
    margin-right: 10px;
  }
  .menu {
    position: fixed;
    width: 180px;
    left: 0;
    top: 80px;
    bottom: 0;
    border-right: solid 1px #ccc;
    z-index: 102;
  }
</style>
