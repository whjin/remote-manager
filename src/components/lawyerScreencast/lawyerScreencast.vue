<template>
  <div v-show="showLawyerScreencast" class="lawyer-screencast">
    <div class="lawyer-screencast-box">
      <div class="header">
        <span class="screen-title">{{ title }}</span>
        <div class="control-box">
          <span class="chip-in" @click="handleChipIn">插话</span>
          <span class="suspend" @click="handleSuspend">中止</span>
          <Icon type="md-close" color="#fff" size="40" @click="handleHideLawyerScreencast" />
        </div>
      </div>
      <video class="lawyer-screen" ref="lawyerScreen" playsinline autoplay object-fit="fill" codec="software"></video>
      <Col class="demo-spin-col" span="8" v-if="isLoading">
      <Spin fix>
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      </Col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lawyerScreencast',
  props: {
    roomId: {
      type: String,
      default: '0'
    },
    title: {
      type: String,
      default: '标题'
    },
    roomName: {
      type: String,
      default: '房间'
    }
  },
  data () {
    return {
      peer: null,
      iceServersConfig: {
        iceServers: [
          {
            urls: ['stun:68.232.28.46:3488', 'stun:192.168.1.56:3488']
          },
          {
            urls: ['turn:68.232.28.46:3478', 'turn:192.168.1.56:3478'],
            username: 'admin',
            credential: 'gktel12345'
          }
        ]
      },
      showLawyerScreencast: false,
      isLoading: true,
      offerOptions: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      }
    };
  },
  computed: {
    organizeCode () {
      return this.$store.state.user.organizeCode.toString();
    }
  },
  methods: {
    initPeer () {
      const that = this;
      this.$refs.lawyerScreen.src = '';
      const PeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      if (!PeerConnection) {
        this.$Message.error('浏览器不支持WebRTC！');
        return;
      }
      this.peer = new PeerConnection(this.iceServersConfig);

      this.$refs.lawyerScreen.onloadeddata = () => {
        this.isLoading = false;
      };

      this.peer.ontrack = (e) => {
        if (!that.$refs.lawyerScreen.paused) return;
        if (e && e.streams) {
          that.$refs.lawyerScreen.srcObject = e.streams[0];
        }
      };
      this.peer.onicecandidate = (e) => {
        if (!that.$refs.lawyerScreen.paused) return;
        if (e.candidate) {
          let message = {
            manageId: that.organizeCode,
            roomId: that.roomId,
            candidate: e.candidate
          };
          that.$socket.emit('candidateToLawyer', message);
        }
      };
      this.peer.createOffer(this.offerOptions).then(offer => {
        that.peer.setLocalDescription(offer);
        let message = {
          manageId: that.organizeCode,
          roomId: that.roomId,
          offer
        };
        that.$socket.emit('screencastOffer', message);
      });
    },
    handleShowLawyerScreencast () {
      this.isLoading = true;
      this.showLawyerScreencast = true;
      this.initPeer();
    },
    handleHideLawyerScreencast () {
      this.showLawyerScreencast = false;
      this.peer && this.peer.close();
    },
    handleChipIn () {
      this.$emit('handleChipIn', this.roomId, this.roomName);
    },
    handleSuspend () {
      this.$emit('handleSuspend', this.roomId);
    },
  },
  sockets: {
    screencastAnswer (message) {
      if (!this.$refs.lawyerScreen.paused) return;
      if (message.manageId.toString() !== this.organizeCode) return;
      if (this.showLawyerScreencast && this.roomId.toString() === message.roomId.toString()) {
        this.peer.setRemoteDescription(message.answer);
      }
    },
    candidateToManage (message) {
      if (!this.$refs.lawyerScreen.paused) return;
      if (message.manageId.toString() !== this.organizeCode) return;
      if (this.showLawyerScreencast && this.roomId.toString() === message.roomId.toString()) {
        this.peer.addIceCandidate(message.candidate);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.lawyerScreen.onloadeddata = () => {
        this.$refs.lawyerScreen.play();
        this.isLoading = false;
      };
    });
  }
};
</script>

<style lang='less' scoped>
.lawyer-screencast {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);

  .lawyer-screencast-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    width: 1440px;
    height: 890px;
    border: 1px solid #03407e;

    background-image: url('../../assets/images/common/background.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .header {
      display: flex;
      padding: 0 30px;
      width: 100%;
      height: 80px;
      border-bottom: 2px solid #006fe9;

      .screen-title {
        flex: 1;
        font-size: 30px;
        color: #35fffa;
        line-height: 80px;
      }

      .control-box {
        display: flex;
        justify-content: center;
        align-items: center;

        .chip-in,
        .suspend {
          margin-right: 18px;
          width: 120px;
          height: 50px;

          background-image: url('../../assets/images/common/searchButton.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;

          font-size: 20px;
          font-weight: 400;
          color: #ffffff;
          line-height: 50px;
          text-align: center;
        }
      }
    }

    .lawyer-screen {
      width: 100%;
      height: 808px;
    }
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 80px;
  left: 0;
}
</style>
