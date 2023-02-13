<template>
  <div class="map_containter">
    <div id="superMap"></div>
  </div>
</template>

<script>
// import '@/assets/js/iclient-openlayers.min.js';
// 超图所有服务地址 https://iserver.supermap.io/iserver/services

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
      // var url ='http://61.3.132.67:8090/iserver/services/map-ugcv5-xysdzdt/rest/maps/xys_dzdt';
      var url = 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World'
      let mapObj
      var ol = window.ol
      new Promise((resolve, reject) => {
          new ol.supermap.MapService(url).getMapInfo(function (serviceResult) {
            mapObj = serviceResult.result;
            console.log(mapObj)
            console.log(ol.supermap.viewOptionsFromMapJSON(mapObj))
            resolve(mapObj)
          })
        }).then((mapObj) => {
          let map = new ol.Map({
              target: 'superMap',
              layers: [
                new ol.layer.Tile({
                  source: new ol.source.TileSuperMapRest(ol.source.TileSuperMapRest.optionsFromMapJSON(url, mapObj, true))
                })
              ],
              // view: new ol.View(Object.assign(ol.supermap.viewOptionsFromMapJSON(mapObj), {zoom:3, minZoom: 3})),
              view: new ol.View(Object.assign({zoom:3, minZoom: 3, projection: 'EPSG:4326', center: [0,0]})),
              controls: ol.control
                .defaults({
                  zoomOptions: {
                    zoomInTipLabel: '放大',
                    zoomOutTipLabel: '缩小'
                  }
                })
                .extend([
                  new ol.control.OverviewMap({
                    collapsed: false,
                    layers: [
                      new ol.layer.Tile({
                        source: new ol.source.TileSuperMapRest(ol.source.TileSuperMapRest.optionsFromMapJSON(url, mapObj, true))
                      })
                    ],
                    view: new ol.View({
                      zoom:3,
                      minZoom: 3,
                      projection: 'EPSG:4326'
                    })
                  }),
                  new ol.control.ScaleLine,
                  new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(5), // 保留5位小数
                    projection: 'EPSG:4326',
                    undefinedHTML: [0, 0]
                  })
                ])
            });
          console.log(map)
          console.log(map.addInteraction)
          map.on('singleclick',()=>{console.log('singleclick')})
        })
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