// import ol from 'openlayers'
import {
  wgs84togcj02,
  gcj02towgs84
} from './tranform'

function initLayer() {
  let layerArr = []
  switch (GloalConfig.mapType) {
    case 0:
      layerArr.push(new ol.layer.Tile({
        source: new ol.source.OSM()
      }));
      break
    case 1:
      layerArr.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        })
      }));
      break
    case 2:
      layerArr.push(new ol.layer.Tile({
        preload: Infinity,
        source: new ol.source.XYZ({
          url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
          crossOrigin: 'anonymous' // 导出图片是否允许跨域
        })
      }));
      break
    case 3:
      layerArr = [
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
            // maxZoom: 18, // 设置请求的最大层级，显示最大层级如果比这个大，那在这个基础上进行数字放大
            // minZoom: 8,
            crossOrigin: 'anonymous' // 导出图片是否允许跨域
          }),

        }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: `http://t5.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=5b1c7a4af317c1efaa03265e11a6204e&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}`,
            crossOrigin: 'anonymous' // 导出图片是否允许跨域
          })
        })
      ]
      break;
    case 4:
      layerArr.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
          crossOrigin: 'anonymous', // 导出图片是否允许跨域
          tileLoadFunction: function (imageTile, src) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', src)
            xhr.setRequestHeader('Authorizatioin', 'tokenxxx')
            xhr.onload = function () {
              imageTile.getImage().src = src
            }
            xhr.send()
          }
        })
      }));
      break
  }
  return layerArr
}

/**
 * 
 * @param {*} lonlat 经纬度 [lon, lat]
 * @returns [lon, lat]
 */
function transform3857To4326(lonlat) {
  if (GloalConfig.EPSG == '3857') {
    return ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326')
  }
  return lonlat
}

/**
 * 
 * @param {*} lonlat 经纬度 [lon, lat] 
 * @returns [lon, lat]
 */
function transform4326To3857(lonlat) {
  // if (GloalConfig.EPSG == '3857') {
  return ol.proj.transform(lonlat, "EPSG:4326", "EPSG:3857")
  // }
  // return lonlat
}

/**
 * 
 * @param {*} lonlat 
 * 数据库的数据坐标系统一是84坐标系、非3857投影，如果底图坐标系是火星坐标系，则点位坐标数据需要进行转换展示
 */
function transformSaveToShow(lonlat) {
  if (GloalConfig.mapNeedTransformGPS) {
    lonlat = wgs84togcj02(lonlat[0], lonlat[1])
  }
  return transform4326To3857(lonlat)
}

/**
 * 
 * @param {*} lonlat 
 * 数据库的数据坐标系统一是84坐标系、非3857投影，如果底图坐标系是火星坐标系，则点位坐标数据需要进行转换保存
 */
function transformShowToSave(lonlat) {
  lonlat = transform3857To4326(lonlat)
  if (GloalConfig.mapNeedTransformGPS) {
    lonlat = gcj02towgs84(lonlat[0], lonlat[1])
  }
  return lonlat
}

export {
  initLayer,
  transform3857To4326,
  transform4326To3857,
  transformSaveToShow,
  transformShowToSave
}