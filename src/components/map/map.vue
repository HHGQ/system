<template>
  <div class="map_containter">
    <mapTool :cMap="map" />
    <!--  -->
    <el-button type="success" size="small" @click="inMapView"
      >判断一下</el-button
    >
    <el-button type="success" size="small" @click="moveup"
      >上移</el-button
    >
    <el-button type="success" size="small" @click="fitToArea"
      >最大化展示某区域</el-button
    >
    <div id="map1"></div>
    <div v-show="this.overlayText" id="popup" class="ol-popup">
      <a id="popup-closer" class="ol-popup-closer">X</a>
      <div id="popup-content" class="popup-content">{{ overlayText }}</div>
      <el-button v-if="showOverlayButton" type="success" size="small" @click="updateFeature"
        >变更坐标</el-button
      >
    </div>
  </div>
</template>

<script>
import ol from "openlayers";
import proj4 from 'proj4'
import Map from 'ol/Map';
import $ from 'jquery'
import { initLayer, transform3857To4326 } from "./js/map";
import {
  startScreenShot,
  html2canvasPrint,
  domtoimagePrint,
} from "./js/mapTool";
import { getPoint } from '@/api/mapApi'
import mapTool from './components/mapTool.vue'

export default {
  components: {
    mapTool
  },
  data() {
    return {
      map: null,
      overlay: null,
      overlayText: '',
      showOverlayButton: false,
      featureData: null,
      source: null,
    };
  },
  created() {},
  mounted() {
    this.initMap();
    // this.addLayer();
    this.addApiLayer()
    this.addLineString()

    this.addDynamicsOverlay()
    document.getElementById("popup-closer").addEventListener("click", (e) => {
      this.overlay.setPosition(undefined);
      document.getElementById("popup-closer").blur();
      return false;
    });
  },
  methods: {
    fitToArea() {
      // 让地图最大化完全地显示区域[112.9819047, 23.66093, 113.0019047, 23.90093]
      this.map.getView().fit([112.9819047, 23.66093, 113.0019047, 23.76093], this.map.getSize());
    },
    moveup() {
      var view = this.map.getView();
      var mapCenter = view.getCenter();
      // 让地图中心的y值减少，即可使得地图向上移动，减少的值根据效果可自由设定
      mapCenter[1] -= 0.003; // 动态加减的坐标，需要用 render() 才生效
      view.setCenter(mapCenter);
      this.map.render()
    },
    inMapView() {
      let extent = this.map.getView().calculateExtent(this.map.getSize())
      console.log(extent)
      extent = transform3857To4326(extent)
      // let flag = ol.extent.containsExtent(extent, this.judgeFeature.getGeometry().getExtent())
      let flag = ol.extent.containsExtent(extent, [112.96, 23.64,112.96, 23.64])
      console.log(flag,this.source.getFeatures()[0].getGeometry().getExtent())
    },
    initMap() {
      proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
      ol.proj.setProj4(proj4) // 若直接在入口index.html直接引入 proj4.js，就不需要调用这个
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
      this.map = new ol.Map({
        target: "map1",
        layers: initLayer(),
        view: new ol.View({
          center: [112.9819047, 23.66093],
          zoom: 14,
          // center: [12630897.63, 2653513.69], // 3857 的中心点
          // projection: "EPSG:3857",
          projection: "EPSG:4326",
          // projection: 'EPSG:4490'
        }),
        controls: ol.control
          .defaults({
            zoomOptions: {
              zoomInTipLabel: "放大",
              zoomOutTipLabel: "缩小",
            },
          })
          .extend([
            new ol.control.MousePosition({
              coordinateFormat: ol.coordinate.createStringXY(6),
              // projection: "EPSG:3857",
              projection: "EPSG:4326",
              // projection: 'EPSG:4490'
            }),
            new ol.control.FullScreen()
          ]),
        interactions: ol.interaction.defaults({
          doubleClickZoom: false, // 取消双击放大
        })
      });
      // 双击也会触发
      // this.map.on('click', (e) => {
      //   console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      // })
      // 只有单击才触发
      this.map.on("singleclick", (e) => {
        console.log('click')
        const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature)
        this.addOverlay(feature, e.coordinate)
        // console.log(this.map.getView().getProjection().getMetersPerUnit()) // 像素转换单位为米
        // console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      });
      console.log(this.map.getLayers().getArray()[0].getSource().getProjection().getExtent())
      console.log(this.map.getLayers().getArray()[0].getSource().getTileGrid().getOrigin())

    },
    addApiLayer() {
      this.source = new ol.source.Vector({
        loader: (extent, resolution, projection) => {
          let arr = [].concat(transform3857To4326([extent[0], extent[1]])).concat(transform3857To4326([extent[2], extent[3]]))
          getPoint({
            leftTopGpsX: arr[0],
            leftTopGpsY: arr[1],
            rightBottomGpsX: arr[2],
            rightBottomGpsY: arr[3]
          }).then(res => {
            if (!res.length) return
            console.log(res, 'res')
            let features = []
            res.forEach((item, index) => {
              features[index] = new ol.Feature({
                geometry: new ol.geom.Point([item.gpsX, item.gpsY]),
                data: {
                  gpsX: item.gpsX,
                  gpsY: item.gpsY,
                  id: String(item.id)
                },
              });
              features[index].setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                  src: require("@/common/img/location.png"),
                }),
                text: new ol.style.Text({
                  text: String(item.id),
                  fill: new ol.style.Fill({
                    color: "black",
                  }),
                }),
              }))
              features[index].setId(String(item.id)) // setId 可以保持唯一性，防止后端返回数据重复，导致点位重复
            })
            this.source.addFeatures(features)
          })
        },
        strategy: ol.loadingstrategy.tile(
          ol.tilegrid.createXYZ({
            tileSize: 512
          })
        )
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
          id: String(333)
        },
        style: new ol.style.Style({
          image: new ol.style.Icon({
            src: require("@/common/img/location.png"),
            width: 20,
            height: 20
          }),
          text: new ol.style.Text({
            text: String(333),
            fill: new ol.style.Fill({
              color: "black",
            }),
          }),
        })
      })
      this.source.addFeature(this.judgeFeature)
    },
    addLayer() {
      this.source = new ol.source.Vector();
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
              id: `${i}_${j}`
            },
            labelPoint: new ol.geom.Polygon()
          });
          feature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
              src: require("@/common/img/location.png"),
            }),
            text: new ol.style.Text({
              text: `${i}_${j}`,
              fill: new ol.style.Fill({
                color: "black",
              }),
            }),
          })) // 只有在这setStyle,feature.getStyle() 才有值
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
              return new ol.style.Style({ // 这个优先级比feature的style高
                image: new ol.style.Icon({
                  src: require("@/common/img/location.png"),
                }),
                text: new ol.style.Text({
                  text: feature.get("features")[0].get("data").id,
                  fill: new ol.style.Fill({
                    color: "black",
                  }),
                }),
                zIndex: 0 // 值越大，优先级越高
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
      let features = []
      // 用 Polygon 画多边形
      var polygon1 = new ol.geom.Polygon([[[112.96, 23.64], [113, 23.68], [113, 23.70], [113, 23.74], [112.96, 23.64]]]);
      // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857')); // 4326 转3857
      var polygonFeature1 = new ol.Feature({
        geometry: polygon1,
        data: {
          type: 'polygon'
        }
      });
      features.push(polygonFeature1)
      // 用 LineString 画多边形
      var polygon2 = new ol.geom.LineString([[112.96, 23.64], [112.97, 23.68], [112.99, 23.70], [113, 23.74], [112.96, 23.64]]);
      // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857')); // 4326 转3857
      var polygonFeature2 = new ol.Feature({
        geometry: polygon2,
        data: {
          type: 'polygon'
        }
      });
      features.push(polygonFeature2)
      // 用 LineString 画矩形
      var rect = new ol.geom.LineString([[112.96, 23.64], [112.97, 23.64], [112.97, 23.66], [112.96, 23.66], [112.96, 23.64]]);
      var rectFeature = new ol.Feature({
        geometry: rect,
        data: {
          type: 'rect'
        }
      });
      features.push(rectFeature)
      // 用 LineString 画线
      var line = new ol.geom.LineString([[113.01, 23.64], [113.02, 23.68]]);
      var lineFeature = new ol.Feature({
        geometry: line,
        data: {
          type: 'line'
        }
      });
      features.push(lineFeature)
      var vectorSource = new ol.source.Vector();
      vectorSource.addFeatures(features);
      var vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          style: feature => {
            let data = feature.get('data')
            if (data && data.type) {
              feature.setStyle(new ol.style.Style({
                fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
                stroke: new ol.style.Stroke({
                  color: 'rgba(0, 34, 43, 0.5)',
                  lineDash: [10,10],
                  width: 3
                }), // 描边
                text: new ol.style.Text({
                  font: '16px',
                  text: '线标题',
                  fill: new ol.style.Fill({ color: '#222' }),
                  offsetX: 0,
                  offsetY: -20
                })
              }))
            }
          }
      });
      this.map.addLayer(vectorLayer);
      // this.map.removeLayer(vectorLayer);
    },
    addDynamicsOverlay() {
      const html = '<div id="dynamics" class="dynamics_icon"></div>'
      $('#map1 canvas.ol-unselectable').append(html)
      console.log(document.getElementById('dynamics'))
      this.dynamicsOverlay = new ol.Overlay({
        element: document.getElementById('dynamics')
      })
      this.map.addOverlay(this.dynamicsOverlay)
      this.dynamicsOverlay.setPosition([112.94, 23.67])
    },
    removeFeature() {
      const features = this.source.getFeatures()
      features.forEach(item => {
        const d = item.get('data')
        if (d == '1_2') {
          this.source.removeFeature(item)
        }
      })
    },
    // 添加悬浮层
    addOverlay(feature, coordinate) {
      if (!feature || !feature.get('data') && !feature.get('features')) {
        if (!this.overlay) return
        this.overlay.setPosition();
        this.overlay = null
        return
      }
      this.overlay = new ol.Overlay({
        element: document.getElementById("popup"), //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250, //自动平移效果的动画时间 9毫秒
        },
      });
      this.map.addOverlay(this.overlay);
      this.overlayText = ''
      this.showOverlayButton = false
      this.featureData = null
      let featuresArr = feature.get('data') || feature.get('features')
      if (featuresArr.length == 1) {
        this.showOverlayButton = true
        this.featureData = featuresArr[0]
      }
      featuresArr.forEach(item => {
        this.overlayText += ` ${item.get('data').id}`
      })
      setTimeout(() => {
        this.overlay.setPosition(coordinate); //把 overlay 显示到指定的 x,y坐标
      }, 200); // 加定时器，防止控制台有报错。估计是悬浮层还未加入到地图中
    },
    // 变更单个图层坐标
    updateFeature() {
      const s = this.featureData.getStyle() // 需要在 feature 的 style 设置样式，否则获取为null
      s.getText().setText('变了')
      this.featureData.setStyle(s)
      let data = this.featureData.get('data')
      data.gpsX = data.gpsX + 0.0001
      data.gpsY = data.gpsY + 0.0001
      this.featureData.set('data', data)
      this.featureData.setGeometry(new ol.geom.Point([data.gpsX, data.gpsY]))
    },
    // 获取左上角/右上角/右下角/左下角/左上角
    getExtendAry() {
      let extent = this.map.getView().calculateExtent(this.map.getSize())
      extent = [].concat(transform3857To4326([extent[0], extent[1]])).concat(transform3857To4326([extent[2], extent[3]]))
      let extentArr = []
      extentArr.push([extent[0], extent[1]])
      extentArr.push([extent[2], extent[1]])
      extentArr.push([extent[2], extent[3]])
      extentArr.push([extent[0], extent[3]])
      extentArr.push([extent[0], extent[1]])
      return extentArr
    },
  },
};
</script>

<style lang="less" scoped>
.map_containter {
  height: 100%;
  #map1 {
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