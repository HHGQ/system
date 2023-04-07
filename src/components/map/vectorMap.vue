<template>
  <div>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import ol from "openlayers";
import proj4 from "proj4";
// import Map from 'openlayers/Map';
// import View from 'openlayers/View';
import chinaGeo from "./json/china.json";
import zhanjiang from "./json/zhanjiang.json";
import html2canvas from "html2canvas";

// import "ol/ol.css";
// import TileLayer from "ol/layer/Tile";
// import VectorLayer from "ol/layer/Vector";
// import { OSM, Vector as VectorSource } from "ol/source";
// import XYZ from "ol/source/XYZ";
// import Map from 'ol/Map';
// import View from 'ol/View';
// import GeoJSON from "ol/format/GeoJSON";
// import Feature from 'ol/Feature';
// import { Style, Stroke, Fill } from "ol/style";
// import { Polygon, MultiPolygon } from "ol/geom";
// import { defaults as defaultControls, OverviewMap } from "ol/control";
// import { fromLonLat } from "ol/proj";
// import ZoomSlider from "ol/control/ZoomSlider";
export default {
  data() {
    return {
      map: null,
    };
  },
  created() {},
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      let vs = new ol.source.Vector({
        features: new ol.format.GeoJSON({
          featureProjection: "EPSG:4326",
        }).readFeatures(chinaGeo),
      }); //读取Geojson格式数据，只有通过这种方式才能出来！！！
      let zhanjiangVS = new ol.source.Vector({
        features: new ol.format.GeoJSON({
          featureProjection: "EPSG:4326",
        }).readFeatures(zhanjiang),
      }); //读取Geojson格式数据，只有通过这种方式才能出来！！！
      this.vs = vs;
      console.log(vs);
      this.map = new ol.Map({
        target: "map",
        layers: [
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: "http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}",
              // "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
              crossOrigin: "anonymous",
            }),
          }),
          new ol.layer.Vector({
            source: this.vs,
            zIndex: 2,
          }),
          new ol.layer.Vector({
            source: zhanjiangVS,
            zIndex: 3,
          }),
          // new ol.layer.Tile({
          //   source: new ol.source.XYZ({
          //     url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
          //     // tileGrid: new ol.tilegrid.TileGrid({
          //     //       // 原点（左上角）
          //     //       origin: origin,
          //     //       // 分辨率数组
          //     //       resolutions: resolutions,
          //     //       // 矩阵标识列表，与地图级数保持一致
          //     //       matrixIds: matrixIds,
          //     //   }),
          //     // tileSize: 256,
          //     // maxZoom: 18,
          //     // minZoom: 8
          //   })
          // }),
        ],
        view: new ol.View({
          center: [113.21, 21.272848],
          // center: ol.proj.fromLonLat([113.21, 21.272848]),
          zoom: 6,
          // center: [12630897.63, 2653513.69],
          projection: "EPSG:4326",
        }),
      });
      // 只有单击才触发
      this.map.on("singleclick", (e) => {
        this.showArea();
      });
    },
    showArea() {
      console.log(this.map.getView().getProjection().getMetersPerUnit()); // 获取地图单位转换为米
    },

    // addArea(geo = []) {
    //             if (geo.length == 0) return false;
    //             let areaFeature = null;
    //             // 设置图层
    //             this.areaLayer = new VectorLayer({   //矢量图层
    //                 source: new VectorSource({
    //                     features: []
    //                 })
    //             });
    //             // 添加图层
    //             this.map.addLayer(this.areaLayer);
    //             geo.forEach(g => {
    //                 let lineData = g.features[0];
    //                 if (lineData.geometry.type == "MultiPolygon") {
    //                     areaFeature = new Feature({
    //                         geometry: new MultiPolygon(
    //                             lineData.geometry.coordinates
    //                         ).transform("EPSG:4326", "EPSG:3857")
    //                     });
    //                 } else if (lineData.geometry.type == "Polygon") {
    //                     areaFeature = new Feature({
    //                         geometry: new Polygon(
    //                             lineData.geometry.coordinates
    //                         ).transform("EPSG:4326", "EPSG:3857")
    //                     });
    //                 };
    //                 areaFeature.setStyle(
    //                 new Style({
    //                     fill: new Fill({ color: "#4e98f444" }),
    //                     stroke: new Stroke({
    //                         width: 3,
    //                         color: [71, 137, 227, 1]
    //                     })
    //                 })
    //               );
    //               this.areaLayer.getSource().addFeatures([areaFeature]);
    //             });

    //         },
  },
};
</script>

<style lang="less" scoped>
#map {
  width: 100%;
  height: 800px;
}
</style>