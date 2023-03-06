<template>
  <i-content class="main-content-con">
    <p class="statisticsTitle">预约申请</p>
    <div class="searchTitleInput">
      <span class="searchItemText">案件名称</span>
      <input class="searchItemInput" v-model="searchCon.data.caseName" placeholder="请输入案件名称"></input>
      <span class="searchItemText">创建日期</span>
      <i-date-picker v-model="searchDate" type="date" format="yyyy-MM-dd" placeholder="请选择创建时间"></i-date-picker>
      <span class="searchItemText">预约状态</span>
      <i-select v-model="searchCon.data.appointmentStatus" clearable>
        <i-option v-for="(item, index) in statusList" :value="item.value" :key="index">{{ item.name }}</i-option>
      </i-select>
      <i-button ghost style="display: inline-block; margin-left: 50px;" @click="searchByCons()" class="searchButton">查询</i-button>
      <i-button ghost style="display: inline-block; margin-left: 10px;" @click="openAddModal()" class="searchButton">新增预约</i-button>
      <i-button ghost style="display: inline-block; margin-left: 10px;" @click="openUploadModel()" class="searchButton uploadTemplate">上传通用模板</i-button>
    </div>
    <i-table border :columns="appointmentColumns" :data="appointmentList" ref="table" style="height:calc(100% - 320px)">
    </i-table>
    <div class="tablePage">
      <i-page style="text-align: right" show-total show-elevator show-sizer :current="searchCon.pageParam.pageIndex" :total="appointmentListLength" :page-size="searchCon.pageParam.pageSize" :page-size-opts="pageSizeOpts" @on-change="changeAppointmentPageIndex" @on-page-size-change="changeAppointmentPageSize">
      </i-page>
    </div>
    <i-modal v-model="detailModal" width="1100px">
      <p slot="header">
        <span class="title">预约详情</span>
      </p>
      <div class="caseInfo" style="height: 600px;overflow: auto;">
        <i-form ref="detailData" :model="detailData" :label-width="125" label-position="right">
          <span class="v-transfer-title">案件信息</span>
          <i-row>
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
              <i-form-item label="办案部门:" prop="caseDepartment">
                <i-input v-model="detailData.caseDepartment" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="案件创建时间:" prop="caseGmtCreate">
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
          <span class="v-transfer-title">被讯问人信息</span>
          <i-row>
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
          <i-row>
            <i-col span="8">
              <i-form-item label="监所:" prop="placeName">
                <i-input v-model="detailData.placeName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <span class="v-transfer-title">提讯信息</span>
          <i-row>
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
            <i-col span="8">
              <i-form-item label="提讯类型:" prop="inquiryType">
                <i-input v-model="detailData.inquiryTypeName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
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
              <i-form-item label="办案单位提讯室:" prop="localRoomName">
                <i-input v-model="detailData.localRoomName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="监所提讯室:" prop="remoteRoomName">
                <i-input v-model="detailData.remoteRoomName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <span style="font-size: 20px;color: #35FFFA">审核情况</span>
          <i-row>
            <Radio-group v-model="detailData.approvalStatus" style="margin-left: 123px;margin-top: 10px;margin-bottom: 10px">
              <Radio label="1" :disabled="detailData.approvalStatus"><span>同意</span></Radio>
              <Radio label="2" :disabled="detailData.approvalStatus"><span>不同意</span></Radio>

            </Radio-group>
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
    <i-modal v-model="addModal" width="1100px" @on-cancel="closeAddModal">
      <p slot="header">
        <span class="title">新增预约</span>
      </p>
      <div class="caseInfo">
        <i-form ref="addData" :model="addData" :label-width="135" label-position="right" :rules="addRule">
          <span class="v-transfer-title">案件信息</span>
          <i-row>
            <i-col span="24">
              <i-form-item label="案件名称:" prop="caseName" class="caseName">
                <select-box :idx="0" :url="caseNameUrl" :submitClear="submitClear" @val="getCaseNameItem"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="案件编号:" prop="caseNo" class="caseNo">
                <i-input v-model="addData.caseNo" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="办案部门:" prop="caseDepartment">
                <i-input v-model="addData.caseDepartment" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="案件创建时间:" prop="caseGmtCreate">
                <i-input v-model="addData.caseGmtCreate" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="24">
              <i-form-item label="简要案情:" prop="caseDesc" class="caseDetail">
                <i-input v-model="addData.caseDesc" type="textarea" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <span class="v-transfer-title">被讯问人信息</span>
          <span>
            <i-button class="searchButton" style="display: inline-block;margin-left: 27px" @click="openSelectPersonModal">新增人员</i-button>
          </span>
          <i-row>
            <i-col span="8">
              <i-form-item label="被讯问人:" prop="rybhName">
                <i-input v-model="addData.rybhName" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="证件类型:" prop="idType">
                <i-input v-model="addData.idType" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="证件号码:" prop="idCard">
                <i-input v-model="addData.idCard" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="监所:" prop="placeName">
                <i-input v-model="addData.placeName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <span class="v-transfer-title">提讯信息</span>
          <span>
            <i-button class="searchButton" style="display: inline-block;margin-left: 27px" @click="openSelectRoomModal">提讯室选择</i-button>
          </span>
          <i-row>
            <i-col span="8">
              <i-form-item label="讯问人:" prop="interrogator">
                <i-input v-model="addData.interrogator"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="讯问人联系方式:" prop="phoneNo">
                <i-input v-model="addData.phoneNo"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="提讯类型:" prop="inquiryType">
                <i-select v-model="addData.inquiryType" placement="top" clearable>
                  <i-option v-for="(item, index) in inquiryTypeList" :value="item.value" :key="index">{{ item.name }}</i-option>
                </i-select>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="开始时间:" prop="meetStartTime">
                <i-input v-model="addData.meetStartTime" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="结束时间:" prop="meetEndTime">
                <i-input v-model="addData.meetEndTime" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="办案单位提讯室:" prop="localRoom">
                <i-input v-model="addData.localRoomName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="监所提讯室:" prop="remoteRoom">
                <i-input v-model="addData.remoteRoomName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="saveAddModal()">保存</Button>
        <Button type="primary" @click="closeAddModal()">关闭</Button>
      </div>
    </i-modal>
    <i-modal v-model="modifyModal" width="1300px">
      <p slot="header">
        <span class="title">修改预约</span>
      </p>
      <div class="caseInfo" style="height: 600px;overflow: auto;">
        <i-form ref="modifyData" :model="modifyData" :label-width="155" label-position="right" :rules="modifyRule">
          <span class="v-transfer-title">案件信息</span>
          <i-row>
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
              <i-form-item label="办案部门:" prop="caseDepartment">
                <i-input v-model="modifyData.caseDepartment" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="案件创建时间:" prop="caseGmtCreate">
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
          <span class="v-transfer-title">被讯问人信息</span>
          <i-row>
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
          <span class="v-transfer-title">提讯信息</span>
          <i-row>
            <i-col span="8">
              <i-form-item label="讯问人:" prop="interrogator">
                <i-input v-model="modifyData.interrogator"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="开始时间:" prop="meetStartTime">
                <i-date-picker v-model="modifyData.meetStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间"></i-date-picker>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="结束时间:" prop="meetEndTime">
                <i-date-picker v-model="modifyData.meetEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间"></i-date-picker>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="提讯类型:" prop="inquiryType">
                <i-select v-model="modifyData.inquiryType" placement="top" clearable>
                  <i-option v-for="(item, index) in inquiryTypeList" :value="item.value" :key="index">{{ item.name }}</i-option>
                </i-select>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="办案单位提讯室:" prop="localRoom">
                <i-input v-model="modifyData.localRoomName"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="监所提讯室:" prop="remoteRoom">
                <i-input v-model="modifyData.remoteRoomName"></i-input>
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
    <i-modal v-model="personSelectModal" width="1300">
      <p slot="header">
        <span class="title">选择涉案人员</span>
      </p>
      <div class="personSelectInfo" style="height: 500px;overflow: auto;">
        <i-form ref="personSelectModel" :model="personSelectModel" :label-width="86" label-position="right">
          <i-row>
            <i-col span="6">
              <i-form-item label="姓名:" prop="name">
                <i-input v-model="personSearchCon.data.name"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="6">
              <i-form-item label="证件号码:" prop="idCard">
                <i-input v-model="personSearchCon.data.idCard"></i-input>
              </i-form-item>
            </i-col>
            <i-button ghost class="searchButton" style="display: inline-block;margin-left: 100px" @click="searchPersonByCon">查询</i-button>
          </i-row>
          <i-table border ref="table" :columns="addColumns" :data="detailList" style="height:360px">
          </i-table>
          <div class="tablePage">
            <i-page style="text-align: right" :current="personSearchCon.pageParam.pageIndex" :total="personTotal" :page-size="personSearchCon.pageParam.pageSize" :page-size-opts="personPageSizeOpts" show-total @on-change="changePersonPageIndex" @on-page-size-change="changePersonPageSize" show-elevator show-sizer>
            </i-page>
          </div>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="closeSelectPerson">关闭</Button>
        <Button type="primary" @click="getSelectPerson">确定</Button>
      </div>
    </i-modal>
    <i-modal v-model="roomSelectModal" width="1372px">
      <p slot="header">
        <span class="title">提讯室选择</span>
      </p>
      <div class="personSelectInfo" style="overflow: auto;">
        <div>
          <i-date-picker v-model="roomSelectDate" :options="optionsDate" type="datetime" format="yyyy-MM-dd" placeholder="请选择开始日期" @on-change="changeRoomDate"></i-date-picker>
        </div>
        <div class="chooseRoom">
          <p>办案单位提讯室</p>
          <case-room-choose :nameArray="caseRoomChooseArray" :disabled="caseRoomDisabledArray" :clear="roomSelectModal" @endTime="getTimeAndRoom($event)" />
          <p>
            <span>已选提讯室：{{getCaseRoomName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>时间：{{getChooseTime}}</span>
          </p>
        </div>
        <div class="chooseRoom">
          <p>监所提讯室</p>
          <prisoner-room-choose :nameArray="prisonerRoomChooseArray" :disabled="prisonerDisableRoomChooseArray" :clear="roomSelectModal" :indexs="currentIndexs" @getRoomName="getRoomName($event)" ref="prisonerRoomChoose" />
          <p>
            <span>已选提讯室：{{getPrisonerRoomName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>时间：{{getChooseTime}}</span>
          </p>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <Button class="searchButton" type="primary" @click="getSelectRoom">确定选择</Button>
      </div>
    </i-modal>
    <i-modal v-model="uploadTempModel" width="55%" height="80%">
      <p slot="header">
        <span class="title">上传通用模板</span>
      </p>
      <div style="width:100%">
        <i-upload action="" style="margin-left: 80%;margin-top:-30px;" type="select" :before-upload="uploadDefaultTemp" :format="['doc', 'docx', 'DOC', 'DOCX']" accept=".doc,.docx,.DOC,.DOCX">
          <NormalButton type="primary" label="新增" size="small" class="searchButton" @click="defaultTempId = ''"></NormalButton>
        </i-upload>
      </div>
      <i-table border ref="table" :columns="defaultTempColumns" :data="defaultTempData" style="height: 380px;">
      </i-table>
      <div class="confirmButton" slot="footer">
        <div class="tablePage">
          <i-page style="text-align: right;margin-bottom: 15px;" :current="defaultTempCon.pageParam.pageIndex" :total="defaultTempTotal" :page-size="defaultTempSize" :page-size-opts="pageSizeOpts" show-total @on-change="changeDefaultTempIndex" @on-page-size-change="changeDefaultTempSize" show-elevator show-sizer>
          </i-page>
        </div>
      </div>
    </i-modal>
  </i-content>
</template>
<script>
import NormalButton from '_c/normal-button';
import selectBox from '_c/select-box/select-box.vue';
import {
  searchByParams, queryPersonListByNo, saveAppointmentData, initLocalRoomList, initDisableLocalRoomList, initRemoteRoomList, searchBoxDataUrl, ifAudited, getSelectPlace, searchDefaultTemp, uploadDefaultTemplate, deleteDefaultTemplate, orderDefaultTemp,
} from '@/api/bg-manage/appointment/manage';
import { getDate, formatDateToStr } from '@/libs/tools';
import prisonerRoomChoose from '_c/chooseRoom/prisonerRoomChoose.vue';
import caseRoomChoose from '_c/chooseRoom/caseRoomChoose.vue';
import { validatePhone } from '@/libs/verification';

export default {
  name: 'appointment',
  components: {
    NormalButton,
    selectBox,
    prisonerRoomChoose,
    caseRoomChoose
  },
  data () {
    return {
      uploadTempModel: false,
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
      // 修改模板ID
      defaultTempId: '',
      // 删除模板ID
      deleteDefaultTempId: '',
      // 通用模板列表
      defaultTempData: [],
      defaultTempColumns: [
        {
          title: '模板名称',
          align: 'center',
          key: 'encName'
        },
        {
          title: '排序',
          align: 'center',
          render: (h, params) => {
            let elementArray = [];
            let tempType = params.row.tempType;
            let maxTempType = params.row.maxTempType;
            let minTempType = params.row.minTempType;
            if (tempType !== minTempType) {
              elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'md-arrow-dropup',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.orderTemp('up', params.row.id);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '上移')])
              ]));
            }
            if (tempType !== maxTempType) {
              elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'md-arrow-dropdown',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#2BABFF'
                  },
                  on: {
                    click: () => {
                      this.orderTemp('down', params.row.id);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '下移')])
              ]));
            }
            return h('div', elementArray);
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Upload', {
                props: {
                  type: 'select',
                  action: '',
                  format: ['doc', 'docx', 'DOC', 'DOCX'],
                  accept: '.doc,.docx,.DOC,.DOCX',
                  'before-upload': this.uploadDefaultTemp
                },
                style: {
                  display: 'inline',
                  marginLeft: '35%',
                  float: 'left'
                }
              },
                [
                  h(NormalButton, {
                    props: {
                      type: 'primary',
                      size: 'small',
                      label: '修改',
                      perms: 'manage:upload'
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.defaultTempId = params.row.id;
                      }
                    }
                  })
                ]),
              h(NormalButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '删除',
                  perms: 'manage:delete'
                },
                style: {
                  marginLeft: '1%',
                  marginTop: '6px',
                  float: 'left'
                },
                on: {
                  click: () => {
                    this.deleteDefaultTempId = params.row.id;
                    this.deleteDefaultTemp(params.row.id);
                  }
                }
              })
            ]);
          }
        }
      ],
      // 上传通用模板分页
      defaultTempCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      defaultTempTotal: 0,
      defaultTempSize: 10,
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
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
          queryType: 'order'
        }
      },
      statusList: [
        { value: '0', name: '待审核' },
        { value: '1', name: '审核通过' },
        { value: '2', name: '不予提讯' },
        { value: '3', name: '逾期取消' }
      ],
      inquiryTypeList: [
        { value: '1', name: '点对点提讯' },
        { value: '2', name: '多方提讯' }
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
          align: 'center',
          key: 'placeName'
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
          title: '验证码',
          align: 'center',
          key: 'verificationCode'
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
            return h('div', actionArray);
          }
        }
      ],
      appointmentList: [],
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
        phoneNo: '',
        placeName: '',
        approvalStatus: '',
        checkRemark: ''
      },
      addColumns: [
        {
          title: '#',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('Radio', {
              props: {
                value: params.row.tag
              },
              on: {
                input: () => {
                  this.detailList.map(item => {
                    item.tag = false;
                  });
                  this.detailList[params.index].tag = true;
                  this.addData.rybh = this.detailList[params.index].rybh;
                  this.addData.rybhName = this.detailList[params.index].rybhName;
                  this.addData.idType = this.detailList[params.index].idType;
                  this.addData.idCard = this.detailList[params.index].idCard;
                  this.addData.unitCode = this.detailList[params.index].unitCode;
                  this.addData.placeName = this.detailList[params.index].placeName;
                }
              }
            });
          }
        },
        {
          title: '姓名',
          key: 'rybhName',
          align: 'center'
        },
        {
          title: '监所',
          key: 'placeName',
          align: 'center'
        },
        {
          title: '性别',
          align: 'center',
          render: (h, params) => {
            if (params.row.sex) {
              if (params.row.sex == '0') {
                return h('span', '未知的性别');
              } else if (params.row.sex == '1') {
                return h('span', '男');
              } else if (params.row.sex == '2') {
                return h('span', '女');
              } else if (params.row.sex == '5') {
                return h('span', '女性改（变）为男性');
              } else if (params.row.sex == '6') {
                return h('span', '男性改（变）为女性');
              } else if (params.row.sex == '9') {
                return h('span', '未说明的性别');
              }
            }
          }
        },
        {
          title: '出生日期',
          key: 'birthday',
          align: 'center',
          render: (h, params) => {
            if (params.row.birthday) {
              return h('span', getDate(params.row.birthday, 'year'));
            }
          }
        },
        {
          title: '证件类型',
          key: 'idType',
          align: 'center'
        },
        {
          title: '证件号码',
          key: 'idCard',
          align: 'center'
        }
      ],
      detailList: [],
      addModal: false,
      addData: {
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
        unitCode: '',
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
        localRoom: '',
        localRoomName: '',
        remoteRoom: '',
        remoteRoomName: '',
        rybh: '',
        rybhName: '',
        idType: '',
        idCard: ''
      },
      personSelectModal: false,
      caseNameUrl: searchBoxDataUrl,
      submitClear: false,
      addRule: {
        caseName: [{ required: true, message: '不能为空' }],
        rybhName: [{ required: true, message: '不能为空' }],
        interrogator: [{ required: true, message: '不能为空' }],
        meetStartTime: [{ required: true, message: '不能为空' }],
        meetEndTime: [{ required: true, message: '不能为空' }],
        inquiryType: [{ required: true, message: '不能为空' }],
        localRoomName: [{ required: true, message: '不能为空' }],
        remoteRoomName: [{ required: true, message: '不能为空' }],
        phoneNo: { required: true, validator: validatePhone, trigger: 'blur' }
      },
      modifyRule: {
        interrogator: [{ required: true, message: '不能为空' }],
        meetStartTime: [{ required: true, message: '不能为空' }],
        meetEndTime: [{ required: true, message: '不能为空' }],
        inquiryType: [{ required: true, message: '不能为空' }],
        localRoomName: [{ required: true, message: '不能为空' }],
        remoteRoomName: [{ required: true, message: '不能为空' }]
      },
      roomSelectModal: false,
      place: [],
      getDate: getDate,
      prisonerRoomChooseArray: [],
      prisonerDisableRoomChooseArray: [],
      getPrisonerRoomName: '',
      caseRoomChooseArray: [],
      caseRoomDisabledArray: [],
      currentIndexs: [],
      getCaseRoomName: '',
      getChooseTime: '',
      roomSelectDate: new Date(),
      chooseRemoteName: '',
      chooseRemoteRoom: '',
      chooseLocalRoom: '',
      chooseTimeStart: '',
      chooseTimeEnd: '',
      chooseTimeIdx: [],
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    };
  },
  mounted () {
    this.searchByCons();
    getSelectPlace().then(res => {
      this.place = res.data.data;
    });
  },
  methods: {
    getCaseNameItem (el) {
      // 每次重新选择案件信息，人员信息和提讯信息清空，因为案件信息与人员信息和提讯信息一一对应
      this.addData.rybhName = '';
      this.addData.idType = '';
      this.addData.idCard = '';
      this.addData.placeName = '';
      this.addData.phoneNo = '';
      this.addData.remoteRoomName = '';
      this.addData.remoteRoom = '';
      this.addData.localRoomName = '';
      this.addData.localRoom = '';
      this.addData.meetStartTime = '';
      this.addData.meetEndTime = '';
      this.addData.inquiryType = '1';
      this.addData.interrogator = this.$store.state.user.userName;
      this.addData.caseNo = el.code;
      this.addData.caseName = el.label;
      this.addData.caseDepartment = el.caseDepartment;
      this.addData.caseGmtCreate = el.caseGmtCreate != null ? getDate(el.caseGmtCreate, 'year') : '';
      this.addData.caseCreateBy = el.caseCreateBy;
      this.addData.caseDesc = el.caseDesc;
    },
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
    openAddModal () {
      this.submitClear = !this.submitClear;
      this.addData.inquiryType = '1';
      this.addData.interrogator = this.$store.state.user.userName;
      this.addModal = true;
      this.getChooseTime = '';
    },
    openDetailModal (row) {
      this.detailData = row;
      this.detailData.caseGmtCreate = this.detailData.caseGmtCreate == null ? '' : getDate(this.detailData.caseGmtCreate, 'year');
      this.detailData.meetStartTime = this.detailData.meetStartTime == null ? '' : getDate(this.detailData.meetStartTime, 'year');
      this.detailData.meetEndTime = this.detailData.meetEndTime == null ? '' : getDate(this.detailData.meetEndTime, 'year');
      this.detailData.inquiryTypeName = this.detailData.inquiryType == '1' ? '点对点提讯' : '多方提讯';

      this.detailModal = true;
    },
    openModifyModal (row) {
      ifAudited(row.id).then(res => {
        if (res.data.data == true) {
          this.modifyData = row;
          this.modifyData.caseGmtCreate = this.modifyData.caseGmtCreate == null ? '' : getDate(this.modifyData.caseGmtCreate, 'year');
          this.modifyData.meetStartTime = this.modifyData.meetStartTime == null ? '' : new Date(this.modifyData.meetStartTime);
          this.modifyData.meetEndTime = this.modifyData.meetEndTime == null ? '' : new Date(this.modifyData.meetEndTime);
          this.modifyModal = true;
        } else {
          this.$Message.success('该条数据已审核，无法修改!');
          this.searchByCons();
        }
      });
    },
    saveAddModal () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          saveAppointmentData({ entity: this.addData, idx: this.chooseTimeIdx }).then(res => {
            if (res.data.state.code == 200) {
              this.$Message.success('保存成功!');
              this.closeAddModal();
              this.searchByCons();
            }
          });
        } else {
          this.$Message.error(res.data.data);
        }
      });
    },
    saveModifyModal () {
      this.$refs['modifyData'].validate((valid) => {
        if (valid) {
          saveAppointmentData({ entity: this.addData, idx: this.chooseTimeIdx }).then(res => {
            if (res.data.state.code == 200) {
              this.$Message.success('修改成功!');
              this.modifyModal = false;
              this.searchByCons();
            }
          });
        } else {
          this.$Message.error(res.data.data);
        }
      });
    },
    closeAddModal () {
      this.$refs.addData.resetFields();
      this.$nextTick(() => (this.addModal = false));
    },
    searchDefaultTemp () {
      this.defaultTempCon.pageParam.pageIndex = 1;
      searchDefaultTemp(this.defaultTempCon).then(res => {
        if (res.data.state.code === 200) {
          this.defaultTempData = res.data.data;
          this.defaultTempTotal = res.data.page && res.data.page.total;
        }
      });
    },
    // 打开上传模板弹框
    openUploadModel () {
      this.searchDefaultTemp();
      this.uploadTempModel = true;
    },
    // 新增|修改通用模板
    uploadDefaultTemp (file) {
      const formData = new window.FormData();
      formData.append('file', file);
      formData.append('tempType', this.defaultTempId);
      uploadDefaultTemplate(formData).then(res => {
        if (res.data.state.code === 200) {
          this.$Message.success('上传成功');
          this.searchDefaultTemp();
        }
      });
      return false;
    },
    // 删除通用模板
    deleteDefaultTemp (id) {
      deleteDefaultTemplate(id).then(res => {
        if (res.data.state.code === 200) {
          this.$Message.success('删除成功');
          this.deleteDefaultTempId = '';
          this.searchDefaultTemp();
        }
      });
    },
    // 通用模板排序
    orderTemp (action, tempId) {
      orderDefaultTemp(action, tempId).then(res => {
        if (res.data.state.code === 200) {
          this.searchDefaultTemp();
        }
      });
    },
    changeDefaultTempIndex (index) {
      this.defaultTempCon.pageParam.pageIndex = index;
      this.searchDefaultTempByPage();
    },
    changeDefaultTempSize (pageSize) {
      this.defaultTempCon.pageParam.pageSize = pageSize;
      this.searchDefaultTempByPage();
    },
    searchPersonByCon () {
      this.personSearchCon.pageParam.pageIndex = 1;
      this.personSearchCon.data.caseNo = this.addData.caseNo;
      queryPersonListByNo(this.personSearchCon).then(res => {
        let data = res.data.data;
        data.forEach((item) => {
          for (let i = 0; i < this.place.length; i++) {
            if (item.unitCode == this.place[i].code) {
              item.placeName = this.place[i].name;
            }
          }
        });
        this.detailList = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    openSelectPersonModal () {
      if (this.addData.caseNo == '' || this.addData.caseNo == undefined) {
        this.$Message.success('请先选择案件!');
      } else {
        this.searchPersonByCon();
        this.personSelectModal = true;
      }
    },
    changePersonPageIndex (index) {
      this.personSearchCon.pageParam.pageIndex = index;
      this.personSearchCon.data.caseNo = this.addData.caseNo;
      this.searchPersonByPage();
    },
    changePersonPageSize (pageSize) {
      this.personSearchCon.pageParam.pageSize = pageSize;
      this.personSearchCon.data.caseNo = this.addData.caseNo;
      this.searchPersonByPage();
    },
    searchPersonByPage () {
      queryPersonListByNo(this.personSearchCon).then(res => {
        let data = res.data.data;
        data.forEach((item) => {
          for (let i = 0; i < this.place.length; i++) {
            if (item.unitCode === this.place[i].code) {
              item.placeName = this.place[i].name;
            }
          }
        });
        this.detailList = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    getSelectPerson () {
      this.personSelectModal = false;
      this.addData.phoneNo = '';
      this.addData.remoteRoomName = '';
      this.addData.remoteRoom = '';
      this.addData.localRoomName = '';
      this.addData.localRoom = '';
      this.addData.meetStartTime = '';
      this.addData.meetEndTime = '';
    },
    closeSelectPerson () {
      this.addData.rybh = '';
      this.addData.rybhName = '';
      this.personSelectModal = false;
    },
    initRoomList () {
      initLocalRoomList().then(res => {
        this.caseRoomChooseArray = res.data.data;
        initDisableLocalRoomList('1', formatDateToStr(this.roomSelectDate)).then(res => {
          this.caseRoomDisabledArray = res.data.data;
        });
      });
      initRemoteRoomList(this.getChooseTime, formatDateToStr(this.roomSelectDate), this.addData.unitCode).then(res => {
        this.prisonerRoomChooseArray = res.data.data;
        initDisableLocalRoomList('2', formatDateToStr(this.roomSelectDate)).then(res => {
          this.prisonerDisableRoomChooseArray = res.data.data;
        });
      });
    },
    openSelectRoomModal () {
      if (this.addData.rybhName == '' || this.addData.rybhName == undefined) {
        this.$Message.success('请先选择人员!');
      } else {
        this.initRoomList();
        this.roomSelectModal = true;
      }
    },
    getRoomName (val) {
      this.getPrisonerRoomName = val[0];
      this.chooseRemoteName = val[0];
      this.chooseRemoteRoom = val[1];
    },
    getTimeAndRoom (val) {
      this.getPrisonerRoomName = '';
      this.getChooseTime = val[0];
      this.getCaseRoomName = val[1];
      this.chooseLocalRoom = val[2];
      this.chooseTimeIdx = val[3];
      this.currentIndexs = val[3].sort((a, b) => a - b);
      this.chooseTimeStart = formatDateToStr(this.roomSelectDate) + ' ' + val[0].split('-')[0] + ':00';
      this.chooseTimeEnd = formatDateToStr(this.roomSelectDate) + ' ' + val[0].split('-')[1] + ':00';
      initRemoteRoomList(this.getChooseTime, formatDateToStr(this.roomSelectDate), this.addData.unitCode).then(res => {
        if (res.data.state.code === 200) {
          this.prisonerRoomChooseArray = res.data.data;
          if (!!this.chooseLocalRoom) {
            let localRoom = "2" + this.chooseLocalRoom.slice(1);
            this.prisonerRoomChooseArray = this.prisonerRoomChooseArray.filter(room => room.id === localRoom);
            const { name, id } = this.prisonerRoomChooseArray[0];
            this.getRoomName([name, id]);
            let chooseRemoteRoom = document.querySelectorAll('.prisonerRoomChoose span');
            if (this.currentIndexs.length === 1) {
              chooseRemoteRoom[this.currentIndexs].classList.add('choose');
            } else {
              for (let i = this.currentIndexs[0]; i <= this.currentIndexs[1]; i++) {
                chooseRemoteRoom[i].classList.add('choose');
              }
            }
          } else {
            this.initRoomList();
          }
        }
      });
      this.$refs.prisonerRoomChoose.getDisable();
      this.getPrisonerRoomName = '';
      this.chooseRemoteName = '';
      this.chooseRemoteRoom = '';
    },
    getSelectRoom () {
      if (this.chooseLocalRoom == '' || this.chooseLocalRoom == null) {
        this.$Message.success('请选择办案单位提讯室!');
        return;
      }
      if (this.chooseRemoteRoom == '' || this.chooseRemoteRoom == null) {
        this.$Message.success('请选择监所提讯室!');
        return;
      }
      if (this.roomSelectDate == '' || this.roomSelectDate == null) {
        this.$Message.success('请选择预约日期!');
        return;
      }
      this.addData.remoteRoomName = this.chooseRemoteName;
      this.addData.remoteRoom = this.chooseRemoteRoom;
      this.addData.localRoomName = this.getCaseRoomName;
      this.addData.localRoom = this.chooseLocalRoom;
      this.addData.meetStartTime = this.chooseTimeStart;
      this.addData.meetEndTime = this.chooseTimeEnd;
      this.roomSelectModal = false;
    },
    changeRoomDate () {
      this.initRoomList();
    }
  },
};
</script>
<style lang="less" scoped>
/deep/.caseInfo {
  .caseDetail {
    .ivu-input {
      width: 893px;
      height: 100px !important;
    }
  }
}
/deep/ .unit {
  .ivu-input {
    width: 520px !important;
  }
}
.chooseRoom {
  width: 50%;
  height: 520px;
  display: inline-block;
  vertical-align: top;
  &:nth-child(2) {
    padding-right: 20px;
    border-right: 1px solid #00c6ff;
    width: calc(~'50% - 1px');
  }
  &:nth-child(3) {
    padding-left: 20px;
    width: 50%;
  }
  > p {
    color: rgba(53, 255, 250, 1);
    font: bold 26px/56px Microsoft YaHei;
  }
  > p:nth-child(3) {
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    > span:nth-child(1) {
      display: inline-block;
    }
    > span:nth-child(2) {
      display: inline-block;
      width: 300px;
    }
  }
}
</style>
