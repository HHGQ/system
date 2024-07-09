<template>
  <div class="map_containter">
    <div id="map1"></div>
  </div>
</template>

<script>
 // 用4.6.5的tileDebug不正确,7.3.0才行
import ol from 'openlayers' // 4.6.5
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileDebug from 'ol/source/TileDebug';
import * as control from 'ol/control';
import TileGrid from 'ol/tilegrid/TileGrid'

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
    // this.initMap()
    this.initMap2()
  },
  methods: {
    initMap() {
      let tileSource = new ol.source.XYZ({
        projection: 'EPSG:3857',
        url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
        crossOrigin: 'anonymous' // 导出图片是否允许跨域
      })
      this.map = new ol.Map({
        target: 'map1',
        layers: [
          new ol.layer.Tile({
              // projection: 'EPSG:4326',
            source: tileSource,
          }),
          new ol.layer.Tile({
            source: new ol.source.TileDebug({
              // template: 'z:{z} x:{x} y:{y}',
              projection: 'EPSG:3857',
              // //获取瓦片网格信息
              tileGrid: tileSource.getTileGrid()
            })
          })
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
      // console.log(tileSource.getTileGrid().getOrigin())
    },
    initMap2() {
      let tileSource = new XYZ({
        projection: 'EPSG:3857',
        url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
        crossOrigin: 'anonymous' // 导出图片是否允许跨域
      })
      this.map = new Map({
        target: 'map1',
        layers: [
          // new TileLayer({
          //     // projection: 'EPSG:4326',
          //   source: tileSource,
          // }),
          new TileLayer({
            source: new TileDebug({
              // template: 'z:{z} x:{x} y:{y}',
              // projection: 'EPSG:4326',
              // //获取瓦片网格信息
              // tileGrid: tileSource.getTileGrid(),
              wrapX: false,
              // tileGrid: new TileGrid({
              //   // origin: [-20037508.342789244, 20037508.342789244],    // 设置原点坐标
              //   origin: [-180,90],    // 设置原点坐标
              //   resolutions: resolutions    // 设置分辨率
              // })
            })
          })
          // new TileLayer({
          //   source: new source.XYZ({
          //     url: `http://t5.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=5b1c7a4af317c1efaa03265e11a6204e&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}`,
          //     crossOrigin: 'anonymous' // 导出图片是否允许跨域
          //   })
          // }),
        ],
        view: new View({
          center: [0,0],
          // center: ol.proj.transform([112.9819047,23.660930], 'EPSG:4326', 'EPSG:3857'),
          zoom: 0,
          projection: 'EPSG:3857', // 要严格按照要求，如EPSG:4326中间不能有空格
          minZoom: 0,
        })
      });
      // console.log(tileSource.getTileGrid().getOrigin())
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