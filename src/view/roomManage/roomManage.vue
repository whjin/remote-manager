<template>
  <i-content class="main-content-con manage">
    <LawyerScreencast ref="lawyerScreencast" @handleChipIn="handleChipIn"></LawyerScreencast>
    <i-layout class="main-layout-con">
      <i-content class="content-wrapper">
        <div class="button-group">
          <NormalButton type="primary" label="新增房间" size="small" style="margin-left: 69%; margin-top: 10px; margin-bottom: 10px;" class="searchButton" @click="openRoomModal('add')"></NormalButton>
          <NormalButton type="primary" label="查看" size="small" style="margin-left: 0.5%" class="searchButton" @click="openRoomModal('detail')"></NormalButton>
          <NormalButton type="primary" label="修改" size="small" style="margin-left: 0.5%" class="searchButton" @click="openRoomModal('update')"></NormalButton>
          <NormalButton type="primary" label="删除" size="small" style="margin-left: 0.5%" class="searchButton" @click="deleteRoomModal()"></NormalButton>
        </div>
        <i-table border ref="table" :columns="columns" :data="roomList" style="height:calc(100% - 12vw);margin:0 10px;">
        </i-table>
        <div class="tablePage">
          <i-page style="text-align: right" :current="searchCon.pageParam.pageIndex" :total="roomTotal" :page-size="pageSize" :page-size-opts="pageSizeOpts" show-total @on-change="changePageIndex" @on-page-size-change="changePageSize" show-elevator show-sizer>
          </i-page>
        </div>
        <i-modal v-model="roomModal" width="423" @on-cancel="closeRoomModal">
          <p slot="header">
            <span class="title">提讯室{{this.modalType === 'detail' ?'详情': this.modalType === 'add' ? '新增': '修改'}}</span>
          </p>
          <div class="caseInfo" style="height: 430px;overflow: auto;">
            <i-form ref="roomModel" :model="roomModel" :rules="roomRuleValidate" :label-width="86" label-position="right">
              <span class="v-transfer-title">提讯会见室信息</span>
              <span style="margin-left: 16px;"><span style="color:#ed4014">*</span>项为必填项</span>
              <i-row>
                <i-col span="8">
                  <i-form-item label="提讯室名称:" prop="roomName" :label-width="120">
                    <i-input v-model="roomModel.roomName" :disabled="modalType === 'detail'"></i-input>
                  </i-form-item>
                </i-col>
              </i-row>
              <i-row>
                <i-col span="8">
                  <i-form-item label="房间类型:" prop="roomType" :label-width="120">
                    <i-select class="selectionIcon" v-model="roomModel.roomType" :disabled="modalType !== 'add'">
                      <i-option v-for="(item, index) in roomTypeList" :value="item.id" :key="index">{{ item.value }}
                      </i-option>
                    </i-select>
                  </i-form-item>
                </i-col>
              </i-row>
              <i-row v-if="isRemoteRoom">
                <i-col span="8">
                  <i-form-item label="关联在押房间:" prop="remoteRoomNo" :label-width="120">
                    <i-input v-model="roomModel.remoteRoomName" v-if="modalType !== 'add'" :disabled="modalType !== 'add'"></i-input>
                    <i-select class="selectionIcon" v-model="roomModel.remoteRoomNo" v-else :disabled="modalType !== 'add'">
                      <i-option v-for="(item, index) in remoteRoomList" :value="item.roomNo" :key="item.roomNo">{{ item.roomName }}
                      </i-option>
                    </i-select>
                  </i-form-item>
                </i-col>
              </i-row>
              <i-row>
                <i-col span="8">
                  <i-form-item label="所属组织机构:" prop="unitCode" :label-width="120">
                    <i-select class="selectionIcon" v-model="roomModel.unitCode" :disabled="modalType === 'detail'">
                      <i-option v-for="(item, index) in organizeList" :value="item.organizeCode" :key="index">{{
                        item.organizeName }}
                      </i-option>
                    </i-select>
                  </i-form-item>
                </i-col>
              </i-row>
              <i-row>
                <i-col span="8">
                  <i-form-item label="提讯终端IP:" prop="ip" :label-width="120">
                    <i-input v-model="roomModel.ip" :disabled="modalType === 'detail'"></i-input>
                  </i-form-item>
                </i-col>
              </i-row>
              <i-row>
                <i-col span="8">
                  <i-form-item label="网络盒IP:" prop="netBoxIp" :label-width="120">
                    <i-input v-model="roomModel.netBoxIp" :disabled="modalType === 'detail'"></i-input>
                  </i-form-item>
                </i-col>
              </i-row>
            </i-form>
          </div>
          <div slot="footer" style="text-align: center;margin-top:-40px;">
            <Button ghost v-show="modalType !== 'detail'" class="searchButton" @click="saveRoomSubmit">确认</Button>
            <Button ghost class="searchButton" @click="closeRoomModal">取消</Button>
          </div>
        </i-modal>
        <!--删除确认框-->
        <confirm-box :confirmModel="roomDelConfirmModel" confirmActive="删除" @confirmValue="deleteRoom($event)" @passModel="closeDelRoomModel($event)">
        </confirm-box>
        </confirm-box>
      </i-content>
    </i-layout>
  </i-content>
