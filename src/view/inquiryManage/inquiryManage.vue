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
            <span class="searchItemText">开始日期:</span>
            <i-date-picker type="date" format="yyyy-MM-dd" v-model="searchCon.data.startDate"></i-date-picker>
            <i-button ghost style="display: inline-block; margin-left: 50px;" @click="searchByParam" class="searchButton">查询</i-button>
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
                      <i-form-item label="提讯类型:" prop="inquiryType">
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
                </i-form>
              </div>
              <div slot="footer" style="text-align: center">
                <Button type="primary" @click="detailModal = false">关闭</Button>
              </div>
            </i-modal>
            <i-modal v-model="video" width="780">
              <p slot="header" style="color:#f60;">
                <span class="title">录像</span>
              </p>
              <i-table border
                       :columns="videoCol"
                       :data="videoData"
                       ref="table"
                       :height="350"></i-table>
              <div class="tablePage">
                <i-page style="text-align: right"
                        show-total
                        show-elevator
                        show-sizer
                        :total="videoListLength"
                        :page-size="videoCon.pageParam.pageSize"
                        :page-size-opts="videoPageSizeOpts"
                        @on-change="changeVideoPageIndex"
                        @on-page-size-change="changeVideoPageSize">
                </i-page>
              </div>
              <div slot="footer" style="text-align: right">
                <Button type="primary" @click="video = false">关闭</Button>
              </div>
            </i-modal>
            <i-modal width="700" v-model="showVideo" @on-ok="closeVideo" @on-cancel="closeVideo" :mask-closable="false">
              <p slot="header">
                <span class="title">查看提讯录像</span>
              </p>
              <!--<video-player
                ref="videoPlayer"
                :cameraIndexCode="cameraCode"
                protocol="rtmp"
                mode="replay"
                :beginTime="videoStartTime"
                :endTime="videoEndTime"
                :initStream="initStream"
                width="14.58" height="8.3"></video-player>-->
              <video ref="monitorRef" :src="videoUrl"></video>
              <div slot="footer">
                <i-button type="primary" class="confirmBtn" @click="closeVideo">确定</i-button>
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
import selectBox from '_c/select-box/select-box.vue';
import { searchByParams, queryPersonListByNo, initLocalRoomList, initRemoteRoomList, searchBoxDataUrl, queryVideoInfo } from '@/api/bg-manage/appointment/manage';
import { getDate, formatDateToStr } from '@/libs/tools';
import confirmBox from '_c/confirmBox/index';
import $ from 'jquery';
import { saveLog } from '@/api/bg-manage/log';

