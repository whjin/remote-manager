<template>
  <i-layout class="main-content-con">
    <i-layout>
      <i-content class="main-content-con">
        <i-layout class="main-layout-con">
          <i-content class="content-wrapper">
            <span class="searchItemText">案件名称:</span>
            <input class="searchItemInput" v-model="searchCon.data.caseName"></input>
            <span class="searchItemText">被讯问人:</span>
            <input class="searchItemInput" v-model="searchCon.data.personName"></input>
            <span class="searchItemText">开始日期(>):</span>
            <i-date-picker type="date" format="yyyy-MM-dd" v-model="searchCon.data.meetStartTime"></i-date-picker>
            <span class="searchItemText personclass">办案单位提讯室:</span>
            <input class="searchItemInput" v-model="searchCon.data.localRoomName"></input>
            <br/>
            <span class="searchItemText">监所提讯室:</span>
            <input class="searchItemInput" v-model="searchCon.data.remoteRoomName"></input>
            <span class="searchItemText">预约状态:</span>
            <i-select clearable v-model="searchCon.data.approvalStatus" placeholder="请选择预约状态">
              <i-option value="1">审核通过</i-option>
              <i-option value="2">不予提讯</i-option>
              <i-option value="3">逾期取消</i-option>
            </i-select>
            <span class="searchItemText">提讯状态:</span>
            <i-select clearable v-model="searchCon.data.inquiryStatus" placeholder="请选择提讯状态">
              <i-option value="0">未开始</i-option>
              <i-option value="1">正在提讯</i-option>
              <i-option value="2">提讯结束</i-option>
            </i-select>
            <i-button ghost style="display: inline-block; margin-left: 50px;" @click="searchByConsIndex()" class="searchButton">查询</i-button>
            <i-table border
                     :columns="appointmentColumns"
                     :data="appointmentList"
                     ref="table"
                     style="height:calc(100% - 11vw)"

            >
            </i-table>
            <div class="tablePage">
              <i-page style="text-align: right"
                      show-total
                      show-elevator
                      show-sizer
                      :current="searchCon.pageParam.pageIndex"
                      :total="dataCount"
                      :page-size="searchCon.pageParam.pageSize"
                      :page-size-opts="pageSizeOpts"
                      @on-change="changePageIndex"
                      @on-page-size-change="changePageSize">
              </i-page>
            </div>

            <i-modal v-model="detailModal" width="1300px">
              <p slot="header" style="color:#f60;">
                <span class="title">提讯详情</span>
              </p>
              <div class="caseInfo" style="height: 600px;overflow: auto;">
                <i-form ref="detailData" style="margin-top: 5px" :model="detailData" :label-width="155" label-position="right">
                  <span style="font-size: 20px;color: #35FFFA">案件信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="24">
                      <i-form-item label="案件名称:" prop="caseName" class="caseName">
                        <i-input v-model="detailData.caseName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="案件编号:" prop="caseNo" class="caseNo">
                        <i-input v-model="detailData.caseNo" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="办案部门:" prop="caseDepartment" >
                        <i-input v-model="detailData.caseDepartment" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="案件创建时间:" prop="caseGmtCreate" >
                        <i-input v-model="detailData.caseGmtCreate" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="24">
                      <i-form-item label="简要案情:" prop="caseDesc" class="caseDetail">
                        <i-input v-model="detailData.caseDesc" type="textarea" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">被讯问人信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="8">
                      <i-form-item label="被讯问人:" prop="interrogator">
                        <i-input v-model="detailData.rybhName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="证件类型:" prop="idType">
                        <i-input v-model="detailData.idType" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="证件号码:" prop="idCard">
                        <i-input v-model="detailData.idCard" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">提讯信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="8">
                      <i-form-item label="讯问人:" prop="interrogator">
                        <i-input v-model="detailData.interrogator" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="开始时间:" prop="meetStartTime">
                        <i-input v-model="detailData.meetStartTime" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="结束时间:" prop="meetEndTime">
                        <i-input v-model="detailData.meetEndTime" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="提讯类型:" prop="inquiryTypeName">
                        <i-input v-model="detailData.inquiryTypeName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="办案单位提讯室:" prop="localRoomName">
                        <i-input v-model="detailData.localRoomName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="监所提讯室:" prop="remoteRoomName">
                        <i-input v-model="detailData.remoteRoomName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="监所:" prop="placeName">
                        <i-input v-model="detailData.placeName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">审核情况</span>
                  <i-row>
                    <radio-group v-model="detailData.approvalStatus" style="margin-left: 150px;margin-top: 10px;margin-bottom: 10px">
                      <radio label="1" disabled>
                        <span>同意</span>
                      </radio>
                      <radio label="2" disabled>
                        <span>不同意</span>
                      </radio>
                    </radio-group>
                  </i-row>
                  <i-row>
                    <i-col span="24">
                      <i-form-item label="审核意见:" prop="checkRemark" class="caseDetail">
                        <i-input v-model="detailData.checkRemark" type="textarea" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                </i-form>
              </div>
              <div slot="footer" style="text-align: center">
                <Button type="primary" @click="detailModal = false">关闭</Button>
              </div>
            </i-modal>
            <!--确认框-->
            <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)" @confirmValue="confirmValue()"></confirm-box>
          </i-content>
        </i-layout>
      </i-content>
    </i-layout>
  </i-layout>
