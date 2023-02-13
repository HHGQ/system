<template>
  <div class="map_containter">
    <el-button type="success" size="small" @click="printMap">用 html2canvas 打印</el-button>
    <el-button type="success" size="small" @click="printMap2">用 dom-to-image 打印</el-button>
    <el-button type="success" size="small" @click="screenshot">用 kscreenshot 截图</el-button>
    <div id="map1"></div>
    <div id="popup" class="ol-popup">
      <a id="popup-closer" class="ol-popup-closer">X</a>
      <div id="popup-content" class="popup-content">
        这是一个overlay悬浮层
      </div>
    </div>
  </div>
</template>

<script>
import ol from 'openlayers'
// import proj4 from 'proj4'
// import Map from 'openlayers/Map';
// import View from 'openlayers/View';
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image';
import kscreenshot from 'kscreenshot'

// 65指A键
let screenShot = new kscreenshot({
  key: 65,
  toolShow: {
    back: false,
    arrow: false,
    drawLine: false,
    rect: false,
    ellipse: false,
    text: false,
    color: false
  },
  endCB: function (imgUrl) {
    if (window.navigator.msSaveOrOpenBlob) {
      let bstr = atob(imgUrl.split(',')[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, 'screenshot.png')
    } else {
      const a = document.createElement('a')
      a.href = imgUrl
      a.setAttribute('download', 'map')
      a.click()
    }
  },
  cancelCB: function() {}
})

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
    this.addLayer()
    window.addEventListener('keydown', (e) => {
      screenShot.endScreenShot()
    })
    document.getElementById("popup-closer").addEventListener('click', (e) => {
      this.overlay.setPosition(undefined);
      document.getElementById("popup-closer").blur();
      return false;
    })
    this.addOverlay()
  },
  methods: {
    initMap() {
      this.$proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
      let projection1 = new ol.proj.get('EPSG:4490')
      projection1.setExtent([-180, -90, 180, 90])
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
        target: 'map1',
        layers: [
          // new ol.layer.Tile({
          //   source: new ol.source.OSM()
          // }),
          // new ol.layer.Tile({
          //   source: new ol.source.XYZ({
          //     url:
          //       // "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
          //       "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
          //   })
          // }),
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x={x}&y={y}&l={z}',
              // tileGrid: new ol.tilegrid.TileGrid({
              //       // 原点（左上角）
              //       origin: origin,
              //       // 分辨率数组
              //       resolutions: resolutions,
              //       // 矩阵标识列表，与地图级数保持一致
              //       matrixIds: matrixIds,
              //   }),
              // tileSize: 256,
              // maxZoom: 18,
              // minZoom: 8,
              crossOrigin: 'anonymous' // 导出图片是否允许跨域
            }),

          }),
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: `http://t5.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=5b1c7a4af317c1efaa03265e11a6204e&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}`,
              crossOrigin: 'anonymous' // 导出图片是否允许跨域
            })
          }),
        ],
        view: new ol.View({
          center: [112.9819047,23.660930],
          zoom: 14,
          // center: [12630897.63, 2653513.69],
          // projection: 'EPSG:4326'
          projection: 'EPSG:4490'
        }),
        controls: ol.control
          .defaults({
            zoomOptions: {
              zoomInTipLabel: '放大',
              zoomOutTipLabel: '缩小'
            }
          })
          .extend([
            new ol.control.MousePosition({
              coordinateFormat: ol.coordinate.createStringXY(6),
              // projection: 'EPSG:4326'
              projection: 'EPSG:4490'
            })
          ])
      });
      console.log(this.map)
      // 双击也会触发
      // this.map.on('click', (e) => {
      //   console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      // })
      // 只有单击才触发
      this.map.on('singleclick', (e) => {
        console.log(e.coordinate)
        this.overlay.setPosition(e.coordinate); //把 overlay 显示到指定的 x,y坐标
        // console.log(this.map.getView().getProjection().getMetersPerUnit()) // 像素转换单位为米
        // console.log(this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => feature).get('features'))
      })
    },
    addLayer() {
      var source = new ol.source.Vector();
      for (let i = 0; i < 5; i++) {
        for (var j = 1; j <= 200; j++) {
            var coordinates = [112.96 + i * 0.01 + Math.random() * 0.01, 23.64 + i * 0.01 + Math.random() * 0.1];
            var feature = new ol.Feature({
              geometry: new ol.geom.Point(coordinates),
              data: {
                gpsX: coordinates[0],
                gpsY: coordinates[1]
              }
            });
            source.addFeature(feature);
        }
      }

      // 创建图层(不聚合)
      // var layer = new ol.layer.Vector({
      //     source: source,
      //     style: function (feature, resolution) {
      //       console.log(feature)
      //       var style = new ol.style.Style({
      //           image: new ol.style.Icon({
      //               src: require('@/common/img/location.png')
      //           })
      //       })
      //       return style;
      //     }
      // });
      // 聚合
      var cluster = new ol.source.Cluster({
          source: source,
          distance: 40
      })
      // 创建图层(聚合)
      var layer = new ol.layer.Vector({
        source: cluster,
        style: function (feature, resolution) {
            var size = feature.get('features').length;
            if (size == 1) {
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        src: require('@/common/img/location.png')
                    })
                })
            }
            else {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 20,
                        stroke: new ol.style.Stroke({
                            color: 'white'
                        }),
                        fill: new ol.style.Fill({
                            color: 'blue'
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: 'white'
                        })
                    })
                })
            }
        }
      });
      this.map.addLayer(layer)
    },
    // 添加悬浮层
    addOverlay() {
      this.overlay = new ol.Overlay({
        element: document.getElementById("popup"), //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 //自动平移效果的动画时间 9毫秒
        }
      });
      this.map.addOverlay(this.overlay);
      this.overlay.setPosition([112.93554782867432, 23.673477172851562]); //把 overlay 显示到指定的 x,y坐标
    },
    printMap() {
      html2canvas(document.getElementById('map1')).then(canvas => {
        let dataUrl = canvas.toDataURL()
        console.log(dataUrl)
        const a = document.createElement('a')
          a.href = dataUrl
          a.setAttribute('download', 'map')
          a.click()
      })
      // html2canvas(document.getElementById('map1'), { useCORS: true }).then(canvas => {
      //   // console.log(canvas)
      //   const imgUrl = canvas.toDataURL()
      //   console.log(imgUrl)
      //   // const imgUrl = document.getElementsByClassName('ol-unselectable')[0].toDataURL()
      //   if (window.navigator.msSaveOrOpenBlob) {
      //     let bstr = atob(imgUrl.split(',')[1])
      //     let n = bstr.length
      //     let u8arr = new Uint8Array(n)
      //     while(n--) {
      //       u8arr[n] = bstr.charCodeAt(n)
      //     }
      //     let blob = new Blob([u8arr])
      //   } else {
      //     const a = document.createElement('a')
      //     a.href = imgUrl
      //     a.setAttribute('download', 'map')
      //     a.click()
      //   }
      // })
    },
    printMap2() {
      domtoimage.toPng(document.getElementById('map1'), {
        quality: 1.0
      })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = '全图导出.png';
        link.href = dataUrl;
        link.click();
      });
    },
    screenshot() {
      screenShot.startScreenShot()
    }
  },
}
</script>

<style lang="less" scoped>
#map1 {
  width: 100%;
  height: 800px;
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