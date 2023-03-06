<template>
  <div class="chooseModelBox">
    <div>
      <i-icon :type="icon"></i-icon>
    </div>
    <p>{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'chooseModelBox',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="less">
.chooseModelBox{
  display: inline-block;
  width:150px;
  height:100px;
  position:relative;
  padding:7px;
  background: url(../../assets/images/blackTheme/chooseBox/modelBoxBd.png) no-repeat;
  background-size:100% 100%;
  &:hover{
    background: url(../../assets/images/blackTheme/chooseBox/modelBoxBdAct.png) no-repeat;
    background-size:100% 100%;
    >div{
      background-color:rgba(0,0,0,0);
    }
    >p{
      color:rgba(0,0,0,1);
    }
  }
  >div{
    background-color:rgba(0,0,0,0);
  }
  >p{
    color:rgba(0,0,0,1);
  }
  >div{
    width:60px;
    height:60px;
    border-radius:50%;
    position: absolute;
    left:50%;
    transform: translateX(-50%);
  }
  >p{
    position:absolute;
    left:50%;
    transform: translateX(-50%);
    bottom:0;
    font:bold 16px/36px Microsoft YaHei;
  }
}
</style>
