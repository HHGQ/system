<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#6b7893"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <template v-for="(item, index) in menuItemArr">
          <el-menu-item
            v-if="!item.children"
            :key="index"
            :index="String(index)"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
          <el-submenu v-else :key="index" :index="String(index)">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="(child1, idx1) in item.children">
              <template>
                <el-menu-item
                  v-if="!child1.children"
                  :key="`${index}-${idx1}`"
                  :index="`${index}-${idx1}`"
                  >{{ child1.title }}</el-menu-item
                >
                <el-submenu
                  v-else
                  :key="`${index}-${idx1}`"
                  :index="`${index}-${idx1}`"
                >
                  <template slot="title">{{ child1.title }}</template>
                  <el-menu-item
                    v-for="(child2, idx2) in child1.children"
                    :key="`${index}-${idx1}-${idx2}`"
                    :index="`${idx1}-${idx2}-${idx2}`"
                    >{{ child2.title }}</el-menu-item
                  >
                </el-submenu>
              </template>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
    <el-col :span="20" style="height: 100%">
      <clientImportAndExport v-show="showKey == 0" />
      <notify v-show="showKey == 1" />
      <tableUI v-show="showKey == 2" />
      <treeSelect v-show="showKey == 3" />
      <tree v-show="showKey == 4" />
      <ajaxImportAndExport v-show="showKey == 5" />
      <webgl v-show="showKey == '6-0'" />
      <webgl1 v-show="showKey == '6-1'" />
      <graphMark v-show="showKey == 7" />
      <barrage v-show="showKey == 8" />
      <lazyload v-show="showKey == 9" />
    </el-col>
  </el-row>
</template>

<script>
import clientImportAndExport from "./functionCollection/clientImportAndExport.vue";
import notify from "./functionCollection/notify.vue";
import tableUI from "./functionCollection/table.vue";
import treeSelect from "./functionCollection/treeSelect.vue";
import tree from "./functionCollection/tree.vue";
import ajaxImportAndExport from "./functionCollection/ajaxImportAndExport.vue";
import webgl from "./functionCollection/webgl.vue";
import webgl1 from "./functionCollection/webgl1.vue";
import graphMark from "./functionCollection/graphMark.vue";
import barrage from "./functionCollection/barrage.vue";
import lazyload from "./functionCollection/lazyload.vue";
export default {
  components: {
    clientImportAndExport,
    notify,
    tableUI,
    treeSelect,
    tree,
    ajaxImportAndExport,
    webgl,
    webgl1,
    graphMark,
    barrage,
    lazyload,
  },
  data() {
    return {
      showKey: 2,
      menuItemArr: [
        {
          title: "导入导出",
        },
        {
          title: "提示窗",
        },
        {
          title: "可合并/取消合并表格",
        },
        {
          title: "树选择框",
        },
        {
          title: "树",
        },
        {
          title: "后端接口导入导出文件",
        },
        {
          title: "webgl解析yuv文件",
          children: [
            {
              title: "解析1",
            },
            {
              title: "解析2",
            },
            {
              title: "虚假导航",
              children: [
                {
                  title: "虚假1",
                },
                {
                  title: "虚假2",
                },
              ],
            },
          ],
        },
        {
          title: '图片评分'
        },
        {
          title: '发弹幕'
        },
        {
          title: '懒加载'
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      this.showKey = key;
      console.log(key, keyPath);
    },
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
