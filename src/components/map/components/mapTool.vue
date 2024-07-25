<template>
  <div>
    <el-button type="success" size="small" @click="printMap"
      >用 html2canvas 打印</el-button
    >
    <el-button type="success" size="small" @click="printMap2"
      >用 dom-to-image 打印</el-button
    >
    <el-button type="success" size="small" @click="screenshot"
      >用 kscreenshot 截图</el-button
    >
    <el-button type="success" size="small" @click="resetMap"
      >还原</el-button
    >
    <el-button type="success" size="small" @click="addPoint"
      >新增</el-button
    >
    <el-button type="success" size="small" @click="dragZoom('in')"
      >拉框放大</el-button
    >
    <el-button type="success" size="small" @click="dragZoom('out')"
      >拉框缩小</el-button
    >
    <measureTool ref="measureToolRef" :cMap="cMap" />
    <el-dropdown
      trigger="hover"
      style="margin-left: 8px;color: white;background: #67C23A;padding: 5px;border-radius: 3px;cursor: pointer;"
      @command="drawSelect"
    >
      <span class="el-dropdown-link"
        >框选<i class="el-icon-arrow-down el-icon--right"></i></span
      >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-plus" command="Point">点</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="LineString">线</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="Rect">矩形</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus-outline" command="Circle">圈</el-dropdown-item>
        <el-dropdown-item icon="el-icon-check" command="Polygon">多边形</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {
  startScreenShot,
  html2canvasPrint,
  domtoimagePrint,
} from "../js/mapTool";
import ol from "openlayers";
import { transformShowToSave } from "../js/map";
import measureTool from './measureTool.vue'

