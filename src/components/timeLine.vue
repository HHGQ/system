<template>
  <div style="width: 100%;height: 70px;">
    <canvas id="timeline"></canvas>
  </div>
</template>

<script>
const defaultOptions = {
  fill:false,
  bgColor: 'rgba(0,0,0,0.5)',
  textColor: '#ffffff',
  scaleColor: '#ffffff',
  areaBgColor: '#ffffff55',
  pointColor: '#00aeec',
  pointWidth: 3,
  scaleSpacing: 7,
  fps: 60,
  zoom: 2,
  maxZoom: 9,
  minZoom: 1,
}
export default {
  data() {
    return {
      $canvas: null,
      canvasContext: null,
      isDraging: false,
      timeSpacing: 30, // 时间间距
      scaleSpacing: 7, // 刻度间距
      scaleHeight: {}, // 刻度高度
      bgColor: 'rgba(0,0,0,0.5)', // canvas 背景颜色
      pointWidth: 3, // 当前时间指针宽度
      pointColor: '#00aeec', // 当前指针颜色
      textColor: '#ffffff', // 文字颜色
      scaleColor: '#ffffff', // 刻度颜色
      areaBgColor: '#ffffff55', // 阴影区颜色
      fps: 60, // fps,
    }
  },
  mounted() {
    this.initData({
      fill: false,
      width: 1000,
      height: 80,
      // bgColor: 'rgba(0,0,0,0.5)',
      // textColor: '#000',
      // pointColor: '#000',
      // centerTimePointColor: '#000',
      // centerTimePointWidth: 5,
      scaleSpacing: 7,
      maxZoom: 9,
      minZoom: 1,
      zoom: 2,
    })
    this.draw({
      currentTime: 1651827817,
      areas: [{
        startTime: 1651827433,
        endTime: 1651829413,
        // bgColor: '#00AEEC'
      },{
        startTime: 1651829533,
        endTime: 1651832533,
        // bgColor: '#00AEEC'
      }],
    });
  },
  methods: {
    initData(options = {}) {
      this.$canvas = document.getElementById('timeline')
      this.canvasContext = this.$canvas.getContext('2d')

      // 获取配置项
      const { fill, width, height, bgColor, textColor, scaleColor, areaBgColor, pointColor, pointWidth, scaleSpacing, fps, zoom, maxZoom, minZoom } = { ...defaultOptions, ...options };

      // 检查zoom参数是否合法
      if (zoom < minZoom || zoom > maxZoom || zoom % 1 !== 0) {
        throw new Error(`zoom must be minZoom ~ maxZoom(${minZoom} ~1 ${maxZoom}), and must be an integer`);
      }
      if (maxZoom < 1 || maxZoom > 9 || maxZoom % 1 !== 0) {
        throw new Error('maxZoom must be 1 ~ 9, and must be an integer');
      }
      if (minZoom < 1 || minZoom > 9 || minZoom % 1 !== 0) {
        throw new Error('minZoom must be 1 ~ 9, and must be an integer');
      }
      if (maxZoom < minZoom) {
        throw new Error('maxZoom must be greater than minZoom');
      }
      
      // 判断使用父元素宽高
      if (fill) {
        // 获取父元素
        const $canvasParent = this.$canvas.parentElement;
        // 将canvas 宽高设为父元素宽高
        this.$canvas.width = $canvasParent.clientWidth;
        this.$canvas.height = $canvasParent.clientHeight;
        // resize observer
        const parentResizeObserver = new ResizeObserver(this._.throttle(this._onParentResize, 200));
        // 监听父元素resize
        parentResizeObserver.observe($canvasParent);
      } else {
        if (width) this.$canvas.width = width;
        if (height) this.$canvas.height = height;
      }

      this.isDraging = false;

      this.currentTime = 0;
      
      const timeSpacingMap = [1, 10, 30, 60, 120, 300, 7200, 86400, 604800];
      this.timeSpacingMap = [];
      for (let i = minZoom - 1; i < maxZoom; i++) {
        this.timeSpacingMap.push(timeSpacingMap[i]);
      }
      
      // this.timeSpacing = 60; // 时间间距
      this.timeSpacing = timeSpacingMap[zoom - 1];
      this.scaleSpacing = scaleSpacing; // 默认刻度间距7px
      

      // 刻度高度
      this.scaleHeight = {
        height6: this.$canvas.height / 2, // 1/2高度
        height5: this.$canvas.height / 3, // 1/3高度
        height4: this.$canvas.height / 4, // 1/4高度
        height3: this.$canvas.height / 5, // 1/5高度
        height2: this.$canvas.height / 8, // 1/8高度
        height1: this.$canvas.height / 10, // 1/10高度
      }

      // canvas 背景颜色
      this.bgColor = bgColor;
      // 当前时间指针宽度
      this.pointWidth = pointWidth;
      // 当前指针颜色
      this.pointColor = pointColor;
      // 文字颜色
      this.textColor = textColor;
      // 刻度颜色
      this.scaleColor = scaleColor;
      // 阴影区颜色
      this.areaBgColor = areaBgColor;
      // fps
      this.fps = fps;
    },
    // 绘制时间轴
    draw ({currentTime, areas, _privateFlag} = {}) {
      // console.time('draw');
      // 拖拽中禁止外部调用,防止冲突
      if (this.isDraging && !_privateFlag) {
        return;
      }
      // 获取参数
      this.currentTime = currentTime || Math.floor(Date.now() / 1000);
      this.areas = areas || [];

      // 当前屏可绘制刻度数量
      const screenScaleCount = Math.ceil(this.$canvas.width / this.scaleSpacing) + 1;
      // 当前屏显示秒数
      const screenSecondCount = screenScaleCount * this.timeSpacing;

      // 开始时间
      const startTime = this.currentTime - screenSecondCount / 2;
      // 结束时间
      const endTime = this.currentTime + screenSecondCount / 2;

      // 每1px所占时间单位（秒）
      const timePerPixel = screenSecondCount / this.$canvas.width;
      // 清空画布及事件
      this.clear();

      // 填充背景
      this.drawArea(0, 0, this.$canvas.width, this.$canvas.height, this.bgColor);

      // 绘制阴影区域
      this.areas.forEach(item => {
        const startX = item.startTime < startTime ? 0 : Math.floor((item.startTime - startTime) / timePerPixel);
        const endX = item.endTime > endTime ? this.$canvas.width : Math.floor((item.endTime - startTime) / timePerPixel);
        this.drawArea(startX, 0, endX, this.$canvas.height, item.bgColor || this.areaBgColor);
      });

      // 绘制刻度
      this.drawHelper({
        pointWidth: this.pointWidth,
        timePerPixel,
        scaleHeight: this.scaleHeight,
        scaleSpacing: this.scaleSpacing,
        timeSpacing: this.timeSpacing,
        screenScaleCount,
        startTime,
        drawLine: this.drawLine,
        drawText: this.drawText,
      });

      // 绘制比例尺
      this.drawTimelineScale(this.timeSpacing);

      // canvas X轴中心点（当前时间指示刻度）
      const xCenterPoint = this.$canvas.width / 2;
      // 绘制当前时间指针
      this.drawLine(xCenterPoint - this.pointWidth / 2, this.$canvas.height, this.pointWidth, this.pointColor);
      this.drawArea(xCenterPoint - 54, 4, xCenterPoint + 54, 18, this.pointColor);
      this.drawText(xCenterPoint, 6, `${this.dateTime(this.currentTime, 'YYYY/MM/DD HH:mm:ss')}`, this.textColor, 'center', 'top');

      // 鼠标滚轮事件
      this.$canvas.onwheel = this._onZoom;
      // 拖拽事件
      this.$canvas.onmousedown = this._onDrag;
      this.$canvas.onclick = this._onClick;
      // console.timeEnd('draw');
    },
    
    // 拖拽
    _onDrag({ clientX }) {
      this.isDraging = true;
      let prexOffset = 0;
      document.onmousemove = this._.throttle((moveEvent) => {
        const curxOffset = moveEvent.clientX - clientX;
        const currentTime = this.currentTime - this.timeSpacing / this.scaleSpacing * (curxOffset - prexOffset);
        console.log(currentTime, this.currentTime)
        prexOffset = curxOffset;

        this.draw({
          currentTime: Math.round(currentTime),
          areas: this.areas,
          _privateFlag: true,
        });
      }, this.timeSpacing === 1 ? 100 : 1000 / this.fps);

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.isDraging = false;
        this.timeUpdate(this.currentTime);
      };
    },
    _onClick(e) {
      console.log(e.clientX, e.layerX, e.offsetX)
    },
    timeUpdate(e) {
      console.log(e, 'currentTime change');
      const _date = new Date(e * 1000)
      console.log(_date)
    },
    // 缩放
    _onZoom(e) {
      e.preventDefault();
      const currentIndex = this.timeSpacingMap.findIndex(item => item === this.timeSpacing);
      if (e.deltaY < 0 && currentIndex > 0) {
        this.timeSpacing = this.timeSpacingMap[currentIndex - 1];
        this.draw({
          currentTime: this.currentTime,
          areas: this.areas,
          _privateFlag: true,
        });
      } else if (e.deltaY > 0 && currentIndex < this.timeSpacingMap.length - 1) {
        this.timeSpacing = this.timeSpacingMap[currentIndex + 1];
        this.draw({
          currentTime: this.currentTime,
          areas: this.areas,
          _privateFlag: true,
        });
      }
    },
    // 父元素size变化
    _onParentResize(e) {
      const $canvasParent = this.$canvas.parentNode;
      console.log($canvasParent.clientWidth,this.$canvas.width)
      if (!$canvasParent || $canvasParent.clientWidth == this.$canvas.width) {
        return;
      }
      this.$canvas.width = $canvasParent.clientWidth;
      this.$canvas.height = $canvasParent.clientHeight;
      // 刻度高度
      this.scaleHeight = {
        height6: this.$canvas.height / 2, // 1/2高度
        height5: this.$canvas.height / 3, // 1/3高度
        height4: this.$canvas.height / 4, // 1/4高度
        height3: this.$canvas.height / 5, // 1/5高度
        height2: this.$canvas.height / 8, // 1/8高度
        height1: this.$canvas.height / 10, // 1/10高度
      }
      this.draw({
        currentTime: this.currentTime,
        areas: this.areas,
      });
    },

    // 清空画布
    clear() {
      if(this.canvasContext) {
        this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      }
      if (this.$canvas) {
        this.$canvas.onwheel = null;
        this.$canvas.onmousedown = null;
      }
    },
    // 绘制比例尺
    drawTimelineScale(timespacing) {
      // [1, 10, 30, 60, 120, 300, 7200, 86400, 604800];
      let text = '';
      switch (timespacing) {
        case 1:
          text = '1s';
          break;
        case 10:
          text = '10s';
          break;
        case 30:
          text = '30s';
          break;
        case 60:
          text = '1min';
          break;
        case 120:
          text = '2min';
          break;
        case 300:
          text = '5min';
          break;
        case 7200:
          text = '2hour';
          break;
        case 86400:
          text = '1day';
          break;
        case 604800:
          text = '1week';
          break;
        default:
          break;
      }
      this.drawText(this.scaleSpacing + 12, 9, `${text}`, this.textColor, 'left', 'middle');

      this.canvasContext.beginPath();
      this.canvasContext.moveTo(5, 6);
      this.canvasContext.lineTo(5, 10);
      this.canvasContext.lineTo(this.scaleSpacing + 7, 10);
      this.canvasContext.lineTo(this.scaleSpacing + 7, 6);
      this.canvasContext.strokeStyle = this.scaleColor;
      this.canvasContext.lineWidth = 1.5;
      this.canvasContext.stroke();
    },

    // 绘制线条
   drawLine(x, y, width = 1, color = this.scaleColor) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(x, this.$canvas.height);
      this.canvasContext.lineTo(x, this.$canvas.height - y);
      this.canvasContext.closePath();
      this.canvasContext.strokeStyle = color;
      this.canvasContext.lineWidth = width;
      this.canvasContext.stroke();
    },

    // 绘制文字
    drawText(x, y, text, color = this.textColor, align = 'center', baseLine ='alphabetic') {
      this.canvasContext.beginPath();
      this.canvasContext.font = '11px Arial';
      this.canvasContext.fillStyle = color;
      this.canvasContext.textAlign = align;
      this.canvasContext.textBaseline = baseLine;
      this.canvasContext.fillText(text, x, y);
    },

    // 绘制区域
    drawArea(startX, startY, endX, endY, bgColor) {
      this.canvasContext.beginPath();
      this.canvasContext.rect(startX, startY, endX - startX, endY - startY);
      this.canvasContext.fillStyle = bgColor;
      this.canvasContext.fill();
    },
    drawHelper({pointWidth, timePerPixel, scaleHeight, scaleSpacing, timeSpacing, screenScaleCount, startTime, drawLine, drawText}) {
      if (timeSpacing === 1) {
        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing + pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing); // 当前刻度时间
          // 10s刻度
          if (time % 10 === 0) {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'HH:mm:ss')}`);
            continue;
          }
          // 5s 刻度
          if (time % 5 === 0) {
            drawLine(x, scaleHeight.height3);
            continue;
          }
          // 1秒刻度
          if (time % 1 === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }

      // 密度为10s时
      if (timeSpacing === 10) {
        const timeOffset = +this.dateTime(startTime, 's') % 10;
        const xOffset = timeOffset / timePerPixel;
        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 1分钟刻度
          if (time % 60 === 0) {
            drawLine(x, scaleHeight.height4);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'HH:mm')}`);
            continue;
          }
          // 10秒刻度
          if (time % 10 === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }

      // 密度为30s时
      if (timeSpacing === 30) {
        const timeOffset = +this.dateTime(startTime, 's') % 30;
        const xOffset = timeOffset / timePerPixel;

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 5分钟刻度
          if (time % (60 * 5) === 0) {
            drawLine(x, scaleHeight.height4);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'HH:mm')}`);
            continue;
          }
          // 30秒刻度
          if (time % 30 === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }

      // 密度为1min时
      if (timeSpacing === 60) {
        const timeOffset = +this.dateTime(startTime, 's') % 60;
        const xOffset = timeOffset / timePerPixel;
        
        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 小时刻度
          if (time % (60 * 60) === 0) {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time)}`);
            continue;
          }
          // 5分钟刻度
          if (time % (60 * 5) === 0) {
            drawLine(x, scaleHeight.height3);
            if (time % (60 * 10) === 0) {
              drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'HH:mm')}`);
            }
            continue;
          }
          // 1分钟刻度
          if (time % 60 === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }

      // 密度为2min时
      if (timeSpacing === 120) {
        const timeArr = this.dateTime(startTime, 'm:s').split(':');
        const timestamp = +timeArr[0] * 60 + +timeArr[1];
        const timeOffset = timestamp % 120;
        const xOffset = timeOffset / timePerPixel;

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 30分钟刻度
          if (time % (60 * 30) === 0) {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time)}`);
            continue;
          }
          // 10分钟刻度
          if (time % (60 * 10) === 0) {
            drawLine(x, scaleHeight.height3);
            continue;
          }
          // 2分钟刻度
          if (time % (60 * 2) === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }

      // 密度为5min时
      if (timeSpacing === 300) {
        const timeArr = this.dateTime(startTime, 'm:s').split(':');
        const timestamp = +timeArr[0] * 60 + +timeArr[1];
        const timeOffset = timestamp % 300;
        const xOffset = timeOffset / timePerPixel;

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 小时刻度
          if (time % (60 * 60) === 0) {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time)}`);
            continue;
          }
          // 30分钟刻度
          if (time % (60 * 30) === 0) {
            drawLine(x, scaleHeight.height3);
            continue;
          }
          // 5分钟刻度
          if (time % (60 * 5) === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }
      // 密度为2h时 3600 * 2
      if (timeSpacing === 7200) {
        const timeArr = this.dateTime(startTime, 'H:m:s').split(':');
        const timestamp = +timeArr[0] * 3600 + +timeArr[1] * 60 + +timeArr[2];
        const timeOffset = timestamp % 7200;
        const xOffset = timeOffset / timePerPixel;

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 每日刻度
          if (time % (3600 * 24) === 0) {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'MM/DD HH:mm')}`);
            continue;
          }
          // 12小时刻度
          if (time % (3600 * 12) === 0) {
            drawLine(x, scaleHeight.height3);
            continue;
          }
          // 2小时刻度
          if (time % 7200 === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }
      // 密度为24h时 3600 * 24
      if (timeSpacing === 86400) {
        const timeArr = this.dateTime(startTime, 'H:m:s').split(':');
        const timestamp = +timeArr[0] * 3600 + +timeArr[1] * 60 + +timeArr[2];
        const timeOffset = timestamp % 86400;
        const xOffset = timeOffset / timePerPixel;

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset - pointWidth / 2;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);
          // 每月1号刻度
          if (this.dateTime(time, 'D') === '1') {
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'YYYY/MM/DD')}`);
            continue;
          }
          // 每日刻度
          if (time % 86400 === 57600) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
        return;
      }
      // 密度为1周时 3600 * 24 * 7
      if (timeSpacing === 604800) {
        const timeOffset = startTime - this.getWeekStartDate(startTime);
        const xOffset = timeOffset / timePerPixel;

        const yearText = new Array(screenScaleCount).fill(false);

        const canDrawYearScale = (index) => {
          for (let i = index; i > index - 7; i--) {
            if (yearText[i]) {
              return false;
            }
          }
          return true;
        }

        for(let i = 0; i < screenScaleCount; i++) {
          const x = i * scaleSpacing - xOffset;
          const time = Math.ceil(startTime + i * timeSpacing - timeOffset);

          if (this.$dayjs(time * 1000).month() === 0 && (this.$dayjs(time * 1000).date() > 0 || this.$dayjs(time * 1000).date() <= 31) && canDrawYearScale(i)) {
            yearText[i] = true;
            drawLine(x, scaleHeight.height5);
            drawText(x, scaleHeight.height5 + 13, `${this.dateTime(time, 'YYYY/MM/DD')}`);
            continue;
          }
          if (this.$dayjs(time * 1000).day() === 0) {
            drawLine(x, scaleHeight.height1);
            continue;
          }
        }
      }
    },
    dateTime(time, format = 'MM/DD HH:mm') {
      return this.$dayjs(time * 1000).format(format);
    },
    getWeekStartDate(timestamp = Math.floor(Date.now() / 1000)) {
      const time = timestamp * 1000;
      const year = this.$dayjs(time).year();
      const month = this.$dayjs(time).month();
      const date = this.$dayjs(time).date();
      const day = this.$dayjs(time).day();
      const weekStartDate = new Date(year, month, date - day).getTime();
      return Math.floor(weekStartDate / 1000);
    }
  }
}
</script>