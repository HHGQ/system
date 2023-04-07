<template>
  <div id="map"></div>
</template>

<script>
// 超图所有服务地址 https://iserver.supermap.io/iserver/services
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import * as control from 'ol/control';
import { createStringXY } from 'ol/coordinate'
import { Logo, TileSuperMapRest, MapService, viewOptionsFromMapJSON } from '@supermap/iclient-ol';
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
    this.initMap2()
  },
  methods: {
    initMap() {
      var url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
      let mapObj
      var ol = window.ol
      new Promise((resolve, reject) => {
          new MapService(url).getMapInfo(function (serviceResult) {
            mapObj = serviceResult.result;
            resolve(mapObj)
          })
        }).then((mapObj) => {
          let map = new Map({
              target: 'map',
              layers: [
                new TileLayer({
                  source: new TileSuperMapRest(TileSuperMapRest.optionsFromMapJSON(url, mapObj, true)),
                })
              ],
              view: new View(Object.assign({zoom:3, minZoom: 1, projection: 'EPSG:4326', center: [0,0]})),
              controls: control
                .defaults({
                  zoomOptions: {
                    zoomInTipLabel: '放大',
                    zoomOutTipLabel: '缩小'
                  }
                })
                .extend([
                  new control.OverviewMap({
                    collapsed: false,
                    layers: [
                      new TileLayer({
                        source: new TileSuperMapRest(TileSuperMapRest.optionsFromMapJSON(url, mapObj, true))
                      })
                    ],
                    view: new View({
                      zoom:3,
                      minZoom: 1,
                      projection: 'EPSG:4326'
                    })
                  }),
                  new control.ScaleLine,
                  new control.MousePosition({
                    coordinateFormat: createStringXY(5), // 保留5位小数
                    projection: 'EPSG:4326',
                    undefinedHTML: [0, 0]
                  })
                ])
            });
        })
    },
    initMap2() {
      var url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
      new Map({
        target: 'map',
        // controls: control.defaults({attributionOptions: {collapsed: false}}).extend([new Logo()]),
        view: new View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326'
        }),
        layers: [
          new TileLayer({
            source: new TileSuperMapRest({
              url: url,
              wrapX: true
            }),
            projection: 'EPSG:4326'
          })
        ],
        controls: control
          .defaults({
            zoomOptions: {
              zoomInTipLabel: '放大',
              zoomOutTipLabel: '缩小'
            }
          })
          .extend([
            new control.OverviewMap({
              collapsed: false,
              layers: [
                new TileLayer({
                  source: new TileSuperMapRest({
                    url: url,
                    wrapX: true
                  }),
                })
              ],
              view: new View({
                zoom:3,
                minZoom: 1,
                projection: 'EPSG:4326'
              })
            }),
            new control.ScaleLine,
            new control.MousePosition({
              coordinateFormat: createStringXY(5), // 保留5位小数
              projection: 'EPSG:4326',
              undefinedHTML: [0, 0]
            })
          ])
      });
    }
  },
}
</script>

<style lang="less" scoped>
#map {
  margin: 0;
  overflow: hidden;
  background: #fff;
  width: 100%;
  height:80%;
  position: absolute;
}
</style>