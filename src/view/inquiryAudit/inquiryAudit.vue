<template>
  <i-layout class="main-content-con">
    <i-layout>
      <i-content class="main-content-con">
        <i-layout class="main-layout-con">
          <i-content class="content-wrapper">
            <span class="searchItemText">案件名称</span>
            <input class="searchItemInput" v-model="searchCon.data.caseName" placeholder="请输入案件名称"></input>
            <span class="searchItemText">创建日期</span>
            <i-date-picker v-model="searchDate" type="date" format="yyyy-MM-dd" placeholder="请选择创建时间"></i-date-picker>
            <i-button ghost style="display: inline-block; margin-left: 50px;" @click="searchByCons()" class="searchButton">查询</i-button>
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
                      :total="appointmentListLength"
                      :page-size="searchCon.pageParam.pageSize"
                      :page-size-opts="pageSizeOpts"
                      @on-change="changeAppointmentPageIndex"
                      @on-page-size-change="changeAppointmentPageSize">
              </i-page>
            </div>
            <i-modal v-model="detailModal" width="1300px">
              <p slot="header">
                <span class="title">预约详情</span>
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
                      <i-form-item label="案件编号:" prop="caseNo">
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
                      <i-form-item label="被讯问人:" prop="rybhName">
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
                      <i-form-item label="讯问人联系方式:" prop="phoneNo">
                        <i-input v-model="detailData.phoneNo" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row style="margin-top: 10px">
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
                    <i-col span="8">
                      <i-form-item label="提讯类型:" prop="inquiryType">
                        <i-input v-model="detailData.inquiryTypeName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="监所:" prop="placeName">
                        <i-input v-model="detailData.placeName" disabled></i-input>
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
                  <span style="font-size: 20px;color: #35FFFA">审核情况</span>
                  <i-row>
                    <i-col span="24">
                      <radio-group v-model="detailData.approvalStatus" style="margin-left: 150px;margin-top: 10px;margin-bottom: 10px">
                        <radio label="1" disabled>
                          <span>同意</span>
                        </radio>
                        <radio label="2" disabled>
                          <span>不同意</span>
                        </radio>
                      </radio-group>
                    </i-col>
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
            <i-modal v-model="modifyModal" width="1300px">
              <p slot="header" style="color:#f60;">
                <span class="title">预约审核</span>
              </p>
              <div class="caseInfo" style="height: 600px;overflow: auto;">
                <i-form ref="modifyData" style="margin-top: 5px" :model="modifyData" :label-width="155" label-position="right" :rules="addRule">
                  <span style="font-size: 20px;color: #35FFFA">案件信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="24">
                      <i-form-item label="案件名称:" prop="caseName" class="caseName">
                        <i-input v-model="modifyData.caseName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="案件编号:" prop="caseNo">
                        <i-input v-model="modifyData.caseNo" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="办案部门:" prop="caseDepartment" >
                        <i-input v-model="modifyData.caseDepartment" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="案件创建时间:" prop="caseGmtCreate" >
                        <i-input v-model="modifyData.caseGmtCreate" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="24">
                      <i-form-item label="简要案情:" prop="caseDesc" class="caseDetail">
                        <i-input v-model="modifyData.caseDesc" type="textarea" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">被讯问人信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="8">
                      <i-form-item label="被讯问人:" prop="rybhName">
                        <i-input v-model="modifyData.rybhName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="证件类型:" prop="idType">
                        <i-input v-model="modifyData.idType" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="证件号码:" prop="idCard">
                        <i-input v-model="modifyData.idCard" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">提讯信息</span>
                  <i-row style="margin-top: 10px">
                    <i-col span="8">
                      <i-form-item label="讯问人:" prop="interrogator">
                        <i-input v-model="modifyData.interrogator" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="讯问人联系方式:" prop="phoneNo">
                        <i-input v-model="modifyData.phoneNo" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row style="margin-top: 10px">
                    <i-col span="8">
                      <i-form-item label="开始时间:" prop="meetStartTime">
                        <i-input v-model="modifyData.meetStartTime" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="结束时间:" prop="meetEndTime">
                        <i-input v-model="modifyData.meetEndTime" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="提讯类型:" prop="inquiryType">
                        <i-input v-model="modifyData.inquiryTypeName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <i-row>
                    <i-col span="8">
                      <i-form-item label="监所:" prop="placeName">
                        <i-input v-model="modifyData.placeName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="办案单位提讯室:" prop="localRoomName">
                        <i-input v-model="modifyData.localRoomName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                    <i-col span="8">
                      <i-form-item label="监所提讯室:" prop="remoteRoomName">
                        <i-input v-model="modifyData.remoteRoomName" disabled></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                  <span style="font-size: 20px;color: #35FFFA">审核情况</span>
                  <i-row>
                    <radio-group v-model="modifyData.approvalStatus" style="margin-left: 150px;margin-top: 10px;margin-bottom: 10px">
                      <radio label="1">
                        <span>同意</span>
                      </radio>
                      <radio label="2">
                        <span>不同意</span>
                      </radio>
                    </radio-group>
                  </i-row>
                  <i-row>
                    <i-col span="24">
                      <i-form-item label="审核意见:" prop="checkRemark" class="caseDetail">
                        <i-input v-model="modifyData.checkRemark" type="textarea"></i-input>
                      </i-form-item>
                    </i-col>
                  </i-row>
                </i-form>
              </div>
              <div slot="footer" style="text-align: center">
                <Button type="primary" @click="saveModifyModal()">保存</Button>
                <Button type="primary" @click="modifyModal = false">关闭</Button>
              </div>
            </i-modal>
          </i-content>
        </i-layout>
      </i-content>
    </i-layout>
  </i-layout>
