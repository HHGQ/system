<template>
  <div class="map_containter">
    <el-button @click="transformUrl">通过url切换</el-button>
    <el-button @click="transformVisible">通过visible切换</el-button>
    <div id="map1"></div>
  </div>
</template>

<script>
import ol from 'openlayers'

export default {
  data() {
    return {
      visible: true,
      map: null,
      overlay: null
    }
  },
  created() {
    
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.normalMap = new ol.layer.Tile({
        // visible: this.visible,
        source: new ol.source.XYZ({
          url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
          crossOrigin: 'anonymous', // 导出图片是否允许跨域
        }),
      }),
      this.mixMap = new ol.layer.Tile({
        visible: !this.visible,
        source: new ol.source.XYZ({
          url: `http://t5.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=5b1c7a4af317c1efaa03265e11a6204e&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}`,
          crossOrigin: 'anonymous' // 导出图片是否允许跨域
        })
      }),
      this.map = new ol.Map({
        target: 'map1',
        layers: [
          this.normalMap,
          this.mixMap
        ],
        view: new ol.View({
          center: [112.9819047,23.660930],
          zoom: 14,
          projection: 'EPSG:4326' // 要严格按照要求，如EPSG:4326中间不能有空格
        })
      });
    },
    transformUrl() {
      // 弊端是会有缓存的瓦片，导致放大缩小会有之前瓦片的残留
      const tileSource = this.map.getLayers().getArray()[0].getSource()
      if (tileSource.getUrls()[0] == 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}') {
        tileSource.setUrl('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'); //显示瓦片
      } else {
        tileSource.setUrl('http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}'); //显示瓦片
      }
      // this.map.getLayers().getArray()[0].setSource(tileSource)
    },
    transformVisible() {
      this.visible = !this.visible
      this.map.getLayers().getArray()[0].setVisible(this.visible); //显示瓦片
      this.map.getLayers().getArray()[1].setVisible(!this.visible); //关闭矢量
      // this.normalMap.setVisible(this.visible); //显示瓦片
      // this.mixMap.setVisible(!this.visible); //关闭矢量
    }
  },
}
</script>

<style lang="less" scoped>
#map1 {
  width: 100%;
  height: 800px;
}
</style>