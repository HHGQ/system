<template>
  <el-row class="tac">
    <el-col :span="2">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">打印</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">颜色选择器</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <vuePrintNb v-show="showKey==1"/>
      <vColorPicker v-show="showKey==2"/>
    </el-col>
  </el-row>
</template>

<script>
import vuePrintNb from './plugin/vuePrintNb.vue'
import vColorPicker from './plugin/vColorPicker.vue'
export default {
  components: {
    vuePrintNb,
    vColorPicker
  },
  data() {
    return {
      showKey: 1,
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      this.showKey = key
      console.log(key, keyPath);
    }
  },
};
</script>

<style lang="less" scoped>
.tac {
  height: calc(100% - 57px);
  .el-col-2 {
    height: 100%;
    .el-menu-vertical-demo {
      height: 100%;
    }
  }
  .el-col-20 {
    padding: 30px;
  }
}
</style>