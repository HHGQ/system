<template>
  <div style="height: 82%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="一般地图" name="1">
      </el-tab-pane>
      <el-tab-pane label="7.3.0地图" name="9">
      </el-tab-pane>
      <el-tab-pane label="栅格地图" name="2">
      </el-tab-pane>
      <el-tab-pane label="超图" name="3">
      </el-tab-pane>
      <el-tab-pane label="可切换地图" name="4">
      </el-tab-pane>
      <el-tab-pane label="debug地图" name="5">
      </el-tab-pane>
      <el-tab-pane label="静态地图" name="6">
      </el-tab-pane>
      <el-tab-pane label="3D地图" name="7">
      </el-tab-pane>
      <el-tab-pane label="mapbox" name="8">
      </el-tab-pane>
    </el-tabs>
    <keep-alive>
      <normalMap v-if="activeName==1" />
      <newOlMap v-else-if="activeName==9" />
      <vectorMap v-else-if="activeName==2" />
      <superMap v-else-if="activeName==3" />
      <transformMap v-else-if="activeName==4" />
      <debugMap v-else-if="activeName==5" />
      <staticMap v-else-if="activeName==6" />
      <threeDMap v-else-if="activeName==7" />
      <mapbox v-else-if="activeName==8" />
    </keep-alive>
  </div>
</template>

<script>
import normalMap from './map/map.vue'
import newOlMap from './map/7.3.0map.vue'
import vectorMap from './map/vectorMap.vue'
import superMap from './map/superMap.vue'
import transformMap from './map/transformMap.vue'
import debugMap from './map/debugMap.vue'
import staticMap from './map/staticMap.vue'
import DMap from './map/3DMap.vue'
import threeDMap from './map/3DMap.vue'
import mapbox from './map/mapbox.vue'
export default {
  components: {
    normalMap,
    newOlMap,
    vectorMap,
    superMap,
    transformMap,
    debugMap,
    staticMap,
    threeDMap,
    mapbox
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