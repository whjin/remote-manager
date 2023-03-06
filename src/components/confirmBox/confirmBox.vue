<template>
 <i-modal v-model="confirmModelIn" width="560px;" class="confirmBox" @on-cancel="passValue">
   <div class="confirmTitle">
     <i class="iconfont icon-danchuangtubiao" style="font-size: 50px;color: #007AFF;"></i>
     <span>确定要{{confirmActive}}吗？</span>
     <span>{{confirmActive}}之后将不可以恢复</span>
   </div>
   <div class="confirmButton" slot="footer">
     <i-button type="primary" @click="passValue" class="cancelBtn">取消</i-button>
     <i-button type="primary" @click="confirmValue" class="confirmBtn">确认</i-button>
   </div>
 </i-modal>
</template>

<script>
export default {
  name: 'confirmBox',
  data () {
    return {
      confirmModelIn: this.confirmModel
    };
  },
  props: {
    confirmModel: {
      type: Boolean,
      require: true
    },
    confirmActive: {
      type: String,
      require: true
    }
  },
  methods: {
    passValue () {
      this.$emit('passModel', false);
    },
    confirmValue () {
      this.$emit('confirmValue', '');
    }
  },
  watch: {
    confirmModel (val) {
      this.confirmModelIn = val;
    }
  }
};
</script>

<style lang="less" scoped>
.confirmTitle{
  height:100px;
  padding:24px 0 0 29px;
  >span:nth-child(2){
    position: relative;
    left: 20px;
    top: -12px;
    font:20px/80px SourceHanSansSC-Regular;
    color:rgba(255,255,255,1);
  }
  >span:nth-child(3){
    position: absolute;
    left: 130px;
    top: 115px;
    font-size:14px;
    font:14px/14px Source Han Sans SC;
    color:rgba(255,255,255,0.3);
  }
}
</style>
