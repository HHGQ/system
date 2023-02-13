<template>
  <div>
    <el-form ref="screenform" :inline="true" :model="screenform">
      <el-form-item>
        <label class="require">名称</label>
        <el-input
          size="small"
          v-model="screenform.Name"
          style="width: 80px"
        ></el-input>
      </el-form-item>
      <el-form-item label="行">
        <el-input-number
          v-model="screenform.Row"
          controls-position="right"
          style="width: 80px"
          :min="1"
          :max="9"
          size="small"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="列">
        <el-input-number
          v-model="screenform.Col"
          controls-position="right"
          style="width: 80px"
          :min="1"
          :max="9"
          size="small"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" @click="cancelMerge" style="margin-bottom: 10px">取消合并</el-button>
    <table
      border="1"
      cellspacing="0"
      ref="table1"
      style="width: 400px;height: 400px"
      :key="tableKey"
    >
      <tr v-for="(item1, index1) in screenform.Row" :key="index1">
        <td
          v-for="(item2, index2) in screenform.Col"
          :key="index2"
          align="center"
          style="color: #fff;"
          @dblclick="dblclickEvent"
        ><span style="position:relative;z-index:-1">{{`${item1}${item2}${item1}${item2}`}}</span></td>
      </tr>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      screenform: {
        Row: 3,
        Col: 3,
      },
      MMRC: {
        startRowIndex: -1, // 所有选中单元格的左上角row
        endRowIndex: -1, // 所有选中单元格的右下角row
        startColIndex: -1, // 所有选中单元格的左上角col
        endColIndex: -1, // 所有选中单元格的右下角col
      },
      tableKey: 1, // 表格的key
      startOnMouse: false, // 是否在合并(感觉无用)
      merged: false, // 是否在合并
      startTD: null, // 第一个鼠标移动选中的单元格
      endTD: null, // 最后一个鼠标移动选中的单元格
      selectTdDom: null, // 双击选中的单元格
    };
  },
  watch: {
    screenform: {
      // 数据变化时执行的逻辑代码
      handler(newObj, oldObj) {
        this.$nextTick(() => {
          this.startTD = null;
          this.endTD = null;
          this.MMRC = {
            startRowIndex: -1,
            endRowIndex: -1,
            startColIndex: -1,
            endColIndex: -1,
          };
          $(this.$refs.table1).find("td").removeClass("selected");
          this.resetTable()
        }, 20);
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    }, 20);
  },
  beforeDestroy() {
    this.$refs.table1.removeEventListener("mousedown", (e) => {
      this.onMousedown(e);
    });
    this.$refs.table1.removeEventListener("mouseup", (e) => {
      // this.startOnMouse = false;
    });
  },
  methods: {
    cancelMerge() {
      let selectDomRc = $(this.selectTdDom).data('rc')
      let colspan = Number($(this.selectTdDom).attr('colspan')) || 1
      let rowspan = Number($(this.selectTdDom).attr('rowspan')) || 1
      let htmlStr = ''
      if (!this.selectTdDom || colspan < 2 || rowspan < 2) this.$message('请双击选中已合并的单元格')
      // 若是全部单元格合并成一个大单元格，则直接重置
      if (colspan * rowspan == this.screenform.Col * this.screenform.Row) return this.resetTable()
      // 1.若是一行，则直接替换选中的单元格
      // 2.若是跨行 1) 占据一整行 2) 前面有td 3) 后面有td
      if (rowspan == 1) {
        for (let j = 1; j <= colspan; j++) {
          htmlStr += `<td align="center" style="color: #fff;"><span style="position:relative;z-index:-1">${selectDomRc.r + 1}${selectDomRc.c + j}${selectDomRc.r + 1}${selectDomRc.c + j}</span></td>`
        }
        let html = $(htmlStr)
        html.each((idx, dom) => {
          let domRc = dom.innerText
          $(dom).data('rc', {
            r: domRc[0] - 1,
            c: domRc[1] - 1,
            maxr: domRc[2] - 1,
            maxc: domRc[3] - 1,
          })
          dom.addEventListener('dblclick', this.dblclickEvent)
        })
        html.replaceAll(this.selectTdDom);
      } else {
        let trDoms = $(this.$refs.table1).find("tr")
        for(let i = 1; i <= rowspan; i++) {
          htmlStr = ''
          for (let j = 1; j <= colspan; j++) {
            htmlStr += `<td align="center" style="color: #fff;"><span style="position:relative;z-index:-1">${selectDomRc.r + i}${selectDomRc.c + j}${selectDomRc.r + i}${selectDomRc.c + j}</span></td>`
          }
          let html = $(htmlStr)
          html.each((idx, dom) => {
            let domRc = dom.innerText
            $(dom).data('rc', {
              r: domRc[0] - 1,
              c: domRc[1] - 1,
              maxr: domRc[2] - 1,
              maxc: domRc[3] - 1,
            })
            dom.addEventListener('dblclick', this.dblclickEvent)
          })
          let preTdDom = null, nextTdDom = null
          $(trDoms[selectDomRc.r + i - 1]).find("td").each((idx, dom) => {
            let rc = $(dom).data('rc')
            if (rc.c < selectDomRc.c) {
              preTdDom = dom
            } else if (rc.c > selectDomRc.c) {
              nextTdDom = dom
            }
          })
          if (colspan == this.screenform.Col) {
            trDoms.eq(selectDomRc.r + i - 1).append(html)
          } else if (preTdDom) {
            // 存在当前选中单元格所在行的上一个td
            $(preTdDom)
            .after(html)
          } else {
            if (nextTdDom) {
              $(nextTdDom)
              .before(html)
            } else {
               trDoms.eq(selectDomRc.r + i - 1)
               .prepend(html)
            }
          }
          // this.selectTdDom.replaceWith(html);
        }
        this.selectTdDom.remove();
      }
    }, 
    // 单元格双击事件
    dblclickEvent(e) {
      let tdDom = e.srcElement.tagName == 'TD' ? e.srcElement : e.srcElement.parentNode
      // 双击选中，将其他已选中的tdDom背景色调回白色
      if (this.selectTdDom && this.selectTdDom != tdDom) {
        this.selectTdDom.style.backgroundColor = 'white'
      }
      tdDom.style.backgroundColor = 'gray'
      this.selectTdDom = tdDom
    },
    // 初始化单元格dom的行列数据信息，新增事件
    initData() {
      // 初始化所有单元格的行列下标内容并存储到dom对象中
      $(this.$refs.table1)
        .find("tr")
        .each(function (rIdx, tr) {
          $("td", this).each(function (cIdx, td) {
            $(this).data("rc", {
              r: rIdx, // 单元格左上角的row
              c: cIdx, // 单元格左上角的col
              maxr: rIdx + (parseInt(this.getAttribute("rowspan")) || 1) - 1, // 单元格右下角的row
              maxc: cIdx + (parseInt(this.getAttribute("colspan")) || 1) - 1, // 单元格右下角的col
            });
          });
        });
      // 添加表格文字禁止选择样式和事件
      $(this.$refs.table1)
        .addClass("cannotselect")
        .bind("selectstart", function () {
          return false;
        });
      this.$refs.table1.addEventListener("mousedown", (e) => {
        // this.startOnMouse = true;
        this.onMousedown(e);
      });
      this.$refs.table1.addEventListener("mouseup", (e) => {
        // this.startOnMouse = false;
      });
    },
    addSelectedClass() {
      let that = this;
      let selected = false, rc;
      $(this.$refs.table1)
        .find("td")
        .each(function (idx, dom) {
          rc = $(this).data("rc");
          //判断单元格左上坐标是否在鼠标按下和移动到的单元格行列区间内
          selected =
            rc.r >= that.MMRC.startRowIndex &&
            rc.r <= that.MMRC.endRowIndex &&
            rc.c >= that.MMRC.startColIndex &&
            rc.c <= that.MMRC.endColIndex;
          if (!selected && rc.maxc) {
            //合并过的单元格，判断另外3（左下，右上，右下）角的行列是否在区域内
            selected =
              (rc.maxr >= that.MMRC.startRowIndex &&
                rc.maxr <= that.MMRC.endRowIndex &&
                rc.c >= that.MMRC.startColIndex &&
                rc.c <= that.MMRC.endColIndex) || //左下
              (rc.r >= that.MMRC.startRowIndex &&
                rc.r <= that.MMRC.endRowIndex &&
                rc.maxc >= that.MMRC.startColIndex &&
                rc.maxc <= that.MMRC.endColIndex) || //右上
              (rc.maxr >= that.MMRC.startRowIndex &&
                rc.maxr <= that.MMRC.endRowIndex &&
                rc.maxc >= that.MMRC.startColIndex &&
                rc.maxc <= that.MMRC.endColIndex); //右下
          }
          if (selected) $(dom).addClass("selected") 
          // this.className = "selected";
        });
      let rangeChange = false, originIndex;
      $(this.$refs.table1)
        .find("td.selected")
        .each(function (idx, dom) {
          //从已选中单元格中更新选中行列的开始结束下标
          rc = $(this).data("rc");
          originIndex = that.MMRC.startRowIndex;
          that.MMRC.startRowIndex = Math.min(that.MMRC.startRowIndex, rc.r);
          rangeChange = rangeChange || that.MMRC.startRowIndex != originIndex;

          originIndex = that.MMRC.endRowIndex;
          that.MMRC.endRowIndex = Math.max(that.MMRC.endRowIndex, rc.maxr);
          rangeChange = rangeChange || that.MMRC.endRowIndex != originIndex;

          originIndex = that.MMRC.startColIndex;
          that.MMRC.startColIndex = Math.min(that.MMRC.startColIndex, rc.c);
          rangeChange = rangeChange || that.MMRC.startColIndex != originIndex;

          originIndex = that.MMRC.endColIndex;
          that.MMRC.endColIndex = Math.max(that.MMRC.endColIndex, rc.maxc);
          rangeChange = rangeChange || that.MMRC.endColIndex != originIndex;
        });
      //注意这里如果用代码选中过合并的单元格需要重新执行选中操作
      if (rangeChange) that.addSelectedClass();
    },
    onMousemove(e) {
      if (this.selectTdDom) {
        this.selectTdDom.style.backgroundColor = 'white'
      }
      //鼠标在表格单元格内移动事件
      e = e || window.event;
      let o = e.srcElement || e.target;
      if (o.tagName == "TD") {
        this.endTD = o;
        let sRC = $(this.startTD).data("rc"),
          eRC = $(this.endTD).data("rc");
        this.MMRC.startRowIndex = Math.min(sRC.r, eRC.r);
        this.MMRC.startColIndex = Math.min(sRC.c, eRC.c);
        this.MMRC.endRowIndex = Math.max(sRC.r, eRC.r);
        this.MMRC.endColIndex = Math.max(sRC.c, eRC.c);
        $(this.$refs.table1).find("td").removeClass("selected");
        this.addSelectedClass();
      }
    },
    onMouseup(e) {
      $(this.$refs.table1).unbind({ mouseup: this.onMouseup, mousemove: this.onMousemove });
        if (this.startTD && this.endTD && this.startTD != this.endTD ) {//开始结束td不相同确认合并
            this.$confirm("是否确认合并？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let tds = $(this.$refs.table1).find('td.selected'), firstTD = tds.eq(0);
                let html = tds.map(function () {
                        return this.innerText
                    }).get().join(',');
                let cellRC = html.split(','); // 所有选中单元格行列信息
                // let b = [];
                // let c = [];
                let resetItem01 = 9999;
                let resetItem23 = 0;
                cellRC.map((item) => {
                    // let item0 = Number(item[0]);
                    // let item1 = Number(item[1]);
                    // let item2 = Number(item[2]);
                    // let item3 = Number(item[3]);
                    // if(item0 == item2) {
                    //     b.push(item0);
                    // } else {
                    //     for(let i = item0; i <= item2; i++) {
                    //         b.push(i);
                    //     }
                    // }
                    // if(item1 == item3) {
                    //     c.push(item1);
                    // } else {
                    //     for(let j = item1; j <= item3; j++) {
                    //         c.push(j);
                    //     }
                    // }
                    let item01 = Number(item.slice(0, 2));
                    let item23 = Number(item.slice(2, 4));
                    resetItem01 = item01 < resetItem01 ? item01 : resetItem01;
                    resetItem23 = item23 > resetItem23 ? item23 : resetItem23;
                })
                // let d = Array.from(new Set(b));
                // let e = Array.from(new Set(c));
                // if(((d.length - 1) != (d[d.length-1] - d[0])) || ((e.length - 1) != (e[e.length-1] - e[0]))) {
                //     $(this.$refs.table1).find('td').removeClass('selected');
                //     this.startTD = this.endTD = null;
                //     return
                // }
                // html = `${resetItem01}${resetItem23}`;
                html = `<span style="position:absolute;z-index:-1">${resetItem01}${resetItem23}</span>`
                tds.filter(':gt(0)').remove();
                firstTD.html(html);
                //更新合并的第一个单元格的缓存rc数据为所跨列和行
                let rc = firstTD.attr({ colspan: this.MMRC.endColIndex - this.MMRC.startColIndex + 1, rowspan: this.MMRC.endRowIndex - this.MMRC.startRowIndex + 1 }).data('rc');
                rc.maxc = rc.c + this.MMRC.endColIndex - this.MMRC.startColIndex; rc.maxr = rc.r + this.MMRC.endRowIndex - this.MMRC.startRowIndex;
                firstTD.data('rc', rc);
                $(this.$refs.table1).find('td').removeClass('selected');
                let singleWidth = parseInt(400 / Number(this.screenform.Col))
                $(this.$refs.table1).find('td').each(function(idx, dom) {
                  if (dom.getAttribute('colspan')) {
                    dom.style.width = singleWidth * Number(dom.getAttribute('colspan')) + 'px'
                  } else {
                    dom.style.width = singleWidth + 'px'
                  }
                  // dom.style.width = singleWidth + 'px' // 设置同一个宽度也可以-_-，因为table的总宽度会撑开cospan
                })
                this.startTD = this.endTD = null;
                this.merged = true
                // this.startOnMouse = false
            }).catch((err)=>{
                $(this.$refs.table1).find('td').removeClass('selected');
                if(!this.merged){
                    // this.startOnMouse = false
                }
            });
        }else{                
            $(this.$refs.table1).find('td').removeClass('selected');
            this.startTD = this.endTD = null;
        }
    },
    onMousedown(e) {
      let o = e.target;
      if (o.tagName == "TD") {
        this.startTD = o;
        $(this.$refs.table1).bind({
          mouseup: this.onMouseup,
          mousemove: this.onMousemove,
        });
      }
    },
    // 重置表格行列
    reset() {
      // this.startOnMouse = false;
      this.$set(this.screenform, 'Row', 3);
      this.$set(this.screenform, 'Col', 3);
      this.resetTable()
    },
    // 重置表格，
    resetTable() {
      // 将原表格摧毁并新建(防止继承已合并的表格)
      this.tableKey = Math.random();
      // 初始化数据
      this.$nextTick(() => {
        this.initData()
      },20)
    },
  },
};
</script>

<style lang="less" scoped>
// td {
//   width: 50px;
//   height: 50px;
// }
// 修改 input + - 样式bug
/deep/ .el-input-number--small {
  line-height: 25px;
}

/deep/ .el-input-number__increase {
  font-size: 12px !important;
  line-height: 10px !important;
}

/deep/ .el-input-number__decrease {
  font-size: 12px !important;
  line-height: 10px !important;
}

.cannotselect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
/deep/ td.selected {
  background: chartreuse !important;
  color: chartreuse !important;
  // opacity: 0;
}
td.hide {
  display: none;
}
.require::before {
  content: "*";
  color: red;
  font-size: 12px;
}
/deep/ .el-input--small .el-input__inner{
  height: 27px;
  line-height: 27px;
}
</style>