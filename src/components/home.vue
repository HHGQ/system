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
        { name: 'html+css+js', url: 'https://developer.mozilla.org/zh-CN/docs/Web', logo: 'mdn' },
        { name: 'vue2', url: 'https://v2.cn.vuejs.org/', logo: 'vue' },
        { name: 'vue3', url: 'https://v3.cn.vuejs.org/', logo: 'vue' },
        { name: 'vuex', url: 'https://vuex.vuejs.org/zh/', logo: 'vue' },
        { name: 'vue-router', url: 'https://router.vuejs.org/zh/', logo: 'vue' },
        { name: 'vue-cli', url: 'https://cli.vuejs.org/zh/', logo: 'vue' },
        { name: 'less 中文网', url: 'https://less.bootcss.com/', logo: 'less' },
        { name: 'axios 中文网', url: 'http://axios-js.com/', logo: 'axios' },
        { name: 'typeScript 中文网', url: 'https://www.tslang.cn/index.html', logo: 'ts' },
        { name: 'typeScript 官网', url: 'https://www.typescriptlang.org/', logo: 'ts' },
        { name: 'webpack', url: 'https://webpack.docschina.org/', logo: 'webpack' },
        { name: 'nodejs官网', url: 'https://nodejs.org/en/', logo: 'nodejs'  },
        { name: 'nodejs 中文文档', url: 'https://www.nodeapp.cn/', logo: 'nodejs' },
        { name: 'express', url: 'https://www.expressjs.com.cn/', logo: 'nodejs' },
        { name: 'art-templage', url: 'http://aui.github.io/art-template/zh-cn/index.html', logo: 'nodejs' },
        { name: 'vscode插件下载地址', url: 'https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Relevance', logo: 'vscode' },
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
        { name: 'vite', url: 'https://cn.vitejs.dev/', logo: 'vite' },
        { name: 'w3school中文网', url: 'https://www.w3school.com.cn/', logo: 'w3c' },
        { name: 'w3schools官网', url: 'https://www.w3schools.com/', logo: 'w3cschools' },
        { name: 'jQuery官网', url: 'https://jquery.com/', logo: 'jquery' },
        { name: 'React', url: 'https://react.docschina.org/', logo: 'react' },
        { name: 'Next.js', url: 'https://www.nextjs.cn/', logo: 'nextjs' },
        { name: '微信小程序', url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', logo: 'wxxcx' },
        { name: '阿里巴巴图标库', url: 'https://www.iconfont.cn/collections/index?spm=a313x.7781069.1998910419.40', logo: 'iconfont' },
        { name: 'rollup', url: 'https://www.rollupjs.com/', logo: 'rollup' },
        { name: 'Three.js', url: 'http://www.webgl3d.cn/', logo: 'threejs' },
        { name: 'zTree', url: 'https://www.jyvtc.edu.cn/dzb/uiFramework/js/zTree-v3.2/api/API_cn.html', logo: 'zTree' },
        { name: 'markdown', url: 'http://markdown.p2hp.com/basic-syntax/', logo: 'markdown' },
        { name: '阿里云全国区域数据', url: 'http://datav.aliyun.com/portal/school/atlas/area_selector/', logo: 'datav' },
        { name: 'EPSG官网', url: 'https://epsg.io/', logo: 'epsg' },
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
  height: calc(100% - 15.5%);
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