<template>
  <div class="prisonerRoomChoose" ref="prisonerRoomChoose">
    <div v-for="(val,idx) in nameArrayIn" :key="idx" @click="chooseRoom($event)">
      <p>{{val.name}}</p>
      <div class="caseRoomChooseBox">
        <span data-idx="0">00:00-01:00</span>
        <span data-idx="1">01:00-02:00</span>
        <span data-idx="2">02:00-03:00</span>
        <span data-idx="3">03:00-04:00</span>
        <span data-idx="4">04:00-05:00</span>
        <span data-idx="5">05:00-06:00</span>
        <span data-idx="6">06:00-07:00</span>
        <span data-idx="7">07:00-08:00</span>
        <span data-idx="8">08:00-09:00</span>
        <span data-idx="9">09:00-10:00</span>
        <span data-idx="10">10:00-11:00</span>
        <span data-idx="11">11:00-12:00</span>
        <span data-idx="12">12:00-13:00</span>
        <span data-idx="13">13:00-14:00</span>
        <span data-idx="14">14:00-15:00</span>
        <span data-idx="15">15:00-16:00</span>
        <span data-idx="16">16:00-17:00</span>
        <span data-idx="17">17:00-18:00</span>
        <span data-idx="18">18:00-19:00</span>
        <span data-idx="19">19:00-20:00</span>
        <span data-idx="20">20:00-21:00</span>
        <span data-idx="21">21:00-22:00</span>
        <span data-idx="22">22:00-23:00</span>
        <span data-idx="23">23:00-24:00</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'prisonerRoomChoose',
  props: {
    nameArray: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    disabled: {
      type: Array,
      required: false,
      default: () => { return []; }
    },
    clear: {
      type: Boolean,
      required: false,
      default: false
    },
    indexs: {
      type: Array,
      required: false,
      default: () => { return []; }
    }
  },
  data () {
    return {
      nameArrayIn: this.nameArray,
      disabledIn: this.disabled,
      clearIn: this.clear
    };
  },
  mounted () {
    this.getDisable();
  },
  methods: {
    getDisable () {
      let dis = this.disabledIn;
      let roomName = this.nameArrayIn;

      // ?????????????????????????????????
      let box = this.$refs.prisonerRoomChoose.children;
      for (let i = 0; i < box.length; i++) {
        for (let j = 0; j < box[i].children[1].children.length; j++) {
          box[i].children[1].children[j].className = '';
        }
      }

      if (dis.length !== 0) {
        for (let i = 0; i < dis.length; i++) { // ???????????????????????????
          for (let j = 0; j < roomName.length; j++) { // ????????????????????????????????????dom??????
            if (dis[i].id === roomName[j].id) {
              let room = this.$refs.prisonerRoomChoose.children[j]; // ???????????????????????????
              for (let k = 0; k < dis[i].value.length; k++) { // ??????????????????????????????
                for (let s = 0; s < room.children[1].children.length; s++) { // ??????????????????????????????dom??????
                  if (dis[i].value[k] === room.children[1].children[s].innerText) {
                    room.children[1].children[s].className = 'disabled'; // ??????????????????????????????dom??????
                  }
                }
              }
            }
          }
        }
      }
    },
    getRoomName (val, el) {
      this.$emit('getRoomName', val);
      let span = document.getElementsByClassName('prisonerRoomChoose')[0]
        .children;
      for (let i = 0; i < span.length; i++) {
        span[i].style.color = '#fff';
        span[i].style.fontWeight = 'normal';
      }
      if (Object.keys(el).length !== 0) {
        el.target.style.color = 'rgba(53,255,250,1)';
        el.target.style.fontWeight = 'bold';
      }
    },
    chooseRoom (el) {
      // ?????????????????????????????????
      let box = this.$refs.prisonerRoomChoose.children;
      for (let i = 0; i < box.length; i++) {
        for (let j = 0; j < box[i].children[1].children.length; j++) {
          if (box[i].children[1].children[j].className === 'choose') {
            box[i].children[1].children[j].className = '';
          }
        }
      }

      // ??????
      this.indexs.sort(function (a, b) {
        return a - b;
      });

      if (this.indexs.length === 1) {
        if (el.currentTarget.children[1].children[this.indexs[0]].className === 'disabled') {
          this.$Message.error('????????????????????????????????????????????????');
          this.$emit('getRoomName', ['', '']);
          return;
        } else {
          if (el.currentTarget.children[1].children[this.indexs[0]].className === '') {
            el.currentTarget.children[1].children[this.indexs[0]].setAttribute('class', 'choose');
          }
        }
      } else {
        for (let i = 0; i < el.currentTarget.children[1].children.length; i++) {
          if (i >= this.indexs[0] && i <= this.indexs[1]) {
            if (el.currentTarget.children[1].children[i].className === 'disabled') {
              this.$Message.error('????????????????????????????????????????????????');
              this.$emit('getRoomName', ['', '']);
              return;
            }
          }
        }
        for (let i = 0; i < el.currentTarget.children[1].children.length; i++) {
          if (i >= parseInt(this.indexs[0]) && i <= parseInt(this.indexs[1])) {
            if (el.currentTarget.children[1].children[i].className === '') {
              el.currentTarget.children[1].children[i].setAttribute('class', 'choose');
            }
          }
        }
      }
      let roomName = el.currentTarget.children[0].innerText;
      let chooseRoomId;
      for (let i = 0; i < this.nameArrayIn.length; i++) {
        if (roomName === this.nameArrayIn[i].name) {
          chooseRoomId = this.nameArrayIn[i].id;
        }
      }
      this.$emit('getRoomName', [roomName, chooseRoomId]);
    }
  },
  watch: {
    nameArray (val) {
      this.nameArrayIn = val;
    },
    disabled (val) {
      this.disabledIn = val;
      this.getDisable();
    },
    clear (val) {
      this.clearIn = val;
      this.getRoomName('', {});
    },
    index (val) {
      this.indexs = val;
    }
  }
};
</script>

<style scoped lang="less">
.prisonerRoomChoose {
  overflow: auto;
  height: calc(~'100% - 120px');
  > div {
    width: 100%;
    height: 254px;
    background: url('../../assets/images/common/chooseRoom.png') no-repeat;
    background-size: 100% 100%;
    padding: 25px 30px;
    cursor: pointer;
    > p {
      color: rgba(53, 255, 250, 1);
      font: 22px/22px Microsoft YaHei;
    }
    > .caseRoomChooseBox {
      margin-top: 20px;
      cursor: pointer;
      > span {
        display: inline-block;
        width: 95px;
        height: 40px;
        border: 1px solid #00c6ff;
        box-shadow: 0 0 8px 0 rgb(0, 122, 255) inset;
        vertical-align: top;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .choose {
        background: #35fffa;
        color: rgba(5, 29, 53, 1);
      }
      .disabled {
        background: #48688c;
        &:hover {
          background: #48688c;
          color: #fff;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
