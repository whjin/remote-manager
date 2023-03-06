<template>
  <div class="caseRoomChoose" ref="caseRoomChoose">
    <div v-for="(val,idx) in nameArrayIn" :key="idx">
      <p>{{val.name}}</p>
      <div class="caseRoomChooseBox" @click="chooseRoom($event)">
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
  name: 'caseRoomChoose',
  props: {
    nameArray: {
      type: Array,
      required: false,
      default: () => { return []; }
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
    }
  },
  data () {
    return {
      chooseValue: [],
      chooseValueTime: [],
      chooseRoomTest: '',
      chooseRoomDom: {},
      nameArrayIn: this.nameArray,
      disabledIn: this.disabled,
      clearIn: this.clear,
      el: {}
    };
  },
  mounted () {
    this.getDisable();
  },
  methods: {
    getDisable () {
      let dis = this.disabledIn;
      let roomName = this.nameArrayIn;

      // 初始化时间段默认未选中
      let box = this.$refs.caseRoomChoose.children;
      for (let i = 0; i < box.length; i++) {
        for (let j = 0; j < box[i].children[1].children.length; j++) {
          box[i].children[1].children[j].className = '';
        }
      }

      if (dis.length !== 0) {
        for (let i = 0; i < dis.length; i++) { // 循环存在占用的监室
          for (let j = 0; j < roomName.length; j++) { // 循环与占用监室名字相同的dom节点
            if (dis[i].id == roomName[j].id) {
              let room = this.$refs.caseRoomChoose.children[j]; // 得到占用的监室名称
              for (let k = 0; k < dis[i].value.length; k++) { // 循环该监室占用的时间
                for (let s = 0; s < room.children[1].children.length; s++) { // 循环该监室占用时间的dom节点
                  if (dis[i].value[k] == room.children[1].children[s].innerText) {
                    room.children[1].children[s].className = 'disabled'; // 得到该监室占用时间的dom节点
                  }
                }
              }
            }
          }
        }
      }
    },
    chooseRoom (el) {
      this.el = el;
      let tar = el.target;
      let oneBox = tar.parentElement.parentElement;
      let that = this;
      // 用于获取第一次点击的监室名，与第二次点击的监室名作对比
      function getRoomCompared () {
        that.chooseRoomTest = oneBox.children[0].innerText;
        that.chooseRoomDom = oneBox;
      }
      // 获取点击的时间
      function getTimeChoose (type) {
        let first = 0;
        let second = 0;
        if (type == 'up') {
          first = Number(that.chooseValue[0]);
          second = Number(that.chooseValue[1]);
        } else {
          first = Number(that.chooseValue[1]);
          second = Number(that.chooseValue[0]);
        }
        for (let i = first; i <= second; i++) {
          if (tar.parentElement.children[i].className == 'disabled') {
            this.$Message.success('含有被占用的时间');
            that.clearTimeChoose(el);
            return;
          }
          tar.parentElement.children[i].className = 'choose';
        }
      }
      if (tar.tagName == 'SPAN' && tar.className !== 'disabled') {
        that.chooseValue.push(tar.dataset.idx);
        if (that.chooseValue.length == 1) { // 当第一次点击时
          getRoomCompared();
          tar.className = 'choose';
        } else if (that.chooseValue.length > 2) { // 当单次点击时（再次选择第一项）
          getRoomCompared();
          that.clearTimeChoose(el);
          // 重新选择
          that.chooseValue.push(tar.dataset.idx);
          tar.className = 'choose';
        } else { // 当已经选择了一项时
          if (oneBox.children[0].innerText == that.chooseRoomTest) { // 同房间选择
            if (Number(that.chooseValue[0]) < Number(that.chooseValue[1])) { // 先选择前面，后选择后面
              getTimeChoose('up');
            } else { // 先选择后面，后选择前面
              getTimeChoose('down');
            }
          } else {
            this.$Message.success('不能跨房间选择');
            that.clearTimeChoose(el);
          }
        }
      }
      let endTime;
      let chooseRoom;
      let chooseRoomId;
      let endTimeIdx = [];
      if (that.chooseValue.length !== 0) {
        this.chooseValueTime = [];
        for (let i = 0; i < that.chooseValue.length; i++) {
          let split = oneBox.children[1].children[that.chooseValue[i]].innerText.split('-');
          this.chooseValueTime.push(split[0], split[1]);
          this.chooseValueTime.sort();
          endTimeIdx.push(oneBox.children[1].children[that.chooseValue[i]].dataset.idx);
        }
        endTime = this.chooseValueTime[0] + '-' + this.chooseValueTime[this.chooseValueTime.length - 1];
        chooseRoom = that.chooseRoomTest;
        for (let i = 0; i < this.nameArrayIn.length; i++) {
          if (chooseRoom == this.nameArrayIn[i].name) {
            chooseRoomId = this.nameArrayIn[i].id;
          }
        }
      } else {
        this.chooseValueTime = [];
        endTime = '';
        chooseRoom = '';
        chooseRoomId = '';
        endTimeIdx = [];
      }
      this.$emit('endTime', [endTime, chooseRoom, chooseRoomId, endTimeIdx]);
    },
    // 把所有选择的结果清空
    clearTimeChoose (el) {
      let tar = el.target;
      let oneBox = tar.parentElement.parentElement;
      let bigBox = oneBox.parentElement;
      let that = this;
      that.chooseValue = [];
      for (let i = 0; i < bigBox.children.length; i++) {
        for (let j = 0; j < bigBox.children[i].children[1].children.length; j++) {
          if (bigBox.children[i].children[1].children[j].className !== 'disabled') {
            bigBox.children[i].children[1].children[j].className = '';
          }
        }
      }
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
      if (Object.keys(this.el).length !== 0) {
        if (this.clearIn) {
          this.clearTimeChoose(this.el);
          this.$emit('endTime', ['', '', '', []]);
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.caseRoomChoose {
  overflow: auto;
  height: calc(~'100% - 120px');
  > div {
    width: 100%;
    height: 254px;
    background: url('../../assets/images/common/chooseRoom.png') no-repeat;
    background-size: 100% 100%;
    padding: 25px 30px;
    > p {
      color: rgba(53, 255, 250, 1);
      font: 22px/22px Microsoft YaHei;
    }
    > .caseRoomChooseBox {
      margin-top: 20px;
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
        &:hover {
          background: #35fffa;
          color: rgba(5, 29, 53, 1);
        }
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
