<template>
  <div>
    <div
      v-show="showDrag"
      class="parameter"
      v-dialogdrag
    >
      <div class="title">标题
        <div class="close">
          <i class="el-icon-close" style="cursor: pointer;" @click="showDrag=false"></i>
        </div>
      </div>
      <div class="content">内容区</div>
    </div>
  </div>
</template>

<script>
import dialogdrag from '@/common/directives/divStretch'
export default {
  data() {
    return {
      showDrag: true
    }
  },
  directives: { dialogdrag },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.parameter {
  height: 569px;
  width: 960px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: calc(-960px / 2);
  margin-top: calc(-569px / 2);
  z-index: 999;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  .title {
    display: flex;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    background: #f5f5f5;
    box-sizing: border-box;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.12);
    border-radius: 2px 2px 0px 0px;
    padding: 0 20px;
    z-index: 99;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    .close {
      img {
        width: 10px;
      }
      margin-left: auto; // 右对齐
    }
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 48px);
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
  }
}
</style>