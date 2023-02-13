<template>
  <div style="background-color: rgb(84, 92, 100)">
    <el-dropdown class="internation_containter" @command="commandEvent">
      <span class="el-dropdown-link">
        {{ langDes[language] }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
        <el-dropdown-item command="zh-TW">繁体中文</el-dropdown-item>
        <el-dropdown-item command="en-US">英文</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="user_containter">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon-user"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="exit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <div v-for="item in menuItem" :key="item.id">
        <el-menu-item :index="item.url">{{item.name}}</el-menu-item>
      </div>
      <!-- <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
export default {
    data() {
      return {
        language: localStorage.getItem('language') || 'zh-CN',
        langDes: {
          'zh-CN': '简体中文',
          'zh-TW': '繁体中文',
          'en-US': 'English',
        },
        activeIndex: '',
        menuItem: [
          {id: 'home', name: 'home', url: '/home'},
        ]
      };
    },
    mounted() {
      this.requireComponent.keys().forEach(item => {
        let mapData = item.split('/')[1].split('.')[0]
        if (mapData == 'home') return
        this.menuItem.push({id: mapData, name: mapData, url: `/${mapData}`})
      })
      let lastUrlName = this.$route.fullPath.split('/')[2]
      this.activeIndex = this.menuItem.find(item => item.name == lastUrlName)?.url || '/home'
    },
    methods: {
      commandEvent(val) {
        this.$i18n.locale = val
        this.language = val
        localStorage.setItem('language', val)
      },
      handleSelect(key, keyPath) {
        if (key == this.activeIndex) return
        this.activeIndex = key
        this.$router.push(`/main${key}`)
      },
      exit() {
        this.$router.push('/login')
        // this.$router.push({name: 'login', params: { id: 3 }, query: { v: 2 }})
        // this.exit1().then(() => {

        // })
      },
      exit1() {
        this.$router.push('/login/123')
        return new Promise((resolve, reject) => {
          reject(1)
        }).then(() => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
.el-menu-demo {
  display: flex;
  background-color: rgb(84, 92, 100);
  overflow: auto;
  margin-right: 163px;
  border: none;
}
.internation_containter {
  position: absolute;
  z-index: 1;
  right: 77px;
  color: white;
  top: 19px;
  cursor: pointer;
}
.user_containter {
  font-size: 26px;
  position: absolute;
  z-index: 1;
  right: 23px;
  top: 8px;
  width: 40px;
  height: 40px;
  border: 1px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  .el-icon-user {
    padding-left: 7px;
  }
}
</style>