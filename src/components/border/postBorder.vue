<template>
<!--  未完成-->
  <div class="postBorder" :style="{background: 'url('+imgType[0].url+')'}">
  </div>
</template>

<script>
import whiteSmall from '@/assets/images/whiteTheme/post/smallBd.png';
import whiteCenter from '@/assets/images/whiteTheme/post/centerBd.png';
import whiteBig from '@/assets/images/whiteTheme/post/bigBd.png';
import blackSmall from '@/assets/images/blackTheme/post/smallBd.png';
import blackCenter from '@/assets/images/blackTheme/post/centerBd.png';
import blackBig from '@/assets/images/blackTheme/post/bigBd.png';
export default {
  name: 'postBorder',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      imgType: [
        { url: require('@/assets/images/whiteTheme/post/smallBd.png') },
        { url: require('@/assets/images/whiteTheme/post/centerBd.png') },
        { url: require('@/assets/images/whiteTheme/post/bigBd.png') },
        { url: require('@/assets/images/blackTheme/post/smallBd.png') },
        { url: require('@/assets/images/blackTheme/post/centerBd.png') },
        { url: require('@/assets/images/blackTheme/post/bigBd.png') }
      ]
    };
  },
  computed: {
    theme () {
      return this.$store.state.user.theme;
    }
  },
  mounted () {
    this.judgeTheme(this.theme);
  },
  watch: {
    theme (val) {
      this.judgeTheme(val);
    }
  },
  methods: {
    judgeTheme (val) {
      if (val == 'blackTheme') {
        if (type == 'small') {
          this.imgType = blackSmall;
        } else if (type == 'center') {
          this.imgType = blackCenter;
        } else if (type == 'big') {
          this.imgType = blackBig;
        }
      } else if (val == 'whiteTheme') {
        if (type == 'small') {
          this.imgType = whiteSmall;
        } else if (type == 'center') {
          this.imgType = whiteCenter;
        } else if (type == 'big') {
          this.imgType = whiteBig;
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
