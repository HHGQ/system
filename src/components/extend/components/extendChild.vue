<template>
  <div>
    随便写点东西吧，这是测试extend的子组件
    <p @click="change">改变按钮状态</p>
    <el-button type="primary" :disabled="disabled">主要按钮</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: true
    }
  },
  methods: {
    change() {
      this.disabled = !this.disabled
    }
  }
}
</script>