</template>
<script>
import NormalButton from '_c/normal-button';
import LawyerScreencast from '_c/lawyerScreencast';
import {
  searchRoomInfo,
  searchRemoteRoom,
  findOrganizeByType,
  save,
  roomDelete
} from '@/api/bg-manage/manage/manage';
import confirmBox from '_c/confirmBox';
import { validateIp } from '@/libs/verification';

export default {
  name: 'manage',
  components: {
    NormalButton,
    confirmBox,
    LawyerScreencast
  },
  data () {
    return {
      // 提讯室查询入参
      searchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      // 提讯室信息列表
      roomList: [],
      roomTotal: 0,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      pageCurrent: 1, // 当前页
      // 新增|修改|查看弹框显隐
      roomModal: false,
      // 房间信息
      roomModel: {
        id: '',
        roomType: '1',
        remoteRoomNo: '',
        roomStatus: '3',
        ip: '',
        netBoxIp: '',
        jkUserName: '',
        jkPassword: ''
      },
      // 弹框类型
      modalType: 'add',
      // 房间类型列表
      roomTypeList: [{
        id: '1',
        value: '办案提讯端'
      }, {
        id: '2',
        value: '提讯在押端'
      }],
      // 关联在押房间列表
      remoteRoomList: [],
      // 所属组织机构列表
      organizeList: [],
      // 选择表格ID
      selectedId: '',
      // 删除房间确认框
      roomDelConfirmModel: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        }, {
          title: '选择',
          key: 'id',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let id = params.row.id;
            let currentObject = params.row;
            let flag = this.selectedId === id;
            let self = this;
            return h('div', [
              h('Checkbox', {
                props: {
                  value: flag
                },
                on: {
                  'on-change': () => {
                    if (!flag) {
                      self.selectedId = id;
                      self.roomModel = JSON.parse(JSON.stringify(currentObject));
                    } else {
                      self.selectedId = '';
                    }
                  }
                }
              })
            ]);
          }
        },
        {
          title: '提讯会见室',
          align: 'center',
          filters: [
            {
              label: '提讯',
              value: 1
            },
            {
              label: '在押',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.roomType === '1';
            } else {
              return row.roomType === '2';
            }
          },
          render: (h, params) => {
            return h('span', params.row.roomName);
          }
        },
        {
          title: '房型',
          align: 'center',
          filters: [
            {
              label: '提讯',
              value: 1
            },
            {
              label: '在押',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.roomType === '1';
            } else {
              return row.roomType === '2';
            }
          },
          render: (h, params) => {
            return h('span', params.row.roomTypeName);
          }
        },
        {
          title: '所属组织',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.organizeName);
          }
        },
        {
          title: '关联房间',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.remoteRoomName);
          }
        },
        {
          title: '房间状态',
          align: 'center',
          filters: [
            {
              label: '开启',
              value: 1
            },
            {
              label: '关闭',
              value: 2
            },
            {
              label: '空闲',
              value: 3
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.roomStatus === 1;
            } else if (value === 2) {
              return row.roomStatus === 2;
            } else if (value === 3) {
              return row.roomStatus === 3;
            }
          },
          render: (h, params) => {
            if (params.row.roomStatus === 1) {
              return h('span', '开启');
            } else if (params.row.roomStatus === 2) {
              return h('span', '关闭');
            } else if (params.row.roomStatus === 3) {
              return h('span', '空闲');
            }
          }
        },
        {
          title: '房间使用者',
          align: 'center',
          render: (h, params) => {
            if (params.row.roomStatus === 3) {
              return h('span', '无');
            } else {
              if (params.row.xm === undefined || params.row.interrogator === undefined) {
                return h('span', '无');
              }
              return h('span', '在押：' + params.row.xm + '，提讯：' + params.row.interrogator);
            }
          }
        },
      ],
      roomRuleValidate: {
        roomName: [
          { required: true, message: '不能为空', trigger: 'blur' }, { max: 50, message: '最多输入50字' }
        ],
        roomType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        unitCode: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        ip: [
          { required: true, validator: validateIp, trigger: 'blur' }
        ],
        netBoxIp: [
          { required: true, validator: validateIp, trigger: 'blur' }
        ],
        jkUserName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        jkPassword: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
    };
  },
  computed: {
    // 关联房间
    isRemoteRoom () {
      return !!this.remoteRoomList.length && this.roomModel.roomType === '1';
    }
  },
  mounted () {
    this.roomInfoSearch();
  },
  methods: {
    // 查询提讯室信息
    roomInfoSearch () {
      searchRoomInfo(this.searchCon).then(res => {
        if (res.data.state.code === 200) {
          this.roomList = res.data.data;
          this.roomTotal = res.data.page.total;
        }
      });
    },
    // 查询关联房间
    getRemoteRoom () {
      searchRemoteRoom().then(res => {
        if (res.data.state.code === 200) {
          this.remoteRoomList = res.data.data;
          if (this.modalType === 'add') {
            this.roomModel.roomType = this.remoteRoomList.length ? '1' : '2';
          }
        }
      });
    },
    // 查询所属组织
    organizeByTypeSearch (type) {
      findOrganizeByType(type).then(res => {
        if (res.data.state.code === 200) {
          this.organizeList = res.data.data;
        }
      });
    },
    // 新增|修改|删除房间弹框
    openRoomModal (type) {
      this.modalType = type;
      if (type !== 'add' && this.selectedId === '') {
        this.$Message.error('未选中会见室');
        return;
      }
      if (type === 'add' && this.roomModel.roomType === '1') {
        this.roomModel.remoteRoomNo = '';
      }
      this.getRemoteRoom();
      this.organizeByTypeSearch(this.roomModel.roomType);
      this.roomModal = true;
    },
    // 提交新增|修改房间
    saveRoomSubmit () {
      this.$refs.roomModel.validate(valid => {
        if (valid) {
          const { id, roomName, roomType, unitCode, ip, netBoxIp } = this.roomModel;
          let params = { roomName, roomType, unitCode, ip, netBoxIp };
          let flag = this.modalType === 'add' &&
            this.isRemoteRoom &&
            this.roomModel.roomType === '1';
          if (flag) {
            if (Reflect.has(this.roomModel, "remoteRoomNo") && this.roomModel.remoteRoomNo !== '') {
              params.remoteRoomNo = this.roomModel.remoteRoomNo;
            } else {
              this.$Message.warning('未选择关联在押房间');
              return;
            }
          }
          if (this.modalType === 'update') {
            params.id = id;
            if (this.roomModel.roomType === '1') {
              params.remoteRoomNo = this.roomModel.remoteRoomNo;
            }
          }
          save(params).then(res => {
            if (res.data.state.code === 200) {
              this.$Message.success('保存成功');
              this.roomInfoSearch();
              this.closeRoomModal();
            }
          });
        }
      });
    },
    deleteRoomModal () {
      if (this.selectedId === '') {
        this.$Message.error('未选中会见室');
        return;
      }
      this.roomDelConfirmModel = true;
    },
    // 删除提讯室
    deleteRoom () {
      roomDelete(this.selectedId).then(res => {
        if (res.data.state.code === 200) {
          this.$Message.success('删除成功');
          this.roomInfoSearch();
        }
        this.closeDelRoomModel();
      });
    },
    closeDelRoomModel () {
      this.roomDelConfirmModel = false;
      this.selectedId = '';
    },
    closeRoomModal () {
      this.roomModal = false;
      this.$refs.roomModel.resetFields();
      this.selectedId = '';
    },
    changePageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      this.roomInfoSearch();
    },
    changePageSize (pageSize) {
      this.searchCon.pageParam.pageSize = pageSize;
      this.roomInfoSearch();
    },
    handleChipIn (roomId, roomName) {
      this.$root.$emit('showChatDialog', {
        title: roomName,
        roomNo: roomId
      });
    }
  },
};
</script>

<style lang="less" scoped>
</style>
