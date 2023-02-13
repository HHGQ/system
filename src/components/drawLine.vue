<template>
  <div>
    <div
      id="draw_container"
      style="
        width: 300px;
        height: 300px;
        border: 1px solid gray;
        position: relative;
        left: 100px;
        top: 100px;
        z-index: 2;
      "
      @mousedown.stop.prevent="mousedown($event)"
      @mousemove="mousemove($event)"
      @contextmenu.prevent
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentDom: null,
      firstPointLeft: -1,
      firstPointTop: null,
      lastPointLeft: null,
      lastPointTop: null,
      vAngle: null,
      vWidth: null,
      vPointLeft: null,
      vPointTop: null,
      vLineDiv: null
    }
  },
  mounted() {
    this.parent = document.getElementById('draw_container')
  },
  methods: {
    mousedown(e) {
      e.preventDefault()
      // 右键或点第一个点
      if (e.button == 2 || this.firstPointLeft - 10 < e.layerX && e.layerX < this.firstPointLeft + 10 && this.firstPointTop - 10 < e.layerY && e.layerY < this.firstPointTop + 10) return this.endDraw()
      // 点击的是预画线
      if (e.srcElement == this.vLineDiv) {
        this.parent.removeChild(this.vLineDiv)
        this.vLineDiv = null
        this.drawLine(this.lastPointLeft, this.lastPointTop, this.vAngle, this.vWidth)
        this.drawPoint(this.vPointLeft, this.vPointTop)
        return
      }
      // 不是点击画图层
      if (this.parent != e.srcElement) {
        return
      }
      if (this.lastPointLeft && this.lastPointTop) {
        // 若已有点，则画线
        if (this.vLineDiv) {
          this.parent.removeChild(this.vLineDiv)
          this.vLineDiv = null
        }
        var obj = this.getAngle(this.lastPointLeft, this.lastPointTop, e.layerX, e.layerY)
        this.drawLine(this.lastPointLeft, this.lastPointTop, obj.angle, obj.z)
      } else {
        // 否则记录第一个点位置
        this.firstPointLeft = e.layerX
        this.firstPointTop = e.layerY
      }
      this.drawPoint(e.layerX, e.layerY)
    },
    // 预画线
    mousemove(e) {
      // 若不是外层div或者没有点
      if (this.parent != e.srcElement || this.firstPointLeft < 0) return
      var obj = this.getAngle(this.lastPointLeft, this.lastPointTop, e.layerX, e.layerY)
      this.vAngle = obj.angle
      this.vWidth = obj.z
      this.vPointLeft = e.layerX
      this.vPointTop = e.layerY
      if (this.vLineDiv) {
        // e.srcElement.removeChild(vLineDiv)
        // vLineDiv = null
        this.vLineDiv.style.width = obj.z + 'px'
        this.vLineDiv.style.transform = 'rotate(' + obj.angle + 'deg)';
        return
      }
      if (this.lastPointLeft && this.lastPointTop) {
        this.drawLine(this.lastPointLeft, this.lastPointTop, obj.angle, obj.z, true)
      }
    },
    endDraw(e) {
      var obj = this.getAngle(this.lastPointLeft, this.lastPointTop, this.firstPointLeft, this.firstPointTop)
      this.drawLine(this.lastPointLeft, this.lastPointTop, obj.angle, obj.z)
      this.firstPointLeft = -1
      this.firstPointTop = undefined
      this.lastPointLeft = undefined
      this.lastPointTop = undefined
      this.parent.removeChild(this.vLineDiv)
      this.vLineDiv = null
    },
    // 画点
    drawPoint(x, y) {
      var oDiv = document.createElement('div')
      oDiv.style.position = 'absolute';
      oDiv.style.height = '2px';
      oDiv.style.width = '2px';
      oDiv.style.backgroundColor = 'red';
      this.lastPointLeft = x
      this.lastPointTop = y
      oDiv.style.left = x + 'px';
      oDiv.style.top = y + 'px';
      this.parent.appendChild(oDiv);
    },
    // 画线
    drawLine(x, y, angle, width, isPre) {
      var lineDiv = document.createElement('div')
      if (isPre) {
        this.vLineDiv = lineDiv
        lineDiv.style.color = 'red'
      }
      lineDiv.style.position = 'absolute';
      lineDiv.style.height = '2px';
      lineDiv.style.width = width + 'px';
      lineDiv.style.backgroundColor = 'red';
      lineDiv.style.left = x + 'px';
      lineDiv.style.top = y + 'px';
      lineDiv.style.transform = 'rotate(' + angle + 'deg)';
      lineDiv.style.transformOrigin = 0;
      this.parent.appendChild(lineDiv);
    },
    // 获取两点之间的角度
    getAngle(x1, y1, x2, y2) {
      // 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
      var x = x1 - x2;
      var y = y1 - y2;
      var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      var cos = y / z;
      var radina = Math.acos(cos); // 用反三角函数求弧度
      var angle = 180 / (Math.PI / radina); // 将弧度转换成角度
      var width = 0
      if (x2 > x1 && y2 === y1) {
        // 在x轴正方向上
        angle = 0;
      }
      if (x2 > x1 && y2 < y1) {
        // 在第一象限;
        angle = angle - 90;
      }
      if (x2 === x1 && y1 > y2) {
        // 在y轴正方向上
        angle = -90;
      }
      if (x2 < x1 && y2 < y1) {
        // 在第二象限
        angle = 270 - angle;
      }
      if (x2 < x1 && y2 === y1) {
        // 在x轴负方向
        angle = 180;
      }
      if (x2 < x1 && y2 > y1) {
        // 在第三象限
        angle = 270 - angle;
      }
      if (x2 === x1 && y2 > y1) {
        // 在y轴负方向上
        angle = 90;
      }
      if (x2 > x1 && y2 > y1) {
        // 在四象限
        angle = angle - 90;
      }
      return { angle, z };
    }
  }
}
</script>