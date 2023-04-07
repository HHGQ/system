import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image';
import kscreenshot from 'kscreenshot'

window.addEventListener('keydown', (event) => {
  if (event.keyCode == 27) {
      screenShot.endScreenShot()
  }
})
// 65指A键
let screenShot = new kscreenshot({
  key: 65,
  toolShow: {
    back: false,
    arrow: false,
    drawLine: false,
    rect: false,
    ellipse: false,
    text: false,
    color: false
  },
  endCB: function (imgUrl) {
    if (window.navigator.msSaveOrOpenBlob) {
      let bstr = atob(imgUrl.split(',')[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, 'screenshot.png')
    } else {
      const a = document.createElement('a')
      a.href = imgUrl
      a.setAttribute('download', 'map')
      a.click()
    }
  },
  cancelCB: function() {}
})
function startScreenShot() {
  screenShot.startScreenShot()
}

function html2canvasPrint(dom) {
  html2canvas(dom).then(canvas => {
    let dataUrl = canvas.toDataURL()
    console.log(dataUrl)
    const a = document.createElement('a')
      a.href = dataUrl
      a.setAttribute('download', 'map')
      a.click()
  })
  // html2canvas(dom, { useCORS: true }).then(canvas => {
  //   // console.log(canvas)
  //   const imgUrl = canvas.toDataURL()
  //   console.log(imgUrl)
  //   // const imgUrl = document.getElementsByClassName('ol-unselectable')[0].toDataURL()
  //   if (window.navigator.msSaveOrOpenBlob) {
  //     let bstr = atob(imgUrl.split(',')[1])
  //     let n = bstr.length
  //     let u8arr = new Uint8Array(n)
  //     while(n--) {
  //       u8arr[n] = bstr.charCodeAt(n)
  //     }
  //     let blob = new Blob([u8arr])
  //   } else {
  //     const a = document.createElement('a')
  //     a.href = imgUrl
  //     a.setAttribute('download', 'map')
  //     a.click()
  //   }
  // })
}

function domtoimagePrint(dom) {
  domtoimage.toPng(document.getElementById('map1'), {
    quality: 1.0
  })
  .then(function (dataUrl) {
    var link = document.createElement('a');
    link.download = '全图导出.png';
    link.href = dataUrl;
    link.click();
  });
}

export {
  startScreenShot,
  html2canvasPrint,
  domtoimagePrint
}