<template>
  <div class="home">
    <div class="homeLeft">
      <div>
        <router-link :to="val.path" v-for="(val, idx) in navigationList" :key="idx">
          <span>{{val.title}}</span>
          <img :src="require('../../assets/images/home/'+val.imgName+'.png')" alt />
        </router-link>
        <a :href="val.path" v-for="(val, idx) in navigationList2" target="_blank" :key="'a'+idx">
          <span>{{val.title}}</span>
          <img :src="require('../../assets/images/home/'+val.imgName+'.png')" alt />
        </a>
      </div>
    </div>
    <div ref="homeRight" class="homeRight" style="display:none;">
      <div class="homeRightTop">
        <p>
          <span>我的案件</span>
          <router-link to="/case">
            <span>更多>></span>
          </router-link>
        </p>
        <i-table :columns="columns1" :data="data1" style="height:calc(100% - 50px)" />
      </div>
      <div class="homeRightBottom">
        <p>
          <span>我的预约</span>
          <router-link to="/appointment">
            <span>更多>></span>
          </router-link>
        </p>
        <i-table :columns="columns2" :data="data2" style="height:calc(100% - 50px)" />
      </div>
    </div>
    <div ref="homeRight2" class="homeRight2" style="display:none;">
      <div class="homeRightTop">
        <p>
          <span>审批列表</span>
          <router-link to="/audit">
            <span>更多>></span>
          </router-link>
        </p>
        <i-table :columns="columns3" :data="data3" style="height:calc(100% - 50px)" />
      </div>
      <div class="homeRightBottom">
        <p>
          <span>提讯消息</span>
          <router-link to="/query">
            <span>更多>></span>
          </router-link>
        </p>
        <i-table :columns="columns4" :data="data4" style="height:calc(100% - 50px)" />
      </div>
    </div>
  </div>
