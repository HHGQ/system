<template>
  <div class="learn_containter">
    <el-card class="box-card" v-for="item in learnList" :key="item.name" @click.native="jumpToUrl(item.url)">
      <img v-if="item.logo" :src="require(`@/assets/${item.logo}.png`)" alt="" width="70px" height="70px">
      <div>{{item.name}}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      learnList: [
        { name: 'vue2', url: 'https://v2.cn.vuejs.org/', logo: 'vue' },
        { name: 'vue3', url: 'https://v3.cn.vuejs.org/', logo: 'vue' },
        { name: 'vuex', url: 'https://vuex.vuejs.org/zh/', logo: 'vue' },
        { name: 'vue-router', url: 'https://router.vuejs.org/zh/', logo: 'vue' },
        { name: 'vue-cli', url: 'https://cli.vuejs.org/zh/', logo: 'vue' },
        { name: 'less 中文网', url: 'https://less.bootcss.com/', logo: 'less' },
        { name: 'axios 中文网', url: 'http://axios-js.com/', logo: 'axios' },
        { name: 'typeScript 中文网', url: 'https://www.tslang.cn/index.html', logo: 'ts' },
        { name: 'webpack', url: 'https://webpack.docschina.org/', logo: 'webpack' },
        // { name: 'nodejs', url: 'https://nodejs.org/en/' },
        { name: 'nodejs 中文文档', url: 'https://www.nodeapp.cn/', logo: 'nodejs' },
        // { name: 'Kubernetes', url: 'https://kubernetes.io/' },
        { name: 'Kubernetes 中文文档', url: 'http://docs.kubernetes.org.cn/', logo: 'Kubernetes' },
        { name: 'Element UI', url: 'https://element.eleme.cn/#/zh-CN', logo: 'element_ui' },
        { name: 'iView', url: 'https://iview.github.io/', logo: 'iView' },
        { name: 'View Design', url: 'https://www.iviewui.com/', logo: 'view_design' },
        { name: 'gitee', url: 'https://gitee.com/', logo: 'gitee' },
        { name: 'openlayers', url: 'https://openlayers.org/', logo: 'openlayers' },
        { name: 'nginx', url: 'https://blog.redis.com.cn/nginx-how-to', logo: 'nginx' },
        { name: 'electronjs', url: 'https://www.electronjs.org/zh/', logo: 'electronjs' },
        { name: '菜鸟教程', url: 'https://www.runoob.com/', logo: 'cainiao' },
        { name: 'echarts', url: 'https://echarts.apache.org/zh/index.html', logo: 'echarts' },
        { name: 'vite', url: 'https://echarts.apache.org/zh/index.html', logo: 'vite' },
        { name: 'Web开发技术', url: 'https://developer.mozilla.org/zh-CN/docs/Web', logo: 'mdn' },
        { name: 'w3school', url: 'https://www.w3school.com.cn/', logo: 'w3c' },
        { name: 'html5', url: 'https://www.w3school.com.cn/html/html5_intro.asp', logo: 'w3c' },
        { name: 'css3', url: 'https://www.w3school.com.cn/css/index.asp', logo: 'w3c' },
        { name: 'JavaScript', url: 'https://www.w3school.com.cn/js/index.asp', logo: 'w3c' },
        { name: 'jQuery', url: 'https://www.w3school.com.cn/jquery/index.asp', logo: 'w3c' },
        { name: 'React', url: 'https://react.docschina.org/', logo: 'react' },
        { name: 'Next.js', url: 'https://www.nextjs.cn/', logo: 'nextjs' },
        { name: '微信小程序', url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', logo: 'wxxcx' },
        { name: '阿里巴巴图标库', url: 'https://www.iconfont.cn/collections/index?spm=a313x.7781069.1998910419.40', logo: 'iconfont' },
        { name: 'rollup', url: 'https://www.rollupjs.com/', logo: 'rollup' },
        { name: 'Three.js', url: 'http://www.webgl3d.cn/', logo: 'threejs' },
        { name: 'zTree', url: 'https://www.jyvtc.edu.cn/dzb/uiFramework/js/zTree-v3.2/api/API_cn.html', logo: 'zTree' },
        { name: 'markdown', url: 'http://markdown.p2hp.com/basic-syntax/', logo: 'markdown' },
      ]
    }
  },
  methods: {
    jumpToUrl(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="less" scoped>
.learn_containter {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 92.5%;
  /deep/ .el-card {
    height: 201px;
    width: 200px;
    margin: 18px;
    cursor: pointer;
    text-align: center;
    &:hover {
      color: white;
      background-color: #80c4f5;
    }
    cursor: pointer;
    .el-card__body {
      padding: 51px  0;
    }
  }
}
</style>