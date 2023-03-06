<template>
  <div>
    <Button size="large" type="text" @click="backHome">返回首页</Button>
    <Button size="large" type="text" @click="backPrev">返回上一页</Button>
  </div>
</template>

<script>
import './error.less';
export default {
  name: 'backBtnGroup',
  data () {
    return {
      timer: null
    };
  },
  methods: {
    backHome () {
      this.$router.replace({
        name: this.$config.homeName
      });
    },
    backPrev () {
      this.$router.go(-1);
    }
  }
};
</script>
