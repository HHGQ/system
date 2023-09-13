<template>
  <div style="height: 100%">
    <div id="mapboxId" style="height: 100%"></div>
    <div
      id="popupDiv"
      ref="popupRef"
      style="display: none"
      class="poput_containter"
    >
      这是一个自定义的弹窗，随便写的内容
    </div>
    <div
      id="popupListDiv"
      ref="popupListRef"
      style="display: none"
      class="poput_containter"
    >
      这是一个聚合的弹窗
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mapObj: {},
      popupObj: null,
      styleData: [
        {
          id: 0,
          style_name: "light-v11",
          style_remark: "light_123123",
        },
        {
          id: 1,
          style_name: "dark-v11",
          style_remark: "dark",
        },
        {
          id: 2,
          style_name: "streets-v12",
          style_remark: "streets",
        },
        {
          id: 3,
          style_name: "outdoors-v12",
          style_remark: "outdoors",
        },
      ],
    };
  },
  mounted() {
    this.initMap();
    this.addMove();
  },
  methods: {
    changeMapStyle(styleId, style_name) {
      this.styleIdArr = [styleId]
      localStorage.setItem("mapStyle", style_name);
      this.map.setStyle('mapbox://styles/mapbox/' + style_name);
    },
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic2VhbmRyYWFkbG96ZSIsImEiOiJjajA3cW1pOTcwMDA5Mndvd2hicHlmNWc1In0.7bt7sPXDoymYJyVDvVmqZw";
      let styleUrl = `mapbox://styles/mapbox/${localStorage.getItem("mapStyle")}` || "mapbox://styles/mapbox/streets-v12"
      this.mapObj = new mapboxgl.Map({
        container: "mapboxId", // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: styleUrl, // style URL
        center: [113, 23], // starting position [lng, lat]
        zoom: 9, // starting zoom
        preserveDrawingBuffer: true,//需要地图截屏时，需要将改参数设置为true
      });
      this.addMapListener();
    },
    addMove() {
      this.mapObj.loadImage(
        require(`@/common/img/location.png`),
        (error, image) => {
          if (error) {
            console.log(error);
            loadSuccessNum++;
            return;
          }
          this.mapObj.addImage("move", image);
          this.movelayer = {
            id: "moveLayer",
            type: "symbol",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [0, 0],
                    },
                    properties: {
                      title: "Moving Point",
                      description: "This point follows the mouse",
                    },
                  },
                ],
              },
            },
            layout: {
              "icon-image": "move", // 使用内置图标
              "text-field": "{title}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1],
              "text-anchor": "top",
              "text-allow-overlap": true,
              "text-ignore-placement": true,
              "icon-offset": [0, -20],
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
            paint: {
              "text-color": "red",
              "text-halo-color": "#fff",  //  属性用于设置文本描边的颜色
              "text-halo-width": 2, //  属性用于设置文本描边的宽度
            }
          };
        }
      );
    },
    addMapListener() {
      this.mapObj.on("load", () => {
        this.checkImageIcon();
        this.mapObj.addLayer(this.movelayer);
      });
      this.mapObj.on("click", (e) => {
        const features = this.mapObj.queryRenderedFeatures(e.point, {
          layers: ["clusters", "unclustered-point"],
        });
        console.log(features);
        if (features.length > 1) {
          const clusterId = features[0].properties.cluster_id;
          const coordinates = features[0].geometry.coordinates.slice();
          this.mapObj
            .getSource("pointslayer")
            .getClusterChildren(clusterId, (err, children) => {
              if (err) return;
              console.log(children);
              this.$refs.popupListRef.style.display = "block";
              this.popupObj = new mapboxgl.Popup({
                closeButton: false,
                anchor: "top-left",
              })
                .setLngLat(coordinates)
                .setDOMContent(this.$refs.popupListRef)
                .addTo(this.mapObj);
            });
          this.removeHighlight();
        } else if (features.length == 1) {
          const coordinates = features[0].geometry.coordinates.slice();

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          this.$refs.popupRef.style.display = "block";
          this.popupObj = new mapboxgl.Popup({
            closeButton: false,
            anchor: "top-left",
          })
            .setLngLat(coordinates)
            .setDOMContent(this.$refs.popupRef)
            .addTo(this.mapObj);

          this.addHighlight(coordinates, features[0].properties.icon);
        } else {
          // this.$refs.popupRef.style.display = "none"
          this.removeHighlight();
          let source = this.mapObj.getSource("pointslayer");
          source.setData({
            type: "FeatureCollection",
            features: source._data.features.concat([
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    e.lngLat.lng.toFixed(6),
                    e.lngLat.lat.toFixed(6),
                  ],
                },
                properties: {
                  name: "New Feature",
                  icon: "anchor",
                },
              },
            ]),
          });
        }
      });
      this.mapObj.on("mousemove", (e) => {
        var coordinates = e.lngLat;

        // 更新图层位置
        this.mapObj.getSource("moveLayer").setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat],
              },
              properties: {
                title: "Moving Point",
                description: "This point follows the mouse",
              },
            },
          ],
        });
      });
    },
    removeHighlight() {
      if (!this.mapObj.getLayer("hightlight")) return;
      // this.mapObj.removeLayer('hightlight')
      this.mapObj.setLayoutProperty("hightlight", "visibility", "none");
    },
    addHighlight(coordinates, iconName) {
      let hlIconName = `${iconName}_hl`;
      this.addImageIcon([hlIconName]).then(() => {
        if (this.mapObj.getLayer("hightlight")) {
          let data = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: coordinates,
                },
                properties: {
                  icon: hlIconName,
                },
              },
            ],
          };
          console.log(data);
          this.mapObj.getSource("hightlight").setData(data);
          this.mapObj.setLayoutProperty("hightlight", "visibility", "visible");
          return;
        }
        this.mapObj.addLayer({
          id: "hightlight",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: coordinates,
                  },
                  properties: {
                    icon: hlIconName,
                  },
                },
              ],
            },
          },
          layout: {
            "icon-image": ["get", "icon"],
            "icon-size": 1,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "text-allow-overlap": true,
          },
        });
      });
    },
    checkImageIcon() {
      console.log(this.mapObj.listImages());
      // Add a data source containing one point feature.
      let featureData = [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [113, 23],
          },
          properties: {
            icon: "location",
            id: 1,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [113.03, 23],
          },
          properties: {
            icon: "anchor",
            id: 2,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [113.1, 23],
            id: 3,
          },
          properties: {
            icon: "anchor",
          },
        },
      ];
      let unloadImageArr = [];
      featureData.forEach((item) => {
        unloadImageArr.push(item.properties.icon);
      });
      if (unloadImageArr.length) {
        this.addImageIcon(unloadImageArr).then(() => {
          this.addPointLayer(featureData);
        });
      } else {
        this.addPointLayer(featureData);
      }
    },
    addImageIcon(unloadImageArr = []) {
      return new Promise((resolve) => {
        let needLoadImageArr = [];
        unloadImageArr.forEach((item) => {
          if (
            !this.mapObj.listImages().includes(item) &&
            !needLoadImageArr.includes(item)
          ) {
            needLoadImageArr.push(item);
          }
        });
        if (!needLoadImageArr.length) return resolve();
        let loadSuccessNum = 0;
        needLoadImageArr.forEach((item) => {
          try {
            this.mapObj.loadImage(
              require(`@/common/img/${item}.png`),
              (error, image) => {
                if (error) {
                  console.log(error);
                  loadSuccessNum++;
                  return;
                }
                this.mapObj.addImage(item, image);
                loadSuccessNum++;
                if (loadSuccessNum == needLoadImageArr.length) resolve();
              }
            );
          } catch (err) {
            loadSuccessNum++;
            console.log(err);
          }
        });
      });
    },
    addPointLayer(featureData) {
      this.mapObj.addSource("pointslayer", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: featureData,
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 40,
      });
      this.mapObj.addLayer({
        id: "clusters",
        type: "circle",
        source: "pointslayer",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            // "#51bbd6",
            // 100,
            // "#f1f075",
            // 750,
            // "#f28cb1",
            "rgba(97, 134, 236, 0.9)",
            100,
            "rgba(97, 134, 236, 0.9)",
            750,
            "rgba(97, 134, 236, 0.9)",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      this.mapObj.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "pointslayer",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          // "text-font": ["sourcehansanscn-normal"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      this.mapObj.addLayer({
        id: "unclustered-point",
        type: "symbol",
        source: "pointslayer",
        filter: ["!has", "point_count"],
        layout: {
          "icon-image": ["get", "icon"],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-allow-overlap": true,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .mapboxgl-map {
  .mapboxgl-canvas {
    cursor: url("~@/common/img/location_hl.png") !important;
  }
  .mapboxgl-popup-content {
    padding: 0;
    .poput_containter {
      padding: 10px 15px 12px;
      max-width: 379px;
      position: relative;
      border-radius: 5px;
      background: #fff;
      color: #666;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.21);
      font-size: 14px;
    }
  }
}
</style>