export default {
  name: 'appointment',
  components: {
    NormalButton,
    selectBox,
    confirmBox
  },
  data () {
    return {
      videoUrl: '',
      showVideo: false,
      searchDate: '',
      personSelectModel: {
        idCard: '',
        name: ''
      },
      personSearchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          idCard: '',
          name: '',
          caseNo: ''
        }
      },
      personTotal: 0,
      personPageSizeOpts: [10, 15, 20],
      searchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          caseName: '',
          createDate: '',
          appointmentStatus: '',
          startDate: '',
          personName: '',
          queryType: 'manage'
        }
      },
      videoCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          inquiryId: ''
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
            let elementArray = [];

            /* if (approvalStatus == '1' && inquiryStatus == '0') {
              elementArray.push(h(NormalButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '进入提讯'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.openVideoCall(params.row);
                  }
                }
              }));
            } */

            // 提讯结束可以刻录光盘和查看录像
            if (inquiryStatus == '2') {
              /* elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'iconfont iconluxiang',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.openVideo(params.row.id);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '录像')])
              ]) */
              elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'iconfont iconchakan',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.openMonitor(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '查看视频')])
              ]), h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'iconfont iconxiazai',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.downloadVideo(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '下载视频')])
              ]), h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'iconfont iconkeluguangpan',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.burnCd(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '刻录')])
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
      videoData: [],
      videoCol: [{
        title: '序号',
        type: 'index',
        width: 90,
        align: 'center'
      }, {
        title: '案件名称',
        key: 'caseName',
        width: 150,
        align: 'center'
      }, {
        title: '讯问人',
        key: 'interrogator',
        width: 150,
        align: 'center'
      }, {
        title: '视频名称',
        key: 'videoName',
        width: 150,
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
          let elementArray = [];

          elementArray.push(h('span', [
            h('Tooltip', {
              props: {
                placement: 'top',
                transfer: true
              }
            }, [h('Icon', {
              props: {
                type: 'iconfont iconchakan',
                size: '20'
              },
              style: {
                marginRight: '5px',
                cursor: 'pointer',
                color: '#2BABFF'
              },
              on: {
                click: () => {
                  this.openMonitor(params.row.videoUrl);
                }
              }
            }),
            h('div', {
              slot: 'content',
              style: {
                whiteSpace: 'normal'
              }
            }, '查看')])
          ]), h('span', [
            h('Tooltip', {
              props: {
                placement: 'top',
                transfer: true
              }
            }, [h('Icon', {
              props: {
                type: 'iconfont iconxiazai',
                size: '20'
              },
              style: {
                marginRight: '5px',
                cursor: 'pointer',
                color: '#2BABFF'
              },
              on: {
                click: () => {
                  this.downloadVideo(params.row.videoUrl, params.row.videoName);
                }
              }
            }),
            h('div', {
              slot: 'content',
              style: {
                whiteSpace: 'normal'
              }
            }, '下载')])
          ]));

          return h('div', elementArray);
        }
      }],
      tableHeight: 0,
      appointmentListLength: 0,
      videoListLength: 0,
      pageSizeOpts: [10, 15, 20],
      videoPageSizeOpts: [10, 15, 20],
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
        placeName: ''
      },
      detailList: [],
      remoteRoomList: [],
      localRoomList: [],
      caseNameUrl: searchBoxDataUrl,
      submitClear: false,
      video: false,
      log: {
        loggerContent: ''
      }
    };
  },
  computed: {
  },
  methods: {
    openVideoCall (row) {
      window.open('http://192.168.1.225:3002/lawyer/1');
    },
    searchByCons () {
      this.searchCon.pageParam.pageIndex = 1;
      searchByParams(this.searchCon).then(res => {
        this.appointmentList = res.data.data;
        this.appointmentListLength = res.data.page.total;
      });
    },
    searchByParam () {
      this.searchCon.pageParam.pageIndex = 1;
      this.searchCon.data.startDate = formatDateToStr(this.searchCon.data.startDate);
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
      this.detailData = row;
      this.detailData.caseGmtCreate = row.caseGmtCreate == null ? '' : getDate(row.caseGmtCreate, 'year');
      this.detailData.meetStartTime = row.meetStartTime == null ? '' : getDate(row.meetStartTime, 'year');
      this.detailData.meetEndTime = row.meetEndTime == null ? '' : getDate(row.meetEndTime, 'year');
      this.detailData.inquiryTypeName = this.detailData.inquiryType === '1' ? '点对点提讯' : '多方提讯';
      this.detailModal = true;
    },
    openVideo (id) {
      this.videoCon.pageParam.pageIndex = 1;
      this.videoCon.data.inquiryId = id;
      queryVideoInfo(this.videoCon).then(res => {
        this.videoData = res.data.data;
        this.videoListLength = res.data.page.total;
        this.video = true;
      });
    },
    changeVideoPageIndex (index) {
      this.videoCon.pageParam.pageIndex = index;
      this.searchVideoByPage();
    },
    changeVideoPageSize (pageSize) {
      this.videoCon.pageParam.pageSize = pageSize;
      this.searchVideoByPage();
    },
    searchVideoByPage () {
      queryVideoInfo(this.videoCon).then(res => {
        this.videoData = res.data.data;
        this.videoListLength = res.data.page.total;
      });
    },
    openMonitor (row) {
      let data = '{"startTime":"' + getDate(row.videoStartTime, 'year') +
        '", "endTime":"' + getDate(row.videoEndTime, 'year') + '", "caseInfo":{"caseName":"' + row.caseName +
        '", "interrogator":"' + row.interrogator + '", "rybhName":"' + row.rybhName + '"}, "resumeEvent":{"struStartTime":"' +
        getDate(row.videoStartTime, 'year') + '", "struStopTime":"' + getDate(row.videoEndTime, 'year') + '", "byRoomIndex":"' +
        row.byRoomIndex + '", "byDriveIndex":"' + row.byDriveIndex + '", "wSegmetSize":"' + row.wSegmetSize + '", "dwSegmentNo":"' +
        row.dwSegmentNo + '", "byRes":"' + row.byRes + '"}}';
      let url = 'http://127.0.0.1/PlaybackByTime';
      let that = this;
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function (result) {
          console.log('success: ' + result);
        },
        error: function (err) {
          console.log('sendError: ' + err);
        }
      });
      that.log.loggerContent = '查看视频';
      that.saveLog(that.log);
    },
    closeVideo () {
      this.showVideo = false;
      this.$refs.monitorRef.pause();
    },
    downloadVideo (row) {
      let data = '{"startTime":"' + getDate(row.videoStartTime, 'year') +
          '", "endTime":"' + getDate(row.videoEndTime, 'year') + '", "caseInfo":{"caseName":"' + row.caseName +
          '", "interrogator":"' + row.interrogator + '", "rybhName":"' + row.rybhName + '"}}';
      let url = 'http://127.0.0.1/DownloadByTime';
      let that = this;
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function (result) {
          console.log('success: ' + result);
        },
        error: function (err) {
          console.log('sendError: ' + err);
        }
      });
      that.log.loggerContent = '下载视频';
      that.saveLog(that.log);
    },
    burnCd (row) {
      /* const msg = this.$Message.loading('光盘刻录中...', 0);
      setTimeout(msg, 5000); */
      let data = '{"appointmentStartTime":"' + getDate(row.meetStartTime, 'year') + '","appointmentEndTime":"' +
        getDate(row.meetEndTime, 'year') + '","resumeEvent":{"struStartTime":"' + getDate(row.videoStartTime, 'year') +
        '", "struStopTime":"' + getDate(row.videoEndTime, 'year') + '", "byRoomIndex":"' +
        row.byRoomIndex + '", "byDriveIndex":"' + row.byDriveIndex + '", "wSegmetSize":"' + row.wSegmetSize + '", "dwSegmentNo":"' +
        row.dwSegmentNo + '", "byRes":"' + row.byRes + '"}}';
      let url = 'http://127.0.0.1/InquestResumeEvent';
      let that = this;
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function (result) {
          console.log('success: ' + result);
        },
        error: function (err) {
          console.log('sendError: ' + err);
        }
      });
      that.log.loggerContent = '刻录视频';
      that.saveLog(that.log);
    },
    searchPersonByCon () {
      this.personSearchCon.pageParam.pageIndex = 1;
      this.personSearchCon.data.caseNo = this.addData.caseNo;
      queryPersonListByNo(this.personSearchCon).then(res => {
        this.detailList = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    changePersonPageIndex (index) {
      this.personSearchCon.pageParam.pageIndex = index;
      this.personSearchCon.data.caseNo = this.caseNo;
      this.searchPersonByPage();
    },
    changePersonPageSize (pageSize) {
      this.personSearchCon.pageParam.pageSize = pageSize;
      this.personSearchCon.data.caseNo = this.caseNo;
      this.searchPersonByPage();
    },
    searchPersonByPage () {
      queryPersonListByNo(this.personSearchCon).then(res => {
        this.detailList = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    getSelectPerson () {
      this.personSelectModal = false;
    },
    closeSelectPerson () {
      this.addData.rybh = '';
      this.addData.rybhName = '';
      this.personSelectModal = false;
    },
    initRoomList () {
      initLocalRoomList().then(res => {
        this.localRoomList = res.data.data;
      });
      initRemoteRoomList().then(res => {
        this.remoteRoomList = res.data.data;
      });
    },
    saveLog (params) {
      saveLog(params).then(res => {
      })
    }
  },
  watch: {
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop;
    this.searchByCons();
    // this.initRoomList();
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
</style>
