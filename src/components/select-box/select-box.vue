<template>
  <!--
    idx：Number  该页面的第几个该组件，用于区分找节点  必须
    searchBoxDataUrl：Function  请求的接口函数，用于搜索  必须
    resFirstLevel：Array  第一级的数据  必须
    resChild：Array  异步加载的子集数据  非必须
    submitClear Boolean   当提交的时候需要清空原有数据时，需要改变此值，则触发清空函数 非必须
    searchLastValueParent: Object  搜索时，直接点击最后一级的数据时，需要请求该数据的父级数据  必须
    typeCode：String   请求字典的类型  非必须，默认为空
    @searchLastValueEnable：获取是否为搜索且直接点击最后一级的数据的状态，若是，则请求该数据的父级数据
    @searchLastValue：获取搜索且直接点击最后一级的数据时的值
    @itemValue：获取当前点击的数据
    modify：修改数据时，modify显示初始修改的数据  非必须
  -->
  <!-- bug: 搜索的时候会传2次值、修改的值是placeholder、搜索直接选择最后一级的时候没有高亮，且要1s后重新打开下拉框才能正常显示 -->
  <!-- 进度：改后端 -->
  <select-box :idx="idx"
              :searchBoxDataUrl="searchBoxDataUrl"
              :resFirstLevel="resFirstLevel"
              :resChild="resChild"
              :submitClear="submitClear"
              :searchLastValueParent="resSearchLast"
              :modify="modifyThis"
              :typeCode="typeCode"
              :disabled="isDisabled"
              @searchLastValueEnable="searchLastValueEnable"
              @searchLastValue="searchLastValue"
              @itemValue="itemValue($event)">
  </select-box>
</template>
<script>
import selectBox from '_c/select-box/cascaderSelect.vue';
export default {
  name: 'schedule',
  components: {
    selectBox
  },
  props: {
    url: {
      type: Function,
      required: true
    },
    submitClear: {
      type: Boolean,
      required: false
    },
    idx: {
      type: Number,
      required: true
    },
    modify: {
      type: String,
      required: false
    },
    typeCode: {
      type: String,
      required: false,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      // 存放当前的值
      value: {},
      // 第一级的数据
      resFirstLevel: [],
      // 子级的数据
      resChild: [],
      // 模糊搜索需要把请求函数传过去，模糊搜索的模式必须为4，具体参照陈鼎的接口
      searchBoxDataUrl: this.url,
      // 搜索时，存放搜索且直接点击最后一级的数据时的值
      searchLastVal: {},
      // 搜索时，直接点击最后一级的数据时，存放当前数据的父级数据
      resSearchLast: {},
      modifyThis: this.modify,
    };
  },
  mounted () {
    this.searchBoxData(1, '', this.typeCode);
  },
  methods: {
    /* 获取第一级的数据 */
    searchBoxData (model, value, typeCode) {
      this.searchBoxDataUrl(model, value, typeCode).then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
          this.$set(this.resFirstLevel, i, res.data.data[i]);
        }
      });
    },
    /* 获取子集数据 */
    itemValue (el) {
      if (el) {
        if (this.searchLastVal.label) {
          this.value = this.searchLastVal;
          this.searchLastVal = {};
          this.$emit('val', this.value);
        } else {
          this.value = el;
          this.$emit('val', this.value);
        }
        this.searchBoxDataUrl(2, el.code, this.typeCode).then(res => {
          this.resChild = res.data.data;
        });
      } else {
        this.value = {};
        this.$emit('val', this.value);
      }
    },
    /* 搜索时，直接点击最后一级的数据时，需要请求该数据的父级数据 */
    searchLastValueEnable (enable, el) {
      // 只有1级
      if (enable && JSON.stringify(el).length !== 2) {
        if (el.parent == '-1') {
          this.resSearchLast = el;
        } else {
          this.searchBoxDataUrl(3, el.parent, this.typeCode).then(res => {
            this.resSearchLast = res.data.data[0];
          });
        }
      } else {
        this.resSearchLast = {};
      }
    },
    // 获取最后一级数据的值
    searchLastValue (val) {
      this.searchLastVal = val;
    }
  },
  watch: {
    modify (val) {
      this.modifyThis = val;
    }
  }
};
</script>
