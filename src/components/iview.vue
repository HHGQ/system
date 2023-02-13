<template>
  <div class="iview_containter">
    <Row>
      <Col span="3">
        <Menu :theme="theme" :open-names="['1']" accordion :active-name="showName" @on-select="handleSelect">
          <MenuItem name="custom_select">自定义选择框</MenuItem>
          <MenuItem name="iView_form">表单</MenuItem>
          <MenuItem name="iView_tree">树</MenuItem>
          <MenuItem name="iview_table">表格</MenuItem>
          <MenuItem name="iview_upload">上传</MenuItem>
          <Submenu name="1">
            <template #title>
              <Icon type="ios-paper" />
              内容管理
            </template>
            <MenuItem name="1-1">文章管理</MenuItem>
            <MenuItem name="1-2">评论管理</MenuItem>
            <MenuItem name="1-3">举报管理</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template #title>
              <Icon type="ios-people" />
              用户管理
            </template>
            <MenuItem name="2-1">新增用户</MenuItem>
            <MenuItem name="2-2">活跃用户</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template #title>
              <Icon type="ios-stats" />
              统计分析
            </template>
            <MenuGroup title="使用">
              <MenuItem name="3-1">新增和启动</MenuItem>
              <MenuItem name="3-2">活跃分析</MenuItem>
              <MenuItem name="3-3">时段分析</MenuItem>
            </MenuGroup>
            <MenuGroup title="留存">
              <MenuItem name="3-4">用户留存</MenuItem>
              <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
          </Submenu>
        </Menu>
        <span>导航栏主题：</span>
        <RadioGroup v-model="theme">
            <Radio label="light"></Radio>
            <Radio label="dark"></Radio>
        </RadioGroup>
      </Col>
      <Col :span="21">
        <keep-alive>
          <customSelect v-if="showName=='custom_select'"/>
          <iViewForm v-else-if="showName=='iView_form'"/>
          <iViewTree v-else-if="showName=='iView_tree'"/>
          <iviewTable v-else-if="showName=='iview_table'"/>
          <iviewUpload v-else-if="showName=='iview_upload'"/>
        </keep-alive>
      </Col>
    </Row>
  </div>
</template>
<script>
import customSelect from './iView/customSelect.vue'
import iViewForm from './iView/form.vue'
import iViewTree from './iView/iViewTree.vue'
import iviewTable from './iView/iviewTable.vue'
import iviewUpload from './iView/iviewUpload.vue'
export default {
  components: {
    customSelect,
    iViewForm,
    iViewTree,
    iviewTable,
    iviewUpload
  },
  data() {
    return {
      theme: "light",
      showName: 'custom_select',
    };
  },
  methods: {
    handleSelect(name) {
      this.showName = name
    }
  }
};
</script>

<style lang="less" scoped>
.iview_containter {
  height: calc(100% - 57px);
  .ivu-row {
    height: 100%;
    .ivu-menu {
      height: calc(100% - 24px);
    }
  }
}
</style>