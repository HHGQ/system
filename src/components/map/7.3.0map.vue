<template>
  <div class="map_containter">
    <mapTool :cMap="map" />
    <!--  -->
    <el-button type="success" size="small" @click="inMapView"
      >判断一下</el-button
    >
    <el-button type="success" size="small" @click="moveup">上移</el-button>
    <el-button type="success" size="small" @click="fitToArea"
      >最大化展示某区域</el-button
    >
    <el-button type="success" size="small" @click="reRequest()"
      >请求重连</el-button
    >
    <el-button
        type="success"
        size="small"
        @click="updateFeature2"
        >变更坐标</el-button
      >
      <a
        id="download"
        type="success"
        size="small"
        download="features.json"
        >下载拖拽导入的GeoJSON</a
      >
    <div id="newmap" tabindex="1"></div>
    <div v-show="this.overlayText" id="popup" class="ol-popup">
      <a id="popup-closer" class="ol-popup-closer">X</a>
      <div id="popup-content" class="popup-content">{{ overlayText }}</div>
      <el-button
        v-if="showOverlayButton"
        type="success"
        size="small"
        @click="updateFeature"
        >变更坐标</el-button
      >
    </div>
  </div>
</template>

<script>
import ol from "openlayers";
// 4.6.5
// import Map from 'ol4.6.5/map';
// import View from 'ol4.6.5/view';
// import VectorSource from 'ol4.6.5/source/vector.js';
// import TileLayer from 'ol4.6.5/layer/tile';
// import XYZ from 'ol4.6.5/source/xyz';
// import TileDebug from 'ol4.6.5/source/tiledebug';
// import * as control from 'ol4.6.5/control';
// import MousePosition from 'ol4.6.5/control/mouseposition';
// import FullScreen from 'ol4.6.5/control/fullscreen';
// import * as olCoordinate from 'ol4.6.5/coordinate';
// import {defaults as controlDefaults } from 'ol4.6.5/control/defaults';
// import {defaults as interactionDefaults} from 'ol4.6.5/interaction/defaults';
// 7.3.0
import Map from "ol/Map";
import View from 'ol/View';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import Overlay from 'ol/Overlay.js';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileDebug from 'ol/source/TileDebug';
import Control from 'ol/control/Control';
import MousePosition from 'ol/control/MousePosition';
import FullScreen from 'ol/control/FullScreen';
import * as olCoordinate from 'ol/coordinate';
import {defaults as controlDefaults } from 'ol/control/defaults';
import {defaults as interactionDefaults} from 'ol/interaction/defaults';
// import proj4 from "proj4";
import $ from "jquery";
import { initLayer, transform3857To4326, transform4326To3857 } from "./js/map";
import {
  startScreenShot,
  html2canvasPrint,
  domtoimagePrint,
} from "./js/mapTool";
import { getPoint } from "@/api/mapApi";
import mapTool from "./components/mapTool.vue";
import LayerGroup from 'ol/layer/Group';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON.js'; 
import Modify from 'ol/interaction/Modify';
import { KeyboardZoom } from 'ol/interaction'; 
export default {
  components: {
    mapTool,
  },
  data() {
    return {
      map: null,
      overlay: null,
      overlayText: "",
      showOverlayButton: false,
      featureData: null,
      source: null,
      requestArr: []
    };
  },
  created() {},
  mounted() {
    this.$EventBus.$on('needReRequest', (resolve) => {
      this.requestArr.push(resolve)
    })

    this.initMap();
    // this.addLayer();
    // this.addApiLayer()
    // this.addLineString();

    this.addDynamicsOverlay();
    // document.getElementById("popup-closer").addEventListener("click", (e) => {
    //   this.overlay.setPosition(undefined);
    //   document.getElementById("popup-closer").blur();
    //   return false;
    // });
  },
  methods: {
    reRequest() {
      this.requestArr.forEach((resolve, index) => {
        if (resolve) {
          resolve()
          this.requestArr[index] = null
        }
      })
      this.requestArr = []
    },
    fitToArea() {
      // 让地图最大化完全地显示区域[112.9819047, 23.66093, 113.0019047, 23.90093]
      this.map
        .getView()
        .fit(
          [112.9819047, 23.66093, 113.0019047, 23.76093],
          this.map.getSize()
        );
    },
    moveup() {
      var view = this.map.getView();
      var mapCenter = view.getCenter();
      // 让地图中心的y值减少，即可使得地图向上移动，减少的值根据效果可自由设定
      mapCenter[1] -= 0.003; // 动态加减的坐标，需要用 render() 才生效
      view.setCenter(mapCenter);
      this.map.render();
    },
    inMapView() {
      let extent = this.map.getView().calculateExtent(this.map.getSize());
      console.log(extent);
      extent = transform3857To4326(extent);
      // let flag = ol.extent.containsExtent(extent, this.judgeFeature.getGeometry().getExtent())
      let flag = ol.extent.containsExtent(
        extent,
        [112.96, 23.64, 112.96, 23.64]
      );
      console.log(flag, this.source.getFeatures()[0].getGeometry().getExtent());
    },
    initMap() {
      proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
      ol.proj.setProj4(proj4); // 若直接在入口index.html直接引入 proj4.js，就不需要调用这个
      let projection1 = new ol.proj.get("EPSG:4490");
      projection1.setExtent([-180, -90, 180, 90]);
      // var projectionExtent = projection1.getExtent();
      // var size = ol.extent.getWidth(projectionExtent) / 256;
      // var resolutions = [];
      // var matrixIds = [];
      // for (var z = 0; z < 19; ++z) {
      //   matrixIds[z] = z;
      //   resolutions[z] = size / Math.pow(2, z);
      // }
      // var origin = ol.extent.getTopLeft(projectionExtent);
      this.map = new Map({
        target: 'newmap',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
              crossOrigin: 'anonymous', // 导出图片是否允许跨域
              maxTilesLoading: 80,
              cacheSize: 100,
              // tileUrlFunction: function (tileCoord) {
              //   console.log(tileCoord, 'tile')
              //   return `http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=${tileCoord[1]}&y=${tileCoord[2]}&z=${tileCoord[0]}`
              // }
            }),
          }),
        ],
        view: new View({
          zoom: 14,
          // extent: [112, 23, 124, 26],
          center: [112.9819047, 23.66093],
          // center: ol.proj.transform([112.9819047, 23.66093], 'EPSG:4326', 'EPSG:3857')
          projection: "EPSG:4326",
          constrainRotation: 8,
          constrainResolution: true
          // multiWorld: true
        }),
        controls: controlDefaults({
            zoomOptions: {
              zoomInTipLabel: "放大",
              zoomOutTipLabel: "缩小",
            },
          })
          .extend([
            new MousePosition({
              coordinateFormat: olCoordinate.createStringXY(6),
              // projection: "EPSG:3857",
              projection: "EPSG:4326",
              // projection: 'EPSG:4490'
            }),
            new FullScreen(),
          ]),
        interactions: interactionDefaults({
          doubleClickZoom: false, // 取消双击放大
        }),
      });
      // 双击也会触发add
      // this.map.on('click', (e) => {
      //   console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      // })
      // 只有单击才触发
      this.map.on("singleclick", (e) => {
        console.log("click");
        const feature = this.map.forEachFeatureAtPixel(
          e.pixel,
          (feature, layer) => feature
        );
        this.addOverlay(feature, e.coordinate);
        // console.log(this.map.getView().getProjection().getMetersPerUnit()) // 像素转换单位为米
        // console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      });
      this.map.on("click", (e) => {
        console.log("click111");
      });
      document.getElementById("newmap").addEventListener("contextmenu", (e) => {
        e.preventDefault()
        console.log("这是右键点击")
      })
      console.log(
        this.map
          .getLayers()
          .getArray()[0]
          .getSource()
          .getProjection()
          .getExtent()
      );
      console.log(
        this.map.getLayers().getArray()[0].getSource().getTileGrid().getOrigin()
      );

      this.downloadGeoJSON()
    },
    // 可拖拽上传geojson文件，及下载geojson文件
    downloadGeoJSON() {
      this.source1 = new VectorSource();
      const layer1 = new VectorLayer({
        source: this.source1,
      });
      this.map.addLayer(layer1);
      this.map.addInteraction(
        new DragAndDrop({
          source: this.source1,
          formatConstructors: [GeoJSON],
        })
      );
      this.map.addInteraction(
        new Modify({
          source: this.source1,
        })
      );
      const download = document.getElementById('download');
      const format = new GeoJSON({featureProjection: 'EPSG:4326'});
      this.source1.on('change', () => {
        console.log(111)
        const features = this.source1.getFeatures();
        const json = format.writeFeatures(features);
        download.href =
          'data:application/json;charset=utf-8,' + encodeURIComponent(json);
      });
    },
    addApiLayer() {
      this.source = new ol.source.Vector({
        loader: (extent, resolution, projection) => { // this.source.clear() 会触发改方法
          let arr = []
            .concat(transform3857To4326([extent[0], extent[1]]))
            .concat(transform3857To4326([extent[2], extent[3]]));
          getPoint({
            leftTopGpsX: arr[0],
            leftTopGpsY: arr[1],
            rightBottomGpsX: arr[2],
            rightBottomGpsY: arr[3],
          }).then((res) => {
            if (!res.length) return;
            console.log(res, "res");
            let features = [];
            res.forEach((item, index) => {
              features[index] = new ol.Feature({
                geometry: new ol.geom.Point([item.gpsX, item.gpsY]),
                data: {
                  gpsX: item.gpsX,
                  gpsY: item.gpsY,
                  id: String(item.id),
                },
              });
              features[index].setStyle(
                new ol.style.Style({
                  image: new ol.style.Icon({
                    src: require("@/common/img/location.png"),
                  }),
                  text: new ol.style.Text({
                    text: String(item.id),
                    fill: new ol.style.Fill({
                      color: "black",
                    }),
                  }),
                })
              );
              features[index].setId(String(item.id)); // setId 可以保持唯一性，防止后端返回数据重复，导致点位重复
            });
            this.source.addFeatures(features); // 若一个个addFeature，会非常慢
          });
        },
        strategy: ol.loadingstrategy.tile(
          ol.tilegrid.createXYZ({
            tileSize: 512,
          })
        ),
      });
      let layer = new ol.layer.Vector({
        source: this.source,
        style: function (feature, resolution) {
          var style = new ol.style.Style({
            image: new ol.style.Icon({
              src: require("@/common/img/location.png"),
            }),
          });
          return style;
        },
      });
      layer = this.cluserLayer(this.source);
      this.map.addLayer(layer);
      this.judgeFeature = new ol.Feature({
        geometry: new ol.geom.Point([112.96, 23.64]),
        data: {
          gpsX: 112.96,
          gpsY: 23.64,
          id: String(333),
        },
        style: new ol.style.Style({
          image: new ol.style.Icon({
            src: require("@/common/img/location.png"),
            width: 20,
            height: 20,
          }),
          text: new ol.style.Text({
            text: String(333),
            fill: new ol.style.Fill({
              color: "black",
            }),
          }),
        }),
      });
      this.source.addFeature(this.judgeFeature);
    },
    addLayer() {
      this.source = new VectorSource();
      for (let i = 0; i < 5; i++) {
        for (var j = 1; j <= 200; j++) {
          var coordinates = [
            112.96 + i * 0.01 + Math.random() * 0.01,
            23.64 + i * 0.01 + Math.random() * 0.1,
          ];
          var feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            data: {
              gpsX: coordinates[0],
              gpsY: coordinates[1],
              id: `${i}_${j}`,
            },
            labelPoint: new ol.geom.Polygon(),
          });
          feature.setStyle(
            new ol.style.Style({
              image: new ol.style.Icon({
                src: require("@/common/img/location.png"),
              }),
              text: new ol.style.Text({
                text: `${i}_${j}`,
                fill: new ol.style.Fill({
                  color: "black",
                }),
              }),
            })
          ); // 只有在这setStyle,feature.getStyle() 才有值
          this.source.addFeature(feature);
        }
      }
      const layer = this.cluserLayer(this.source);
      this.map.addLayer(layer);
    },
    // 聚合图层
    cluserLayer(source) {
      const needCluser = true;
      var layer;
      if (needCluser) {
        // 聚合
        var cluster = new ol.source.Cluster({
          source: source,
          distance: 40,
        });
        // 创建图层(聚合)
        layer = new ol.layer.Vector({
          source: cluster,
          style: function (feature, resolution) {
            var size = feature.get("features").length;
            if (size == 1) {
              return new ol.style.Style({
                // 这个优先级比feature的style高
                image: new ol.style.Icon({
                  src: require("@/common/img/location.png"),
                }),
                text: new ol.style.Text({
                  text: feature.get("features")[0].get("data").id,
                  fill: new ol.style.Fill({
                    color: "black",
                  }),
                }),
                zIndex: 0, // 值越大，优先级越高
              });
            } else {
              return new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 20,
                  stroke: new ol.style.Stroke({
                    color: "white",
                  }),
                  fill: new ol.style.Fill({
                    color: "blue",
                  }),
                }),
                text: new ol.style.Text({
                  text: size.toString(),
                  fill: new ol.style.Fill({
                    color: "white",
                  }),
                }),
              });
            }
          },
        });
      } else {
        // 创建图层(不聚合)
        layer = new ol.layer.Vector({
          source: source,
          style: function (feature, resolution) {
            var style = new ol.style.Style({
              image: new ol.style.Icon({
                src: require("@/common/img/location.png"),
              }),
            });
            return style;
          },
        });
      }
      return layer;
    },
    // 可画线、矩形、多边形
    addLineString() {
      let features = [];
      this.addSector();
      // 用 Polygon 画多边形
      var polygon1 = new ol.geom.Polygon([
        [
          [112.96, 23.64],
          [113, 23.68],
          [113, 23.7],
          [113, 23.74],
          [112.96, 23.64],
        ],
      ]);
      // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857')); // 4326 转3857
      var polygonFeature1 = new ol.Feature({
        geometry: polygon1,
        data: {
          type: "polygon",
        },
      });
      features.push(polygonFeature1);
      // 用 LineString 画多边形
      var polygon2 = new ol.geom.LineString([
        [112.96, 23.64],
        [112.97, 23.68],
        [112.99, 23.7],
        [113, 23.74],
        [112.96, 23.64],
      ]);
      // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857')); // 4326 转3857
      var polygonFeature2 = new ol.Feature({
        geometry: polygon2,
        data: {
          type: "polygon",
        },
      });
      features.push(polygonFeature2);
      // 用 LineString 画矩形
      var rect = new ol.geom.LineString([
        [112.96, 23.64],
        [112.97, 23.64],
        [112.97, 23.66],
        [112.96, 23.66],
        [112.96, 23.64],
      ]);
      var rectFeature = new ol.Feature({
        geometry: rect,
        data: {
          type: "rect",
        },
      });
      features.push(rectFeature);
      // 用 LineString 画线
      var line = new ol.geom.LineString([
        [113.01, 23.64],
        [113.02, 23.68],
      ]);
      var lineFeature = new ol.Feature({
        geometry: line,
        data: {
          type: "line",
        },
      });
      features.push(lineFeature);
      // 用 Circle 画圆
      var circle = new ol.geom.Circle([113.01, 23.64], 0.002);
      var circleFeature = new ol.Feature({
        geometry: circle,
        data: {
          type: 'circle'
        }
      });
      features.push(circleFeature);
      var vectorSource = new ol.source.Vector();
      vectorSource.addFeatures(features);
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: (feature) => {
          let data = feature.get("data");
          if (data && data.type) {
            feature.setStyle(
              new ol.style.Style({
                fill: new ol.style.Fill({ color: "rgba(255, 255, 255, 0.5)" }),
                stroke: new ol.style.Stroke({
                  color: "rgba(0, 34, 43, 0.5)",
                  lineDash: [10, 10],
                  width: 3,
                }), // 描边
                text: new ol.style.Text({
                  font: "16px",
                  text: "线标题",
                  fill: new ol.style.Fill({ color: "#222" }),
                  offsetX: 0,
                  offsetY: -20,
                }),
              })
            );
          }
        },
      });
      this.map.addLayer(vectorLayer);
      // this.map.removeLayer(vectorLayer);
    },
    // 画扇形
    addSector() {
      // 用 Polygon 画扇形
      let longlat = [112.92014122009279, 23.669657707214355];
      let EPSG = this.map.getView().getProjection().getCode();
      var center = EPSG == "EPSG:3857" ? transform4326To3857(longlat) : longlat; // 扇形的中心点
      // var startAngle = Math.PI/4; // 扇形的起始角度（弧度）
      // var endAngle = Math.PI; // 扇形的结束角度（弧度）
      let directAngle = 90; // 朝向角度(°)
      let levelAngle = 40; // 水平可视角度(°)
      var startAngle = ((90 - directAngle - levelAngle / 2) * Math.PI) / 180; // 扇形的起始角度（弧度）
      var endAngle = ((90 - directAngle + levelAngle / 2) * Math.PI) / 180; // 扇形的结束角度（弧度）
      var radius = 500; // 半径（单位：米）
      // 中心点转换成米,为了配合半径一起计算边界点的坐标数据
      var centerProj =
        EPSG == "EPSG:3857" ? center : ol.proj.fromLonLat(center); // 转成3857
      // 计算扇形的边界点
      var coordinates = [center];
      var numPoints = 32; // 边界点的数量
      for (var i = 0; i <= numPoints; i++) {
        var angle = startAngle + (i / numPoints) * (endAngle - startAngle);
        // if (EPSG == "EPSG:3857") {
        let x = centerProj[0] + radius * Math.cos(angle);
        let y = centerProj[1] + radius * Math.sin(angle);
        coordinates.push(
          EPSG == "EPSG:3857" ? [x, y] : ol.proj.toLonLat([x, y])
        );
        // } else {
        //   let x = centerProj[0] + (radius / ol.proj.METERS_PER_UNIT.m) * Math.cos(angle) / Math.cos(center[1] * Math.PI / 180);
        //   let y = centerProj[1] + (radius / ol.proj.METERS_PER_UNIT.m) * Math.sin(angle);
        //   coordinates.push(ol.proj.toLonLat([x, y])); // 转成经纬度
        // }
      }

      var sector = new ol.geom.Polygon([coordinates]);
      // 创建一个Feature对象并添加扇形
      var sectorFeature = new ol.Feature(sector);
      var sectorSource = new ol.source.Vector();
      sectorSource.addFeature(sectorFeature);

      // 设置渐变色，但这个会随着层级变化而变化
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const gradient = context.createLinearGradient(0, 0, 128, 0);
      gradient.addColorStop(0, "rgba(73, 139, 236, 1)");
      gradient.addColorStop(1, "rgba(73, 139, 236, 0.5)");
      gradient.addColorStop(1 / 6, "rgba(73, 139, 236, 0.7)");
      gradient.addColorStop(2 / 6, "rgba(73, 139, 236, 0.5)");
      gradient.addColorStop(3 / 6, "rgba(73, 139, 236, 0.4)");
      gradient.addColorStop(4 / 6, "rgba(73, 139, 236, 0.3)");
      gradient.addColorStop(5 / 6, "rgba(73, 139, 236, 0.2)");

      // 创建一个矢量图层并将其添加到地图上
      var sectorLayer = new ol.layer.Vector({
        source: sectorSource,
        style: new ol.style.Style({
          // fill: new ol.style.Fill({
          //   // color: 'rgba(255, 0, 0, 0.2)' // 设置填充颜色和透明度
          //   color: gradient // 设置填充颜色和透明度
          // }),
          // stroke: new ol.style.Stroke({
          //   color: 'rgba(73, 139, 236, 1)', // 设置边界线颜色
          //   width: 0.3 // 设置边界线宽度
          // })
          renderer: (coordinatesArr, state) => {
            let coordLen = coordinatesArr[0].length;
            let ctx = state.context;
            let centerIndex = Math.floor(coordLen / 2);
            // fill
            let grad = ctx.createLinearGradient(
              coordinatesArr[0][centerIndex][0],
              coordinatesArr[0][centerIndex][1],
              coordinatesArr[0][coordLen - 1][0],
              coordinatesArr[0][coordLen - 1][1]
            );
            grad.addColorStop(0, "rgba(73, 139, 236, 0)");
            grad.addColorStop(1, "rgba(73, 139, 236, 0.8)");
            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.moveTo(coordinatesArr[0][0][0], coordinatesArr[0][0][1]);
            for (let i = 0; i < coordLen; i++) {
              ctx.lineTo(coordinatesArr[0][i][0], coordinatesArr[0][i][1]);
            }
            ctx.fill();

            // storke
            let gradLine1 = ctx.createLinearGradient(
              coordinatesArr[0][1][0],
              coordinatesArr[0][1][1],
              coordinatesArr[0][0][0],
              coordinatesArr[0][0][1]
            );
            grad.addColorStop(0, "rgba(28, 197, 245, 0)");
            grad.addColorStop(1, "rgba(28, 197, 245, 1)");
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = gradLine1;
            ctx.moveTo(coordinatesArr[0][0][0], coordinatesArr[0][0][1]);
            ctx.lineTo(coordinatesArr[0][1][0], coordinatesArr[0][1][1]);
            ctx.stroke();

            let gradLine2 = ctx.createLinearGradient(
              coordinatesArr[0][1][0],
              coordinatesArr[0][1][1],
              coordinatesArr[0][0][0],
              coordinatesArr[0][0][1]
            );
            grad.addColorStop(0, "rgba(28, 197, 245, 0)");
            grad.addColorStop(1, "rgba(28, 197, 245, 1)");
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = gradLine2;
            ctx.moveTo(coordinatesArr[0][0][0], coordinatesArr[0][0][1]);
            ctx.lineTo(
              coordinatesArr[0][coordLen - 2][0],
              coordinatesArr[0][coordLen - 2][1]
            );
            ctx.stroke();
          },
        }),
      });

      // 将矢量图层添加到地图上
      this.map.addLayer(sectorLayer);
    },
    addDynamicsOverlay() {
      const html = '<div id="dynamics" class="dynamics_icon"></div>';
      $("#newmap .ol-layers").append(html);
      console.log(document.getElementById("dynamics"));
      this.dynamicsOverlay = new Overlay({
        element: document.getElementById("dynamics"),
      });
      this.map.addOverlay(this.dynamicsOverlay);
      this.dynamicsOverlay.setPosition([112.94, 23.67]);
    },
    removeFeature() {
      const features = this.source.getFeatures();
      features.forEach((item) => {
        const d = item.get("data");
        if (d == "1_2") {
          this.source.removeFeature(item);
        }
      });
    },
    // 添加悬浮层
    addOverlay(feature, coordinate) {
      if (!feature || (!feature.get("data") && !feature.get("features"))) {
        if (!this.overlay) return;
        this.overlay.setPosition();
        this.overlay = null;
        return;
      }
      this.overlay = new ol.Overlay({
        element: document.getElementById("popup"), //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250, //自动平移效果的动画时间 9毫秒
        },
      });
      this.map.addOverlay(this.overlay);
      this.overlayText = "";
      this.showOverlayButton = false;
      this.featureData = null;
      let featuresArr = feature.get("data") || feature.get("features");
      if (featuresArr.length == 1) {
        this.showOverlayButton = true;
        this.featureData = featuresArr[0];
      }
      featuresArr.forEach((item) => {
        this.overlayText += ` ${item.get("data").id}`;
      });
      setTimeout(() => {
        this.overlay.setPosition(coordinate); //把 overlay 显示到指定的 x,y坐标
      }, 200); // 加定时器，防止控制台有报错。估计是悬浮层还未加入到地图中
    },
    // 变更选中的图标坐标
    updateFeature() {
      const s = this.featureData.getStyle(); // 需要在 feature 的 style 设置样式，否则获取为null
      s.getText().setText("变了");
      this.featureData.setStyle(s);
      let data = this.featureData.get("data");
      data.gpsX = data.gpsX + 0.0001;
      data.gpsY = data.gpsY + 0.0001;
      this.featureData.set("data", data);
      this.featureData.setGeometry(new ol.geom.Point([data.gpsX, data.gpsY]));
    },
    updateFeature2() {
      const features = this.source.getFeatures()
      features.forEach(item => {
        let d = item.get('data')
        if (d.id == 3) {
          d.gpsX = d.gpsX + 0.0001;
          d.gpsY = d.gpsY + 0.0001;
          item.set("data", d);
          item.setGeometry(new ol.geom.Point([d.gpsX, d.gpsY]));
        }
      })
    },
    // 获取左上角/右上角/右下角/左下角/左上角
    getExtendAry() {
      let extent = this.map.getView().calculateExtent(this.map.getSize());
      extent = []
        .concat(transform3857To4326([extent[0], extent[1]]))
        .concat(transform3857To4326([extent[2], extent[3]]));
      let extentArr = [];
      extentArr.push([extent[0], extent[1]]);
      extentArr.push([extent[2], extent[1]]);
      extentArr.push([extent[2], extent[3]]);
      extentArr.push([extent[0], extent[3]]);
      extentArr.push([extent[0], extent[1]]);
      return extentArr;
    },
  },
};
</script>

<style lang="less" scoped>
.map_containter {
  height: 100%;
  #newmap {
    width: 100%;
    height: 89%;
  }
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
}

.popup-content {
  width: 400px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
</style>