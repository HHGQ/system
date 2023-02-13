<template>
  <div>
    <ul id="treeDemo" class="ztree"></ul>
    <div id="divDom" @click="clickEvent">1111</div>
  </div>
</template>

<script>
// import $ from 'jquery'
// import '@ztree/ztree_v3/js/jquery.ztree.core.min.js'
// import '@ztree/ztree_v3/js/jquery.ztree.excheck.min.js'
// import '@ztree/ztree_v3/css/metroStyle/metroStyle.css'
export default {
  data() {
    return {

    }
  },
  methods: {
    clickEvent() {
      console.log(1111)
      console.log(document.getElementById('divDom').onclick)
      document.getElementById('divDom').onclick = this.clickEvent
      console.log(document.getElementById('divDom').onclick)
    }
  }
}
</script>