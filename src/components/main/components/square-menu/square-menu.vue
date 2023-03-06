<template>
    <div>
      <div v-for="(item,index) in list" class="square" :key="index">
        <common-icon :type="item.iconType" :size="32" color="white"/>
        <p>{{item.name}}</p>
      </div>
    </div>
</template>

<script>
import CommonIcon from '_c/common-icon';

export default {
  name: 'square-menu',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      require: true
    }
  }
};
</script>

<style scoped lang="less">
.square{
  width: 90px;
  height: 90px;
  background-color: #B5C8FF;
  text-align: center;
  margin-top:15px;
  vertical-align: middle;
  padding-top: 5px;
  p{
    font-size: 16px;
    line-height: 14px;
    color: white;
  }
}
</style>
