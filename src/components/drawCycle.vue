<template>
  <div id="cycle_containter">
    <div id="div1">在浏览器上拖动鼠标试试</div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.drawCircle()
    this.drawLine(500, 80, 0, 80);
    this.drawLine(300, 70, 300, 600);
    this.drawLine(50, 70, 700, 600);
    var x1 = 0;
    var y1 = 0;
    //以下是处理拖拽 拖拽的时候，出现一条直线和一个圆
    //注意：由于这些操作都是由DOM来完成的，所以性能开销比较大，尤其是在IE里，明显的会卡一些。
    function down(e) {
      let event = e || window.event;
      x1 = event.clientX;
      y1 = event.clientY;
      document.getElementById('cycle_containter').onmousemove = move;
      document.getElementById('cycle_containter').onmouseup = up;
    }
    let move = (e) => {
      document.getElementById('div1').innerHTML = '';
      var event = e || window.event;
      var x2 = event.clientX;
      var y2 = event.clientY;
      this.drawLine(x1, y1, x2, y2);//用这个方法就可以在浏览器上拖出一条直线来
      this.dragCircle(x1, y1, x2, y2);//用这个方法就可以在浏览器上拖出一个圆来
    }
    function up() {
      document.getElementById('cycle_containter').onmousemove = null;
      document.getElementById('cycle_containter').onmouseup = null;
    }
    document.getElementById('cycle_containter').onmousedown = down;
  },
  methods: {
    point(x, y) {//画点
      var oDiv = document.createElement('div');
      oDiv.style.position = 'absolute';
      oDiv.style.height = '2px';
      oDiv.style.width = '2px';
      oDiv.style.backgroundColor = 'red';
      oDiv.style.left = x + 'px';
      oDiv.style.top = y + 'px';
      //document.body.appendChild(oDiv);
      return oDiv;//注意：返回的值是一个dom节点，但并未追加到文档中
    },
    drawLine(x1, y1, x2, y2) {//画一条直线的方法
      var x = x2 - x1;//宽
      var y = y2 - y1;//高
      var frag = document.createDocumentFragment();
      // var frag = document.createElement('div');
      if (Math.abs(y) > Math.abs(x)) {//那个边更长，用那边来做画点的依据（就是下面那个循环），如果不这样，
        if (y > 0)//正着画线是这样的

          for (let i = 0; i < y; i++) {
            let width = x / y * i  //x/y是直角两个边长的比，根据这个比例，求出新坐标的位置
            {
              frag.appendChild(this.point(width + x1, i + y1));
            }
          }
        if (y < 0) {//有时候是倒着画线的
          for (let i = 0; i > y; i--) {
            let width = x / y * i
            {
              frag.appendChild(this.point(width + x1, i + y1));
            }
          }
        }
      }//end if
      else {
        if (x > 0)//正着画线是这样的
          for (let i = 0; i < x; i++) {
            let height = y / x * i
            {
              frag.appendChild(this.point(i + x1, height + y1));
            }
          }
        if (x < 0) {//有时候是倒着画线的
          for (let i = 0; i > x; i--) {
            let height = y / x * i
            {
              frag.appendChild(this.point(i + x1, height + y1));
            }
          }
        }//end if
      }
      //document.body.appendChild(frag);
      document.getElementById('div1').appendChild(frag);
      //var oDiv=document.createElement('div')
      //oDiv.appendChild(frag);
      //document.body.appendChild(oDiv);
    },
    drawCircle() {//画个圆
      var r = 200;
      var x1 = 300;
      var y1 = 300;
      var frag = document.createDocumentFragment();
      // var frag = document.getElementById('cycle_containter');
      for (var degree = 0; degree < 360; degree += 2) {
        var x2 = r * Math.sin(degree * Math.PI / 180);
        var y2 = r * Math.cos(degree * Math.PI / 180);
        frag.appendChild(this.point(x1 + x2, y1 + y2));
      }
      document.getElementById('div1').appendChild(frag);
    },
    dragCircle(x1, y1, x2, y2) {//拖出一个圆来
      var r = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));//求出半径的长 直角三角形中 斜边的平方=两个直边的平方之和
      var frag = document.createDocumentFragment();
      // var frag = document.getElementById('cycle_containter');
      for (var degree = 0; degree < 360; degree += 2) {//每隔2度画一个点
        let x2 = r * Math.sin(degree * Math.PI / 180);
        let y2 = r * Math.cos(degree * Math.PI / 180);
        frag.appendChild(this.point(x1 + x2, y1 + y2));
      }
      document.getElementById('div1').appendChild(frag);
    }
  }
}
</script>

<style lang="less" scoped>
#cycle_containter {
  height: 100%;
}
</style>