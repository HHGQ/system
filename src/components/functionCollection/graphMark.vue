<template>
  <ul class="comment">
    <li>☆</li>
    <li>☆</li>
    <li>☆</li>
    <li>☆</li>
    <li>☆</li>
  </ul>
</template>

<script>
import $ from "jquery";
export default {
  mounted() {
    //1. 给li注册鼠标经过事件，让自己和前面所有的兄弟都变成实心
    var wjx_k = "☆";
    var wjx_s = "★";
    $(".comment>li").on("mouseenter", function () {
      $(this).text(wjx_s).prevAll().text(wjx_s);
      $(this).nextAll().text(wjx_k);
    });

    //2. 给ul注册鼠标离开事件，让所有的li都变成空心
    $(".comment").on("mouseleave", function () {
      $(this).children().text(wjx_k);

      //再做一件事件，找到current，让current和current前面的变成实心就行。
      $("li.current").text(wjx_s).prevAll().text(wjx_s);
    });

    //3. 给li注册点击事件
    $(".comment>li").on("click", function () {
      $(this).addClass("current").siblings().removeClass("current");
    });
  },
};
</script>

<style lang="less" scoped>
.comment {
  font-size: 40px;
  color: #ff16cf;
}

.comment li {
  float: left;
}

ul {
  list-style: none;
}
</style>
