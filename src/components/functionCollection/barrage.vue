<template>
  <div class="boxDom" id="boxDom">
    <div class="idDom" id="idDom">
      <div class="content">
        <p class="title">吐槽:</p>
        <input type="text" class="text" id="text" />
        <button type="button" class="btn" id="btn">发射</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  mounted() {
    var colors = [
      "red",
      "green",
      "hotpink",
      "pink",
      "cyan",
      "yellowgreen",
      "purple",
      "deepskyblue",
    ];
    $("#btn").click(function () {
      var randomColor = parseInt(Math.random() * colors.length);
      var randomY = parseInt(Math.random() * 400);

      $("<span></span>") //创建span
        .text($("#text").val()) //设置内容
        .css("color", colors[randomColor]) //设置字体颜色
        .css("left", "1400px") //设置left值
        .css("top", randomY) //设置top值
        .animate({ left: -500 }, 10000, "linear", function () {
          //到了终点，需要删除
          $(this).remove();
        }) //添加动画
        .appendTo("#boxDom");

      $("#text").val("");
    });

    $("#text").keyup(function (e) {
      if (e.keyCode == 13) {
        $("#btn").click();
      }
    });
  },
};
</script>

<style lang="less" scoped>
.boxDom {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.idDom {
  width: 100%;
  height: 100px;
  background: #666;
  position: fixed;
  bottom: 0px;
}

.content {
  display: flex;
  align-items: center;
  width: 430px;
  height: 40px;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: auto;
}

.title {
  display: inline;
  font-size: 2em;
  vertical-align: bottom;
  color: #fff;
}

.text {
  border: none;
  width: 300px;
  height: 30px;
  border-radius: 5px;
  font-size: 1.5em;
}

.btn {
  width: 60px;
  height: 30px;
  background: #f90000;
  border: none;
  color: #fff;
  font-size: 1.5em;
  border-radius: 5px;
  margin-left: 5px;
}

/deep/ span {
  width: 300px;
  height: 40px;
  position: absolute;
  overflow: hidden;
  color: #000;
  font-size: 2em;
  line-height: 1.5em;
  cursor: pointer;
  white-space: nowrap;
  z-index: 100;
}
</style>
