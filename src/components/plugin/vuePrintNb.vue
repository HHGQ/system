<template>
  <div>
    <div id="printMe">
      <p>葫芦娃，葫芦娃</p>
      <p>一根藤上七朵花 </p>
      <p>小小树藤是我家 啦啦啦啦 </p>
      <p>叮当当咚咚当当　浇不大</p>
      <p> 叮当当咚咚当当 是我家</p>
      <p> 啦啦啦啦</p>
      <p>...</p>
    </div>
    <button v-print="'#printMe'">打印</button>
  </div>
</template>

<script>
// 插件官网 https://www.npmjs.com/package/vue-print-nb
import print from 'vue-print-nb'

export default {
  directives: {
    print   
  }
}
</script>