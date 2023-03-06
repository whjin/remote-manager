<template>
  <div class="tags-nav" :style="{width:'calc(100% - 840px)',display:'inline-block'}">
    <div
      :class="['tags-item',{'item-active':isCurrentTag(item)}]"
      v-for="(item, index) in list"
      :key="`tag-nav-${index}`"
      :data-route-item="item"
      :name="item.name"
    >
      <span @click="handleClick(item)" style="height: 100%;display: inline-block;">{{ showTitleInside(item) }}</span>
      <common-icon v-if="item.name !== homeName" type="md-close"  class="tags-icon-delete" @click.native="handleClose(item)" />
    </div>
  </div>
</template>

<script>
import { showTitle, routeEqual } from '@/libs/util';
import beforeClose from '@/router/before-close';
import CommonIcon from '../../../common-icon/common-icon';
export default {
  components: { CommonIcon },
  name: 'TagsNav',
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return [];
      }
    },
    homeName: {
      type: String,
      require: true
    }
  },
  data () {
    return {};
  },
  computed: {
    currentRouteObj () {
      const { name, params, query } = this.value;
      return { name, params, query };
    }
  },
  methods: {
    handleClose (current) {
      if (current.meta && current.meta.beforeCloseName && current.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[current.meta.beforeCloseName]).then(close => {
          if (close) {
            this.close(current);
          }
        });
      } else {
        this.close(current);
      }
    },
    close (route) {
      let res = this.list.filter(item => !routeEqual(route, item));
      this.$emit('on-close', res, undefined, route);
    },
    handleClick (item) {
      this.$emit('input', item);
    },
    showTitleInside (item) {
      return showTitle(item, this);
    },
    isCurrentTag (item) {
      return routeEqual(this.currentRouteObj, item);
    }
  }
};
</script>

<style lang="less">
  .tags-nav{
    height: 85px;
    overflow-x: auto;
    white-space: nowrap;
    vertical-align: top;
    .tags-item{
      display: inline-block;
      margin: 0 0 0 10px;
      padding: 0 14px;
      border-radius: 6px 6px 2px 2px;
      font-size: 16px;
      vertical-align: middle;
      opacity: 1;
      overflow: hidden;
      cursor: pointer;
      line-height: 32px;
      height: 32px;
      letter-spacing:2px;
      background-color: #5885AB;
      color: #fff;
      position: relative;
      top: 7px;
    }
    .item-active{
      background-color: rgba(4,132,255,0.5);
      color: #fff;
    }

    .tags-icon-delete{
      display: inline-block;
      font-size: 12px;
      -webkit-transform: scale(1.42857143) rotate(0);
      transform: scale(1.42857143) rotate(0);
      cursor: pointer;
      margin-left: 4px;
      opacity: .66;
      position: relative;
    }
  }

</style>
