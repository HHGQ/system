<template>
  <div>
    这是用后端接口进行导入导出
    <div @click="exportExcel()">导出</div>
  </div>
</template>

<script>
import { getUsersExcel } from '@/api/user.js'
export default {
  data() {
    return {

    }
  },
  methods: {
    /**
      * 导入导入文件、图片都可以
      * @param { Array } data 
      * @return 
    */
    import() {
      // let formData = new FormData()
      // formData.append('file', this.file) // this.file 可以用导入组件的回调file
      // formData.append('data', {}) // this.file 可以用导入组件的回调file
      // this.$ajax({
      //   method: 'post',
      //   url,
      //   data: formData
      // }).then(res => {
      //   consoel.log(res)
      // })
    },
    // 接口返回的就是文件，在前端导出
    exportExcel(fileName="导出.xlsx") {
      getUsersExcel().then(data => {
        let blob = data
        if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, fileName)
        } else {
          const url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(url) // 释放blob对象
        }
      })
    },
    // 返回的是csv字符串,但要导出csv文件
    exportCSV() {
      // this.$ajax({
      //   url,
      // }).then(data => {
      //   const blob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });//返回的格式
      //   if (window.navigator.msSaveBlob) {
      //     window.navigator.msSaveBlob(blob, fileName)
      //   } else {
      //     const url = window.URL.createObjectUrL(blob)
      //     let link = document.createElement('a')
      //     link.style.display = 'none'
      //     link.href = url
      //     link.setAttribute('dowunload', fileName)
      //     document.body.appendChild(link)
      //     link.click()
      //     window.URL.revokeObjectURL(url) // 释放blob对象
      //   }
      // })
    }
  }
}
</script>