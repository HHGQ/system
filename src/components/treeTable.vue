<template>
  <div>
    <div @click="expandTest">展开001001</div>
    <div @click="expandTest2">展开0010011</div>
    <u-table
      ref="plTreeTable"
      fixed-columns-roll
      beautify-table
      header-drag-style
      :height="height"
      :treeConfig="{
        children: 'children',
        expandAll: false,
        lazy: true,
        load: load,
        iconLoaded: 'el-icon-folder-add',
        iconClose: 'el-icon-folder-add',
        iconOpen: 'el-icon-folder-remove',
        hasChildren: 'hasChildren',
        expandRowKeys: ['001']
      }"
      :render-content="renderContent"
      use-virtual
      big-data-checkbox
      row-id="id"
      row-key="id"
      border
      @cell-click="rowClick"
      @select="selectEvent"
      @toggle-tree-expand="toggleTreeExpand"
      @select-all="selectAllEvent"
    >
      <u-table-column type="selection" width="55"/>
      <!-- <u-table-column type="selection" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </u-table-column> -->
      <!--u-table大数据表格 你需要在列上指定某个列显示展开收起 treeNode属性-->
      <u-table-column
        :tree-node="true"
        prop="address"
        label="我是树节点"
        :width="200"
      >
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span style="margin-left: 10px" :title="scope.row.address" :id="scope.row.id" @click="test(scope)">{{ scope.row.address }}</span>
          <span style="display:none">{{ scope.row.id }}</span>
          <i class="el-icon-edit"></i>
        </template>
      </u-table-column>
      <u-table-column
        v-for="item in columns"
        :id="item.id"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      />
    </u-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectionIdObj: {}, // 存储已勾选和半勾选的节点。key为id，value为选中节点数
      selectionArr: [],
      selectionNameObj: {}, // 存储已勾选的节点。key为id，value为选中的节点id_节点name
      halfSelectionIdObj: {}, // 存储半勾选的节点
      halfSelectionIdArr: [], // 存储半勾选的节点
      hasOneHalfObj: {}, // 存储只有一个半选子节点时，该节点也为半选
      selectAll: false,
      height: 700,
      columns: Array.from({ length: 10 }, (_, idx) => ({
        prop: "address",
        id: idx,
        label: "地址" + idx,
        width: 200
      })),
      rootRow: {}
    };
  },
  mounted() {
    // const data2 = Array.from({ length: 30000 }, (_, idx) => ({
    //   id: idx + "_" + 1,
    //   date: "2016-05-03",
    //   name: 1,
    //   ab: "欢迎使用u-table",
    //   address: idx,
    // }));
    const data = [
      {
        id: '001',
        date: "2016-05-02",
        name: "王小虎",
        address: '001',
        hasChildren: false,
        children: [],
        selectNum: 0,
        pid: 0
      },
      // {
      //   id: '002',
      //   date: "2016-05-04",
      //   name: "王小虎",
      //   address: '002',
      // },
    ];
    this.rootRow = data[0]
    for(let i = 1; i <100; i++) {
      data[0].children.push({
        id: data[0].id+String(i).padStart(3, 0),
        date: "2016-05-01",
        name: data[0].id+String(i).padStart(3, 0),
        age: 18,
        address: data[0].id+String(i).padStart(3, 0),
        hasChildren: true,
        pidArr: [data[0].id],
        selectNum: 0,
        children: [],
        pid: data[0].id
      })
    }
    for(let i = 0; i <10000; i++) {
      data[0].children.push({
        id: data[0].id+String(i).padStart(5, 0),
        date: "2016-05-01",
        name: data[0].id+String(i).padStart(3, 0),
        age: 18,
        address: data[0].id+String(i).padStart(3, 0),
        pid: data[0].id,
      })
    }
    // 设置表格数据
    // this.$refs.plTreeTable.reloadData([...data, ...data2]);
    this.$refs.plTreeTable.reloadData([...data]);
    this.rootNodes = data[0].children
    // this.$refs.plTreeTable.setTreeExpansion(data[0], true)
    document.getElementsByClassName('el-table__body-wrapper')[0].addEventListener('scroll', () => {
      this.batchChangeSelectState()
    })
  },
  methods: {
    expandTest() {
      let data = this.$refs.plTreeTable.getUTreeData()
      let row, height
      data.some((item, index) => {
        if (item.id == '001094') {
          if (!item.hasChildren) return true
          height = (index - 4) * 60
          item.address = '改变了'
          item.children = [
            {
              id: '0010011',
              date: "2016-05-01",
              name: "王小虎",
              address: '0010011',
              pid: '001001',
              hasChildren: true,
              pl_table_level: item.pl_table_level + 1
            },
            {
              id: '0010012',
              date: "2016-05-01",
              name: "王小虎",
              address: '0010012',
              pid: '001001',
              pl_table_level: item.pl_table_level + 1
            },
          ]
          row = item
          return true
        }
      })
      if (!row || !row.hasChildren) return
      // console.log(data)
      // this.$refs.plTreeTable.reloadData([...data]);
      this.$refs.plTreeTable.setTreeExpansion(row, true)
      row.hasChildren = false
      this.expandTest2()
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = height
    },
    expandTest2() {
      let data = this.$refs.plTreeTable.getUTreeData()
      let row
      data.some(item => {
        if (item.id == '0010011') {
          if (!item.hasChildren) return true
          item.children = [
            {
              id: '0010011001',
              date: "2016-05-01",
              name: "王小虎",
              address: '0010011001',
              pid: '0010011001',
              pl_table_level: item.pl_table_level + 1
            },
          ]
          row = item
          return true
        }
      })
      if (!row || !row.hasChildren) return
      console.log(data)
      // this.$refs.plTreeTable.reloadData([...data]);
      this.$refs.plTreeTable.setTreeExpansion(row, true)
      row.hasChildren = false
    },
    test(a) {
      console.log(this.$refs.plTreeTable.getCheckboxRecords())
    },
    selectEvent(selection, row) {
      // 若只有一个根节点
      if (row.id == '001' && selection.includes(row)) {
        return this.$refs.plTreeTable.toggleAllSelection()
      } else if (row.id == '001') {
        this.selectAll = false
        this.$refs.plTreeTable.clearSelection()
        this.selectionNameObj = {}
        return this.selectionIdObj = {}
      }
      this.selectAll = false
      // let hasSelect = this.selectionIdObj[row.pid] // 用来判断所选节点的父节点之前是否已选中/半选，这样祖父节点的selectNum就不需要+1
      this.saveSelection(row, selection.includes(row)) // 在这开始存已选数据，不能放到unselectArea、selectArea、batchChangeSelectState后面
      !selection.includes(row) ? this.unselectArea(row) : this.selectArea(row)
      this.batchChangeSelectState()
    },
    // 向下找节点
    // 把勾选的区域下的子孙节点存入this.selectionIdObj
    // recursion 是否递归调用。因为第一次调用时，就已经存入this.selectionIdObj，不需要再次存入
    saveSelection(row, select, recursion) {
      // if(!recursion) select ? this.selectionIdObj[row.id] = select : delete this.selectionIdObj[row.id]
      if(!recursion && select) {
        this.selectionIdObj[row.id] = !this.selectionIdObj[row.id] ? 1 : ++this.selectionIdObj[row.id]
        this.selectionNameObj[row.id] = `${row.pid}_${row.name}`
      } else if (!recursion) {
        delete this.selectionNameObj[row.id]
        delete this.selectionIdObj[row.id]
      }
      // 判断是否有children，若有，则存入this.selectionIdObj
      if (row.children && row.children.length) {
        let expandArr = this.$refs.plTreeTable.getTreeExpandRecords() // 获取已展开的节点数组
        if (select) this.selectionIdObj[row.id] = row.children.length // 选中节点存储和子节点数量相同的数
        // let expandIdArr = expandArr.map(item => item.id) // 已展开节点的id
        row.children.forEach(item => {
          select ? this.selectionIdObj[item.id] = select : delete this.selectionIdObj[item.id]
          select ? this.selectionNameObj[item.id] = `${item.pid}_${item.name}` : delete this.selectionNameObj[item.id]
          // 判断item是否展开，若展开则递归调用this.saveSelection
          // 需要使用expandArr,不能直接使用row，因为可能不含有children
          expandArr.some(child => {
            if (child.id == item.id) {
              this.saveSelection(child, select, true)
            }
            return true
          })
          // if (expandIdArr.includes(item.id)) {
          //   this.saveSelection(item, select, true)
          // }
        })
      }
    },
    // 根据this.selectionIdObj批量懒勾选/取消勾选
    batchChangeSelectState() {
      // console.log(this.selectionNameObj)
      // console.log(this.selectionIdObj)
      // if (!Object.keys(this.selectionIdObj).length) {
      //   for (let key of Object.keys(this.halfSelectionIdObj)) {
      //     if (!this.selectionIdObj[key]) {
      //       this.halfSelectionIdObj[key].className = this.halfSelectionIdObj[key].className.replace(/ is-indeterminate/g, '')
      //       delete this.halfSelectionIdObj[key]
      //     }
      //   }
      //   return this.$refs.plTreeTable.clearSelection()
      // }
      let data = this.$refs.plTreeTable.getUTreeData()
      let startNum = parseInt(document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop / 60)
      let visibleNum = parseInt(document.getElementsByClassName('el-table__body-wrapper')[0].clientHeight / 60) + 50
      let visibleData = data.slice(startNum, startNum + visibleNum) // 可视区域范围内的数据
      let selectData = [], unselectData = []
      visibleData.forEach(item => {
        // 不存在于this.selectionIdObj，而且第一个子节点也不存在于this.selectionIdObj
        if (!this.selectionIdObj[item.id] && (!item.children || !item.children.length == 1 || !this.selectionIdObj[item.children[0].id])) {
          if (this.hasOneHalfObj[item.id]) delete this.hasOneHalfObj[item.id]
          unselectData.push(item)
        } else if (item.children && this.selectionIdObj[item.id] != item.children.length && item.children.length) {
          unselectData.push(item)
          this.$nextTick(() => {
            if (document.getElementById(item.id)) {
              let parentCheckDom = document.getElementById(item.id).parentNode.parentNode.parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0]
              if (!parentCheckDom.className.includes('is-indeterminate')) {
                this.$nextTick(() => {
                  parentCheckDom.className += ' is-indeterminate'
                })
                this.halfSelectionIdObj[item.id] = parentCheckDom
                console.log(parentCheckDom, 'half')
                // 防止只有一个子节点，但子节点为半选
                if (item.children && item.children.length == 1 && this.selectionIdObj[item.children[0].id]) {
                  this.hasOneHalfObj[item.id] = true
                }
              } else if (this.hasOneHalfObj[item.id] && (this.selectionIdObj[item.id] || !this.selectionIdObj[item.children[0].id])) {
                delete this.hasOneHalfObj[item.id]
              }
            }
          })
        } else if (this.halfSelectionIdObj[item.id] && item.children && this.selectionIdObj[item.id] == item.children.length && item.children.length) {
          delete this.halfSelectionIdObj[item.id]
          selectData.push(item)
        } else {
          selectData.push(item)
        }
      })
      this.$refs.plTreeTable.partRowSelections(selectData, true)
      this.$refs.plTreeTable.partRowSelections(unselectData, false)
      
      // 没有partRowSelections进行选中或取消选中，直接手动点取消选中，不能改变半选状态
      this.$nextTick(() => {
        for (let key of Object.keys(this.halfSelectionIdObj)) {
          if (!this.selectionIdObj[key] && !this.hasOneHalfObj[key]) {
                console.log(this.selectionIdObj[key], 'halfs')
            this.halfSelectionIdObj[key].className = this.halfSelectionIdObj[key].className.replace(/ is-indeterminate/g, '')
            delete this.halfSelectionIdObj[key]
          }
        }
      })
    },
    // 向上找节点
    // 若节点取消勾选，则把所属区域的勾选状态取消
    unselectArea(row) {
      // let selection = this.$refs.plTreeTable.getCheckboxRecords()
      let expandArr = this.$refs.plTreeTable.getTreeExpandRecords()
      if (!row.children) {
        // 若没有子节点，则根据父节点id取消勾选状态
        expandArr.some(item => {
          if (item.id == row.pid) {
            delete this.selectionNameObj[item.id]
            this.selectionIdObj[item.id] == 1 ? delete this.selectionIdObj[item.id] : this.selectionIdObj[item.id]--
            return this.unselectArea(item)
          }
        })
      } else {
        // 若有子节点，则根据节点id取消勾选状态
        // let areaLength = row.id.length / 3
        // let areaArr = []
        // for(let i = 0; i< areaLength; i++) {
        //   areaArr.push(row.id.slice(0, 3 + i * 3))
        // }
        // let length = areaArr.length
        // if (length > 1) {
          expandArr.some(item => {
            if (item.id == row.pid) {
              // delete this.selectionIdObj[item.id]
              delete this.selectionNameObj[item.id]
              // this.selectionIdObj[item.id] == 1 ? delete this.selectionIdObj[item.id] : this.selectionIdObj[item.id]--
              if (this.selectionIdObj[item.id] == 1 && (!item.children.length || (item.children.length == 1 && (!this.selectionIdObj[item.children[0].id] || !this.halfSelectionIdObj[item.children[0].id])))) {
                delete this.selectionIdObj[item.id]
              } else if (this.selectionIdObj[item.id] > 1) {
                this.selectionIdObj[item.id]--
              }
              return this.unselectArea(item)
            }
          })
        // }
      }
    },
    // 向上找节点
    // 若节点所属区域的子节点全勾选，则勾选所属区域
    selectArea(row, hasSelect) {
      let expandArr = this.$refs.plTreeTable.getTreeExpandRecords()
      if (!row.children) {
        // 若没有子节点，则根据父节点id进行勾选
        expandArr.some(item => {
          if (item.id == row.pid) {
            this.selectionIdObj[item.id] = this.selectionIdObj[item.id] ? ++this.selectionIdObj[item.id] : 1
            if(this.selectionIdObj[item.id] == item.children.length) {
              this.selectionNameObj[item.id] = `${item.pid}_${row.name}`
            }
            this.selectArea(item, hasSelect)
            // if(!hasSelect) this.selectArea(item, hasSelect) // 查看父节点的父节点是否需要勾选
            return true
          }
        })
      } else {
        // 若有子节点，则根据节点id进行勾选
        expandArr.some(item => {
          if (item.id == row.pid) {
            // let hasSelect = this.selectionIdObj[item.id]
            this.selectionIdObj[item.id] = this.selectionIdObj[item.id] ? ++this.selectionIdObj[item.id] : 1
            // 若只有一个子节点，且子节点的选中数不等于总数，则是半选
            if (item.children.length == 1 && item.children[0].children && item.children[0].children.length && this.selectionIdObj[item.children[0].id] != item.children[0].children.length) {
              delete this.selectionIdObj[item.id]
            }
            if(this.selectionIdObj[item.id] == item.children.length) {
              this.selectionNameObj[item.id] = `${item.pid}_${item.name}`
            }
            this.selectArea(item, hasSelect)
            // if(!hasSelect) this.selectArea(item, hasSelect)
            return true
          }
        })
      }
    },
    selectAllEvent(selection) {
      this.selectAll = !this.selectAll
      // 动态勾选，防止先勾选一部分节点，再全选->取消全选后，滚动会勾选上之前勾选的节点
      if (!this.selectAll) {
        this.selectionNameObj = {}
        this.selectionIdObj = {}
      } else {
        this.selectionNameObj = {
          [this.rootRow.id]: this.rootRow.pid + '_' + this.rootRow.name
        }
        this.saveSelection(this.rootRow, true, true)
      }
    },
    renderContent() {
      // console.log(111)
    },
    rowClick(row, column, event) {
      
    },
    // 收起展开时触发
    toggleTreeExpand(row, treeExpanded, event) {
      console.log('expand')
      let selection = this.$refs.plTreeTable.getCheckboxRecords()
      if (selection.includes(row)) this.saveSelection(row, true)
      this.batchChangeSelectState()
      
      // 修复根节点下全是半选时，根节点不是半选问题
      let dom = document.getElementsByClassName('pltableDragIcon')[0].nextSibling.childNodes[0].childNodes[0]
      if(JSON.stringify(this.selectionIdObj)!="{}" && !dom.className.includes('is-checked')) {
        this.$nextTick(() => {
          dom.className += ' is-indeterminate'
        })
      }
    },
    load(row,resolve) {
      let dom
      // row 你可以根据里面的id，去拿后端数据啦
      if (row.id == '001') return resolve(this.rootNodes) // 解决默认展开根节点时，收起根节点会再次加载问题
      // 在此修复节点初次展开时，全部未初次展开的节点图标都显示加载中的问题
      this.$nextTick(() => {
        for(let i = 0; i < 20; i++) {
          dom = document.getElementsByClassName('pltree-loading')[i]
          if (dom.nextSibling.childNodes[1].innerText == row.id) {
            dom.childNodes[0].className = 'el-icon-loading'
            break
          }
        }
      })
      setTimeout(() => {
        if (row.id === '001001') {
          resolve([
            {
              id: '0010011',
              date: "2016-05-01",
              name: "王小虎",
              address: '0010011',
              pid: '001001',
            },
            {
              id: '0010012',
              date: "2016-05-01",
              name: "王小虎",
              address: '0010012',
              pid: '001001',
            },
          ]);
        } else if (row.id === '001002' || row.id == '001003001') {
          let data = []
          for(let i = 1; i < 10; i++) {
            data.push({
              id: row.id + i,
              date: "2016-05-01",
              name: "王小虎",
              address: row.id + i,
              pid: '001002',
            })
          } 
          resolve(data)
        } else {
          resolve([
            {
              id: row.id + '001',
              date: "2016-05-01",
              name: "王小虎",
              address: row.id + '001',
              hasChildren: true,
              children: [],
              pid: row.id
            },
            {
              id: row.id + '002',
              date: "2016-05-01",
              name: "王小虎",
              address: row.id + '002',
              hasChildren: true,
              children: [],
              pid: row.id
            }
          ])
        }
      }, 500);
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .pltree-loading {
  top: 2px;
  .el-icon-folder-add {
    font-size: 16px;
    &:before {

    }
  }
}
</style>