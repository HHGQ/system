<template>
  <div class="videobox">
    <el-button @click="clickhandleitem">播放</el-button>

    <div class="video">
      <video
        id="videoElement"
        controls
        autoplay
        muted
      ></video>
    </div>
  </div>
</template>

<script>
import flvjs from "flv.js";

export default {
  data() {
    return {
      flvPlayer: null,
      devicename: "60",
      url: "",
      list: [],
      count: 1, // 当前点击标识
      flvPlayerList: [],
    };
  },
  methods: {
    clickhandleitem(data, index) {
      this.url = "http://localhost:300/video";

      if (this.flvPlayerList.length > 3) {
        this.destoryVideo(this.flvPlayerList[0]);
        this.flvPlayerList.shift();
      }
      this.createVideo();
    },
    play(flvPlayer) {
      flvPlayer.play();
    },

    createVideo() {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement");
        this.flvPlayer = flvjs.createPlayer(
          {
            type: "mp4",
            isLive: true,
            hasAudio: false,
            hasVideo: true,
            url: this.url,
          },
          {
            enableWorker: false, //不启用分离线程
            enableStashBuffer: false, //关闭IO隐藏缓冲区
            reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true, //自动清除缓存
            lazyLoadMaxDuration: 3 * 60,
            seekType: 'range',
          }
        );

        this.flvPlayer.attachMediaElement(videoElement);
        // this.flvPlayer.load();

        if (this.url !== "" && this.url !== null) {
          this.flvPlayer.load();
          // this.flvPlayer.play();
        }
      }

      //定时方法是为了用户离开页面视频是实时播放的,暂停按钮无用
      // setInterval(function () {
      //   // console.log(videoElement.buffered,"idididid");
      //   if (videoElement.buffered.length > 0) {
      //     const end = videoElement.buffered.end(0); // 视频结尾时间
      //     const current = videoElement.currentTime; //  视频当前时间
      //     const diff = end - current; // 相差时间
      //     // console.log(diff);
      //     const diffCritical = 4; // 这里设定了超过4秒以上就进行跳转
      //     const diffSpeedUp = 1; // 这里设置了超过1秒以上则进行视频加速播放
      //     const maxPlaybackRate = 4; // 自定义设置允许的最大播放速度
      //     let playbackRate = 1.0; // 播放速度
      //     if (diff > diffCritical) {
      //       //  this.flvPlayer.load();
      //       // console.log("相差超过4秒，进行跳转");
      //       videoElement.currentTime = end - 1.5;
      //       playbackRate = Math.max(1, Math.min(diffCritical, 16));
      //     } else if (diff > diffSpeedUp) {
      //       // console.log("相差超过1秒，进行加速");
      //       playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16));
      //     }
      //     videoElement.playbackRate = playbackRate;
      //     if (videoElement.paused) {
      //       videoElement.play();
      //     }
      //   }
      //   //  if (videoElement.buffered.length) {
      //   //   let end = this.flvPlayer.buffered.end(0);//获取当前buffered值
      //   //   let diff = end - this.flvPlayer.currentTime;//获取buffered与currentTime的差值
      //   //   if (diff >= 0.5) {//如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
      //   //     this.flvPlayer.currentTime = this.flvPlayer.buffered.end(0);//手动跳帧
      //   //  }
      //   // }
      // }, 1000);
      // statistics_info
      this.flvPlayer.on("error", (errType, errDetail) => {
        console.log("网络波动,正在尝试连接中...");
        // if (this.flvPlayer) {
        //   this.reloadVideo(this.flvPlayer);
        // }
        // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
        // errType是 MediaError时，对应errDetail是MediaMSEError   或MEDIA_SOURCE_ENDED
      });
      this.flvPlayerList.push(this.flvPlayer);
    },

    reloadVideo(flvPlayer) {
      this.destoryVideo(flvPlayer);
      this.createVideo();
    },
    destoryVideo(flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
      flvPlayer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.videolist {
  width: 550px;
  height: 906px;
  display: flex;
}
.video {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  video {
    object-fit: contain;
    width: 600px;
    height: 390px;
  }
}
</style>