<template>
  <div id="app" :class="theme">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    theme () {
      return this.$store.state.user.theme;
    }
  },
  beforeUpdate () {
    document.getElementsByTagName('body')[0].className = this.theme;
  }
};
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
