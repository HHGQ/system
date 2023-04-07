<template>
  <div style="display: inline-block;margin-left: 7px;">
    <el-button type="success" size="small" @click="measure('LineString')"
      >测距</el-button
    >
    <el-button type="success" size="small" @click="measure('Polygon')"
      >测面积</el-button
    >
    <el-button type="success" size="small" @click="clearDraw"
      >清除测量</el-button
    >
    <el-button type="success" size="small" @click="measure('LineString', true)"
      >画可编辑路线</el-button
    >
    <el-button type="success" size="small" @click="finishModify"
      >完成编辑路线</el-button
    >
  </div>
</template>

<script>
import $ from "jquery";
import ol from "openlayers";
let listener;
export default {
  props: {
    cMap: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      drawInteraction: null,
      drawLayerIndex: 0,
      measureLayerList: {},
      sketch: null,
      helpTooltipElement: null,
      helpTooltip: '',
      measureTooltipElement: null,
      measureTooltip: '',
      modifyInteractionObj: {},
      vectorLayer: [],
      vectorLayerId: 1,
    }
  },
  mounted() {
    this.addEscListener()
  },
  methods: {
    // 测量
    measure(type, isModify) {
      this.addMeasureLayer()
      this.addTip()
      this.addInteractionDraw(type, isModify)
      isModify && this.addModifyDraw()
    },
    // 画测量图层
    addMeasureLayer() {
      this.measureSource = new ol.source.Vector()
      let vector = new ol.layer.Vector({
        source: this.measureSource,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({ color: '#e33e33', width: 3 })
        })
      })
      this.cMap.addLayer(vector)
      this.drawLayerIndex++
      this.measureLayerList[this.drawLayerIndex] = {
        layer: vector
      }
    },
    // 新增绘制提示和距离参数
    addTip() {
      this.createMeasureTooltip();
      this.createHelpTooltip();
      // 鼠标移动时添加提示
      this.cMap.on('pointermove', e => {
        this.pointerMoveHandler(e)
      })
      // 鼠标移除地图时隐藏提示
      this.cMap.getViewport().addEventListener('mouseout', () => {
        this.helpTooltipElement && this.helpTooltipElement.classList.add('hidden')
      })
    },
    // 添加交互
    addInteractionDraw(type, isModify) {
      // 移除已有交互
      this.cMap.removeInteraction(this.drawInteraction)
      this.drawInteraction = new ol.interaction.Draw({
        source: this.measureSource,
        type: type,
        stopClick: true, // 是否禁止地图单击双击事件，默认是false
        finishCondition: e => { // 加该参数可限制双击完成编辑
          this.drawInteraction.finishDrawing() // 完成编辑
        },
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      this.cMap.addInteraction(this.drawInteraction);
      this.drawInteraction.on('drawstart',
        function (evt) {
          evt.feature.set('data', this.drawLayerIndex) // 给画的 feature 加上标记，用于清除 feature 及 tip
          this.drawstartCallback(evt)
        }, this);
 
      this.drawInteraction.on('drawend',
        (evt) => {
          this.sketch = null;
          // 处理距离显示框
          this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static measureNum';
          this.measureTooltip.setOffset([0, -7]);
          this.measureTooltipElement = null;
          // 处理 draw 交互
          ol.Observable.unByKey(listener);
          this.cMap.un('pointermove', e => {
            this.pointerMoveHandler(e)
          });
          this.cMap.removeInteraction(this.drawInteraction);
          this.drawInteraction = null
          // 移除操作提示框
          this.helpTooltipElement.classList.add('hidden');
          this.cMap.removeOverlay(this.measureLayerList[this.drawLayerIndex].helpTooltip)
          // 给取消按钮添加删除事件
          this.addDeleteEvent()
          // 若是可编辑交互则添加额外的图层
          isModify && this.addExtraLayer(evt)
        }, this);
    },
    addModifyDraw() {
      // this.cMap.removeInteraction(this.modifyInteraction)
      this.modifyInteractionObj[this.drawLayerIndex] = new ol.interaction.Modify({
        source: this.measureSource
      })
      this.cMap.addInteraction(this.modifyInteractionObj[this.drawLayerIndex])
      this.modifyInteractionObj[this.drawLayerIndex].on(
        'modifystart',
        evt => {
          this.drawstartCallback(evt, true)
        },
        this
      )
      this.modifyInteractionObj[this.drawLayerIndex].on(
        'modifyend',
        evt => {
          // 处理 draw 交互
          ol.Observable.unByKey(listener);
          this.cMap.un('pointermove', e => {
            this.pointerMoveHandler(e)
          });
          
          // 给取消按钮添加删除事件
          this.addDeleteEvent()

          this.addExtraLayer(evt, true)
        },
        this
      )
    },
    drawstartCallback(evt, isModify) {
      this.sketch = isModify ? evt.features.item(0) : evt.feature;
      let modifyIndex = this.sketch.get('data')
      let tooltipCoord = evt.coordinate;
      listener = this.sketch.getGeometry().on('change', (e) => {
        let geom = e.target;
        let output;
        if (geom instanceof ol.geom.Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        let cancelBtn = `<span class="ol-tooltip-close" title="清除" data-index="${modifyIndex}" style="position: absolute; top: -7px;right: -16px;cursor: pointer;">x</span>`
        this.measureLayerList[modifyIndex].measureTooltipElement.innerHTML = output + cancelBtn;
        this.measureLayerList[modifyIndex].measureTooltip.setPosition(tooltipCoord);
      });
    },
    addDeleteEvent() {
      let cancelsBtn = document.querySelectorAll('.ol-tooltip-close')
      const self = this
      for(let i = 0; i < cancelsBtn.length; i++) {
        $(cancelsBtn[i]).off('click')
        $(cancelsBtn[i]).on('click', function() {
          self.cMap.removeLayer(self.measureLayerList[Number(this.dataset.index)].layer)
          self.cMap.removeOverlay(self.measureLayerList[Number(this.dataset.index)].measureTooltip)
          self.$delete(self.measureLayerList, Number(this.dataset.index))
          self.cMap.removeInteraction(self.modifyInteractionObj[Number(this.dataset.index)])
          self.$delete(self.modifyInteractionObj, Number(this.dataset.index))
        })
      }
    },
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return;
      }
      var helpMsg = '请点击开始绘制,按esc取消';
      if (this.sketch) {
        var geom = this.sketch.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
          helpMsg = '单击继续绘制多边形,按esc取消';
        } else if (geom instanceof ol.geom.LineString) {
          helpMsg = '单击继续绘制直线,按esc取消';
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);
      this.helpTooltipElement.classList.remove('hidden');
    },
    formatLength(line) {
      //获取投影坐标系
      var sourceProj = this.cMap.getView().getProjection(); // 获取投影
      //ol/sphere里有getLength()和getArea()用来测量距离和区域面积，默认的投影坐标系是EPSG:3857, 其中有个options的参数，可以设置投影坐标系
      var length = ol.Sphere.getLength(line, {projection: sourceProj});
      var output;
      if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
      } else {
        output = (Math.round(length * 100) / 100) +
          ' ' + 'm';
      }
      return output;
    },
    formatArea(polygon) {
      //获取投影坐标系
      var sourceProj = this.cMap.getView().getProjection();
      var area = ol.Sphere.getArea(polygon, {projection: sourceProj})
      var output;
      if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
          ' ' + 'km<sup>2</sup>';
      } else {
        output = (Math.round(area * 100) / 100) +
          ' ' + 'm<sup>2</sup>';
      }
      return output;
    },
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement('div');
      this.helpTooltipElement.className = 'ol-tooltip hidden';
      this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      });
      this.cMap.addOverlay(this.helpTooltip);
      this.measureLayerList[this.drawLayerIndex].helpTooltip = this.helpTooltip
      this.measureLayerList[this.drawLayerIndex].measureTooltip = this.measureTooltip // 防止重复添加测距时，被删掉
      this.measureLayerList[this.drawLayerIndex].measureTooltipElement = this.measureTooltipElement
    },
    createMeasureTooltip() {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
      }
      this.measureTooltipElement = document.createElement('div');
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
      this.measureTooltip = new ol.Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this.cMap.addOverlay(this.measureTooltip);
    },
    addExtraLayer(evt, isModify) {
      let feature = isModify ? evt.features.item(0) : evt.feature
      let featureData = feature.get('data')
      this.vectorLayer.forEach((item, index) => {
        if (item.getSource().getFeatures()[0].get('data') == featureData) this.cMap.removeLayer(this.vectorLayer[index])
      })
      let gpsArr = feature.getGeometry().getCoordinates()
      console.log(gpsArr)
      if (!gpsArr.length) return
      this.addVectorLayer(
        {
          pointsList: gpsArr[0],
          fill: 'rgba(255, 0, 0, 1)',
          stroke: 'rgba(255, 0, 0, 1)',
          circleRadius: 14,
          strokeWidth: 7,
          featureData
        }
      )
      this.addVectorLayer(
        {
          pointsList: gpsArr[0],
          fill: 'rgba(255, 255, 255, 1)',
          stroke: 'rgba(255, 255, 255, 1)',
          circleRadius: 7,
          strokeWidth: 7,
          featureData
        }
      )
      this.addVectorLayer(
        {
          pointsList: gpsArr[gpsArr.length - 1],
          fill: 'red',
          stroke: 'red',
          circleRadius: 14,
          strokeWidth: 7,
          featureData
        }
      )
      this.addVectorLayer(
        {
          pointsList: gpsArr[gpsArr.length - 1],
          fill: 'rgba(255, 0, 0, 0.15)',
          stroke: 'rgba(255, 0, 0, 1)',
          circleRadius: 35,
          strokeWidth: 1,
          featureData
        }
      )

      this.addVectorLayer(
        {
          pointsList: gpsArr[0],
          text: '起点',
          fill: 'blue',
          stroke: undefined,
          featureData
        },
        true
      )
      this.addVectorLayer(
        {
          pointsList: gpsArr[gpsArr.length - 1],
          text: '终点',
          fill: 'blue',
          stroke: undefined,
          featureData
        },
        true
      )
    },
    addVectorLayer(option, isText = false) {
      let source = new ol.source.Vector()
      this.vectorLayer[this.vectorLayerId] = new ol.layer.Vector({
        source
      })
      this.cMap.addLayer(this.vectorLayer[this.vectorLayerId])
      this.vectorLayerId++
      let feature = new ol.Feature({
        geometry: new ol.geom.Point(option.pointsList || []),
        name: option.text || '',
        data: option.featureData
      })
      if (isText) {
        feature.setStyle(
          new ol.style.Style({
            text: new ol.style.Text({
              textAlign: 'center',
              textBaseline: 'middle',
              font: '16px',
              offsetX: 0,
              offsetY: 0,
              text: feature.get('name'),
              fill: new ol.style.Fill({ color: option.fill || '#FFFFFF' }),
              stroke: option.stroke == undefined ? '' : new ol.style.Stroke({ color: option.stroke || '#039B03', width: 14 })
            })
          })
        )
      } else {
        feature.setStyle(
          new ol.style.Style({
            image: new ol.style.Circle({
              fill: new ol.style.Fill({ color: option.fill || 'rgba(255, 255, 255, 0.4)' }),
              stroke: option.stroke == undefined ? '' : new ol.style.Stroke({ color: option.stroke || 'rgba(0, 193, 192, 0.5)', width: option.strokeWidth || 14 }),
              radius: option.circleRadius || 13
            }),
            fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.4)' }),
            stroke: new ol.style.Stroke({ color: '#3399CC', width: 1.25 })
          })
        )
      }
      source.addFeature(feature)
    },
    clearDraw() {
      for(let key in this.measureLayerList) {
        this.cMap.removeLayer(this.measureLayerList[key].layer)
        this.cMap.removeOverlay(this.measureLayerList[key].measureTooltip)
      }
      this.measureLayerList = {}
    },
    addEscListener() {
      window.addEventListener('keydown', (e) => {
        if (event.keyCode == 27) {
          if (this.drawInteraction) {
            this.removeCurrentDraw()
          }
        }
      })
    },
    removeCurrentDraw() {
      if (this.drawInteraction) {
        this.cMap.removeInteraction(this.drawInteraction)
        this.drawInteraction = null
        this.cMap.removeLayer(this.measureLayerList[this.drawLayerIndex].layer)
        this.cMap.removeOverlay(this.measureLayerList[this.drawLayerIndex].measureTooltip)
        this.cMap.removeOverlay(this.measureLayerList[this.drawLayerIndex].helpTooltip)
        this.$delete(this.measureLayerList, this.drawLayerIndex)
      }
      if (this.modifyInteractionObj[this.drawLayerIndex]) {
        this.cMap.removeInteraction(this.modifyInteractionObj[this.drawLayerIndex])
        this.$delete(self.modifyInteractionObj, Number(this.dataset.index))
      }
    },
    finishModify() {
      this.cMap.removeInteraction(this.modifyInteractionObj[this.drawLayerIndex])
      this.$delete(self.modifyInteractionObj, Number(this.dataset.index))
    }
  }
}
</script>