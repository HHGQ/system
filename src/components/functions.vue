<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导入导出</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">提示窗</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">可合并/取消合并表格</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-setting"></i>
          <span slot="title">树选择框</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-setting"></i>
          <span slot="title">树</span>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="el-icon-setting"></i>
          <span slot="title">后端接口导入导出文件</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <clientImportAndExport v-show="showKey==2"/>
      <notify v-show="showKey==3"/>
      <tableUI v-show="showKey==4"/>
      <treeSelect v-show="showKey==5" />
      <tree v-show="showKey==6" />
      <ajaxImportAndExport v-show="showKey==7" />
    </el-col>
  </el-row>
</template>

<script>
import clientImportAndExport from './functionCollection/clientImportAndExport.vue'
import notify from './functionCollection/notify.vue'
import tableUI from './functionCollection/table.vue'
import treeSelect from './functionCollection/treeSelect.vue'
import tree from './functionCollection/tree.vue'
import ajaxImportAndExport from './functionCollection/ajaxImportAndExport.vue'
export default {
  components: {
    clientImportAndExport,
    notify,
    tableUI,
    treeSelect,
    tree,
    ajaxImportAndExport
  },
  data() {
    return {
      showKey: 2,
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
  .el-col-4 {
    height: 100%;
    .el-menu-vertical-demo {
      height: 100%;
    }
  }
}
</style>