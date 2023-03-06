<template>
  <i-content class="main-content-con manage">
    <p class="statisticsTitle">案件管理</p>
    <div class="searchTitleInput">
      <span class="searchItemText">案件名称:</span>
      <input class="searchItemInput" v-model="searchCon.data.caseName" type="text">
      <span class="searchItemText">创建时间:</span>
      <i-date-picker type="daterange" format="yyyy-MM-dd" @on-change="changeDate" placeholder="请输入日期"></i-date-picker>
      <i-button ghost class="searchButton" style="display: inline-block;float: right" @click="openCaseModal">新增案件</i-button>
      <!-- <i-button ghost style="display: inline-block; float: right;margin-right: 5px" class="searchButton">案件导出</i-button> -->
      <i-button ghost style="display: inline-block; float: right;margin-right: 5px" class="searchButton" @click="confirmSaveFile">归档</i-button>
      <i-button ghost style="display: inline-block; float: right;margin-right: 5px" class="searchButton" @click="searchByCon">查询</i-button>
    </div>
    <i-table border ref="table" :columns="columns" :data="data" @on-selection-change="seelctChange" style="height:calc(100% - 320px);margin:0 10px;">
    </i-table>
    <div class="tablePage">
      <i-page style="text-align: right" :current="searchCon.pageParam.pageIndex" :total="total" :page-size="searchCon.pageParam.pageSize" :page-size-opts="pageSizeOpts" show-total @on-change="changePageIndex" @on-page-size-change="changePageSize" show-elevator show-sizer>
      </i-page>
    </div>
    <i-modal v-model="caseModal" width="1000" @on-visible-change="closeCaseModal">
      <p slot="header">
        <span class="title">案件{{this.operateName == 'show' ?'详情': this.operateName == 'add' ? '创建': '修改'}}</span>
      </p>
      <div class="caseInfo" style="height: 550px;overflow: auto;">
        <i-form ref="caseModel" :model="caseModel" :rules="caseRuleValidate" :label-width="86" label-position="right">
          <span class="v-transfer-title">案件信息</span>
          <span style="margin-left: 16px;"><span style="color:#35FFFA">*</span>项为必填项</span>
          <i-row>
            <i-col span="8">
              <i-form-item label="案件编号:" prop="caseNo">
                <i-input v-model="caseModel.caseNo" :readonly="this.operateName == 'add' ? false: 'readonly'  "></i-input>
              </i-form-item>
            </i-col>
            <i-col span="16" v-show="!isDetail">
              <i-col span="6">
                <i-button ghost style="display: inline-block;width: 145px!important;margin-top: -6px;" class="searchButton">实战平台信息复用</i-button>
              </i-col>
              <i-col span="16">
                <i-form-item label="同案编号:" prop="sameNo" class="caseNoPosition">
                  <i-input></i-input>
                </i-form-item>
              </i-col>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="24">
              <i-form-item label="案件名称:" prop="caseName" class="caseName">
                <i-input v-model="caseModel.caseName" :readonly="this.operateName == 'show' ?  'readonly':false "></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="办案单位:" prop="caseDepartment"  >
                <select-box :idx="0" :url="url" :isDisabled="this.operateName == 'show' ?  true : false " :modify="caseModel.caseDepartment" typeCode="SYS_DIC_SENDING_UNIT" @val="getDept" :submitClear="submitClear1"  ></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="创建时间:" prop="gmtCreate" :label-width="120">
                <i-input v-model="caseModel.gmtCreate" disabled></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="创建人:" prop="createBy">
                <i-input v-model="userName" disabled></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="24">
              <i-form-item label="简要案情:" prop="caseDesc" class="caseDetail">
                <i-input v-model="caseModel.caseDesc"  type="textarea"  :readonly="this.operateName == 'show' ?  'readonly':false "/>
              </i-form-item>
            </i-col>
          </i-row>
          <span class="v-transfer-title">涉案人员信息</span>
          <span>
            <i-button ghost v-show="!isDetail" class="searchButton" style="margin-left: 27px" @click="openSelectPersonModal">新增人员</i-button>
          </span>
          <i-table border ref="personTable" :columns="columns1" :data="personSelectList" style="height:300px;margin:0 10px">
          </i-table>
          <!--   <span v-show="!isDetail" style="font-size: 20px;color: #35FFFA;display:inline-block;margin-bottom:22px;">附件</span>
            <span><i-button ghost v-show="!isDetail" class="searchButton" style="display: inline-block;margin-left: 27px" @click="openSelectPersonModal">新增人员</i-button></span>
