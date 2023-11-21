<template>
  <div
    style="
      display: grid;
      gap: 3px;
      grid-template-columns: repeat(9, 1fr);
      grid-template-rows: repeat(9, 1fr);
      width: 100%;
      height: calc(100% - 73px);
    "
  >
    <div class="item" style="grid-area: auto / auto / span 2 / span 2"></div>
    <div class="item" v-for="item in itemNums" :key="item">
      <span>这是</span>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {

  },
  data() {
    return {
      itemNums: 79
    }
  },
}
</script>

<style lang="less" scoped>
.item {
  display: inline-block;
  background: black;
  overflow: hidden;
}
</style>