<template>
  <div class="VideoPlayer">
    <video :id="id" controls playsinline autoplay :style="{width: width, height: height}" class="video" ></video>
  </div>
</template>

<script>
import '@/components/video-player/ezuikit.js';
import { getPlaybackURLs, getPreviewURLs } from '@/api/bg-manage/patrol';
import { formatDate, getDate } from '@/libs/tools';

/*
  支持rtmp、hls，移动端只支持hls播放
  回放不能使用hls
 */
export default {
  name: 'VideoPlayer',
  props: {
    cameraIndexCode: {
      type: String,
      required: true
    }, // 监控点编号，必填
    protocol: '', // 取流协议（hls、rtmp，移动端只支持hls）
    beginTime: '', // 开始时间，回放必填
    endTime: '', // 结束时间，回放必填
    mode: '', // 播放形式，'live'表示直播，'replay'表示回放，二选一
    width: {
      type: String,
      default: '20.8'
    },
    height: {
      type: String,
      default: '15.625'
    },
    initStream: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: 'myPlayer'
    }
  },
  data () {
    return {
      params: {
        cameraIndexCode: this.replace(this.cameraIndexCode),
        protocol: this.replace(this.protocol),
        beginTime: this.beginTime,
        endTime: this.endTime
      },
      liveParams: {
        cameraIndexCode: this.replace(this.cameraIndexCode),
        protocol: this.replace(this.protocol)
      },
      videoObject: ''
    };
  },
  created () {
    if (this.initStream) {
      this.videoPlayer();
    }
  },
  methods: {
    replace (param) {
      return param.replace(/(^\s*)/g, '').replace(/(\s*$)/g, '');
    },
    videoPlayer () {
      let myPlayer = document.getElementById('myPlayer');
      if (this.mode == 'live') {
        getPreviewURLs(params).then(res => {
          myPlayer.src = res.data.data.url;
          return new EZUIPlayer('myPlayer');
        });
      } else if (this.mode == 'replay') {
        this.params.beginTime = getDate(formatDate(this.beginTime), 'time');
        this.params.endTime = getDate(formatDate(this.endTime), 'time');
        getPlaybackURLs(this.params).then(res => {
          document.getElementById(this.id).src = res.data.data.url;
          this.videoObject = new EZUIPlayer(this.id);
          return this.videoObject;
        });
      } else {
        this.$Message.error('请指定播放模式');
      }
    },
    stopPlayer () {
      this.videoObject.stop();
    }
  },
  watch: {
    id (val) {
      this.params = {
        cameraIndexCode: this.replace(this.cameraIndexCode),
        protocol: this.replace(this.protocol),
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      this.liveParams = {
        cameraIndexCode: this.replace(this.cameraIndexCode),
        protocol: this.replace(this.protocol)
      };
      this.videoPlayer();
    }
  },
  destroyed () {
    this.stopPlayer();
  }
};
</script>