-->
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button ghost v-show="!isDetail" class="searchButton" @click="saveCase">确认</Button>
        <Button ghost class="searchButton" @click="closeCaseModal(false)">取消</Button>
      </div>
    </i-modal>
    <i-modal v-model="personModal" width="1100px" @on-visible-change="closePersonModal">
      <p slot="header">
        <span class="title">涉案人员信息</span>
      </p>
      <div class="personInfo">
        <i-form ref="personModel" :rules="personRuleValidate" :model="personModel" :label-width="100" label-position="right">
          <i-row>
            <i-col span="8">
              <i-form-item label="姓名:" prop="xm">
                <i-input v-model="personModel.xm"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="证件类型:" prop="zjlx">
                <select-box :idx="1" :url="url" typeCode="SYS_DIC_CERTIFICATE" @val="getZjlx" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="证件编号:" prop="zjhm">
                <i-input v-model="personModel.zjhm"></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="在押监所:" prop="dwdm">
                <i-select filterable clearable v-model="personModel.dwdm" ref="zyjs">
                  <i-option v-for="(item,index) in organizeList" :value="item.code" :key="index">{{ item.name }}</i-option>
                </i-select>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="别名或绰号:" prop="bm">
                <i-input v-model="personModel.bm"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="性别:" prop="xb">
                <select-box :idx="2" :url="url" typeCode="SYS_DIC_SEX" @val="getXb" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="出生日期:" prop="csrq">
                <i-date-picker type="date" format="yyyy-MM-dd" v-model="personModel.csrq" placeholder="请输入日期"></i-date-picker>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="文化程度:" prop="whcd">
                <select-box :idx="3" :url="url" typeCode="SYS_DIC_EDUCATION" @val="getWhcd" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="国籍:" prop="gj">
                <select-box :idx="4" :url="url" typeCode="SYS_DIC_NATIONALITY" :modify="gj" @val="getGj" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="民族:" prop="mz">
                <select-box :idx="5" :url="url" typeCode="SYS_DIC_NATION" :modify="mz" @val="getMz" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="婚姻状况:" prop="hyzk">
                <select-box :idx="6" :url="url" typeCode="SYS_DIC_MARITAL_STATUS" @val="getHyzk" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="政治面貌:" prop="zzmm">
                <select-box :idx="7" :url="url" typeCode="SYS_DIC_POLITICAL_STATUS" @val="getZzmm" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="籍贯:" prop="jg">
                <select-box :idx="8" :url="url" typeCode="SYS_DIC_PROVINCE" @val="getJg" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="职务:" prop="zw">
                <i-input v-model="personModel.zw"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="职务级别:" prop="zwjb">
                <select-box :idx="9" :url="url" typeCode="SYS_DIC_JOB_LEVEL" @val="getZwjb" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="档案编号:" prop="dabh">
                <i-input v-model="personModel.dabh"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="特殊身份:" prop="tssf">
                <i-input v-model="personModel.tssf"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="入所原因:" prop="rsyy">
                <select-box :idx="10" :url="url" typeCode="SYS_DIC_ENTRY_REASON" @val="getRsyy" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="关押期限:" prop="gyqx">
                <i-date-picker type="date" format="yyyy-MM-dd" v-model="personModel.gyqx" placeholder="请输入日期"></i-date-picker>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="工作单位:" prop="gzdw">
                <i-input v-model="personModel.gzdw"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="居住地详址:" prop="jzdxz">
                <i-input v-model="personModel.jzdxz"></i-input>
              </i-form-item>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="8">
              <i-form-item label="户籍地详址:" prop="hjdxz">
                <i-input v-model="personModel.hjdxz"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="涉嫌罪名:" prop="sxzm">
                <select-box :idx="11" :url="url" typeCode="SYS_DIC_CHARGE" @val="getSxzm" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
            <i-col span="8">
              <i-form-item label="诉讼环节:" prop="sshj">
                <select-box :idx="12" :url="url" typeCode="SYS_DIC_LITIGATION" @val="getSshj" :submitClear="submitClear"></select-box>
              </i-form-item>
            </i-col>
          </i-row>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button ghost class="searchButton" @click="savePerson">确定</Button>
        <Button ghost class="searchButton" @click="personModal = false">关闭</Button>
      </div>
    </i-modal>
    <i-modal v-model="personSelectModal" width="1300" @on-visible-change="closeSelectPersonModal">
      <p slot="header">
        <span class="title">选择涉案人员</span>
      </p>
      <div class="personSelectInfo" style="height:500px;overflow: auto;">
        <i-form ref="personSelectModel" :model="personSelectModel" :label-width="86" label-position="right">
          <i-row>
            <i-col span="6">
              <i-form-item label="姓名:" prop="name">
                <i-input v-model="personSearchCon.data.name"></i-input>
              </i-form-item>
            </i-col>
            <i-col span="6">
              <i-form-item label="证件编号:" prop="idCard">
                <i-input v-model="personSearchCon.data.idCard"></i-input>
              </i-form-item>
            </i-col>
           <!-- <i-col span="6">
              <i-form-item label="案件编号:" prop="caseNo">
                <i-input v-model="personSearchCon.data.caseNo"></i-input>
              </i-form-item>
            </i-col>-->
            <i-button ghost class="searchButton" style="display: inline-block;position: relative;top:-5px;" @click="searchPersonByCon">查询</i-button>
            <i-button ghost class="searchButton" style="display: inline-block;margin-left: 10px;position: relative;top:-5px;" @click="openPersonModal">新增</i-button>
          </i-row>
          <i-table border ref="personSelectTable" :columns="personColumns" :data="personData" style="height:360px">

          </i-table>
          <div class="tablePage">
            <i-page style="text-align: right" :current="personSearchCon.pageParam.pageIndex" :total="personTotal" :page-size="personSearchCon.pageParam.pageSize" :page-size-opts="personPageSizeOpts" show-total @on-change="changePersonPageIndex" @on-page-size-change="changePersonPageSize" show-elevator show-sizer>
            </i-page>
          </div>
        </i-form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button ghost class="searchButton" @click="getSelectPerson">确定</Button>
        <Button ghost class="searchButton" @click="personSelectModal = false">关闭</Button>
      </div>
    </i-modal>
    <i-modal v-model="policeModal" width="800">
      <p slot="header">
        <span class="title">共享账户</span>
      </p>
      <div class="policeModel" style="height: 400px;overflow: auto;">
        <Button ghost class="searchButton" style="width: 117px;margin-bottom: 10px;" @click="openPoliceSeleceModal">添加共享用户</Button>
        <i-table border ref="policeTable" :columns="shareColumn" :data="policeData" style="height:340px">
        </i-table>
      </div>
      <div slot="footer" style="text-align: center">
        <Button ghost class="searchButton" @click="saveShareList">保存</Button>
        <Button ghost class="searchButton" @click="policeModal = false">关闭</Button>
      </div>
    </i-modal>
    <i-modal v-model="policeSelectModal" width="1000">
      <p slot="header">
        <span class="title">共享用户列表</span>
      </p>
      <div class="policeSelectModel" style="height: 400px;overflow: auto;">
        <div style="height: 100%;width: 30%;position: relative;float: left;border: 1px solid rgba(0,122,255,.3);overflow: scroll; ">
          <tpl-tree tpl-name="Organize" @on-select-change="changeOrganizeId"></tpl-tree>
        </div>
        <div style="height: 100%;width: 70%;position: relative;float: right">
          <i-table border ref="userListTable" :columns="policeColumn" :data="userList" style="height: 360px;margin-left: 34px;" class="checkBox">
          </i-table>
        </div>
        <div class="tablePage selectionIcon">
          <i-page style="text-align: right" show-total show-elevator show-sizer :current="pageIndex" :total="userListLength" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changeUserPageIndex" @on-page-size-change="changeUserPageSize">
          </i-page>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <Button ghost class="searchButton" @click="shareCase">添加</Button>
        <Button ghost class="searchButton" @click="policeSelectModal = false">取消</Button>
      </div>
    </i-modal>
    <!--删除确认框-->
    <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)" @confirmValue="batchDelete($event)">
    </confirm-box>
    <!--归档确认框-->
    <confirm-box :confirmModel="fileConfirmModel" :confirmActive="fileConfirmActive" @passModel="fileConfirmModel = false" @confirmValue="saveFile">
    </confirm-box>
  </i-content>
