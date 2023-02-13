<template>
  <div>
    <button @click="print">带引</button>
    <canvas id="canvas"></canvas>
    <!-- <img
      src="http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x=6666&y=3544&l=13"
      alt=""
      srcset=""
      crossorigin="anonymous"
    /> -->
  </div>
</template>

<script>
export default {
  methods: {
    print() {
      var canvas = document.getElementById("canvas"), //获取canvas
        ctx = canvas.getContext("2d"), //对应的CanvasRenderingContext2D对象(画笔)
        img = new Image(), //创建新的图片对象
        base64 = ""; //base64
      img.setAttribute("crossOrigin", "anonymous");
      img.src = "http://t4.tianditu.com/DataServer?T=vec_w&tk=5b1c7a4af317c1efaa03265e11a6204e&x=6666&y=3544&l=13";
      img.onload = function () {
        //图片加载完，再draw 和 toDataURL
        console.log(img);
        ctx.drawImage(img, 0, 0);
        base64 = canvas.toDataURL("image/png");
        console.log(base64);
      };
    },
  },
};
</script>