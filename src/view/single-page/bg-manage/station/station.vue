<template>
  <div>
    <div class="title">岗位管理</div>
    <i-row>
      <i-split v-model="split" min="200" max="650" >
        <i-col slot="left" class="treeCol">
          <i-tree :data="treeData" @on-select-change="changeUserGroupId"></i-tree>
        </i-col>
        <i-col slot="right" class="tableCol">
          <span class="searchItemText">岗位名称</span><input v-model="userGroupName" class="searchItemInput" type="text">
          <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="selectedByParams">查询</i-button>
          <div class="tableFunction">
            <p>管理信息</p>
            <permission-button type="error"
                               label="删除选中"
                               perms="conf:station:del"
                               @click="deleteModelChange('')" />
            <permission-button type="primary"
                               label="新增"
                               perms="conf:station:add"
                               @click="openAddUserGroupModal" />
          </div>
          <i-table border
                   ref="table"
                   :columns="columns"
                   :data="userGroupList"
                   style="height:calc(100% - 13vw)"
                   @on-selection-change="getSelectedRows">
          </i-table>
          <div class="tablePage selectionIcon">
            <i-page style="text-align: right"
                    show-total
                    show-elevator
                    show-sizer
                    ref="pages"
                    :total="userGroupListLength"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="changePageIndex"
                    @on-page-size-change="changePageSize">
            </i-page>
          </div>
        </i-col>
      </i-split>
    </i-row>
    <!--确认框-->
    <confirm-box :confirmModel="confirmModel"
                 :confirmActive="confirmActive"
                 @passModel="updateConfirmModel($event)"
                 @confirmValue="deleteRows($event)">
    </confirm-box>
    <!--查看岗位信息的模态框-->
    <i-modal width="400" v-model="showInfoModal" @on-ok="showInfoModal = false">
      <p slot="header">
        <span class="title">查看岗位信息</span>
      </p>
      <div class="objInfoModal" style="height:100px;">
        <i-tooltip :content="selectedUserGroup.userGroupName" placement="top-start" v-show="selectedUserGroup.userGroupName">
          岗位名称：{{selectedUserGroup.userGroupName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUserGroup.userGroupName">
          岗位名称：{{selectedUserGroup.userGroupName}}
        </div>
        <i-tooltip :content="selectedUserGroup.userGroupDuty" placement="top-start" v-show="selectedUserGroup.userGroupDuty">
          岗位职能：{{selectedUserGroup.userGroupDuty}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUserGroup.userGroupDuty">
          岗位职能：{{selectedUserGroup.userGroupDuty}}
        </div>
        <i-tooltip :content="selectedUserGroup.parentGroupName" placement="top-start" v-show="selectedUserGroup.parentGroupName">
          所属岗位：{{selectedUserGroup.parentGroupName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUserGroup.parentGroupName">
          所属岗位：{{selectedUserGroup.parentGroupName}}
        </div>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="showInfoModal = false">确定</i-button>
      </div>
    </i-modal>
    <!--修改岗位信息的模态框-->
    <i-modal v-model="showEditModal" width="420" @on-cancel="cancelSubmit('selectedUserGroup')">
      <p slot="header">
        <span class="title">{{isAddFunction?'新增':'修改'}}岗位信息</span>
      </p>
      <div class="userInfo" style="height:150px;">
        <i-form ref="selectedUserGroup" :model="selectedUserGroup" :label-width="120" :rules="ruleValidate">
          <i-form-item label="岗位名称" prop="userGroupName">
            <i-input v-model="selectedUserGroup.userGroupName" placeholder="请输入岗位名称"></i-input>
          </i-form-item>
          <i-form-item label="岗位职责" prop="userGroupDuty">
            <i-input v-model="selectedUserGroup.userGroupDuty" placeholder="请输入岗位职能"></i-input>
          </i-form-item>
          <i-form-item label="父级节点" prop="parentId">
            <i-input v-model="selectedUserGroup.parentId" placeholder="请输入父级节点"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" class="cancelBtn" @click="cancelSubmit('selectedUserGroup')">取消</i-button>
        <i-button type="primary" class="confirmBtn" @click="handleSubmit('selectedUserGroup')">提交</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import { getTreeData, addNewUserGroup, updateUserGroup, getUserGroupDetail, getUserGroupListWithParm, deleteUserGroups } from '@/api/bg-manage/station';
import TreeSelect from '_c/tree-select';
import confirmBox from '_c/confirmBox';
import PermissionButton from '_c/permission-button';
import { validateSpace } from '@/libs/verification';
export default {
  name: 'station',
  components: {
    TreeSelect,
    confirmBox,
    PermissionButton
  },
  data () {
    const parentIdCheck = (rule, value, callback) => {
      if (value == '' || value == undefined || /^[0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error('该字段值只能由数字组成'));
      }
    };
    return {
      split: 0.1,
      columns: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '岗位名称',
          key: 'userGroupName'
        },
        {
          title: '岗位职能',
          key: 'userGroupDuty'
        },
        {
          title: '所属岗位',
          key: 'parentGroupName'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h(PermissionButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '详情'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showUserGroupInfo(params.row, 1);
                  }
                }
              }),
              h(PermissionButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  perms: 'conf:station:edit',
                  label: '修改'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showUserGroupInfo(params.row, true);
                  }
                }
              }),
              h(PermissionButton, {
                props: {
                  type: 'error',
                  size: 'small',
                  perms: 'conf:station:del',
                  label: '删除'
                },
                on: {
                  click: () => {
                    this.deleteModelChange(params.row);
                  }
                }
              })
            ]);
          }
        }
      ],
      selectedUserGroup: {
        userGroupName: '',
        userGroupDuty: '',
        parentId: '',
        parentGroupName: ''
      },
      params: {
        LIKE_sysUserGroupDO_path: '',
        LIKE_sysUserGroupDO_userGroupName: ''
      },
      data: [], // 表格数据
      pageSize: 10, // 每页显示条数
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      dataCount: 0, // 总条数
      pageCurrent: 1, // 当前页
      userGroupList: [],
      treeData: [],
      pageIndex: 1,
      userGroupListLength: 0,
      id: '',
      showInfoModal: false,
      showEditModal: false,
      isAddFunction: false,
      time: false,
      ruleValidate: {
        userGroupName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        userGroupDuty: [
          { required: true, message: '岗位职能不能为空', trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        parentId: [
          { required: true, validator: parentIdCheck, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ]
      },
      confirmModel: false,
      confirmActive: '',
      userGroupName: '',
      selectedIds: []
    };
  },
  mounted () {
    this.getUserGroupListWithParm(this.params, this.pageIndex, this.pageSize);
    this.getSysUserGroup();
  },
  methods: {
    getSysUserGroup () {
      getTreeData().then(res => {
        this.treeData = res.data.data;
      });
    },
    changePageIndex (index) {
      this.pageIndex = index;
      this.getUserGroupListWithParm(this.params, index, this.pageSize);
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.getUserGroupListWithParm(this.params, this.index, pageSize);
    },
    selectedByParams () {
      this.params = {};
      this.pageIndex = 1;
      this.$refs['pages'].currentPage = 1;
      this.params.LIKE_sysUserGroupDO_userGroupName = this.userGroupName;
      this.getUserGroupListWithParm(this.params, this.pageIndex, this.pageSize);
    },
    getUserGroupListWithParm (params, pageIndex, pageSize) {
      getUserGroupListWithParm(params, pageIndex, pageSize).then(res => {
        let data = [...res.data.data];
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].parentGroupName == undefined) {
            data[i].parentGroupName = data[i].userGroupName;
          }
        }
        this.userGroupList = data;
        this.userGroupListLength = res.data.page.total;
      });
    },
    changeUserGroupId (rows, currentObj) {
      this.id = currentObj.id;
      this.params = {};
      this.params.LIKE_sysUserGroupDO_path = currentObj.id;
      this.getUserGroupListWithParm(this.params, 1, this.pageSize);
      this.selectedUserGroup = {};
      this.selectedUserGroup.parentId = this.id;
      this.id = '';
    },
    openAddUserGroupModal () {
      this.showEditModal = true;
      this.isAddFunction = true;
    },
    showUserGroupInfo (item, isEditModal) {
      if (Number.isInteger(isEditModal)) {
        this.showInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }
      getUserGroupDetail(item.id).then(res => {
        this.selectedUserGroup = res.data.data[0];
        if (this.selectedUserGroup.parentGroupName == undefined) {
          this.selectedUserGroup.parentGroupName = this.selectedUserGroup.userGroupName;
        }
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddFunction) {
            this.selectedUserGroup = Object.assign({}, this.selectedUserGroup, { id: this.id });
            addNewUserGroup(this.selectedUserGroup).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('新增岗位成功!');
                this.getSysUserGroup();
                let data = {
                  'LIKE_sysUserGroupDO_path': this.selectedUserGroup.parentId
                };
                this.getUserGroupListWithParm(data, this.pageIndex, this.pageSize);
                this.selectedUserGroup = {};
              }
            });
          } else {
            updateUserGroup(this.selectedUserGroup).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('修改岗位成功!');
                this.getSysUserGroup();
                let data = {
                  'LIKE_sysUserGroupDO_path': this.selectedUserGroup.id
                };
                this.getUserGroupListWithParm(data, this.pageIndex, this.pageSize);
                this.selectedUserGroup = {};
              }
            });
          }
          this.showEditModal = false;
        } else {
          this.$Message.error('校验失败!无法进行操作');
        }
      });
    },
    cancelSubmit (name) {
      this.$refs[name].resetFields();
      this.showEditModal = false;
    },
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    deleteModelChange (row) {
      this.confirmActive = '删除';
      if (row instanceof Object) {
        this.confirmModel = true;
        this.$refs.table.toggleSelect(row._index);
      } else {
        if (this.selectedIds.length == 0) {
          this.$Message.error({
            content: '未选中任何数据,无法进行操作!',
            duration: 10,
            closable: true
          });
        } else {
          this.confirmModel = true;
        }
      }
    },
    updateConfirmModel (el) {
      this.$refs.table.selectAll();
      this.confirmModel = el;
    },
    deleteRows () {
      deleteUserGroups(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.getSysUserGroup();
          let data = {
            'LIKE_sysUserGroupDO_path': this.params.LIKE_sysUserGroupDO_path
          };
          this.getUserGroupListWithParm(data, this.pageIndex, this.pageSize);
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    }
  }
};
</script>
<style>
  .ivu-transfer-list-header {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0px 0px 4px 4px;
  }

  .ivu-transfer-list-header-title, .ivu-transfer-list-header-count {
    color: rgba(255, 255, 255, 1);
  }

  ivu-transfer-list-search {
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  .ivu-transfer-list-body-with-search {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0px 0px 4px 4px;
  }

  .ivu-transfer-list-content > .ivu-transfer-list-content-item > span {
    color: rgba(255, 255, 255, 1);
  }

  .ivu-transfer-list-content {
    margin-top: 10px;
  }

  .ivu-input-wrapper-small .ivu-input-icon {
    line-height: 32px;
  }
</style>
