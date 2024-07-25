<template>
  <div>
    <el-button type="primary" @click="downloadNotify()">倒计时的notify</el-button>
    <div>
      <slot name="tree"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    downloadNotify() {
      const h = this.$createElement;
      let that = this
      let timeNumber = 5 // 倒计时时间
      let timeNumberId = `notify_${Date.now()}${Math.random().toString().slice(-3)}` // 唯一的id
      let intervalId = setInterval(() => {
        let dom = document.getElementById(timeNumberId)
        if (!dom) return clearInterval(intervalId)
        if (timeNumber == 0) {
          notify.close()
          return clearInterval(intervalId)
        }
        timeNumber--
        dom.innerText = String(timeNumber)
      }, 1000)
      console.log(timeNumberId)
      this.appendNotifyFrame(`.notify_${timeNumberId}`)
      let notify = this.$notify({
        title:'录像下载任务提示',
        type: 'success',
        duration: 0,
        iconClass: 'notify_icon',
        customClass: `notify_${timeNumberId}`,
        position: 'bottom-right',
        message: h('div', null, [
          h('div', {style:'font-size:14px;height:80px'}, [
            h('span', {style:'color:#3D84EE;', on: {
              click: () => {
                console.log('dianji')
              }
            }}, '干啥'),
            h('span', null, '这又是干啥')
          ]),
          h('div', {style: 'display:flex'}, [
            h('el-checkbox', {style:'position:relative;left:-19px', attrs:{'v-model':that.timeNumberId,checked:true},on: {
              change: (val) => {
                if (val) {
                  // 按剩余秒数重新计时
                  that[`check${timeNumberId}`] = setInterval(()=> {
                    let dom = document.getElementById(timeNumberId)
                    if (!dom) return clearInterval(that[`check${timeNumberId}`])
                    let timeNumber = Number(dom.innerText)
                    if (timeNumber ==0) {
                      notify.close()
                      return clearInterval(that[`check${timeNumberId}`])
                    }
                    timeNumber--
                    dom.innerText = String(timeNumber)
                  }, 1000)
                } else {
                  clearInterval(intervalId)
                  clearInterval(that[`check${timeNumberId}`])
                }
              }
            }},[
              h('span',null,'自动关闭('),
              h('span', {attrs: {id:timeNumberId}}, timeNumber),
              h('span',null, 's)')
            ])
          ]),
          h('div',{style: 'color:#3D84EE;right:20px;position:absolute;cursor:pointer;bottom: 13px;'},[
            h('span',{
              on: {
                click: () => {
                  that.showTip()
                }
              }
            }, '打开显示信息')
          ])
        ])
      })
    },
    showTip() {
      console.log('tip')
    },
    appendNotifyFrame(domClass) {
      this.$nextTick(() => {
        const panel = document.querySelector(domClass)
        const iframe = document.createElement('iframe')
        iframe.src = 'about:blank'
        iframe.className = 'common_iframe'
        iframe.frameBorder = '0'
        iframe.marginHeight = '0'
        iframe.marginWidth = '0'
        panel.appendChild(iframe)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>