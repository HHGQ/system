<template>
  <div id="staticmap"></div>
</template>

<script>
import ol from "openlayers";
export default {
  data() {
    return {
      map: null,
      center: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.center = ol.proj.transform(
        [104.06667, 30.66667],
        "EPSG:4326",
        "EPSG:3857"
      ); // 中心点随便设置，只是为了让图片有个固定位置
      // 计算熊猫基地地图映射到地图上的范围，图片像素为 550*344，保持比例的情况下，把分辨率放大一些
      var extent = [
        this.center[0] - (650 * 1000) / 2,
        this.center[1] - (365 * 1000) / 2,
        this.center[0] + (650 * 1000) / 2,
        this.center[1] + (365 * 1000) / 2,
      ];

      //创建地图
      this.map = new ol.Map({
        view: new ol.View({
          center: this.center,
          zoom: 7,
          minZoom: 6,
          maxZoom: 20,
          extent: extent, // 限制拖动范围
        }),
        target: "staticmap",
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
          ]),
      });

      // 加载熊猫基地静态地图层
      this.map.addLayer(
        new ol.layer.Image({
          source: new ol.source.ImageStatic({
            url: require("@/common/img/zhujiang.jpg"), // 熊猫基地地图
            imageExtent: extent, // 映射到地图的范围
          }),
        })
      );

      this.addTag();
    },
    addTag() {
      let gps = ol.proj.transform(
        [101.359863, 29.935895],
        "EPSG:4326",
        "EPSG:3857"
      ); // 中心点随便设置，只是为了让图片有个固定位置
      // 创建一个用于放置活动图标的layer
      var activityLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
      });
      // 创建一个活动图标需要的Feature，并设置位置
      var activity = new ol.Feature({
        // geometry: new ol.geom.Point([
        //   this.center[0] - (650 * 1000) / 2 + 390 * 1000,
        //   this.center[1] - (365 * 1000) / 2 + (365 - 145) * 1000,
        // ]),
        geometry: new ol.geom.Point(gps),
      });
      activity.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: require("@/common/img/location.png"),
            anchor: [0, 1],
            scale: 0.5
          }),
        })
      );
      // 添加活动Feature到layer上，并把layer添加到地图中
      activityLayer.getSource().addFeature(activity);
      this.map.addLayer(activityLayer);
    },
  },
};
</script>