</template>
<script>
import NormalButton from '_c/normal-button';
import { searchByParams, saveAuditAppointmentData, ifAudited } from '@/api/bg-manage/appointment/manage';
import { getDate, formatDateToStr } from '@/libs/tools';
import { getToken } from '@/libs/util';
import axios from 'axios';
import config from '@/config';

export const searchByParams1 = (params) => {
  return axios.request({
    url: '/inquiry/inquiryManagement/queryAppointmentInfo',
    data: params,
    method: 'post'
  });
};

export default {
  name: 'inquiryAudit',
  components: {
    NormalButton
  },
  data () {
    return {
      searchDate: '',
      searchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          caseName: '',
          createDate: '',
          queryType: 'audit',
          sort: 't.meet_start_time'
        }
      },
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
          align: 'center',
          render: (h, params) => {
            if (params.row.inquiryType) {
              if (params.row.inquiryType == '1') {
                return h('span', '点对点提讯');
              } else if (params.row.inquiryType == '2') {
                return h('span', '多方提讯');
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
          title: '开始时间',
          key: 'meetStartTime',
          align: 'center',
          render: (h, params) => {
            if (params.row.meetStartTime) {
              return h('span', getDate(params.row.meetStartTime, 'year'));
            }
          }
        },
        {
          title: '结束时间',
          key: 'meetEndTime',
          align: 'center',
          render: (h, params) => {
            if (params.row.meetEndTime) {
              return h('span', getDate(params.row.meetEndTime, 'year'));
            }
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          render: (h, params) => {
            if (params.row.gmtCreate) {
              return h('span', getDate(params.row.gmtCreate, 'year'));
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
                return h('span', { style: { color: '#35FFFA' } }, '审核通过');
              } else if (params.row.approvalStatus == '2') {
                return h('span', { style: { color: '#FF0000' } }, '不予提讯');
              } else if (params.row.approvalStatus == '3') {
                return h('span', '逾期取消');
              }
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let actionArray = [];
            actionArray.push(h('span', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                }
              }, [h('Icon', {
                props: {
                  type: 'ios-paper-outline',
                  size: '18'
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
              }, '查看')])
            ]));
            if (params.row.approvalStatus == '0') {
              actionArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: ' iconfont icon-xiugai'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.openModifyModal(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '审核')])
              ]));
            }
            return h('div', actionArray);
          }
        }
      ],
      appointmentList: [],
      tableHeight: 0,
      appointmentListLength: 0,
      pageSizeOpts: [10, 15, 20],
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
        inquiryTypeName: '',
        localRoom: '',
        localRoomName: '',
        remoteRoom: '',
        remoteRoomName: '',
        rybh: '',
        rybhName: '',
        idType: '',
        idCard: '',
        approvalStatus: '',
        checkRemark: '',
        phoneNo: '',
        placeName: ''
      },
      modifyModal: false,
      modifyData: {
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
        inquiryTypeName: '',
        localRoom: '',
        localRoomName: '',
        remoteRoom: '',
        remoteRoomName: '',
        rybh: '',
        rybhName: '',
        idType: '',
        idCard: '',
        approvalStatus: '',
        checkRemark: '',
        timeIndex: '',
        phoneNo: '',
        placeName: ''
      },
      addRule: {
        checkRemark: [
          { required: false, message: '审核意见长度应在0~100位之间', min: 1, max: 100, trigger: 'blur' }
        ]
      },
      path: 'ws://' + config.websocket.ip + ':' + config.websocket.port + '/inquiryAudit',
      websocket: ''
    };
  },
  computed: {
  },
  methods: {
    searchByCons () {
      this.searchCon.pageParam.pageIndex = 1;
      this.searchCon.data.createDate = formatDateToStr(this.searchDate);
      searchByParams(this.searchCon).then(res => {
        this.appointmentList = res.data.data;
        this.appointmentListLength = res.data.page.total;
      });
    },
    changeAppointmentPageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      this.searchByPage();
    },
    changeAppointmentPageSize (pageSize) {
      this.searchCon.pageParam.pageSize = pageSize;
      this.searchByPage();
    },
    searchByPage () {
      this.searchCon.data.createDate = formatDateToStr(this.searchDate);
      searchByParams(this.searchCon).then(res => {
        this.appointmentList = res.data.data;
        this.appointmentListLength = res.data.page.total;
      });
    },
    openDetailModal (row) {
      this.detailData = Object.assign({}, row);
      this.detailData.caseGmtCreate = this.detailData.caseGmtCreate == null ? '' : getDate(this.detailData.caseGmtCreate, 'year');
      this.detailData.meetStartTime = this.detailData.meetStartTime == null ? '' : getDate(this.detailData.meetStartTime, 'year');
      this.detailData.meetEndTime = this.detailData.meetEndTime == null ? '' : getDate(this.detailData.meetEndTime, 'year');
      this.detailData.inquiryTypeName = this.detailData.inquiryType == '1' ? '点对点提讯' : '多方提讯';
      this.detailModal = true;
    },
    openModifyModal (row) {
      ifAudited(row.id).then(res => {
        if (res.data.data == true) {
          this.modifyData = Object.assign({}, row);
          this.modifyData.caseGmtCreate = this.modifyData.caseGmtCreate == null ? '' : getDate(this.modifyData.caseGmtCreate, 'year');
          this.modifyData.meetStartTime = this.modifyData.meetStartTime == null ? '' : getDate(this.modifyData.meetStartTime, 'year');
          this.modifyData.meetEndTime = this.modifyData.meetEndTime == null ? '' : getDate(this.modifyData.meetEndTime, 'year');
          this.modifyData.inquiryTypeName = this.modifyData.inquiryType == '1' ? '点对点提讯' : '多方提讯';
          this.modifyData.approvalStatus = '1';
          this.modifyModal = true;
        } else {
          this.$Message.success('该条数据已审核，无法修改!');
          this.searchByCons();
        }
      });
    },
    saveModifyModal () {
      this.$refs['modifyData'].validate((valid) => {
        if (valid) {
          if (this.modifyData.approvalStatus == '1' || this.modifyData.approvalStatus == '2') {
            saveAuditAppointmentData(this.modifyData).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('修改成功!');
                this.modifyModal = false;
                this.searchByCons();
              }
            });
          } else {
            this.$Message.success('请选择审批结果!');
          }
        } else {
          this.$Message.error(res.data.data);
        }
      });
    },
    realTimeRefresh () {
      this.searchCon.data.createDate = formatDateToStr(this.searchDate);
      searchByParams1(this.searchCon).then(res => {
        this.appointmentList = res.data.data;
        this.appointmentListLength = res.data.page.total;
      });
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
      this.$Message.warning('有新的审批项');
      this.realTimeRefresh();
    }
  },
  watch: {
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
    this.searchByCons();
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
</style>
