<template>
  <div id="app_containter">
    <router-view tag="ddd"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    
  },
  mounted() {
    // console.log(this.$qs.parse('a[b][c][d][e][f][g][h][i]=j'))
  }
}
</script>

<style>
html, body, #app_containter {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  margin: 0;
  padding: 0;
}
</style>
