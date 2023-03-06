<template>
  <div class="chooseSysBox" @click="openWindow(path)">
    <img :src="require('../../assets/images/chooseBox/'+ this.imgName +'.png')">
    <p>{{title}}</p>
  </div>
</template>

<script>
import config from '@/config';
export default {
  name: 'chooseSysBox',
  props: {
    title: {
      type: String,
      required: true
    },
    imgName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    openWindow (path) {
      // 如果路径以http开头,则直接在页面跳转
      if (path.startsWith('http')) {
        window.open(path);
      } else {
        window.open(config.superVersionBaseURL + path);
      }
    }
  }
};
</script>

<style lang="less">
  .chooseSysBox{
    display: inline-block;
    background: url(../../assets/images/blackTheme/chooseBox/sysBoxBd.png) no-repeat 31px 31px;
    background-size:calc(~"100% - 72px") calc(~"100% - 141px");
    width:375px;
    height:430px;
    position: relative;
    cursor:pointer;
    &:hover{
      background: url(../../assets/images/blackTheme/chooseBox/sysBoxBdAct.png) no-repeat -5px -5px;
      background-size:100% calc(~"100% - 69px");
    }
    >img{
      position: absolute;
      left:49%;
      /*top:calc(~"50% - 20px");*/
      top:calc(~"50% - 35px");
      transform:translate(-50%,-50%);
      /*width:150px;*/
      /*height:150px;*/
      width:258px;
      height:258px;
    }
    >p{
      position:absolute;
      /*bottom:18px;*/
      bottom:31px;
      left:50%;
      transform:translateX(-58%);
      /*font: bold 22px/22px PangMenZhengDao;*/
      font: bold 38px/38px PangMenZhengDao;
      color:rgba(55,108,232,1);
    }
  }
</style>
