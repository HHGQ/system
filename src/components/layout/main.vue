<template>
  <div class="main_containter">
    <header-view></header-view>
    <keep-alive>
      <router-view>
        <template v-slot:tree>
          这是一个来自main.vue的数据
        </template>
      </router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import headerView from '@/components/header/index.vue'

export default {
  props: {
    msg: String
  },
  components: {
    headerView
  },
  data() {
    return {
      color: 'gray'
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main_containter {
  height: 100%;
}
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
