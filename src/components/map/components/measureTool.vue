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
      modifyInteraction: null
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
      this.addInteractionDraw(type)
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
    addInteractionDraw(type) {
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
          this.drawstartCallback(evt)
        }, this);
 
      this.drawInteraction.on('drawend',
        () => {
          this.sketch = null;
          // 处理距离显示框
          this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static measureNum';
          this.measureTooltip.setOffset([0, -7]);
          this.measureTooltipElement = null;
          this.createMeasureTooltip();
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
          let cancelsBtn = document.querySelectorAll('.ol-tooltip-close')
          const self = this
          for(let i = 0; i < cancelsBtn.length; i++) {
            cancelsBtn[i].addEventListener('click', function() {
              self.cMap.removeLayer(self.measureLayerList[Number(this.dataset.index)].layer)
              self.cMap.removeOverlay(self.measureLayerList[Number(this.dataset.index)].tooltip)
              self.$delete(self.measureLayerList, Number(this.dataset.index))
            })
          }
        }, this);
    },
    addModifyDraw() {
      this.modifyInteraction = new ol.interaction.Modify({
        source: this.measureSource
      })
      this.cMap.addInteraction(this.modifyInteraction)
      this.modifyInteraction.on(
        'modifystart',
        evt => {
          this.drawstartCallback(evt, true)
        },
        this
      )
      this.modifyInteraction.on(
        'modifyend',
        evt => {
          // this.measureTooltip.setOffset([0, -7]);
          // this.measureTooltipElement = null;
          // this.createMeasureTooltip();
        },
        this
      )
    },
    drawstartCallback(evt, isModify) {
      this.sketch = isModify ? evt.features.item(0) : evt.feature;
      var tooltipCoord = evt.coordinate;
      listener = this.sketch.getGeometry().on('change', (evt) => {
        var geom = evt.target;
        var output;
        if (geom instanceof ol.geom.Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        if (!isModify) {
          let cancelBtn = `<span class="ol-tooltip-close" title="清除" data-index="${this.drawLayerIndex}" style="position: absolute; top: -7px;right: -16px;cursor: pointer;">x</span>`
          this.measureTooltipElement.innerHTML = output + cancelBtn;
        }
        this.measureTooltip.setPosition(tooltipCoord);
      });
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
      this.measureLayerList[this.drawLayerIndex].tooltip = this.measureTooltip // 防止重复添加测距时，被删掉
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
    clearDraw() {
      for(let key in this.measureLayerList) {
        this.cMap.removeLayer(this.measureLayerList[key].layer)
        this.cMap.removeOverlay(this.measureLayerList[key].tooltip)
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
        this.cMap.removeOverlay(this.measureLayerList[this.drawLayerIndex].tooltip)
        this.cMap.removeOverlay(this.measureLayerList[this.drawLayerIndex].helpTooltip)
        this.$delete(this.measureLayerList, this.drawLayerIndex)
      }
      if (this.modifyInteraction) {
        this.cMap.removeInteraction(this.modifyInteraction)
        this.modifyInteraction = null
      }
    },
    finishModify() {
      this.cMap.removeInteraction(this.modifyInteraction)
      this.modifyInteraction = null
    }
  }
}
</script>