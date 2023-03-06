<template>
  <i-select v-model="currentValue" :placeholder="placeholder" v-on="$listeners" v-bind="$attrs">
    <i-option v-for="(item,index) in dictionaryList" :value="item.fieldValue" :key="index">{{item.fieldName}}</i-option>
  </i-select>
</template>

<script>
import { getDictionaryListByCode } from '@/api/login';
export default {
  name: 'dictionary-select',
  data () {
    return {
      dictionaryList: [],
      currentValue: this.checkValue
    };
  },
  props: {
    placeholder: {
      type: String
    },
    code: {
      type: String
    },
    checkValue: {
      type: String
    }
  },
  methods: {
    initList () {
      getDictionaryListByCode(this.code).then(res => {
        this.dictionaryList = res.data.data;
      });
    }
  },
  mounted () {
    this.initList();
  },
  watch: {
    'currentValue' (newValue) {
      this.$emit('update:checkValue', newValue);
    },
    'checkValue' (newValue) {
      this.currentValue = newValue;
    }
  }
};
</script>
