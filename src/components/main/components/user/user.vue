<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator" />
        <span v-html="userName" class="username"></span>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="license">
          <i class="iconfont iconICON-houtai-xiaoxizhongxin"></i>
          授权信息
        </DropdownItem>
        <DropdownItem name="changePassword">
          <i class="iconfont iconICON-houtai-xiugaimima"></i>
          修改密码
        </DropdownItem>
        <DropdownItem name="logout">
          <i class="iconfont iconICON-houtai-tuichudenglu"></i>
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!--修改密码弹出框-->
    <div class="change-password-dialog">
      <i-modal v-model="showTransferDialog" width="600px;">
        <p slot="header" style="color:#f60;">
          <span class="title">修改密码</span>
        </p>
        <div style="height:150px;">
          <i-form ref="User" :model="User" :label-width="140" :rules="ruleValidate">
            <i-form-item label="旧密码" prop="oldPassword">
              <i-input v-model="User.oldPassword" placeholder="请输入旧密码"></i-input>
            </i-form-item>
            <i-form-item label="新密码" prop="newPassword">
              <i-input v-model="User.newPassword" placeholder="请输入新密码"></i-input>
            </i-form-item>
          </i-form>
        </div>
        <div slot="footer">
          <i-button type="primary" class="confirmBtn" @click="handleSubmit('User')">提交</i-button>
          <i-button type="primary" class="cancelBtn" @click="handleTransferCancel">关闭</i-button>
        </div>
      </i-modal>
      <!-- 授权信息 -->
      <i-modal v-model="licenseModal" width="460" @on-cancel="cancelModal">
        <p slot="header">
          <span class="title">授权信息</span>
        </p>
        <div class="licenseText" style="height: 160px;">
          <i-form>
            <i-row>
              <i-form-item label="授权项目:" :label-width="120">
                <i-input v-model="licenseInfo.authorizedCustomers" class="license-input-info" disabled></i-input>
              </i-form-item>
            </i-row>
            <i-row>
              <i-form-item label="授权IP:" :label-width="120">
                <i-input v-model="licenseInfo.ip" class="license-input-info" disabled></i-input>
              </i-form-item>
            </i-row>
            <i-row>
              <i-form-item label="到期时间:" :label-width="120">
                <i-input v-model="licenseInfo.expirationTime" class="license-input-info" disabled></i-input>
              </i-form-item>
            </i-row>
          </i-form>
        </div>
        <div slot="footer" style="text-align: center;">
          <Button class="searchButton" @click="cancelModal">关闭</Button>
        </div>
      </i-modal>
    </div>
  </div>
</template>

<script>
import './user.less';
import { mapActions } from 'vuex';
import { updatePassword } from '@/api/bg-manage/user';
import axios from '@/libs/api.request';
import Cookies from 'js-cookie';
import md5 from 'js-md5';
import { dateFormat } from '@/libs/util';
import {
  getLicense,
} from '@/api/login';

export const switchTheme = theme => {
  return axios.request({
    url: '/sysmgr/sysUser/switchTheme',
    params: {
      theme: theme
    },
    method: 'get'
  });
};
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      licenseModal: false,
      licenseInfo: {},
      userName: this.$store.state.user.userName,
      User: {
        newPassword: '',
        oldPassword: '',
        id: this.$store.state.user.userId
      },
      showTransferDialog: false,
      ruleValidate: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    ...mapActions(['handleLogOut']),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        });
      });
    },
    license () {
      getLicense().then(res => {
        if (res.data.state.code === 200) {
          this.licenseInfo = res.data.data;
          this.licenseInfo.expirationTime = dateFormat("YYYY-MM-DD", new Date(this.licenseInfo.expirationTime));
          this.licenseModal = true;
        }
      });
    },
    cancelModal () {
      this.licenseModal = false;
    },
    message () {
      this.$router.push({
        name: 'message_page'
      });
    },
    changePassword () {
      this.showTransferDialog = true;
      this.User.newPassword = '';
      this.User.oldPassword = '';
    },
    handleSubmit (name) {
      let scope = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          scope.User.newPassword = md5(scope.User.newPassword);
          scope.User.oldPassword = md5(scope.User.oldPassword);
          updatePassword(scope.User).then(res => {
            if (res.data.state.code !== 5000) {
              this.$Message.success('修改用户成功!');
              this.showTransferDialog = false;
            }
          });
        }
      });
    },
    handleTransferCancel () {
      this.showTransferDialog = false;
    },
    handleClick (name) {
      switch (name) {
        case 'license': this.license();
          break;
        case 'message':
          this.message();
          break;
        case 'changePassword':
          this.changePassword();
          break;
        case 'lock':
          this.lock();
          break;
        case 'dataSync':
          this.$router.push({ path: '/dataSync' });
          break;
        case 'background':
          this.$router.push({ path: '/background' });
          break;
        case 'lawyerMeeting':
          this.$router.push({ path: '/' });
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    theme () {
      let theme = this.$store.state.user.theme;
      if (theme == 'blackTheme') {
        theme = 'whiteTheme';
      } else {
        theme = 'blackTheme';
      }
      this.$store.commit('changeTheme', theme);
      switchTheme(this.$store.state.user.theme).then(res => {
      });
    },
    lock () {
      Cookies.set('lock', 'true');
    }
  }
};
</script>

<style lang="less">
.license-input-info {
  .ivu-input {
    color: #35fffa !important;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>