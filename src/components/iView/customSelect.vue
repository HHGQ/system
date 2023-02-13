<template>
  <div v-clickoutside="blurSelect" class="box_containter">
    <div class="ivu-select" @click="focusSelect">
      <div class="ivu-select-selection">
        <div v-if="selectArr.length">
          <div v-for="item in selectArr" :key="item.id" class="ivu-tag">
            <div class="ivu-tag-text">{{item.name}}</div>
            <Icon type="ios-close" @click.stop="cancelSelect(item.id)"></Icon>
          </div>
        </div>
        <div v-else class="ivu-select-placeholder">请选择</div>
      </div>
    </div>
    <Icon :type="showVisible?'ios-arrow-up':'ios-arrow-down'"></Icon>
    <div v-show="showVisible" class="select_modal">
      <div>这里随便定义模板。树结构、表格等等都行</div>
      <div v-for="item in selectData" :key="`data_${item.id}`" @click="confirmSelect(item)" style="cursor: pointer;">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import clickoutside from '@/common/directives/clickoutside'
export default {
  directives: { clickoutside },
  data() {
    return {
      selectArr: [],
      selectData: [
        {
          id: 0,
          name: '什么'
        },
        {
          id: 1,
          name: '这是什么'
        },
        {
          id: 2,
          name: '这又是什么'
        }
      ],
      showVisible: false
    }
  },
  methods: {
    focusSelect() {
      this.showVisible = true
    },
    blurSelect() {
      this.showVisible = false
    },
    confirmSelect(data) {
      if (this.selectArr.map(item => item.id).includes(data.id)) return
      this.selectArr.push(data)
    },
    cancelSelect(id) {
      this.selectArr.some((item, index) => {
        if (item.id == id) {
          this.selectArr.splice(index, 1)
          return true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box_containter {
  position: relative;
  .ivu-icon-ios-arrow-down,
  .ivu-icon-ios-arrow-up {
    color: #9ea7b4;
    position: absolute;
    top: 11px;
    right: 8px;
  }
  .ivu-select {
    .ivu-select-placeholder {
      display: block;
      height: 30px;
      line-height: 30px;
      color: #c5c8ce;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 16px;
      padding-right: 22px;
      position: absolute;
      z-index: 1;
    }
    .ivu-select-selection {
      min-height: 32px;
    }
    .ivu-tag {
      position: relative;
      height: 24px !important;
      line-height: 24px !important;
      margin: 3px 4px 3px 0 !important;
      max-width: 99%;
      min-width: initial !important;
      padding: 0 8px;
      border: 1px solid #e8eaec;
      background: #f7f7f7;
      font-size: 12px !important;
      vertical-align: middle;
      opacity: 1;
      overflow: hidden;
    }
    .ivu-tag-text {
      display: block;
      margin-right: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ivu-icon-ios-close {
      position: absolute;
      right: 4px !important;
      top: 4px !important;
    }
  }
  .select_modal {
    position: absolute;
    width: 300px;
    height: 300px;
    z-index: 1;
    background: white;
    border: 1px solid #aebad2;
    border-radius: 5px;
  }
}
</style>