</template>
<script>
import {
  searchByCon, searchPersonByCon, saveCase, saveShareList, searchBoxDataUrl,
  savePerson, findPersonByCaseNo, batchDelete, findShareListById, findByOne, saveFile
} from '@/api/bg-manage/caseManage/caseManage';
import {validateCaseNo,validateoCaseName} from '@/libs/verification';
import selectBox from '_c/select-box/select-box.vue';
import confirmBox from '_c/confirmBox/index';
import NormalButton from '_c/normal-button';
import { getDate } from '@/libs/tools';
import TreeSelect from '_c/tree-select';
import { loadTableData } from '@/api/bg-manage/table';
import { getSelectPlace } from '@/api/bg-manage/appointment/manage';


export default {
  name: 'caseManage',
  components: {
    NormalButton,
    selectBox,
    confirmBox,
    TreeSelect
  },
  data () {
    return {
      userList: [],
      pageIndex: 1,
      userListLength: 0,
      operateName: '',
      policeSelectModal: false,
      confirmModel: false,
      confirmActive: '',
      policeModal: false,
      submitClear: false,
      submitClear1: false,
      url: searchBoxDataUrl,
      policeColumn: [
        {
          type: 'index',
          width: 100,
          align: 'center',
          title: '序号'
        },
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'accountName',
          align: 'center'
        },
        {
          title: '所属区域',
          key: 'organizeName',
          align: 'center'
        },
        {
          title: '用户类型',
          key: 'postName',
          align: 'center'
        }
        /* {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('img', {
                style: {
                  width: '20px',
                  height: '20px',
                  verticalAlign: 'middle',
                  cursor: 'pointer'
                },
                attrs: {
                  src: require('../../assets/images/common/delete.png')
                }
              })
            ]);
          }
        }, */
        /* {
          title: '共享类型',
          key: 'shareType',
          render: (h, params) => {
            return h('RadioGroup', {
              props: {
                value: '1'
              },
              on: {
                'on-change': (status) => {
                  params.row.shareType = status;
                  this.userList[params.row._index] = params.row;
                }
              }
            }, [
              h('Radio', {
                props: {
                  label: '0'
                }
              }, '只读'),
              h('Radio', {
                props: {
                  label: '1'
                }
              }, '读写')
            ]
            );
          }
        } */
      ],
      shareColumn: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'accountName'
        },
        {
          title: '所属区域',
          key: 'organizeName'
        },
        {
          title: '用户类型',
          key: 'roleName'
        },
        {
          title: '共享类型',
          key: 'shareType',
          render: (h, params) => {
            return h('RadioGroup', {
              props: {
                value: params.row.shareType
              },
              on: {
                'on-change': (status) => {
                  params.row.shareType = status;
                  this.policeData[params.row._index] = params.row;
                }
              }
            }, [
              h('Radio', {
                props: {
                  label: '0'
                }
              }, '只读'),
              h('Radio', {
                props: {
                  label: '1'
                }
              }, '读写')
            ]
            );
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('img', {
                style: {
                  width: '20px',
                  height: '20px',
                  verticalAlign: 'middle',
                  margin: 0,
                  cursor: 'pointer'
                },
                attrs: {
                  src: require('../../assets/images/common/delete.png')
                },
                on: {
                  click: () => {
                    this.deleteSelectPolice(params.row.accountName);
                  }
                }
              })
            ]);
          }
        }
      ],
      policeData: [],
      personColumns: [
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          type: 'index',
          width: 50,
          title: '序号',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'xm',
          align: 'center'
        },
        {
          title: '性别',
          key: 'xb',
          align: 'center',
          render: (h, params) => {
            if (params.row.xb == '1') {
              return h('span', '男');
            } else if (params.row.xb == '2') {
              return h('span', '女');
            }
          }
        },
        {
          title: '证件编号',
          key: 'zjhm',
          align: 'center'
        },
        /*{
          title: '案件编号',
          key: 'ajbh',
          align: 'center'
        },*/
        {
          title: '涉嫌罪名',
          key: 'sxzm',
          align: 'center'
        },
        {
          title: '关押期限',
          key: 'gyqx',
          align: 'center',
          render: (h, params) => {
            if (params.row.gyqx) {
              return h('span', getDate(params.row.gyqx, 'year'));
            }
          }
        },
        {
          title: '诉讼环节',
          key: 'sshj',
          align: 'center'
        }
      ],
      personData: [],
      personSelectModel: {
        idCard: '',
        name: '',
        caseNo: ''
      },
      split: '200px',
      personSelectModal: false,
      personModal: false,
      caseModel: {
        createBy: '',
        id: '',
        caseNo: '',
        caseDesc: '',
        gmtCreate: '',
        caseDepartment: '',
        caseName: ''
      },
      personModel: {
        gyqx: '',
        zjlxzw: '',
        zjlx: '',
        zjhm: '',
        xm: '',
        dwdm: '',
        bm: '',
        xb: '',
        sshj: '',
        sxzm: '',
        hjdxz: '',
        jzdxz: '',
        gzdw: '',
        rsyy: '',
        tssf: '',
        dabh: '',
        zwjb: '',
        zw: '',
        gj: '156',
        jg: '',
        zzmm: '',
        csrq: '',
        whcd: '',
        hyzk: '',
        mz: '01'
      },
      caseModal: false,
      columns1: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          maxWidth: 80
        },
        {
          title: '姓名',
          key: 'xm',
          align: 'center'
        },
        {
          title: '别名',
          key: 'bm',
          align: 'center'
        },
        {
          title: '证件类型',
          key: 'zjlx',
          align: 'center'
        },
        {
          title: '证件编号',
          key: 'zjhm',
          align: 'center',
          maxWidth: 200
        },
        {
          title: '特殊身份',
          align: 'center',
          key: 'tssf'
        },
        {
          title: '关押期限',
          key: 'gyqx',
          align: 'center',
          render: (h, params) => {
            if (params.row.gyqx) {
              return h('span', getDate(params.row.gyqx, 'year'));
            }
          }
        },
        {
          title: '诉讼环节',
          align: 'center',
          key: 'sshj'
        },
        {
          title: '提讯次数',
          align: 'center',
          key: 'txcs'
        },
        {
          title: '操作',
          style: {
            display: 'none'
          },
          render: (h, params) => {
            return h('div', [
              h('img', {
                style: {
                  width: '20px',
                  height: '20px',
                  verticalAlign: 'middle',
                  marginLeft: '5px',
                  cursor: 'pointer',
                  display: this.operateName === 'show' ? 'none' : ''
                },
                attrs: {
                  src: require('../../assets/images/common/delete.png')
                },
                on: {
                  click: () => {
                    this.deleteSelectPerson(params.row.rybh);
                  }
                }
              })
            ]);
          }
        }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 90,
          align: 'center'
        },
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          title: '案件名称',
          align: 'center',
          key: 'caseName'
        },
        {
          title: '办案单位',
          align: 'center',
          key: 'caseDepartment'
        },
        {
          title: '创建人',
          align: 'center',
          key: 'userName'
        },
        {
          title: '提讯次数',
          align: 'center',
          key: 'hearingCount'
        },
        {
          title: '提讯时长',
          align: 'center',
          key: 'hearingTime',
          render: (h, params) => {
            if (params.row.hearingTime == undefined) {
              return h('span', '');
            }
            return h('span', params.row.hearingTime + '分钟');
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'gmtCreate'
        },
        /* {
          title: '相关档案',
          width: 200,
          key: 'relate'
        }, */
        {
          title: '归档状态',
          align: 'center',
          render: (h, params) => {
            if (params.row.archived == 0) {
              return h('span',
                {
                  style: {
                    color: 'red'
                  }
                }, '未归档');
            } else if (params.row.archived == 1) {
              return h('span',
                {
                  style: {
                    color: '#35FFFA'
                  }
                },
                '已归档');
            }
          }
        },
        {
          title: '共享',
          align: 'center',
          render: (h, params) => {
            if (!params.row.caseUser || params.row.caseCreate == 'T') {
              return h('div', [
                h('img', {
                  style: {
                    width: '20px',
                    height: '20px',
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  },
                  attrs: {
                    src: require('../../assets/images/common/share.png')
                  },
                  on: {
                    click: () => {
                      this.openShareModel(params.row);
                    }
                  }
                })
              ]
              );
            }
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            if (params.row.archived == 0) {
              // 管理员
              if (!params.row.caseUser || params.row.caseCreate == 'T') {
                return h('div', [
                  h('img', {
                    style: {
                      width: '20px',
                      height: '20px',
                      marginRight: '16px',
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    },
                    attrs: {
                      src: require('../../assets/images/common/show.png')
                    },
                    on: {
                      click: () => {
                        this.caseDetail(params.row);
                      }
                    }
                  }),
                  h('img', {
                    style: {
                      width: '20px',
                      height: '20px',
                      marginRight: '16px',
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    },
                    attrs: {
                      src: require('../../assets/images/common/edit.png')
                    },
                    on: {
                      click: () => {
                        this.caseUpdate(params.row);
                      }
                    }
                  }),
                  h('img', {
                    style: {
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'middle',
                      cursor: 'pointer'
                    },
                    attrs: {
                      src: require('../../assets/images/common/delete.png')
                    },
                    on: {
                      click: () => {
                        this.selectRowChange(params.row);
                      }
                    }
                  })
                ]);
              } else {
                // 读写权限
                if (params.row.caseUser == 'T') {
                  return h('div', [
                    h('img', {
                      style: {
                        width: '20px',
                        height: '20px',
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                      },
                      attrs: {
                        src: require('../../assets/images/common/show.png')
                      },
                      on: {
                        click: () => {
                          this.caseDetail(params.row);
                        }
                      }
                    }),
                    h('img', {
                      style: {
                        width: '20px',
                        height: '20px',
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                      },
                      attrs: {
                        src: require('../../assets/images/common/edit.png')
                      },
                      on: {
                        click: () => {
                          this.caseUpdate(params.row);
                        }
                      }
                    })
                  ]);
                } else if (params.row.caseUserRead == 'T') {
                  return h('div', [
                    h('img', {
                      style: {
                        width: '20px',
                        height: '20px',
                        marginRight: '16px',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                      },
                      attrs: {
                        src: require('../../assets/images/common/show.png')
                      },
                      on: {
                        click: () => {
                          this.caseDetail(params.row);
                        }
                      }
                    })
                  ]);
                }
              }
            } else {
              return h('img', {
                style: {
                  width: '20px',
                  height: '20px',
                  marginRight: '16px',
                  verticalAlign: 'middle',
                  cursor: 'pointer'
                },
                attrs: {
                  src: require('../../assets/images/common/show.png')
                },
                on: {
                  click: () => {
                    this.caseDetail(params.row);
                  }
                }
              });
            }
          }
        }],
      isDetail: false,
      data: [],
      total: 0,
      personTotal: 0,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20],
      personPageSizeOpts: [10, 15, 20],
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
      personSelectList: [],
      personRuleValidate: {
        xm: [
          { required: true, message: '不能为空', trigger: 'blur' }, { max: 20, message: '最多输入20字' }
        ],
        zjlx: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        zjhm: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        dwdm: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        bm: [
          { max: 20, message: '最多输入20字' }
        ],
        zw: [
          { max: 50, message: '最多输入50字' }
        ],
        dabh: [
          { max: 20, message: '最多输入20字' }
        ],
        jzdxz: [
          { max: 50, message: '最多输入50字' }
        ],
        hjdxz: [
          { max: 50, message: '最多输入50字' }
        ],
        gzdw: [
          { max: 50, message: '最多输入50字' }
        ],
        tssf: [
          { max: 6, message: '最多输入6字' }
        ]
      },
      caseRuleValidate: {
        caseNo: [
          { required: true, message: '不能为空', trigger: 'blur' }, { max: 50, message: '最多输入50字' },
          { type: 'string', validator: validateCaseNo, trigger: 'blur' }
        ],
        caseName: [
          { required: true, message: '不能为空', trigger: 'blur' },{ max: 20, message: '最多输入20字' },
          { type: 'string', validator: validateoCaseName, trigger: 'blur' }
        ],
        caseDepartment: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        caseDesc: [
          { max: 1000, message: '最多输入1000字',trigger: 'blur' }
        ]
      },
      userName: '',
      selectedIds: [],
      organizeId: '',
      selectId: '',
      organizeList: [],
      gj: '中国',
      mz: '汉',
      fileConfirmModel: false,
      fileConfirmActive: '归档',
      columns1Item: {},
      columns1Length: 0
    };
  },
  methods: {
    shareCase () {
      let userList = this.$refs.userListTable.getSelection();
      if (userList.length > 0) {
        userList.forEach(item => {
          let accountName = item.accountName;
          let flag = false;
          this.policeData.forEach(item1 => {
            if (item1.accountName == accountName) {
              flag = true;
            }
          });
          if (!flag) {
            item.shareType = '0';
            this.policeData.push(item);
          }
        });
      }
      this.policeSelectModal = false;
    },
    searchByCon () {
      this.searchCon.pageParam.pageIndex = 1;
      searchByCon(this.searchCon).then(res => {
        this.data = res.data.data;
        this.total = res.data.page.total;
      });
    },
    searchByPage () {
      searchByCon(this.searchCon).then(res => {
        this.data = res.data.data;
        this.total = res.data.page.total;
      });
    },
    searchPersonByPage () {
      searchPersonByCon(this.personSearchCon).then(res => {
        this.personData = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    searchPersonByCon () {
      this.personSearchCon.pageParam.pageIndex = 1;
      searchPersonByCon(this.personSearchCon).then(res => {
        this.personData = res.data.data;
        this.personTotal = res.data.page.total;
      });
    },
    changePageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      this.searchByPage();
    },
    changePageSize (pageSize) {
      this.searchCon.pageParam.pageSize = pageSize;
      this.searchByPage();
    },
    changePersonPageIndex (index) {
      this.personSearchCon.pageParam.pageIndex = index;
      this.searchPersonByPage();
    },
    changePersonPageSize (pageSize) {
      this.personSearchCon.pageParam.pageSize = pageSize;
      this.searchPersonByPage();
    },
    changeDate (date) {
      let dateArr = date.toString().split(',');
      this.searchCon.data.startDate = dateArr[0];
      this.searchCon.data.endDate = dateArr[1];
    },
    openCaseModal () {
      this.operateName = 'add';
      this.userName = this.$store.state.user.userName;
      this.caseModal = true;
      this.caseModel.gmtCreate = getDate(new Date().getTime(), 'year');
    },
    openSelectPersonModal () {
      this.personModal = true;
      this.personSelectModal = false;
      this.getOrganizeList();
    },
    getSelectPerson () {
      let persons = this.$refs.personSelectTable.getSelection();
      if (persons.length > 0) {
        persons.forEach(item => {
          this.personSelectList.push(item);
        });
      } else {
        this.$Message.error('请选择人员!');
      }
      this.personSelectModal = false;
    },
    closeSelectPersonModal (visit) {
      if (!visit) {
        this.personSearchCon = {
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
        };
      } else {
        this.searchPersonByCon();
      }
    },
    closePersonModal (visit) {
      if (!visit) {
        this.submitClear = !this.submitClear;
        this.$refs.zyjs.setQuery(null);
        this.$refs.personModel.resetFields();
      }
    },
    closeCaseModal (visit) {
      if (!visit) {
        this.isDetail = false;
        this.caseModal = false;
        this.submitClear1 = !this.submitClear1;
        this.caseModel.id = '';
        this.$refs.caseModel.resetFields();
        this.personSelectList = [];
        if(this.columns1.length !== this.columns1Length){
          this.columns1.push(this.columns1Item);
        }
      }
    },
    saveCase () {
      this.$refs.caseModel.validate(valid => {
        if (valid) {
          let rybh = [];
          if (this.personSelectList.length < 1) {
            this.$Message.error('请选择涉案人员!');
            return;
          }
          this.personSelectList.forEach(item => {
            rybh.push(item.rybh);
          });
          if (this.operateName == 'add') {
            this.caseModel.rybh = rybh.join(',');
            saveCase(this.caseModel).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('操作成功!');
                this.caseModal = false;
                this.searchByCon();
              }
            });
          } else {
            findByOne(this.caseModel.id).then(res => {
              this.caseModel.caseUser = res.data.data.caseUser;
              this.caseModel.caseUserRead = res.data.data.caseUserRead;
              this.caseModel.rybh = rybh.join(',');
              saveCase(this.caseModel).then(res => {
                if (res.data.state.code == 200) {
                  this.$Message.success('操作成功!');
                  this.caseModal = false;
                  this.searchByCon();
                }
              });
            });
          }
        }
      });
    },
    getZjlx (el) {
      if (!el.code) {
        this.personModel.zjlx = '';
        this.personModel.zjlxzw = '';
        return;
      }
      this.personModel.zjlxzw = el.label;
      this.personModel.zjlx = el.code;
    },
    getDept (el) {
      if (!el.code) {
        this.caseModel.caseDepartment = '';
        return;
      }
      this.caseModel.caseDepartment = el.label;
    },
    savePerson () {
      this.$refs.personModel.validate(valid => {
        if (valid) {
          savePerson(this.personModel).then(res => {
            if (res.data.state.code == 200) {
              this.personModal = false;
              this.personSelectModal = false;
              res.data.data.zjlx = this.personModel.zjlxzw;
              this.personSelectList.push(res.data.data);
            }
          });
        }
      });
    },
    openShareModel (row) {
      this.policeModal = true;
      this.policeData = [];
      this.selectId = row.id;
      findShareListById(row.id).then(res => {
        this.policeData = res.data.data;
      });
    },
    caseDetail (row) {
      this.operateName = 'show';
      this.userName = row.userName;
      this.isDetail = true;
      this.caseModal = true;
      this.caseModel = JSON.parse(JSON.stringify(row));
      findPersonByCaseNo(row.caseNo).then(res => {
        this.personSelectList = res.data.data;
      });
      this.columns1Item = this.columns1.pop();
    },
    caseUpdate (row) {
      this.operateName = 'edit';
      this.userName = row.userName;
      this.caseModal = true;
      this.caseModel = JSON.parse(JSON.stringify(row));
      findPersonByCaseNo(row.caseNo).then(res => {
        this.personSelectList = res.data.data;
      });
    },
    updateConfirmModel (el) {
      this.$refs.table.selectAll();
      this.confirmModel = el;
    },
    batchDelete () {
      if (this.selectedIds.length == 0) {
        this.$Message.error('没有选中的数据');
        return;
      }
      batchDelete(this.selectedIds).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('删除成功');
          this.searchByCon();
          this.confirmModel = false;
        }
      });
    },
    selectRowChange (row) {
      this.confirmActive = '删除';
      if (row instanceof Object) {
        this.$refs.table.selectAll();
        this.confirmModel = true;
        this.$refs.table.toggleSelect(row._index);
      } else {
        if (this.selectedIds.length == 0) {
          this.$Message.error('没有选中的数据');
        } else {
          this.confirmModel = true;
        }
      }
    },
    seelctChange (selection) {
      this.selectedIds = [];
      selection.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    deleteSelectPerson (rybh) {
      for (let i = 0; i < this.personSelectList.length; i++) {
        if (this.personSelectList[i].rybh == rybh) {
          this.personSelectList.splice(i, 1);
        }
      }
    },
    changeUserPageIndex (index) {
      this.pageIndex = index;
      this.getUserListWithParm(this.organizeId, index, this.pageSize, this.searchData);
    },
    changeUserPageSize (pageSize) {
      this.pageSize = pageSize;
      this.getUserListWithParm(this.organizeId, this.index, pageSize, this.searchData);
    },
    getUserListWithParm (organizeId, pageIndex, pageSize, searchData) {
      loadTableData('organize', [
        {
          alias: 'O',
          name: 'PATH',
          operator: 'LIKE',
          type: 'STRING',
          value: organizeId == '' ? '' : '#' + organizeId + '#'
        }
      ], {
        pageIndex: pageIndex,
        pageSize: pageSize
      }).then(res => {
        this.userList = res.data.data;
        this.userListLength = res.data.page.total;
      });
    },
    changeOrganizeId (rows, currentObj) {
      this.organizeId = currentObj.id;
      this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
    },
    openPoliceSeleceModal () {
      this.policeSelectModal = true;
      this.getUserListWithParm('', this.index, 10, this.searchData);
    },
    saveShareList () {
      saveShareList(this.selectId, this.policeData).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('操作成功');
          this.policeModal = false;
        }
      });
    },
    deleteSelectPolice (accountName) {
      for (let i = 0; i < this.policeData.length; i++) {
        if (this.policeData[i].accountName == accountName) {
          this.policeData.splice(i, 1);
        }
      }
    },
    getOrganizeList () {
      getSelectPlace().then(res => {
        this.organizeList = res.data.data;
        this.personModel.dwdm = res.data.data[0].code;
      });
    },
    openPersonModal () {
      this.personModal = true;
      this.getOrganizeList();
    },
    getXb (el) {
      if (!el.code) {
        this.personModel.xb = '';
        return;
      }
      this.personModel.xb = el.code;
    },
    getSshj (el) {
      if (!el.code) {
        this.personModel.sshj = '';
        return;
      }
      this.personModel.sshj = el.code;
    },
    getSxzm (el) {
      if (!el.code) {
        this.personModel.sxzm = '';
        return;
      }
      this.personModel.sxzm = el.code;
    },
    getRsyy (el) {
      if (!el.code) {
        this.personModel.rsyy = '';
        return;
      }
      this.personModel.rsyy = el.code;
    },
    getZwjb (el) {
      if (!el.code) {
        this.personModel.zwjb = '';
        return;
      }
      this.personModel.zwjb = el.code;
    },
    getJg (el) {
      if (!el.code) {
        this.personModel.jg = '';
        return;
      }
      this.personModel.jg = el.code;
    },
    getGj (el) {
      if (!el.code) {
        this.personModel.gj = '';
        return;
      }
      this.personModel.gj = el.code;
    },
    getZzmm (el) {
      if (!el.code) {
        this.personModel.zzmm = '';
        return;
      }
      this.personModel.zzmm = el.code;
    },
    getHyzk (el) {
      if (!el.code) {
        this.personModel.hyzk = '';
        return;
      }
      this.personModel.hyzk = el.code;
    },
    getMz (el) {
      if (!el.code) {
        this.personModel.mz = '';
        return;
      }
      this.personModel.mz = el.code;
    },
    getWhcd (el) {
      if (!el.code) {
        this.personModel.whcd = '';
        return;
      }
      this.personModel.whcd = el.code;
    },
    findByOne (id) {
      findByOne(id).then(res => {
        this.organizeList = res.data.data;
        this.personModel.dwdm = res.data.data[0].code;
      });
    },
    confirmSaveFile () {
      if (this.selectedIds.length == 0) {
        this.$Message.error('未选中案件');
      } else {
        let flag = 0;
        this.selectedIds.forEach(item => {
          if (this.data[this.data.findIndex(item1 => item1.id == item)].archived == 1) {
            flag++;
          }
        });
        if (flag == this.selectedIds.length) {
          this.$Message.info('选中案件已归档，请重新选择');
          return;
        } else if (flag) {
          this.$Message.info('选中案件中有已归档的，将自动忽略');
        }
        this.fileConfirmModel = true;
      }
    },
    saveFile () {
      saveFile(this.selectedIds).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('归档成功');
          this.selectedIds = [];
          this.fileConfirmModel = false;
          this.searchByCon();
        }
      });
    }
  },
  watch: {
  },
  mounted () {
    this.searchByCon();
    this.columns1Length = this.columns1.length;
  }
};
</script>
<style lang="less" scoped>
/deep/ .caseName {
  .ivu-input {
    width: 823px !important;
  }
}
/deep/.caseInfo {
  .cascaderNew {
    margin: 0;
  }
  .caseDetail {
    .ivu-input {
      width: 823px;
      height: 100px !important;
    }
  }
  .ivu-form-item-required .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    color: #33f5f0;
    font: 12px/1 SimSun;
  }
  .ivu-form-item-required .ivu-form-item-label {
    color: #33f5f0;
  }
}
/deep/ .personInfo {
  .cascaderNew {
    margin: 0;
  }
}
/deep/ .ivu-table-wrapper .ivu-table-body{
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

