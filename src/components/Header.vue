<template>
  <header>
    <div class='logo-wrapper'>
      <img src='../assets/images/logo.png'>
      <div class='logo-title'>智猪管理系统</div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  beforeCreate() {
    if (sessionStorage.getItem('username') === null) {
      this.$router.replace('/login');
    }
  },
};
</script>

<style scoped>
  header {
    position: fixed;
    width: 100%;
    height: 80px;
    background-color: #20a0ff;
    display: flex;
    align-items: center;
    padding-left: 180px;
    z-index: 102;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-title {
    color: #ffffff;
    font-size: 20px;
  }
</style>
