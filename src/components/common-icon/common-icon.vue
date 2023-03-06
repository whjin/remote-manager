<template>
  <!--动态组件的使用示例-->
  <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize"/>
</template>

<script>
/**
  * 如果i-view的内置图标不能满足需求的话 可以通过iconfont来支持自定义图标
  * 1. 图标网址： https://www.iconfont.cn/  将图标添加至项目 并通过Font Class的方式将图标下载至本地
  * 2. 解压后打开文件夹 对比 ./src/assets/icons文件夹内文件内容并进行替换
  * 3. 使用时只需要添加iconfont中的icon-后面的名字即可并在之前加上个_
  *     使用方式参见 Home.vue文件中的infoData里的icon方式
  *     ps: iconfont.css的图标里class名字就是图标名 支持在iconfont中自定义
  * */
import Icons from '_c/common-icon/icons';
export default {
  name: 'CommonIcon',
  components: { Icons },
  props: {
    type: {
      type: String,
      required: true
    },
    color: String,
    size: Number
  },
  computed: {
    iconType () {
      return this.type.indexOf('_') == 0 ? 'Icons' : 'Icon';
    },
    iconName () {
      return this.iconType == 'Icons' ? this.getCustomIconName(this.type) : this.type;
    },
    iconSize () {
      return this.size || (this.iconType == 'Icons' ? 12 : undefined);
    },
    iconColor () {
      return this.color || '';
    }
  },
  methods: {
    getCustomIconName (iconName) {
      return iconName.slice(1);
    }
  }
};
</script>

<style>

</style>
