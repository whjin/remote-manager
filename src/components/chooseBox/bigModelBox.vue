<template>
  <div class="bigModelBox" :style="{width:width,height:height}"></div>

</template>

<script>
export default {
  name: 'bigModelBox',
  props: {
    width: {
      type: String,
      required: false,
      default: '100px'
    },
    height: {
      type: String,
      required: false,
      default: '100px'
    }
  }
};
</script>

<style lang="less">
.bigModelBox{
  background:url(../../assets/images/whiteTheme/chooseBox/bigModelBdLT.png) 0 0 no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdTC.png) center 0 no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdRT.png) 100% 0 no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdLB.png) 0 100% no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdRB.png) 100% 100% no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdLC.png) 0 center no-repeat,
  url(../../assets/images/whiteTheme/chooseBox/bigModelBdRC.png) 100% center no-repeat;
  /*background:linear-gradient(135deg, transparent 15px, #346CEA 0) top left no-repeat,*/
  /*linear-gradient(-135deg, transparent 15px, #346CEA 0) top right no-repeat,*/
  /*linear-gradient(-45deg, transparent 15px, #346CEA 0) bottom right no-repeat,*/
  /*linear-gradient(45deg, transparent 15px, #346CEA 0) bottom left no-repeat;*/
  /*background-size: 50% 50%;*/
}
</style>
