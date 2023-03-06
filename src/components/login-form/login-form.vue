<template>
  <i-form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <i-form-item prop="accountName">
      <i-input v-model="form.accountName" placeholder="请输入用户名">
        <span slot="prepend">
          <i-icon :size="16" type="ios-person-outline"></i-icon>
        </span>
      </i-input>
    </i-form-item>
    <i-form-item prop="password">
      <i-input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <i-icon :size="14" type="ios-unlock-outline"></i-icon>
        </span>
      </i-input>
    </i-form-item>
    <i-form-item>
      <Border>
        <i-button @click="handleSubmit" type="primary">登录</i-button>
      </Border>
    </i-form-item>
  </i-form>
</template>
<script>
import Border from '@/components/border/border.vue';
export default {
  name: 'LoginForm',
  components: {
    Border
  },
  props: {
    accountNameRules: {
      type: Array,
      default: () => {
        return [
          {
            required: true,
            message: '用户名长度应在1~10位之间',
            min: 1,
            max: 10,
            trigger: 'blur'
          }
        ];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }];
      }
    }
  },
  data () {
    return {
      form: {
        accountName: '',
        password: ''
      }
    };
  },
  computed: {
    rules () {
      return {
        accountName: this.accountNameRules,
        password: this.passwordRules
      };
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', {
            accountName: this.form.accountName,
            password: this.form.password
          });
        }
      });
    }
  }
};
</script>
