<template>
  <Tree :data="data" :render="renderContent" class="demo-tree-render" @on-select-change="selectChange"></Tree>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          title: "parent 1",
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%",
                },
              },
              [
                h("span", [
                  h('Icon', {
                    props: {
                      type: "ios-folder-outline",
                    },
                    style: {
                      marginRight: "8px",
                    },
                  }),
                  h("span", data.title),
                ]),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      float: "right",
                      marginRight: "32px",
                    },
                  },
                  [
                    h('Button', {
                      ...this.buttonProps,
                      props: {
                        icon: "ios-add",
                        type: "primary",
                      },
                      style: {
                        width: "64px",
                      },
                      onClick: () => {
                        this.append(data);
                      },
                    }),
                  ]
                ),
              ]
            );
          },
          children: [
            {
              title: "child 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  expand: true,
                },
                {
                  title: "leaf 1-1-2",
                  expand: true,
                },
              ],
            },
            {
              title: "child 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1",
                  expand: true,
                },
                {
                  title: "leaf 1-2-1",
                  expand: true,
                },
              ],
            },
          ],
        },
      ],
      buttonProps: {
        type: "default",
        size: "small",
      },
    };
  },
  methods: {
    selectChange(data) {
      console.log(data)
    },
    renderContent(h, { root, node, data }) {
      // 若自定义内容的点击不生效，则使用这个
      // return h('span', {
      //   class: 'ivu-tree-title',
      //   on: {
      //     click: event => {
      //       let selectDom = document.getElementsByClassName('ivu-tree-title-selected')[0]
      //       if (selectDom) selectDom.className = 'ivu-tree-title'
      //       let dom = event.target
      //       dom.className = 'ivu-tree-title ivu-tree-title-selected'
      //        this.selectChange([data])
      //     }
      //   }
      // })
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline",
              },
              style: {
                marginRight: "8px",
              },
            }),
            h("span", data.title),
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px",
              },
            },
            [
              h("Button", {
                ...this.buttonProps,
                props: {
                  icon: "ios-add",
                },
                style: {
                  marginRight: "8px",
                },
                onClick: () => {
                  this.append(data);
                },
              }),
              h("Button", {
                ...this.buttonProps,
                props: {
                  icon: "ios-remove",
                },
                onClick: () => {
                  this.remove(root, node, data);
                },
              }),
            ]
          ),
        ]
      );
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: "appended node",
        expand: true,
      });
      data.children = children;
    },
    remove(root, node, data) {
      const parentKey = root.find((el) => el === node).parent;
      const parent = root.find((el) => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
  },
};
</script>
<style>
.demo-tree-render .ivu-tree-title {
  width: 100%;
}
</style>
