<template>
  <div>
    <el-select
      v-model="input"
      popper-class="popperClass"
      @focus="focus"
    ></el-select>

    <div v-show="showTree" style="position: absolute" v-clickoutside="hideTree">
      <div
        style="
          width: 218px;
          height: 200px;
          overflow: auto;
          border-radius: 5px;
          margin-top: 5px;
          background-color: white;
          box-shadow: 0px 2px 12px 0px rgb(0 0 0 / 21%);
        "
      >
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '@/common/directives/clickoutside'
export default {
  directives: { clickoutside },
  data() {
    return {
      showTree: false,
      input: "",
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    hideTree() {
      this.showTree = false;
    },
    focus() {
      this.showTree = true;
    },
    handleNodeClick(data) {
      console.log(data);
      this.input = data.label
    },
  },
};
</script>

<style lang="less">
.popperClass {
  display: none;
}
</style>