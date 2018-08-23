<template>
  <div class="home-wrapper">
    <Header />
    <Menu />
    <router-view class='main-wrapper' />
  </div>
</template>

<script>
import Header from './Header';
import Menu from './Menu';

export default {
  name: 'Home',
  components: {
    Header,
    Menu,
  },
};
</script>

<style scoped>
  .main-wrapper{
    position: absolute;
    top: 80px;
    right: 0;
    bottom: 0;
    left: 180px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-width: 750px;
  }
</style>
