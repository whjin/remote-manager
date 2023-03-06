<template>
  <div class="bgMain">
    <div class="header-con">
      <img src="../../assets/images/common/bigTitle.png" />
      <tags-nav class="main-header-tags" :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" homeName="home" />
      <div class="nowDate">
        <div>
          <span>{{time2}}</span>
          <span>{{time3}}</span>
        </div>
        <div>{{time1}}</div>
      </div>
      <user :user-avator="userAvator" />
      <div class="logout" @click="logoutSystem">
        <common-icon type="md-power" :size="35" color="white" />
        <span>退出</span>
      </div>
    </div>
    <div class="message" style="height:44px;">
      <i class="iconfont iconICON-8" @click="messageDisplay($event)" />
      <div style="display: none;">
        <p>
          <span>系统消息{{ tipsInfoListLength > 0 ? '（' + tipsInfoListLength + '）' : '' }}</span>
          <span @click="showMoreTips">更多>></span>
        </p>
        <ul type="none">
          <li v-for="(item, idx) in tipsInfoList" :key="idx">
            <div>
              <span>{{ item.message }}</span>
            </div>
            <div>
              <span>{{ item.gmtCreate }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <router-view />
    <i-modal v-model="tipsInfoModal" width="1300px">
      <p slot="header">
        <span class="title">系统消息</span>
      </p>
      <div class="tipsInfo" style="height: 500px;overflow: auto;">
        <i-form ref="tipsInfoModel" :label-width="100" label-position="right">
          <i-row>
            <span class="searchItemText">创建日期</span>
            <i-date-picker v-model="searchDate" type="date" format="yyyy-MM-dd" placeholder="请选择创建时间"></i-date-picker>
            <i-button ghost class="searchButton" style="display: inline-block;margin-left: 100px" @click="searchTipsInfoByCon">查询</i-button>
          </i-row>
          <i-table border ref="table" :columns="tipsColumns" :data="tipsInfoAllList" style="height:300px"></i-table>
          <div class="tablePage" style="position: relative">
            <i-page style="text-align: right" :current="tipsInfoSearchCon.pageParam.pageIndex" :total="tipsInfoListLength" :page-size="tipsInfoSearchCon.pageParam.pageSize" :page-size-opts="tipsPageSizeOpts" show-total @on-change="changeTipsPageIndex" @on-page-size-change="changeTipsPageSize" show-elevator show-sizer></i-page>
          </div>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="closeMoreTips">关闭</Button>
      </div>
    </i-modal>
  </div>
</template>
<script>
import axios from 'axios';
import './main.less';
import $ from 'jquery';
import { mapActions } from 'vuex';
import User from '_c/main/components/user';
import CommonIcon from "_c/common-icon";
import { getNowDate, formatDateToStr } from '@/libs/tools';
import TagsNav from '_c/main/components/tags-nav';
import {
  getNextRoute,
  routeEqual,
  getRouteTitleHandled,
  routeHasExist,
  getNewTagList,
  getToken
} from '@/libs/util';
import router from '@/router';
import config from '@/config';
export const queryTipsInfo = data => {
  return axios.request({
    url: '/inquiry/meetVideoMessage/queryTipsInfoList',
    data: data,
    method: 'post'
  });
};
export default {
  name: 'bgMain',
  components: {
    User,
    CommonIcon,
    TagsNav
  },
  computed: {
    userAvator () {
      return this.$store.state.user.avatorImgPath;
    }
  },
  data () {
    return {
      time1: '',
      time2: '',
      time3: '',
      timer: '',
      tagNavList: [
        {
          path: '/home',
          name: 'home',
          meta: {
            hideInMenu: true,
            title: '首页'
          }
        }
      ],
      tipsInfoList: [],
      tipsInfoAllList: [],
      path:
        'ws://' +
        config.websocket.ip +
        ':' +
        config.websocket.port +
        '/roomStatus',
      websocket: '',
      tipsInfoSearchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          searchDate: ''
        }
      },
      tipsInfoListLength: 0,
      tipsPageSizeOpts: [10, 15, 20],
      tipsInfoModal: false,
      tipsColumns: [
        {
          title: '单位',
          key: 'unit',
          align: 'center'
        },
        {
          title: '系统消息',
          key: 'message',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center'
        }
      ],
      searchDate: ''
    };
  },
  beforeDestroy () {
    clearInterval(this.timer);
  },
  destroyed () {
    this.websocket.close();
  },
  created () {
    this.websocketInit();
    this.queryTipsInfo();
    this.time = setInterval(() => {
      this.nowTime();
    }, 1000);
    this.initMenuAndPermission();
  },
  methods: {
    ...mapActions(['handleLogOut']),
    queryTipsInfo () {
      queryTipsInfo(this.tipsInfoSearchCon).then(res => {
        if (res.data.page.total > 2) {
          this.tipsInfoList = [];
          this.tipsInfoList.push(res.data.data[0]);
          this.tipsInfoList.push(res.data.data[1]);
        } else {
          this.tipsInfoList = res.data.data;
        }
        this.tipsInfoListLength = res.data.page.total;
      });
    },
    websocketInit () {
      if (typeof WebSocket === 'undefined') {
        this.$Message.error(
          '您的浏览器不支持WebSocket，无法实时接收到信息。请更换浏览器！'
        );
      } else {
        this.websocket = new WebSocket(this.path);
        this.websocket.onopen = this.websocketOpen;
        this.websocket.onmessage = this.websocketOnMessage;
        this.websocket.error = this.websocketError;
      }
    },
    websocketOpen () {
      console.log('websocket已连接:' + '   ' + this.path);
      this.websocket.send(getToken());
    },
    websocketError () {
      this.websocketInit();
    },
    websocketOnMessage () {
      this.queryTipsInfo();
    },
    searchTipsInfoByCon () {
      this.tipsInfoSearchCon.pageParam.pageIndex = 1;
      this.tipsInfoSearchCon.data.searchDate = formatDateToStr(this.searchDate);
      queryTipsInfo(this.tipsInfoSearchCon).then(res => {
        this.tipsInfoAllList = res.data.data;
        this.tipsInfoListLength = res.data.page.total;
        this.tipsInfoSearchCon.data.searchDate = '';
      });
    },
    changeTipsPageIndex (index) {
      this.tipsInfoSearchCon.pageParam.pageIndex = index;
      this.searchTipsByPage();
    },
    changeTipsPageSize (pageSize) {
      this.tipsInfoSearchCon.pageParam.pageSize = pageSize;
      this.searchTipsByPage();
    },
    searchTipsByPage () {
      this.tipsInfoSearchCon.data.searchDate = formatDateToStr(this.searchDate);
      queryTipsInfo(this.tipsInfoSearchCon).then(res => {
        this.tipsInfoAllList = res.data.data;
        this.tipsInfoListLength = res.data.page.total;
        this.tipsInfoSearchCon.data.searchDate = '';
      });
    },
    showMoreTips () {
      this.searchTipsInfoByCon();
      this.$nextTick(() => (this.tipsInfoModal = true));
    },
    closeMoreTips () {
      this.$refs.tipsInfoModel.resetFields();
      this.$nextTick(() => (this.tipsInfoModal = false));
    },
    messageDisplay (el) {
      let next = el.target.nextElementSibling;
      let parent = el.target.parentElement;
      if (next.style.display == 'block') {
        el.target.style.transform = 'translateX(-50%) rotate(0deg)';
        next.style.display = 'none';
        parent.style.height = '44px';
        parent.style.width = '38px';
      } else {
        el.target.style.transform = 'translateX(-50%) rotate(180deg)';
        next.style.display = 'block';
        parent.style.height = '280px';
        parent.style.width = '450px';
      }
    },
    nowTime () {
      this.time1 =
        getNowDate().year + '-' + getNowDate().month + '-' + getNowDate().day;
      if (getNowDate().date == 0) {
        this.time2 = '星期日';
      } else {
        this.time2 = '星期' + getNowDate().date;
      }
      this.time3 =
        getNowDate().hour +
        ':' +
        getNowDate().minutes +
        ':' +
        getNowDate().second;
    },
    initMenuAndPermission () {
      const { name, params, query, meta } = this.$route;
      this.addTag({
        route: { name, params, query, meta },
        type: 'push'
      });
    },
    addTag ({ route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route);
      if (!routeHasExist(this.tagNavList, router)) {
        if (type == 'push') this.tagNavList.push(router);
        else {
          if (router.name == this.homeName) this.tagNavList.unshift(router);
          else this.tagNavList.splice(1, 0, router);
        }
      }
    },
    setTagNavList (list) {
      let tagList = [...list];
      let homeTagIndex = tagList.findIndex(item => item.name == this.homeName);
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      this.tagNavList = tagList;
    },
    closeTag (route) {
      let tag = this.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) {
        router.push({
          path: '/home',
          name: 'home',
          meta: {
            hideInMenu: true,
            title: '首页'
          }
        });
        return;
      }
      this.closePage(route);
    },
    closePage (route) {
      const nextRoute = getNextRoute(this.tagNavList, route);
      if (Object.keys(nextRoute).length == 0) {
        router.push({
          path: '/home',
          name: 'home',
          meta: {
            hideInMenu: true,
            title: '首页'
          }
        });
      }
      this.tagNavList = this.tagNavList.filter(item => {
        return !routeEqual(item, route);
      });
      router.push(nextRoute);
    },
    turnToPage (route) {
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleClick (item) {
      this.turnToPage(item);
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type == 'all') {
          this.turnToPage(this.homeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    logoutSystem () {
      this.handleLogOut().then(() => {
        localStorage.clear();
        this.$router.push({
          name: 'login'
        });
        let params = {
          key: 'EnvironmentExit'
        };
        $.ajax({
          type: "post",
          url: "http://127.0.0.1/EnvironmentExit",
          data: JSON.stringify(params),
          success: function () { },
          error: function () { },
        });
      });
    }
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  }
};
</script>
<style lang="less">
.message {
  padding: 20px;
  position: absolute;
  left: 0;
  bottom: 28px;
  width: 38px;
  height: 280px;
  background: rgba(4, 13, 52, 1);
  border: 2px solid rgba(82, 112, 169, 1);
  box-shadow: 0 0 22px 0 #5270a9 inset;
  z-index: 1;
  > i {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    cursor: pointer;
    color: #fff;
  }
  > div {
    height: 100%;
    > p {
      span:nth-child(1) {
        color: rgba(53, 255, 250, 1);
        font: bold 22px Microsoft YaHei;
      }
      span:nth-child(2) {
        float: right;
        color: rgba(53, 255, 250, 1);
        font: 18px/32px Microsoft YaHei;
        cursor: pointer;
      }
    }
    > ul {
      height: calc(~'100% - 20px');
      width: 100%;
      overflow: auto;
      > li {
        margin: 14px 0;
        border-bottom: 1px solid rgba(0, 111, 233, 0.48);
        > div:nth-child(1) {
          height: 40px;
          width: 100%;
          margin-bottom: 6px;
          span:nth-child(1) {
            color: rgba(255, 255, 255, 0.85);
            font: 16px/20px Microsoft YaHei;
            display: inline-block;
            width: calc(~'100% - 100px');
            vertical-align: top;
            float: left;
          }
          span:nth-child(2) {
            color: rgba(255, 255, 255, 1);
            font: 20px/32px Microsoft YaHei;
            display: inline-block;
            width: 60px;
            float: right;
          }
        }
        > div:nth-child(2) {
          color: rgba(53, 255, 250, 0.85);
          font: 16px/26px Microsoft YaHei;
          height: 40px;
          width: 100%;
          position: relative;
          span:nth-child(2) {
            float: right;
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
}
</style>
