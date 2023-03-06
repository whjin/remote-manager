<template>
  <div class="cascaderNew" :class="{'modifyStyle':modify2}">
    <cascader :disabled="disabled" v-model="newValue" :data="data" :load-data="loadData" :render-format="format" not-found-text="异常：无法获取数据，请稍后再试" :placeholder="modify2 ? modify2 : '请选择'" change-on-select filterable :searchLastValueParent="searchLastValueParent" @searchLastValueEnable="searchLastValueEnable" :searchBoxDataUrl="searchBoxDataUrl" :submitClear="submitClear" :typeCode="typeCode" @on-visible-change="changeStatus" @on-change="changeLevel">
    </cascader>
  </div>
</template>
<script>
import cascader from '_c/select-box/cascader';
export default {
  data () {
    return {
      newValue: [],
      data: [],
      type: 0,
      loadType: true,
      modify2: this.modify
    };
  },
  components: {
    cascader
  },
  props: {
    // 第一级节点的内容
    resFirstLevel: {
      type: Array,
      required: true
    },
    // 子级返回数据
    resChild: {
      type: Array,
      required: false,
      default: () => { return []; }
    },
    modify: {
      type: String,
      required: false,
      default: ''
    },
    idx: {
      type: Number,
      required: true
    },
    searchLastValueParent: {
      type: Object,
      required: true
    },
    searchBoxDataUrl: {
      type: Function,
      required: true
    },
    submitClear: {
      type: Boolean,
      required: false
    },
    typeCode: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    format (labels, selectedData) {
      if (selectedData.length !== 0) {
        return selectedData[selectedData.length - 1].label;
      }
    },
    changeLevel (value, dataList) {
      // 从最大盒子开始寻找元素，避免冲突
      let bigBox = document.getElementsByClassName('cascaderNew')[this.idx];
      // 切换级数时，把该级数前面的盒子全部隐藏
      let optionList = bigBox.getElementsByClassName('ivu-cascader-menu');
      for (let i = 0; i < optionList.length; i++) {
        optionList[i].style.display = 'none';
      }
      this.newValue = dataList;
      if (this.loadType) {
        this.$emit('itemValue', this.newValue[this.newValue.length - 1] ? this.newValue[this.newValue.length - 1] : '');
      } else {
        this.loadType = true;
      }
      this.$emit('extChange', value, dataList);
    },
    changeStatus () {
      // 从最大盒子开始寻找元素，避免冲突
      let bigBox = document.getElementsByClassName('cascaderNew')[this.idx];
      let optionList = bigBox.getElementsByClassName('ivu-cascader-menu');
      // 除第一次点击以外请求数据
      if (this.data.length !== 0) {
        if (this.resChild.length !== 0) {
          this.data = this.resFirstLevel;
        }
        // 点击到哪一级哪一级就显示
        optionList[optionList.length - 1].style.display = 'block';
      } else {
        this.data = this.resFirstLevel;
      }
    },
    loadData (item, callback, item2) {
      this.modify2 = '';
      // 当搜索，且是最后一级的数据时，把该数据传过去
      if (item2) {
        this.$emit('searchLastValue', item2);
      }
      this.$emit('itemValue', item || '');
      this.loadType = false;
      item.loading = true;
      let that = this;
      setTimeout(() => {
        item.children = that.resChild;
        item.loading = false;
        callback();
      }, 1000);
    },
    searchLastValueEnable (enable, el) {
      this.$emit('searchLastValueEnable', enable, el);
    }
  },
  watch: {
    modify (val) {
      this.modify2 = val;
    }
  }
};
</script>
<style lang="less">
@bigBoxWidth: 330px;
@bigBoxHeight: 232px;
@btnHeight: 32px;
.cascaderNew {
  position: relative;
  display: inline-block;
  .ivu-cascader {
    .ivu-cascader-not-found-tip {
      border: 1px solid #ff6c00;
      background-color: #ffd7be;
      color: #ff7362;
    }
    .ivu-select-dropdown {
      border-radius: 0;
      width: @bigBoxWidth;
      height: @bigBoxHeight;
      max-height: unset;
      box-shadow: none;
      overflow: hidden;
      > div:nth-child(2) {
        height: @bigBoxHeight - @btnHeight * 2;
        > div {
          height: 100%;
          padding: 0;
          > ul {
            height: 100%;
          }
        }
      }
    }
    .ivu-cascader-menu {
      padding: 0 !important;
      width: @bigBoxWidth;
      height: @bigBoxHeight - @btnHeight * 2;
      overflow: auto;
      .ivu-cascader-menu-item {
        padding: 0 !important;
      }
    }
    .ivu-select-item {
      color: #000;
      padding: 0;
    }
    .ivu-icon-ios-arrow-forward {
      display: none;
    }
    .btnBox,
    .btn {
      text-align: center;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      line-height: 30px;
      background-color: #dcdee2;
      color: #515a6e;
      cursor: unset;
      height: @btnHeight;
      width: @bigBoxWidth;
      > span {
        display: inline-block;
      }
      > span:nth-child(1) {
        border-right: 1px solid #ccc;
      }
    }
    .btnBox:nth-child(1) {
      > span:nth-child(1) {
        width: @bigBoxWidth / 3;
      }
      > span:nth-child(2) {
        width: 2 * @bigBoxWidth / 3;
        border-right: 1px solid #ccc;
      }
    }
    .btnBox:nth-child(3) {
      > span:nth-child(1) {
        cursor: pointer;
        width: 2 * @bigBoxWidth / 3;
      }
      > span:nth-child(2) {
        cursor: pointer;
        width: @bigBoxWidth / 3;
        border-right: 1px solid #ccc;
      }
    }
    // 避免内容清空时，底下的按钮组合移到上面去
    .btnBox:nth-child(3) {
      position: absolute;
      bottom: 0;
    }
    .codeBox,
    .labelBox {
      display: inline-block;
      height: 32px;
      padding-left: 10px;
      line-height: 32px;
      vertical-align: top;
    }
    .codeBox {
      width: @bigBoxWidth / 3;
      border-right: 1px solid #ccc;
    }
  }
}
// 级联下拉框样式
.cascaderNew {
  .ivu-cascader-label {
    line-height: 40px;
    padding: 0 10px;
  }
  color: rgba(255, 255, 255, 0.85);
  .ivu-select-dropdown {
    background: rgb(7, 22, 47);
    .ivu-cascader-menu-item,
    .ivu-select-item {
      color: rgba(255, 255, 255, 1);
      &:hover {
        background-color: unset;
      }
      .codeBox {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: 1px solid rgba(0, 122, 255, 0.3);
      }
    }
    .ivu-cascader-menu-item-active {
      background: unset;
      color: #2d8cf0;
    }
    .btnBox {
      background-color: rgba(0, 122, 255, 0.6);
      color: rgba(255, 255, 255, 1);
      span:nth-child(1) {
        border-right: 1px solid rgba(0, 122, 255, 0.3);
      }
      &:nth-child(1) {
        border-bottom: 1px solid rgba(0, 122, 255, 0.3);
        border-top: 0 none;
      }
      &:nth-child(3) {
        border-top: 1px solid rgba(0, 122, 255, 0.3);
        border-bottom: 0 none;
      }
    }
  }
}
</style>
