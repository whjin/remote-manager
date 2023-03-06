<template>
  <i-button :type="type"
            :ghost="ghost"
            :shape="shape"
            :size="size"
            :loading="loading"
            :disabled="disabled"
            :html-type="htmlType"
            :icon="icon"
            :customIcon="customIcon"
            :to="to"
            :long="long"
            @click="handleClick"
  >{{label}}</i-button>
</template>

<script>
export default {
  name: 'NormalButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    ghost: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'default'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    htmlType: {
      type: String,
      default: 'button'
    },
    icon: {
      type: String,
      default: null
    },
    customIcon: {
      type: String,
      default: null
    },
    to: {
      type: String | Object,
      default: null
    },
    long: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Button'
    }
  },
  data () {
    return {

    };
  },
  methods: {
    handleClick: function () {
      this.$emit('click', {});
    }
  }
};
</script>

<style scoped>

</style>
