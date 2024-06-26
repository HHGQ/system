<template>
  <div>
    <img src="http://192.168.73.134:3000/chunkImg" alt="">
    <video id="videoPlayer" controls></video>
    <!-- <video src="http://localhost:8080/static/这是视频.mp4" id="videoPlayer" controls></video> -->
    <div @click="copy">复制一下</div>
    <div @click="playVideo">播放一下</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    copy() {
      var text = "被复制的内容，啦啦啦~";
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text);
      } else {
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = "fixed";
        textarea.style.clip = "rect(0 0 0 0)";
        textarea.style.top = "10px";
        // 赋值
        textarea.value = text;
        // 选中
        textarea.select();
        // 复制
        document.execCommand("copy", true);
        // 移除输入框
        document.body.removeChild(textarea);
      }
    },
    playVideo() {
      const videoPlayer = document.getElementById("videoPlayer");

      // 创建一个新的MediaSource对象
      const mediaSource = new MediaSource();

      // 将MediaSource对象设置为videoPlayer的src
      videoPlayer.src = URL.createObjectURL(mediaSource);


      // avc1.42E01E：H.264 视频编码器
      // mp4a.40.2：MPEG-4 AAC 音频编码器
      // opus：Opus 音频编码器
      // vorbis：Vorbis 音频编码器
      // vp8：VP8 视频编码器
      // vp9：VP9 视频编码器
      // 当MediaSource对象打开时
      mediaSource.addEventListener("sourceopen", () => {
        // 创建一个新的SourceBuffer对象
        const sourceBuffer = mediaSource.addSourceBuffer(
          'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'
          // 'video/mp4; codecs="avc1.4d401f"'
          // 'video/mp4; codecs="hev1.1.6.L93.B0"'
          // 'video/webm; codecs="vorbis, vp8"'
          // 'video/mp4;codecs=avc1.420028'
          // 'audio/mp4; codecs="mp4a.40.2"'
          // 'video/mp4; codecs="avc1.64001e"'
          // 'audio/mp4; codecs="mp4a.40.5"'
        );

        // 当数据可用时
        sourceBuffer.addEventListener("updateend", function () {
          console.log(mediaSource.readyState)
          // 如果videoPlayer没有在播放，则开始播放
          if (videoPlayer.paused) {
            videoPlayer.play();
          }
        });

        // 发送请求获取视频二进制流
        this.$ajax({
          // url: 'https://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4',
          // url: 'http://localhost:8080/static/frag_bunny.mp4',
          // url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
          // url: 'http://localhost:8080/static/video.mp4',
          // responseType: 'blob' // 若是blob，则先转成arrayBuffer，再appendBuffer
          url: 'http://localhost:3000/video',
          responseType: 'arraybuffer',
        })
          .then((response) => {
            sourceBuffer.appendBuffer(response);
            // return response.arrayBuffer()
          })
          // .then((arrayBuffer) => {
          //   console.log(arrayBuffer)
          //   // 将视频二进制流添加到SourceBuffer中
          //   sourceBuffer.appendBuffer(arrayBuffer);
          // })
          .catch(err => {
            console.log(err, 'err')
          })
      });
    },
  },
};
</script>