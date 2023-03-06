<template>
  <i-content class="main-content-con">
        <i-tabs @on-click="getAuditType" style="height: 100%">
          <i-tab-pane label="待审核" name="default" style="height: 100%">
            <span class="searchItemText" style="margin-left: 0;">预约时间</span>
            <i-date-picker v-model="orderTime" type="date" placeholder="请输入日期" class="formCon"></i-date-picker>
            <i-button type="primary" style="display: inline-block;" @click="searchAuditingByParams">查询</i-button>
            <div style="width: 100%; height: 150px;">
              <div class="menuInfoBox" v-for="(item,index) in orderStateList" :key="index">
                <div class="infoBox">
                  <span class="areaName">{{item.timeQuantum}}</span>
                  <div class="roomInfoBox">
                    <span class="menuInfo">已约会见室</span>
                    <span class="menuInfo">{{item.orderedCount}}间</span>
                  </div>
                  <div class="roomInfoBox">
                    <span class="menuInfo">剩余会见室</span>
                    <span class="menuInfo">{{item.lastCount}}间</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tableFunction" style="margin-bottom:10px">
              <i-button type="primary" style="display: inline-block;" @click="batchOrderAuditPass('')">审核通过</i-button>
            </div>
            <i-table border
                     :columns="auditingColumns"
                     :data="auditingList"
                     style="height:calc(100% - 450px)"
                     @on-selection-change="getSelectedRows">
            >
            </i-table>
            <div class="tablePage">
              <i-page style="text-align: right"
                      show-total
                      show-elevator
                      show-sizer
                      :total="auditingListLength"
                      :page-size="searchCon.pageParam.pageSize"
                      :page-size-opts="pageSizeOpts"
                      @on-change="changeAuditingPageIndex"
                      @on-page-size-change="changeAuditingPageSize">
              </i-page>
            </div>
          </i-tab-pane>
          <i-tab-pane label="预约成功" style="height: 100%">
            <span class="searchItemText" style="margin-left: 0;">预约时间</span>
            <i-date-picker v-model="orderTime" type="date" placeholder="请输入日期" class="formCon"></i-date-picker>
            <i-button type="primary" style="display: inline-block;" @click="searchSuccessByParams">查询</i-button>
            <div style="width: 100%; height: 150px;">
              <div class="menuInfoBox" v-for="(item,index) in orderStateList" :key="index">
                <div class="infoBox">
                  <span class="areaName">{{item.timeQuantum}}</span>
                  <div class="roomInfoBox">
                    <span class="menuInfo">已约会见室</span>
                    <span class="menuInfo">{{item.orderedCount}}间</span>
                  </div>
                  <div class="roomInfoBox">
                    <span class="menuInfo">剩余会见室</span>
                    <span class="menuInfo">{{item.lastCount}}间</span>
                  </div>
                </div>
              </div>
            </div>
            <i-table border
                     :columns="successColumns"
                     :data="successList"
                     style="height:calc(100% - 450px)"
            >
            </i-table>
            <div class="tablePage">
              <i-page style="text-align: right"
                      show-total
                      show-elevator
                      show-sizer
                      :total="successListLength"
                      :page-size="searchCon.pageParam.pageSize"
                      :page-size-opts="pageSizeOpts"
                      @on-change="changeSuccessPageIndex"
                      @on-page-size-change="changeSuccessPageSize">
              </i-page>
            </div>
          </i-tab-pane>
        </i-tabs>
        <i-modal v-model="showAuditModel" width="40%" @on-cancel="cancelSubmit()">
          <p slot="header" style="color:#f60;">
            <span class="title">律师会见预约审核</span>
          </p>
          <div class="userInfo">
            <i-table border
                     :columns="successColumns"
                     :data="auditRows"
                     style="height:200px; width:708px"
            >
            </i-table>
            <radio-group v-model="auditResult" class="searchItemText">
              <radio label="1">
                <span>审核通过</span>
              </radio>
              <radio label="2">
                <span>审核不通过</span>
              </radio>
            </radio-group>
            <span class="searchItemText">审核意见：</span>
            <input v-model="auditContent" placeholder="输入审核意见" style="width: 50%" class="searchItemInput"></input>
          </div>
          <div slot="footer">
            <i-button type="primary" class="cancelBtn" @click="cancelSubmit()">取消</i-button>
            <i-button type="primary" class="confirmBtn" @click="handleSubmit()">提交</i-button>
          </div>
        </i-modal>
      </i-content>
