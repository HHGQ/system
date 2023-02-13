<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="一般地图" name="1">
      </el-tab-pane>
      <el-tab-pane label="栅格地图" name="2">
      </el-tab-pane>
      <el-tab-pane label="超图" name="3">
      </el-tab-pane>
    </el-tabs>
    <keep-alive>
      <normalMap v-if="activeName==1" />
      <vectorMap v-else-if="activeName==2" />
      <superMap v-else-if="activeName==3" />
    </keep-alive>
  </div>
</template>

<script>
import normalMap from './map/map.vue'
import vectorMap from './map/vectorMap.vue'
import superMap from './map/superMap.vue'
export default {
  components: {
    normalMap,
    vectorMap,
    superMap
  },
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>
// .el-tabs {
//   height: 100%;
//   /deep/ .el-tabs__content {
//     height: 100%;
//     .el-tab-pane {
//       height: 100%;
//     }
//   }
// }
</style>