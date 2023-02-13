<template>
  <div class="map_containter">
    <div id="map1"></div>
  </div>
</template>

<script>
import ol from 'openlayers'

export default {
  data() {
    return {
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
      this.map = new ol.Map({
        target: 'map1',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
              crossOrigin: 'anonymous' // 导出图片是否允许跨域
            }),

          }),
          // new ol.layer.Tile({
          //   source: new ol.source.XYZ({
          //     url: `http://t5.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=5b1c7a4af317c1efaa03265e11a6204e&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}`,
          //     crossOrigin: 'anonymous' // 导出图片是否允许跨域
          //   })
          // }),
        ],
        view: new ol.View({
          center: [112.9819047,23.660930],
          zoom: 14,
          projection: 'EPSG:4326' // 要严格按照要求，如EPSG:4326中间不能有空格
        })
      });
    },
  },
}
</script>

<style lang="less" scoped>
#map1 {
  width: 100%;
  height: 800px;
}
</style>