</template>
<script>
import { getAuditDataByParams, getRoomCountByParams, submitAuditResult } from '@/api/bg-manage/audit/manage';
import { formatDate, formatDateToStr } from '@/libs/tools';
import NormalButton from '_c/normal-button';
export default {
  name: 'audit',
  components: {
    NormalButton
  },
  data () {
    return {
      orderTime: new Date(),
      auditingColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '预约单位',
          key: 'practicingInstitution'
        },
        {
          title: '预约律师',
          key: 'name'
        },
        {
          title: '被约人',
          key: 'rybhName'
        },
        {
          title: '会见人数',
          key: 'meetNumber'
        },
        {
          title: '预约时间',
          key: 'appointmentTime'
        },
        {
          title: '审批状态',
          key: 'auditState'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h(NormalButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '审核'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.orderAuditPass(params.row);
                  }
                }
              })
            ]);
          }
        }
      ],
      auditRows: [],
      showAuditModel: false,
      auditResult: '1',
      auditContent: '',
      auditingList: [],
      auditingListLength: 0,
      successColumns: [
        {
          title: '预约单位',
          key: 'practicingInstitution'
        },
        {
          title: '预约律师',
          key: 'name'
        },
        {
          title: '被约人',
          key: 'rybhName'
        },
        {
          title: '会见人数',
          key: 'meetNumber'
        },
        {
          title: '预约时间',
          key: 'appointmentTime'
        },
        {
          title: '审批状态',
          key: 'auditState'
        }
      ],
      successList: [],
      successListLength: 0,
      searchCon: {
        data: {
          IN_odsYyLshjDO_appointmentApprover: '0,2',
          EQ_odsYyLshjDO_appointmentDate: ''
        },
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      searchSuccessCon: {
        data: {
          EQ_odsYyLshjDO_appointmentApprover: '1',
          EQ_odsYyLshjDO_appointmentDate: ''
        },
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      pageSizeOpts: [10, 15, 20],
      orderStateList: [
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        },
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        },
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        },
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        },
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        },
        {
          timeQuantum: '9:00-10:00',
          orderedCount: '8',
          lastCount: '8'
        }
      ]
    };
  },
  computed: {
  },
  methods: {
    getAuditType (name) {
      if (name == 'default') {
        this.searchCon.data.EQ_odsYyLshjDO_appointmentDate = formatDate(this.orderTime);
        this.searchCon.data.IN_odsYyLshjDO_appointmentApprover = '0,2';
        this.getAuditingList(this.searchCon);
      } else {
        this.searchSuccessCon.data.EQ_odsYyLshjDO_appointmentDate = formatDate(this.orderTime);
        this.searchSuccessCon.data.EQ_odsYyLshjDO_appointmentApprover = '1';
        this.getSuccessList(this.searchSuccessCon);
      }
    },
    getAuditingList (params) {
      getAuditDataByParams(params).then(res => {
        this.auditingList = res.data.data;
        this.auditingListLength = res.data.page.total;
      });
    },
    getSuccessList (params) {
      getAuditDataByParams(params).then(res => {
        this.successList = res.data.data;
        this.successListLength = res.data.page.total;
      });
    },
    searchAuditingByParams () {
      this.searchCon.data.EQ_odsYyLshjDO_appointmentDate = formatDate(this.orderTime);
      this.searchCon.data.IN_odsYyLshjDO_appointmentApprover = '0,2';
      this.searchCon.pageParam.pageIndex = 1;
      this.getRoomCountList();
      this.getAuditingList(this.searchCon);
    },
    changeAuditingPageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      this.getAuditingList(this.searchCon);
    },
    changeAuditingPageSize (size) {
      this.searchCon.pageParam.pageSize = size;
      this.getAuditingList(this.searchCon);
    },
    orderAuditPass (item) {
      this.auditRows = [];
      this.auditRows.push(item);
      this.showAuditModel = true;
    },
    getSelectedRows (selectedRows) {
      this.auditRows = [];
      selectedRows.forEach(item => {
        this.auditRows.push(item);
      });
    },
    batchOrderAuditPass () {
      if (this.auditRows.length == 0) {
        this.$Message.error({
          content: '未选中任何数据,无法进行操作!',
          duration: 10,
          closable: true
        });
      } else {
        this.showAuditModel = true;
        this.$nextTick(() => {
          this.auditRows = Object.assign([], this.auditRows);
        });
      }
    },
    cancelSubmit () {
      this.auditRows = [];
      this.auditResult = '1';
      this.auditContent = '';
      this.showAuditModel = false;
      this.searchAuditingByParams();
    },
    handleSubmit () {
      let ids = '';
      for (let i = 0; i < this.auditRows.length; i++) {
        if (i == 0) {
          ids += this.auditRows[i].id;
        } else {
          ids += ',' + this.auditRows[i].id;
        }
      }
      let submitData = {
        'id': ids,
        'auditResult': this.auditResult,
        'auditContent': this.auditContent
      };
      submitAuditResult(submitData).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('审核成功!');
          this.searchCon.data.EQ_odsYyLshjDO_appointmentDate = formatDate(this.orderTime);
          this.searchCon.data.IN_odsYyLshjDO_appointmentApprover = '0,2';
          this.getAuditingList(this.searchCon);
          this.cancelSubmit();
        }
      });
    },
    searchSuccessByParams () {
      this.searchSuccessCon.data.EQ_odsYyLshjDO_appointmentDate = formatDate(this.orderTime);
      this.searchSuccessCon.data.EQ_odsYyLshjDO_appointmentApprover = '1';
      this.searchSuccessCon.pageParam.pageIndex = 1;
      this.getRoomCountList();
      this.getSuccessList(this.searchSuccessCon);
    },
    changeSuccessPageIndex (index) {
      this.searchSuccessCon.pageParam.pageIndex = index;
      this.getSuccessList(this.searchSuccessCon);
    },
    changeSuccessPageSize (size) {
      this.searchSuccessCon.pageParam.pageSize = size;
      this.getSuccessList(this.searchSuccessCon);
    },
    getRoomCountList () {
      let roomInfoParams = {
        data: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', formatDateToStr(this.orderTime)]
      };
      getRoomCountByParams(roomInfoParams).then(res => {
        this.orderStateList = res.data.data;
      });
    }
  },
  watch: {
  },
  mounted () {
    this.searchAuditingByParams();
    this.getRoomCountList();
  }
};
</script>
<style lang="less" scoped>
  .ivu-message{
    z-index:999999999!important;
  }
  .menuInfoBox{
    width:14.5%;
    height:130px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(52, 108, 234, 0.27);
    margin: 0 1% 4px 1%;
    float:left;
    .infoBox{
      width:95%;
      height:118px;
      background:rgba(227,234,254,1);
      border-radius:4px;
      margin: 6px 9px;
      overflow: auto;
      font: 14px Microsoft YaHei;
      color:rgba(85,85,85,1);
      .areaName{
        display: block;
        height: 16px;
        width: 100px;
        margin: 5px auto;
        font-weight:bold;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .menuInfo{
        display: block;
        width: 100px;
        margin: 0 auto;
        line-height:35px;
        text-align: center;
      }
      .roomInfoBox{
        width:50%;
        float: left;
      }
    }
  }
  .ivu-tabs-content-animated{
    height: 100%;
  }
</style>
