<template>
  <div class="hello">
      <colorPicker v-model="color" v-on:change="headleChangeColor"></colorPicker>
      <test-panel></test-panel>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      color: 'gray'
    }
  },
  created() {
    console.log(this.$msg)
    console.log(this.$myMethod(['1', '2']))
    this.$testPlugin2()()
  },
  methods: {
    headleChangeColor(val) {
      console.log(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
