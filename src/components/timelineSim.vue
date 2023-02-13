<template>
  <div style="width: 100%;height: 20px;">
    <img :src="require('@/assets/timeline/fastRewind_normal.png')" title="快退30秒" alt="" width="20px" height="20px" style="cursor: pointer;position:absolute" @click="iconChangeTime('rewind')">
    <canvas id="timelineSimple" width="1000" height="20"></canvas>
    <img :src="require('@/assets/timeline/fastForward_normal.png')" title="快进30秒" alt="" width="20px" height="20px" style="cursor: pointer;position:absolute" @click="iconChangeTime('forward')">
    <div style="cursor: pointer;" @click="startPlay">开始播放</div>
    <div style="cursor: pointer;" @click="stopPlay">停止播放</div>
    <canvas></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      $canvas: null,
      canvasContext: null,
      isDraging: false,
      timePerPixel: 30, // 每1px占用毫秒数
    }
  },
  mounted() {
    this.initData('03:02:51 /03:07:51')
    this.draw(0, '03:02:51 /03:07:51');
    // this.startPlay()
  },
  methods: {
    startPlay() {
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        if (this.processTime == this.endTime) return
        let targetDate = new Date(new Date(`2022-01-01 ${this.processTime}`).valueOf() + 1000)
        let processTime = `${String(targetDate.getHours()).padStart(2, 0)}:${String(targetDate.getMinutes()).padStart(2, 0)}:${String(targetDate.getSeconds()).padStart(2, 0)}`
        if (processTime >= this.endTime) {
          this.stopPlay()
          this.draw(this.$canvas.width-105, `${this.endTime} /${this.endTime}`)
        } else {
          let time = `${processTime} /${this.endTime}`
          let process = (new Date(`2022-01-01 ${processTime}`) - new Date(`2022-01-01 ${this.startTime}`)) / this.timePerPixel
          this.draw(process, time)
        }
        this.timeUpdate(this.processTime);
      }, 1000)
    },
    stopPlay() {
      clearInterval(this.intervalId)
    },
    initData(time) {
      this.$canvas = document.getElementById('timelineSimple')
      this.canvasContext = this.$canvas.getContext('2d')
      this.isDraging = false;
      let timeArr = time.split(' /')
      this.startTime = timeArr[0]
      this.endTime = timeArr[1]
      this.timePerPixel = (new Date(`2023-01-01 ${timeArr[1]}`) - new Date(`2023-01-01 ${timeArr[0]}`)) / (this.$canvas.width-125)
    },
    // 绘制时间轴
    draw (process = 0, time = '00:00:00 /00:00:00') {
      // 拖拽中禁止外部调用,防止冲突
      // if (this.isDraging && !_privateFlag) {
      //   return;
      // }
      let timeArr = time.split(' /')
      this.processTime = timeArr[0]
      // 清空画布及事件
      this.clear();
      // 填充背景
      this.drawArea(this.$canvas.width-125, '#dcdfe6');
  
      this.drawArea(process, '#3d84ee');

      // 绘制当前时间指针
      this.drawText(this.$canvas.width-100, 6, time, 'black', 'left', 'top');

      // 拖拽事件
      this.$canvas.onmousedown = this._onDrag;
    },
    
    // 拖拽
    _onDrag(e) {
      this.isDraging = true;
      this.dragTime(e)
      document.onmousemove = this._.throttle((moveEvent) => {
        if (moveEvent.srcElement != this.$canvas) return this.isDraging = false
        this.dragTime(moveEvent)
      }, 200);

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.isDraging = false;
        this.timeUpdate(this.processTime);
      };
    },
    dragTime(e) {
      let offset = e.offsetX - 20
      if (offset < 0 || offset > this.$canvas.width-125) return
      let targetDate = new Date(new Date('2022-01-01 03:02:51').valueOf() + offset * this.timePerPixel)
      let processTime = `${String(targetDate.getHours()).padStart(2, 0)}:${String(targetDate.getMinutes()).padStart(2, 0)}:${String(targetDate.getSeconds()).padStart(2, 0)}`
      let time = `${processTime} /${this.endTime}`
      this.draw(offset, time)
    },
    iconChangeTime(type) {
      if (type == 'rewind') {
        if (this.processTime == this.startTime) return
        let targetDate = new Date(new Date(`2022-01-01 ${this.processTime}`).valueOf() - 30000)
        let processTime = `${String(targetDate.getHours()).padStart(2, 0)}:${String(targetDate.getMinutes()).padStart(2, 0)}:${String(targetDate.getSeconds()).padStart(2, 0)}`
        if (processTime <= this.startTime) {
          this.draw(0, `${this.startTime} /${this.endTime}`)
        } else {
          let time = `${processTime} /${this.endTime}`
          let process = (new Date(`2022-01-01 ${processTime}`) - new Date(`2022-01-01 ${this.startTime}`)) / this.timePerPixel
          this.draw(process, time)
        }
        this.timeUpdate(this.processTime);
      } else {
        if (this.processTime == this.endTime) return
        let targetDate = new Date(new Date(`2022-01-01 ${this.processTime}`).valueOf() + 30000)
        let processTime = `${String(targetDate.getHours()).padStart(2, 0)}:${String(targetDate.getMinutes()).padStart(2, 0)}:${String(targetDate.getSeconds()).padStart(2, 0)}`
        if (processTime >= this.endTime) {
          this.draw(this.$canvas.width-105, `${this.endTime} /${this.endTime}`)
        } else {
          let time = `${processTime} /${this.endTime}`
          let process = (new Date(`2022-01-01 ${processTime}`) - new Date(`2022-01-01 ${this.startTime}`)) / this.timePerPixel
          this.draw(process, time)
        }
        this.timeUpdate(this.processTime);
      }
    },
    timeUpdate(e) {
      console.log(e, 'currentTime change');
    },

    // 清空画布
    clear() {
      if(this.canvasContext) {
        this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      }
      if (this.$canvas) {
        this.$canvas.onmousedown = null;
      }
    },

    // 绘制文字
    drawText(x, y, text, color = '#ffffff', align = 'center', baseLine ='alphabetic') {
      this.canvasContext.beginPath();
      this.canvasContext.font = '12px Arial';
      this.canvasContext.fillStyle = color;
      this.canvasContext.textAlign = align;
      this.canvasContext.textBaseline = baseLine;
      this.canvasContext.fillText(text, x, y);
    },

    // 绘制区域
    drawArea(endX, bgColor) {
      this.canvasContext.beginPath();
      this.canvasContext.rect(20, 6, endX, 8);
      this.canvasContext.fillStyle = bgColor;
      this.canvasContext.fill();
    },
    dateTime(time, format = 'MM/DD HH:mm') {
      return this.$dayjs(time * 1000).format(format);
    },
  }
}
</script>