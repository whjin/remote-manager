<template>
  <div class="login">
    <div class="login-con">
      <Card title="远程提讯会见平台" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
    <div class="license" @click="licenseModal=true">授权</div>
    <!-- 导入授权 -->
    <i-modal v-model="licenseModal" width="560" @on-cancel="cancelModal" class="license-Modal">
      <p slot="header">
        <span class="title">导入授权</span>
      </p>
      <div style="height: 300px;text-align: center;">
        <i-upload style="margin-bottom: 15px;" action name="files" :format="licenseFormat" accept=".bin" :before-upload="uploadHandler">
          <i-button type="primary">导入授权文件</i-button>
        </i-upload>
        <i-input type="textarea" class="license-input" v-model="license" placeholder="授权码" disabled></i-input>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button ghost class="searchButton" @click="importLicense">确认</Button>
        <Button ghost class="searchButton" @click="cancelModal">取消</Button>
      </div>
    </i-modal>
    <!-- 授权管理 -->
    <i-modal v-model="loginModal" width="480" @on-cancel="cancelLoginModal">
      <p slot="header">
        <span class="title">授权管理</span>
      </p>
      <div class="licenseText" style="height: 45px;">
        <i-form>
          <i-row>
            <i-form-item label="授权信息:" :label-width="80">
              <i-input v-model="licenseInfo.licenseTip" class="license-input-login" disabled></i-input>
            </i-form-item>
          </i-row>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button ghost class="searchButton" @click="loginConfirm">确认</Button>
        <Button ghost class="searchButton" @click="cancelLoginModal">取消</Button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import LoginForm from '_c/login-form';
import { mapActions } from 'vuex';
import Cookies from 'js-cookie';
import {
  getLicense,
  saveLicense,
} from '@/api/login';

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loginInfo: {},
      licenseModal: false,
      license: '',
      loginModal: false,
      licenseInfo: {},
      licenseFormat: ['bin'],
    };
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit (loginInfo) {
      this.loginInfo = loginInfo;
      getLicense().then(response => {
        if (response.data.state.code === 200) {
          this.licenseInfo = response.data.data;
          if (Reflect.has(this.licenseInfo, 'licenseTip')) {
            this.loginModal = true;
          } else {
            this.loginConfirm();
          }
        }
      });
    },
    loginConfirm () {
      this.handleLogin(this.loginInfo).then(resp => {
        if (resp.data.state.code === 200) {
          this.getUserInfo().then(res => {
            Cookies.set('lock', false);
            this.$router.push('/home');
          });
        }
      });
    },
    // 导入授权
    importLicense () {
      if (this.license === "") {
        this.$Message.warning('请输入授权信息');
        return;
      }
      let flag = this.license.startsWith("{") && this.license.endsWith("}");
      if (flag) {
        let params = JSON.parse(this.license);
        saveLicense(params).then(res => {
          if (res.data.state.code === 200) {
            this.$Message.success('授权导入成功');
            this.licenseModal = false;
          }
        });
      } else {
        this.$Message.warning('授权文件为JSON格式');
      }
    },
    // 上传授权文件
    uploadHandler (file) {
      const reader = new FileReader();
      reader.readAsText(file, "urtf-8");
      reader.onload = (e) => {
        this.license = e.target.result;
      };
    },
    cancelModal () {
      this.licenseModal = false;
      this.license = "";
    },
    cancelLoginModal () {
      this.loginModal = false;
    }
  }
};
</script>

<style lang="less">
@import './login.less';
.license-input {
  .ivu-input {
    width: 386px !important;
    height: 260px !important;
    font-size: 15px;
    font-weight: 500;
    resize: none;
    overflow: auto;
    line-height: 2;
    text-align: left;
    color: #35fffa !important;
    border-radius: 4px;
  }
}
.license-input-login {
  .ivu-input {
    width: 320px !important;
    height: 40px !important;
    color: #35fffa !important;
    font-size: 15px;
    font-weight: 500;
    border-radius: 4px;
  }
}
</style>