export default {
  props: {
    cMap: {
      type: Object,
      default: null
    }
  },
  components: { measureTool },
  data() {
    return {
      drawVector: null,
      drawAction: null,
      drawInteraction: null,
      dragZoomIn: null,
      dragZoomOut: null,
    }
  },
  mounted() {
    this.addEscListener()
  },
  methods: {
    dragZoom(type) {
      if (type == 'in') {
        // 初始化一个拉框控件
        if (!this.dragZoomIn) {
          this.dragZoomIn = new ol.interaction.DragZoom({
            condition: ol.events.condition.always,
            // out: true, // true:缩小 false: 放大
          });
          this.cMap.addInteraction(this.dragZoomIn);
        }
        this.dragZoomIn.setActive(true);
        this.dragZoomIn.on('boxend', () => {
          this.dragZoomIn.setActive(false);
        })
      } else {
         // 初始化一个拉框控件
         if (!this.dragZoomOut) {
          this.dragZoomOut = new ol.interaction.DragZoom({
            condition: ol.events.condition.always,
            out: true, // true:缩小 false: 放大
          });
          this.cMap.addInteraction(this.dragZoomOut);
        }
        this.dragZoomOut.setActive(true);
        this.dragZoomOut.on('boxend', () => {
          this.dragZoomOut.setActive(false);
        })
      }
    },
    // 新增点位
    addPoint() {
      this.drawVector = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: (feature, resolution) => {
          var style = new ol.style.Style({
            image: new ol.style.Icon({
              src: require("@/common/img/location.png"),
            }),
          })
          return style
        }
      })
      if (this.drawAction != null) this.cMap.removeInteraction(this.drawAction)
      this.drawAction = new ol.interaction.Draw({
        style: new ol.style.Style({
          image: new ol.style.Icon({
            src: require("@/common/img/location.png"),
          }),
          zIndex: 0
        }), // 鼠标样式
        // source: this.drawVector.getSource(),
        type: 'Point',
      })
      this.cMap.addInteraction(this.drawAction)
      this.drawAction.on('drawend', e => {
        console.log(e)
        const feature = e.feature
        const geometry = feature.getGeometry()
        const coodinates = geometry.getCoordinates()
        const longiture = parseFloat(coodinates[0].toFixed(5))
        const latitude = parseFloat(coodinates[1].toFixed(5))
        this.saveGPS({ longiture, latitude })
        this.cMap.removeInteraction(this.drawAction)
      })
    },
    saveGPS(gpsObj) {
      gpsObj = transformShowToSave(gpsObj)
    },
    
    drawSelect(type) {
      console.log(type, 'xcs')
      this.$refs.measureToolRef.removeCurrentDraw()
      this.cMap.removeInteraction(this.drawInteraction)
      let style = new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({ color: '#00c170' }), // 点颜色
          radius: 6
        }),
        fill: new ol.style.Fill({ color: [255, 255, 255, 0.5] }),
        stroke: new ol.style.Stroke({ color: '#00c170', width: 2 })
      })
      if (type == 'Point') {
        style.setImage(
          new ol.style.Icon({
            opacity: 0.75,
            src: require("@/common/img/location.png"), 
          })
        )
      }
      let {promise, draw} = this.addInteractionByPoint(style, type, true)
      this.drawInteraction = draw
      promise.then(res => {
        console.log(res)
        let arr = [], gpsCenter, radius
        switch(type) {
          case "Polygon":
          case "Rect":
            arr = res[0].map(item => transformShowToSave(item))
            break
          case "LineString":
            arr = res.map(item => transformShowToSave(item))
            break
          case "Point":
            break;
          case "Circle":
            arr = res.split(',')
            gpsCenter = transformShowToSave([arr[0], arr[1]])
            radius = Number(arr[2]) * this.cMap.getView().getProjection().getMetersPerUnit() // 单位米
            console.log(arr, gpsCenter, radius)
            break;
        }
        console.log(arr)
      })
    },
    addInteractionByPoint(style, type, needClear) {
      let source = new ol.source.Vector({ wrapX: false })
      let layer = new ol.layer.Vector({
        source,
        style
      })
      this.cMap.addLayer(layer)
      let draw = type == 'Rect' ? this.initRectInteraction(source, style) : new ol.interaction.Draw({type, source, style})
      let promise = new Promise((resolve, rej) => {
        draw.on('drawend', evt => {
          this.cMap.removeInteraction(draw)
          // needClear && this.cMap.removeLayer(layer) // 是否清除已画的
          let geom = evt.feature.getGeometry()
          resolve(this.getCoordinateByFeature(geom))
        })
      })
      this.cMap.addInteraction(draw)
      return { promise, draw }
    },
    initRectInteraction(source, style) {
      let draw = new ol.interaction.Draw({
        style,
        source,
        type: 'LineString',
        geometryFunction: (coordinates, geometry) => {
          let start = coordinates[0]
          let end = coordinates[1]
          if (!geometry) {
            geometry = new ol.geom.Polygon([
              [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ])
          }
          geometry.setCoordinates([
            [start, [start[0], end[1]], end, [end[0], start[1]], start]
          ])
          return geometry
        },
        maxPoints: 2
      })
      return draw
    },
    getCoordinateByFeature(geom) {
      let points
      if (geom) {
        if (geom instanceof ol.geom.Circle) {
          points = `${geom.getCenter().join(',')},${geom.getRadius()}`
        } else if (geom instanceof ol.geom.LineString || geom instanceof ol.geom.Polygon || geom instanceof ol.geom.Point) {
          points = geom.getCoordinates()
        }
      }
      return points
    },
    resetMap() {
      this.cMap.getView().animate({center: [112.9819047, 23.66093], zoom: 14, rotation: 0})
      // this.cMap.getView().animate({center: [112.9819047, 23.66093]}, {zoom: 14}, {rotation: 0})
      // this.cMap.getView().setCenter([112.9819047, 23.66093])
      // this.cMap.getView().setZoom(14)
      // this.cMap.getView().setRotation(0)
    },
    printMap() {
      html2canvasPrint(document.getElementById("map1"));
    },
    printMap2() {
      domtoimagePrint(document.getElementById("map1"));
    },
    screenshot() {
      startScreenShot();
    },
    addEscListener() {
      window.addEventListener('keydown', (e) => {
        if (event.keyCode == 27) {
          if (this.drawInteraction) {
            this.cMap.removeInteraction(this.drawInteraction)
            this.drawInteraction = null
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>