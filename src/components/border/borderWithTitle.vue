<template>
  <div class="border">
    <div class="title">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'border',
  props: {
    title: String,
    require: true
  }
};
</script>

<style scoped>
  .border{
    width:100%;
    height:100%;
    border:1px solid rgba(0,122,255,1);
    border-radius:5px;
    background:rgba(0,122,255,0.08);
    box-shadow:0px 0px 11px 1px rgb(0,122,255) inset;
    background:url(../../assets/images/common/bdLeftTop.png) no-repeat 0% 0%,url(../../assets/images/common/bdRightTop.png) no-repeat 100% 0%,url(../../assets/images/common/bdLeftBottom.png) no-repeat 0% 100%,url(../../assets/images/common/bdRightBottom.png) no-repeat 100% 100%;
  }
  .title{
    box-sizing:border-box;
    width:100%;
    height:60px;
    border-bottom:1px solid rgba(0,122,255,1);
    padding: 16px 0 0 50px;
    background:url(../../assets/images/common/titleIcon.png) no-repeat 24px 22px;
    font-size: 20px;
    font-weight: 600;
    color:#fff;
  }
</style>