</template>
<script>
import { getMenuApi } from '@/api/login';
import { searchByCon } from '@/api/bg-manage/caseManage/caseManage';
import { searchByParams } from '@/api/bg-manage/appointment/manage';
import { loadTableData } from '@/api/bg-manage/table';
import { getDate } from '@/libs/tools';
export default {
  name: 'home',
  data () {
    return {
      navigationList: [],
      navigationList2: [],
      searchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          caseName: '',
          startDate: '',
          endDate: ''
        }
      },
      columns1: [
        {
          title: '案件名称',
          key: 'caseName'
        },
        {
          title: '提讯次数',
          key: 'hearingCount',
          align: 'center',
          width: 120,
          render: (h, params) => {
            let bgColor = 'rgba(53,255,250,1)';
            return h(
              'div',
              {
                style: {
                  color: bgColor
                }
              },
              params.row.hearingCount
            );
          }
        }
      ],
      data1: [],
      searchCon2: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          caseName: '',
          createDate: '',
          appointmentStatus: '',
          queryType: 'order'
        }
      },
      columns2: [
        {
          title: '预约名称',
          key: 'caseName'
        },
        {
          title: '预约状态',
          key: 'approvalStatus',
          align: 'center',
          width: 120,
          render: (h, params) => {
            let bgColor =
              params.row.approvalStatus == '1'
                ? 'rgba(53,255,250,1)'
                : 'rgba(255,0,0,1)';
            let status =
              params.row.approvalStatus == '1' ? '审核通过' : params.row.approvalStatus == '0' ? '待审核':params.row.approvalStatus == '2'? '不予提讯' : '逾期取消';
            return h(
              'div',
              {
                style: {
                  color: bgColor
                }
              },
              status
            );
          }
        }
      ],
      data2: [],
      searchCon3: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          caseName: '',
          createDate: '',
          queryType: 'audit'
        }
      },
      columns3: [
        {
          title: '审批名称',
          key: 'caseName'
        },
        {
          title: '审批状态',
          key: 'approvalStatus',
          align: 'center',
          width: 120,
          render: (h, params) => {
            let bgColor =
              params.row.approvalStatus == '1'
                ? 'rgba(53,255,250,1)'
                : 'rgba(255,0,0,1)';
            let status =
              params.row.approvalStatus == '1' ? '审核通过' : '待审核';
            return h(
              'div',
              {
                style: {
                  color: bgColor
                }
              },
              status
            );
          }
        }
      ],
      data3: [],
      searchCon4: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10,
          order: 'meet_start_time',
          sortType: 'DESC'
        },
        data: {
          caseName: '',
          personName: '',
          meetStartTime: '',
          localRoomName: '',
          remoteRoomName: '',
          approvalStatus: '',
          inquiryStatus: '',
          userName: ''
        }
      },
      columns4: [
        {
          title: '案件名称',
          key: 'caseName'
        },
        {
          title: '提讯状态',
          key: 'inquiryStatus',
          align: 'center',
          width: 120,
          render: (h, params) => {
            let bgColor = 'rgba(53,255,250,1)';
            let status = '未开始';
            if(params.row.inquiryStatus === '1'){
              bgColor = 'rgba(255,0,0,1)';
              status = '正在会见';
            }else if(params.row.inquiryStatus === '2'){
              bgColor = 'rgba(204,204,204,1)';
              status = '会见结束';
            }
            return h(
              'div',
              {
                style: {
                  color: bgColor
                }
              },
              status
            );
          }
        }
      ],
      data4: []
    };
  },
  methods: {
    initMenu () {
      getMenuApi().then(res => {
        const moduleList = res.data.data;
        moduleList.forEach(item => {
          switch (item) {
            case '案件管理':
              this.navigationList.push({
                title: '案件管理',
                imgName: 'case',
                path: '/case'
              });
              break;
            case '预约申请':
              this.navigationList.push({
                title: '预约申请',
                imgName: 'appoint',
                path: '/appointment'
              });
              break;
            case '提讯管理':
              this.navigationList.push({
                title: '提讯管理',
                imgName: 'remote',
                path: '/manage'
              });
              break;
            case '提讯审批':
              this.navigationList.push({
                title: '提讯审批',
                imgName: 'examine',
                path: '/audit'
              });
              break;
            case '提讯查询':
              this.navigationList.push({
                title: '提讯查询',
                imgName: 'stastics',
                path: '/query'
              });
              break;
            case '提讯室管理':
              this.navigationList.push({
                title: '提讯室管理',
                imgName: 'remoteRoom',
                path: '/room'
              });
              break;
            case '统计分析':
              this.navigationList.push({
                title: '统计分析',
                imgName: 'stastics',
                path: '/statistics'
              });
              break;
            case '用户管理':
              this.navigationList2.push({
                title: '用户管理',
                imgName: 'background',
                path: '/background'
              });
              break;
          }
        });
        if (this.navigationList[0].title == '案件管理') {
          this.$refs.homeRight.style.display = 'block';
        } else {
          this.$refs.homeRight2.style.display = 'block';
        }
      });
    },
    searchByCon () {
      searchByCon(this.searchCon).then(res => {
        this.data1 = res.data.data;
      });
    },
    searchByCon2 () {
      searchByParams(this.searchCon2).then(res => {
        this.data2 = res.data.data;
      });
    },
    searchByCon3 () {
      searchByParams(this.searchCon3).then(res => {
        this.data3 = res.data.data;
      });
    },
    searchByCon4 () {
      this.searchCon4.data.userName = this.$store.state.user.userName;
      this.searchCon4.data.meetStartTime = getDate(
        new Date(),
        'yearWithOutHours'
      );
      loadTableData(
        'inquiry',
        [
          {
            name: 'meet_start_time',
            alias: 'T',
            operator: 'LIKE',
            value: this.searchCon4.data.meetStartTime
          },
          {
            name: 'user_name',
            operator: 'EQ',
            alias: 'u',
            value: this.searchCon4.data.userName
          }
        ],
        this.searchCon4.pageParam
      ).then(res => {
        this.data4 = res.data.data;
      });
    }
  },
  mounted () {
    this.initMenu();
    this.searchByCon();
    this.searchByCon2();
    this.searchByCon3();
    this.searchByCon4();
  }
};
</script>
<style lang="less">
.home {
  width: 100%;
  height: calc(~'100% - 100px');
  > div {
    display: inline-block;
  }
  .homeLeft {
    height: 100%;
    width: calc(~'100% - 467px');
    display: inline-flex;
    justify-content: center;
    align-items: center;
    > div {
      width: 888px;
      display: inline-block;
      a {
        display: inline-block;
        width: 222px;
        height: 274px;
        background: url('../../assets/images/home/box.png') no-repeat 24px 24px;
        background-size: calc(~'100% - 48px') calc(~'100% - 98px');
        position: relative;
        &:hover {
          background: url('../../assets/images/home/boxAct.png') no-repeat;
          background-size: 100% calc(~'100% - 50px');
        }
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -88%);
          width: 68px;
          height: 66px;
        }
        span {
          color: #35fffa;
          font: bold 26px PangMenZhengDao;
          position: absolute;
          bottom: 0;
          display: inline-block;
          text-align: center;
          width: 100%;
        }
      }
    }
  }
  .homeRight,
  .homeRight2 {
    height: 100%;
    width: 467px;
    float: right;
    border-left: 2px solid rgba(0, 111, 233, 0.48);
    > div:nth-child(1) {
      border-bottom: 2px solid rgba(0, 111, 233, 0.48);
      height: calc(~'50% - 2px');
    }
    > div:nth-child(2) {
      height: 50%;
    }
    > div {
      width: 100%;
      padding: 20px;
      > p {
        span {
          color: rgba(53, 255, 250, 1);
          font: bold 28px Microsoft YaHei;
        }
        a {
          span {
            float: right;
            color: rgba(53, 255, 250, 1);
            font: 20px/37px Microsoft YaHei;
            cursor: pointer;
          }
        }
      }
      .ivu-table-wrapper .ivu-table {
        .ivu-table-header table {
          background: none !important;
          th .ivu-table-cell {
            color: rgba(53, 255, 250, 1) !important;
            font: bold 24px/36px Microsoft YaHei;
          }
        }
        .ivu-table-body table {
          td {
            border-bottom: 1px solid rgba(0, 111, 233, 0.48) !important;
            .ivu-table-cell {
              white-space: normal !important;
              line-height: 32px;
            }
          }
        }
      }
    }
  }
}
</style>