</template>
<script>

import NormalButton from '_c/normal-button';
import selectBox from '_c/select-box/select-box.vue';
import {searchBoxDataUrl, overdueCancel, searchQueryByParams } from '@/api/bg-manage/appointment/manage';
import { getDate, formatDateToStr } from '@/libs/tools';
import { loadTableData } from '@/api/bg-manage/table';
import axios from 'axios';
import { getToken } from '@/libs/util';
import config from '@/config';
import confirmBox from '_c/confirmBox/index';

export const loadTableData1 = (tableName, expressions, pageParam) => {
  return axios.request({
    url: '/inquiry/table/loadData',
    data: {
      tableName: tableName,
      emptyPage: true,
      expressions: expressions,
      pageParam: Object.assign({
        pageIndex: 1,
        pageSize: 10,
        order: '',
        sortType: 'ASC'
      }, pageParam)
    },
    method: 'post'
  });
};

export default {
  name: 'appointment',
  components: {
    NormalButton,
    selectBox,
    confirmBox
  },
  data () {
    return {
      cancelId: '',
      confirmModel: false,
      confirmActive: '取消',
      searchDate: '',
      personSelectModel: {
        idCard: '',
        name: ''
      },
      personTotal: 0,
      personPageSizeOpts: [10, 15, 20],
      searchCon: {
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
      statusList: [
        { value: '0', name: '待审核' },
        { value: '1', name: '审核通过' },
        { value: '2', name: '不予提讯' },
        { value: '3', name: '逾期取消' }
      ],
      appointmentColumns: [
        {
          title: '序号',
          type: 'index',
          width: 90,
          align: 'center'
        },
        {
          title: '案件名称',
          key: 'caseName',
          align: 'center'
        },
        {
          title: '讯问人',
          key: 'interrogator',
          align: 'center'
        },
        {
          title: '被讯问人',
          key: 'rybhName',
          align: 'center'
        },
        {
          title: '提讯类型',
          key: 'inquiryType',
          align: 'center',
          render: (h, params) => {
            if (params.row.inquiryType) {
              if (params.row.inquiryType == '1') {
                return h('span', '点对点提讯');
              } else if (params.row.inquiryType == '2') {
                return h('span', '多方提讯');
              } else {
                return h('span', params.row.inquiryType);
              }
            }
          }
        },
        {
          title: '监所',
          key: 'placeName',
          align: 'center'
        },
        {
          title: '办案单位提讯室',
          key: 'localRoomName',
          align: 'center'
        },
        {
          title: '监所提讯室',
          key: 'remoteRoomName',
          align: 'center'
        },
        {
          title: '开始日期',
          key: 'meetStartTime',
          align: 'center',
          render: (h, params) => {
            if (params.row.meetStartTime) {
              return h('span', formatDateToStr(params.row.meetStartTime, 'date'));
            }
          }
        },
        {
          title: '开始时间',
          key: 'meetStartTime',
          align: 'center',
          render: (h, params) => {
            if (params.row.meetStartTime) {
              return h('span', getDate(params.row.meetStartTime, 'hoursMinutesSecond'));
            }
          }
        },
        {
          title: '结束时间',
          key: 'meetEndTime',
          align: 'center',
          render: (h, params) => {
            if (params.row.meetEndTime) {
              return h('span', getDate(params.row.meetEndTime, 'hoursMinutesSecond'));
            }
          }
        },
        {
          title: '预约状态',
          align: 'center',
          render: (h, params) => {
            if (params.row.approvalStatus) {
              if (params.row.approvalStatus == '0') {
                return h('span', '待审核');
              } else if (params.row.approvalStatus == '1') {
                return h('span', '审核通过');
              } else if (params.row.approvalStatus == '2') {
                return h('span', '不予提讯');
              } else if (params.row.approvalStatus == '3') {
                return h('span', '逾期取消');
              }
            }
          }
        },
        {
          title: '提讯状态',
          align: 'center',
          render: (h, params) => {
            let status = params.row.inquiryStatus || '0';
            if (status == '0') {
              return h('span', '未开始');
            } else if (status == '1') {
              return h('span', '正在提讯');
            } else if (status == '2') {
              return h('span', '提讯结束');
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let inquiryStatus = params.row.inquiryStatus || '0';
            let approvalStatus = params.row.approvalStatus;
            let meetStartTime = params.row.meetStartTime;
            let meetEndTime = params.row.meetEndTime;

            let nowTime = new Date().getTime();
            let elementArray = [];

            // 提讯结束可以刻录光盘和查看录像
            // if (inquiryStatus == '2') {
            //   elementArray.push(h('span', [
            //     h('Tooltip', {
            //       props: {
            //         placement: 'top',
            //         transfer: true
            //       }
            //     }, [h('Icon', {
            //       props: {
            //         type: 'iconfont iconluxiang',
            //         size: '20'
            //       },
            //       style: {
            //         marginRight: '5px',
            //         cursor: 'pointer',
            //         color: '#2BABFF'
            //       },
            //       on: {
            //         click: () => {
            //           this.openVideo(params.row);
            //         }
            //       }
            //     }),
            //     h('div', {
            //       slot: 'content',
            //       style: {
            //         whiteSpace: 'normal'
            //       }
            //     }, '录像')])
            //   ]));
            // }

            if (inquiryStatus == '0' && approvalStatus == '1' &&  nowTime<=meetEndTime) {
              elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'md-close-circle',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.openCancelModal(params.row.id);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '逾期取消')])
              ]));
            }

            elementArray.push(h('span', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                }
              }, [h('Icon', {
                props: {
                  type: 'iconfont iconxiangqing',
                  size: '20'
                },
                style: {
                  marginRight: '5px',
                  cursor: 'pointer',
                  color: '#2BABFF'
                },
                on: {
                  click: () => {
                    this.openDetailModal(params.row);
                  }
                }
              }),
              h('div', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, '详情')])
            ]));

            return h('div', elementArray);
          }
        }
      ],
      appointmentList: [],
      tableHeight: 0,
      dataCount: 0,
      pageSizeOpts: [10, 15, 20],
      remoteRoomList: [],
      localRoomList: [],
      caseNameUrl: searchBoxDataUrl,
      submitClear: false,
      detailModal: false,
      detailData: {
        id: '',
        caseNo: '',
        caseName: '',
        caseDepartment: '',
        caseGmtCreate: '',
        caseCreateBy: '',
        caseDesc: '',
        interrogator: '',
        meetStartTime: '',
        meetEndTime: '',
        inquiryType: '',
        localRoom: '',
        localRoomName: '',
        remoteRoom: '',
        remoteRoomName: '',
        rybh: '',
        rybhName: '',
        idType: '',
        idCard: '',
        type: '',
        placeName: ''
      },
      flushTime: 600000,
      timer: {},
      path: 'ws://' + config.websocket.ip + ':' + config.websocket.port + '/inquiryQuery',
      websocket: ''
    };
  },
  computed: {
  },
  methods: {
    getInquiryQuery () {
      this.type = 'query';
      this.searchCon.data.userName = this.$store.state.user.userName;
      this.searchCon.data.meetStartTime = getDate(new Date(), 'yearWithOutHours');

      let params = [{
        name: 'meet_start_time',
        alias: 'T',
        operator: 'LIKE',
        value: this.searchCon.data.meetStartTime
      }];

      if(this.searchCon.data.userName !== 'admin'){
        params.push({
          name: 'user_name',
          operator: 'EQ',
          alias: 'u',
          value: this.searchCon.data.userName
        });
      }

      loadTableData('inquiry', params, this.searchCon.pageParam).then(res => {
        this.appointmentList = res.data.data;
        this.dataCount = res.data.page.total;
        this.searchCon.pageParam.pageIndex = res.data.page.pageIndex;
      });
    },
    loadData () {
      this.type = 'queryWithParams';
      this.searchCon.data.userName = this.$store.state.user.userName;
      if (this.searchCon.data.meetStartTime) {
        this.searchCon.data.meetStartTime = getDate(this.searchCon.data.meetStartTime, 'yearWithOutHours');
      }
      let params = [{
        name: 'case_name',
        alias: 'T1',
        operator: 'LIKE',
        value: this.searchCon.data.caseName
      }, {
        name: 'xm',
        alias: 't2',
        operator: 'LIKE',
        value: this.searchCon.data.personName
      }, {
        name: 'meet_start_time',
        alias: 'T',
        operator: 'GT',
        value: this.searchCon.data.meetStartTime
      }, {
        name: 'room_name',
        alias: 't3',
        operator: 'LIKE',
        value: this.searchCon.data.localRoomName
      }, {
        name: 'room_name',
        alias: 't4',
        operator: 'LIKE',
        value: this.searchCon.data.remoteRoomName
      }, {
        name: 'approval_status',
        alias: 'T',
        operator: 'EQ',
        value: this.searchCon.data.approvalStatus
      }, {
        name: 'inquiry_status',
        alias: 'T',
        operator: 'EQ',
        value: this.searchCon.data.inquiryStatus
      }];
      if(this.searchCon.data.userName !== 'admin'){
        params.push({
          name: 'user_name',
          operator: 'EQ',
          alias: 'u',
          value: this.searchCon.data.userName
        });
      }
      loadTableData('inquiry', params, this.searchCon.pageParam).then(res => {
        this.appointmentList = res.data.data;
        this.dataCount = res.data.page.total;
        this.searchCon.pageParam.pageIndex = res.data.page.pageIndex;
      });
    },

    searchByConsIndex(){
      this.searchCon.pageParam.pageIndex = 1;
      this.searchByCons();
    },
    searchByCons () {
      //this.searchCon.pageParam.pageIndex = 1;
      //this.searchCon.data.createDate = formatDateToStr(this.searchDate);
      if (this.searchCon.data.meetStartTime) {
        this.searchCon.data.meetStartTime = getDate(this.searchCon.data.meetStartTime, 'yearWithOutHours');
      }
      searchQueryByParams(this.searchCon).then(res => {
        this.appointmentList = res.data.data;
        this.dataCount = res.data.page.total;
        this.searchCon.pageParam.pageIndex = res.data.page.pageIndex;
      });
    },

    getInquiryQuery1 () {
      this.type = 'query';
      this.searchCon.data.userName = this.$store.state.user.userName;
      this.searchCon.data.meetStartTime = getDate(new Date(), 'yearWithOutHours');
      let params = [{
        name: 'meet_start_time',
        alias: 'T',
        operator: 'LIKE',
        value: this.searchCon.data.meetStartTime
      }];

      if(this.searchCon.data.userName !== 'admin'){
        params.push({
          name: 'user_name',
          operator: 'EQ',
          alias: 'u',
          value: this.searchCon.data.userName
        });
      }
      loadTableData1('inquiry', params, this.searchCon.pageParam).then(res => {
        this.appointmentList = res.data.data;
        this.dataCount = res.data.page.total;
        this.searchCon.pageParam.pageIndex = res.data.page.pageIndex;
      });
    },
    loadData1 () {
      this.type = 'queryWithParams';
      this.searchCon.data.userName = this.$store.state.user.userName;
      if (this.searchCon.data.meetStartTime) {
        this.searchCon.data.meetStartTime = getDate(this.searchCon.data.meetStartTime, 'yearWithOutHours');
      }

      let params = [{
        name: 'case_name',
        alias: 'T1',
        operator: 'LIKE',
        value: this.searchCon.data.caseName
      }, {
        name: 'xm',
        alias: 't2',
        operator: 'LIKE',
        value: this.searchCon.data.personName
      }, {
        name: 'meet_start_time',
        alias: 'T',
        operator: 'GT',
        value: this.searchCon.data.meetStartTime
      }, {
        name: 'room_name',
        alias: 't3',
        operator: 'LIKE',
        value: this.searchCon.data.localRoomName
      }, {
        name: 'room_name',
        alias: 't4',
        operator: 'LIKE',
        value: this.searchCon.data.remoteRoomName
      }, {
        name: 'approval_status',
        alias: 'T',
        operator: 'LIKE',
        value: this.searchCon.data.approvalStatus
      }, {
        name: 'inquiry_status',
        alias: 'T',
        operator: 'LIKE',
        value: this.searchCon.data.inquiryStatus
      }];

      if(this.searchCon.data.userName !== 'admin'){
        params.push({
          name: 'user_name',
          operator: 'EQ',
          alias: 'u',
          value: this.searchCon.data.userName
        });
      }
      loadTableData1('inquiry', params, this.searchCon.pageParam).then(res => {
        this.appointmentList = res.data.data;
        this.dataCount = res.data.page.total;
        this.searchCon.pageParam.pageIndex = res.data.page.pageIndex;
      });
    },
    changePageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      /*if (this.type == 'query') {
        this.getInquiryQuery();
      } else {
        this.loadData();
      }*/
      this.searchByCons();
    },
    changePageSize (pageSize) {
      this.searchCon.pageParam.pageSize = pageSize;
     /* if (this.type == 'query') {
        this.getInquiryQuery();
      } else {
        this.loadData();
      }*/
      this.searchByCons();
    },
    openDetailModal (row) {
      this.detailData = row;
      this.detailData.caseGmtCreate = row.caseGmtCreate == null ? '' : getDate(row.caseGmtCreate, 'year');
      this.detailData.meetStartTime = row.meetStartTime == null ? '' : getDate(row.meetStartTime, 'year');
      this.detailData.meetEndTime = row.meetEndTime == null ? '' : getDate(row.meetEndTime, 'year');
      this.detailData.inquiryTypeName = this.detailData.inquiryType === '1' ? '点对点提讯' : '多方提讯';
      this.detailModal = true;
    },
    realTimeRefresh () {
      if (this.type == 'query') {
        this.getInquiryQuery1();
      } else {
        this.loadData1();
      }
    },
    websocketInit () {
      if (typeof (WebSocket) === 'undefined') {
        this.$Message.error('您的浏览器不支持WebScoket，无法实时接收到报警信息。请更换浏览器！');
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
      this.$Message.warning('提讯查询列表发生了变化');
      this.realTimeRefresh();
    },
    openCancelModal (id) {
      this.confirmModel = true;
      this.cancelId = id;
    },
    updateConfirmModel (el) {
      this.confirmModel = el;
      this.cancelId = '';
    },
    confirmValue () {
      overdueCancel(this.cancelId).then(res => {
        if (res.data.state.code == 200) {
          this.confirmModel = false;
          this.$Message.success('取消成功');
          this.cancelId = '';
          this.loadData();
        }
      });
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop-33;
   // this.getInquiryQuery();
    this.searchByConsIndex();
    this.websocketInit();
  },
  destroyed () {
    this.websocket.close();
  }

};
</script>
<style lang="less" scoped>
  /deep/ .caseNo{
    .ivu-input{
      width: 300px!important;
    }
  }
  /deep/ .caseName{
    .ivu-input{
      width: 500px!important;
    }
  }
  /deep/.caseInfo{
    .caseDetail{
      .ivu-input{
        background: none;
        border: 1px solid rgba(0,122,255,.3);
        width: 1020px;
        height: 150px!important;
      }
    }
  }
  /deep/ .unit{
    .ivu-input{
      width: 520px!important;
    }
  }

  #test .ivu-modal-footer{
    padding: 0;
  }
  .demo-table-info-row {

    height: 475px;
  }
  /deep/ .personclass {

    with: 150px;
  }

</style>
