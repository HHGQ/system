<template>
  <div class="map_containter">
    <el-button @click="changeMethod">切换加载方式</el-button>
    <div id="baidumap" tabindex="1"></div>
  </div>
</template>

<script>
// 4.6.5
import ol from "openlayers";
// 7.3.0
import Map from "ol/Map";
import View from "ol/View";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import Overlay from "ol/Overlay.js";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import TileDebug from "ol/source/TileDebug";
import Control from "ol/control/Control";
import MousePosition from "ol/control/MousePosition";
import FullScreen from "ol/control/FullScreen";
import * as olCoordinate from "ol/coordinate";
import { defaults as controlDefaults } from "ol/control/defaults";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
// import proj4 from "proj4";
import $ from "jquery";
import { initLayer, transform3857To4326, transform4326To3857 } from "./js/map";
import {
  startScreenShot,
  html2canvasPrint,
  domtoimagePrint,
} from "./js/mapTool";
import { getPoint } from "@/api/mapApi";
import LayerGroup from "ol/layer/Group";
import DragAndDrop from "ol/interaction/DragAndDrop";
import GeoJSON from "ol/format/GeoJSON.js";
import Modify from "ol/interaction/Modify";
import { KeyboardZoom } from "ol/interaction";
import TileGrid from 'ol/tilegrid/TileGrid';
export default {
  components: {},
  data() {
    return {
      map: null,
      source: null,
      useNewVersion: false,
    };
  },
  created() {},
  mounted() {
    this.changeMethod()
  },
  methods: {
    changeMethod() {
      this.useNewVersion = !this.useNewVersion
      document.getElementById('baidumap').innerHTML = ''
      if (this.useNewVersion) {
        this.initMapByNewVersion();
      } else {
        this.initMapByOldVersion();
      }
    },
    // 使用7.3.0版本的openlayers加载
    initMapByNewVersion() {
      var resolutions = [];
      var maxZoom = 18;

      // 计算百度使用的分辨率
      for (var i = 0; i <= maxZoom; i++) {
        resolutions[i] = Math.pow(2, maxZoom - i);
      }
      var tilegrid = new TileGrid({
        origin: [0, 0], // 设置原点坐标
        resolutions: resolutions, // 设置分辨率
      });
      console.log(tilegrid, 'resolutions')
      this.map = new Map({
        target: "baidumap",
        layers: [
          new TileLayer({
            source: new XYZ({
              tilePixelRatio: 2,
              tileGrid: tilegrid,
              tileUrlFunction: function (tileCoord) {
                console.log(tileCoord, 'tile')
                // 参数tileCoord为瓦片坐标
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = -tileCoord[2] - 1;

                // 百度瓦片服务url将负数使用M前缀来标识
                if (x < 0) {
                  x = "M" + -x;
                }
                if (y < 0) {
                  y = "M" + -y;
                }

                // 返回经过转换后，对应于百度在线瓦片的url
                return (
                  "http://online2.map.bdimg.com/onlinelabel/?qt=tile&x=" +
                  x +
                  "&y=" +
                  y +
                  "&z=" +
                  z +
                  "&styles=pl&udt=20160321&scaler=2&p=0"
                );
              },
            }),
          }),
        ],
        view: new View({
          zoom: 10,
          center: ol.proj.transform(
            [112.9819047, 23.66093],
            "EPSG:4326",
            "EPSG:3857"
          ),
          // projection: "EPSG:4326",
        }),
      });
    },
    // 使用4.6.5版本的openlayers加载
    initMapByOldVersion() {
      var resolutions = [];
      var maxZoom = 18;

      // 计算百度使用的分辨率
      for (var i = 0; i <= maxZoom; i++) {
        resolutions[i] = Math.pow(2, maxZoom - i);
      }
      var tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0], // 设置原点坐标
        resolutions: resolutions, // 设置分辨率
      });
      console.log(tilegrid, 'resolutions')
      var baiduMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          tilePixelRatio: 2,
          tileGrid: tilegrid,
          tileUrlFunction: function (tileCoord) {
            console.log(tileCoord, 'tile')
            // 参数tileCoord为瓦片坐标
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
              x = "M" + -x;
            }
            if (y < 0) {
              y = "M" + -y;
            }

            // 返回经过转换后，对应于百度在线瓦片的url
            return (
              "http://online2.map.bdimg.com/onlinelabel/?qt=tile&x=" +
              x +
              "&y=" +
              y +
              "&z=" +
              z +
              "&styles=pl&udt=20160321&scaler=2&p=0"
            );
          },
        }),
      });
      this.map = new ol.Map({
        target: "baidumap",
        layers: [baiduMapLayer],
        view: new ol.View({
          // center: [112.9819047, 23.66093],
          center: ol.proj.transform(
            [112.9819047, 23.66093],
            "EPSG:4326",
            "EPSG:3857"
          ),
          // projection: "EPSG:4326",
          zoom: 10,
        }),
      });
    },
  },
};
</script>

<style lang="less" scoped>
.map_containter {
  height: 100%;
  #baidumap {
    width: 100%;
    height: 89%;
  }
}
</style>
