<template>
  <div>
    <div class="title">角色管理</div>
    <i-row>
      <i-col class="tableCol" style="border: 0;">
        <div class="top-header">
          <span class="searchItemText">角色名称</span>
          <input v-model="inputName" placeholder="请输入名称..." class="searchItemInput" type="text">
          <span class="searchItemText">角色类型</span>
          <select-box :idx="0" :url="url" typeCode="SYS_DICT_ROLE_TYPE" @val="getAllRoleType"></select-box>
          <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="getRoleByName">查询</i-button>
        </div>
        <div class="tableFunction">
          <p>管理信息</p>
          <permission-button type="error" label="删除选中" perms="conf:role:del" @click="deleteModelChange('')" />
          <permission-button type="primary" label="新增" perms="conf:role:add" @click="openAddRoleModal" />
        </div>
        <i-table border ref="table" :columns="columns" :data="roleList" style="height:calc(100% - 16vw);position:absolute;" @on-selection-change="getSelectedRows">
        </i-table>
        <div class="tablePage selectionIcon">
          <i-page style="text-align: right" ref="pages" :total="roleListLength" :page-size="pageSize" :page-size-opts="pageSizeOpts" show-total @on-change="changePageIndex" @on-page-size-change="changePageSize" show-elevator show-sizer>
          </i-page>
        </div>
      </i-col>
    </i-row>
    <!--确认框-->
    <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)" @confirmValue="confirmValue($event)"></confirm-box>
    <div class="add-role-dialog">
      <i-modal v-model="showEditModal" @on-cancel="cancelSubmit('selectedRole')" width="740">
        <p slot="header" style="color:#f60;">
          <span class="title">{{isAddFunction?'添加':'修改'}}角色信息</span>
        </p>
        <div style="height:160px;">
          <i-form ref="selectedRole" :model="selectedRole" :label-width="120" :rules="ruleValidate">
            <i-row>
              <i-col span="12">
                <i-form-item label="角色名称" prop="roleName">
                  <i-input v-model="selectedRole.roleName" placeholder="请输入名字"></i-input>
                </i-form-item>
              </i-col>
              <i-col span="12">
                <i-form-item label="角色描述" prop="roleDesc">
                  <i-input v-model="selectedRole.roleDesc" placeholder="请输入描述"></i-input>
                </i-form-item>
              </i-col>
            </i-row>
            <i-row>
              <i-col span="12">
                <i-form-item label="数据查询权限" prop="dataAuth" :label-width="120">
                  <i-radio-group v-model="selectedRole.dataAuth">
                    <i-radio :label="1">所在部门</i-radio>
                    <i-radio :label="2">全部</i-radio>
                  </i-radio-group>
                </i-form-item>
              </i-col>
            </i-row>
          </i-form>
        </div>
        <div slot="footer">
          <i-button type="primary" class="cancelBtn" @click="cancelSubmit('selectedRole')">取消</i-button>
          <i-button type="primary" class="confirmBtn" @click="handleSubmit('selectedRole')">提交</i-button>
        </div>
      </i-modal>
    </div>
    <div class="assign-permissions-dialog">
      <i-modal width="500" v-model="showPermissionDialog" @on-cancel="permissionCancelSubmit('selectedRole')" class="modal-permission-dialog">
        <p slot="header" style="color:#f60;">
          <span class="title">修改角色权限</span>
        </p>
        <i-row style="height:250px;overflow:auto;">
          <i-col :md="24" :lg="6">
            <i-tree ref="selectedTree" :data="selectedTree" show-checkbox multiple></i-tree>
          </i-col>
        </i-row>
        <div slot="footer">
          <i-button type="primary" class="cancelBtn" @click="permissionCancelSubmit('selectedRole')">取消</i-button>
          <i-button type="primary" class="confirmBtn" @click="permissionHandleSubmit('selectedRole')">提交</i-button>
        </div>
      </i-modal>
    </div>
    <div class="role-info-dialog">
      <i-modal class="infoDialogClass" v-model="isShowInfoModal" width="700" @on-ok="isShowInfoModal = false">
        <p slot="header" style="color:#f60;">
          <span class="title">查看角色信息</span>
        </p>
        <div class="objInfoModal" style="height:130px;">
          <i-tooltip :content="selectedRole.roleName" placement="top-start" v-show="selectedRole.roleName">
            角色名称：{{selectedRole.roleName}}
          </i-tooltip>
          <div class="unToolTip" v-show="!selectedRole.roleName">
            角色名称：{{selectedRole.roleName}}
          </div>
          <i-tooltip :content="selectedRole.roleDesc" placement="top-start" v-show="selectedRole.roleDesc">
            角色描述：{{selectedRole.roleDesc}}
          </i-tooltip>
          <div class="unToolTip" v-show="!selectedRole.roleDesc">
            角色描述：{{selectedRole.roleDesc}}
          </div>
          <i-tooltip :content="selectedRole.dataAuth" placement="top-start" v-show="selectedRole.dataAuth">
            数据查询权限：{{selectedRole.dataAuth == 0 ? '自己':selectedRole.dataAuth== 1 ? '所在部门':'全部'}}
          </i-tooltip>
          <div class="unToolTip" v-show="!selectedRole.dataAuth">
            数据查询权限：{{selectedRole.dataAuth== 0 ?'自己':selectedRole.dataAuth== 1 ?'所在部门':'全部'}}
          </div>
        </div>
        <div slot="footer">
          <i-button type="primary" class="confirmBtn" @click="isShowInfoModal = false">确定</i-button>
        </div>
      </i-modal>
    </div>
  </div>
</template>

<script>
import {
  getRoleWithParam, addNewRole, getRoleDetail, searchBoxDataUrl,
  getTreeByRoleId, updateMenuRoleConf, deleteRoles, updateRole
} from '@/api/bg-manage/role';
import confirmBox from '_c/confirmBox';
import { validateDataAuth, validateSpace, validateNormal } from '@/libs/verification.js';
import { tableTip } from '@/libs/tableTip';
import DictionarySelect from '_c/dictionary-select';
import PermissionButton from '_c/permission-button';
import selectBox from '_c/select-box/select-box.vue';

export default {
  name: 'role',
  components: {
    confirmBox,
    DictionarySelect,
    PermissionButton,
    selectBox
  },
  data () {
    return {
      inputType: '',
      url: searchBoxDataUrl,
      submitClear: false,
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
          title: '角色名称',
          key: 'roleName',
          render: tableTip
        },
        {
          title: '角色描述',
          key: 'roleDesc',
          render: tableTip
        },
        {
          title: '数据查询权限',
          key: 'dataAuth',
          render: (h, params) => {
            const row = params.row;
            const text = row.dataAuth == 0 ? '自己' : row.dataAuth == 1 ? '所在部门' : '全部';
            if (text == undefined || text == '') {
              return h('div', text);
            } else {
              return h('Tooltip', {
                props: {
                  placement: 'top-start',
                  transfer: true
                },
                style: {
                  width: '100%'
                }
              }, [h('span', {
                style: {
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  overflow: 'hidden',
                  marginTop: '6px',
                  display: 'inline-block'
                }
              }, text),
              h('div', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, text)]);
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 210,
          render: (h, params) => {
            return h('div', [
              h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: 'md-open',
                    size: '50px'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.showRoleInfo(params.row, 1);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '详情')])
              ]),
              h('span', [
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
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.showRoleInfo(params.row, true);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '修改')])
              ]),
              h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: ' iconfont icon-shanchu'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.deleteModelChange(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '删除')])
              ]),
              h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: ' iconfont icon-fenpeijiaose'
                  },
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.showPermissionInfo(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '分配权限')])
              ])
            ]
            );
          }
        }
      ],
      roleList: [],
      roleListLength: 1,
      pageSize: 10, // 每页显示条数
      pageIndex: 1,
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      selectedRole: {
        type: ''
      },
      showEditModal: false,
      isAddFunction: false,
      ruleValidate: {
        roleName: [
          { required: true, validator: validateSpace, trigger: 'blur' },
          { required: true, validator: validateNormal, trigger: 'blur' }
        ],
        dataAuth: [
          { required: true, validator: validateDataAuth, trigger: 'change' }
        ],
      },
      isShowInfoModal: false,
      showPermissionDialog: false,
      selectedTree: [],
      roleId: '',
      inputName: '',
      selectedIds: [],
      time: false,
      confirmModel: false,
      confirmActive: '',
      deleteType: '',
      deleteRow: '',
      loading: false
    };
  },
  mounted () {
    this.getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType);
  },
  methods: {
    changePageIndex (index) {
      this.pageIndex = index;
      this.getRoleWithParam(index, this.pageSize, this.inputName, this.inputType);
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.getRoleWithParam(this.pageIndex, pageSize, this.inputName, this.inputType);
    },
    getRoleWithParam (pageIndex, pageSize, roleName, inputType) {
      getRoleWithParam(pageIndex, pageSize, roleName, inputType).then(res => {
        this.roleList = res.data.data;
        this.roleListLength = res.data.page.total;
      });
    },
    openAddRoleModal () {
      this.showEditModal = true;
      this.selectedRole = {};
      this.selectedRole.dataAuth = 1;
      this.isAddFunction = true;
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    cancelSubmit (name) {
      this.$refs[name].resetFields();
      this.showEditModal = false;
    },
    permissionCancelSubmit (name) {
      this.$refs[name].resetFields();
      this.showPermissionDialog = false;
      this.selectedTree = [];
      this.submitClear = !this.submitClear;
    },
    permissionHandleSubmit () {
      this.loading = true;
      const node = this.$refs.selectedTree.getCheckedAndIndeterminateNodes();
      updateMenuRoleConf(this.roleId, node).then(res => {
        if (res.data.state.code == 200) {
          this.loading = false;
          this.$Message.success(res.data.state.msg);
          this.getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType);
          this.showPermissionDialog = false;
          this.selectedTree = [];
        } else {
          this.$Message.error(res.data.state.msg);
        }
        this.roleId = '';
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddFunction) {
            this.selectedRole = Object.assign({}, this.selectedRole, {});
            addNewRole(this.selectedRole).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success(res.data.state.msg);
                this.getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType);
                this.submitClear = !this.submitClear;
                this.showEditModal = false;
              } else {
                this.$Message.error({
                  content: res.data.state.msg,
                  duration: 10,
                  closable: true
                });
              }
            });
          } else {
            updateRole(this.selectedRole).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success(res.data.state.msg);
                this.getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType);
                this.submitClear = !this.submitClear;
                this.showEditModal = false;
              } else {
                this.$Message.error({
                  content: res.data.state.msg,
                  duration: 10,
                  closable: true
                });
              }
            });
          }
        } else {
          this.$Message.error('校验失败!无法进行操作');
        }
      });
    },
    showPermissionInfo (item) {
      this.loading = true;
      this.showPermissionDialog = true;
      this.roleId = item.id;
      getTreeByRoleId(item.id).then(res => {
        this.selectedTree = res.data.data;
        this.selectedTree.forEach(data => {
          if (!data.checked) {
            let children = data.children;
            children.map(item => item.checked = false);
          }
        });
        this.loading = false;
      });
    },
    // 递归遍历处理属性数据
    filterTreeDate (rootData) {
      rootData.forEach(data => {
        if (!data.checked) {
          let children = data.children;
          children.map(item => item.checked = false);
        }
      });
    },
    showRoleInfo (item, isEditModal) {
      if (Number.isInteger(isEditModal)) {
        this.isShowInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }
      getRoleDetail(item.id).then(res => {
        this.selectedRole = res.data.data;
      });
    },
    getRoleByName () {
      this.pageIndex = 1;
      getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType).then(res => {
        this.roleList = res.data.data;
        this.roleListLength = res.data.page.total;
        this.$refs['pages'].currentPage = 1;
      });
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
    confirmValue () {
      this.deleteRows();
    },
    deleteRows () {
      deleteRoles(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success(res.data.state.msg);
          this.getRoleWithParam(this.pageIndex, this.pageSize, this.inputName, this.inputType);
          this.selectedIds = [];
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    },
    getRoleTypeItem (el) {
      if (!el.code) {
        this.selectedRole.type = '';
        return;
      }
      this.selectedRole.type = el.code;
      this.selectedRole = Object.assign({}, this.selectedRole);
    },
    getAllRoleType (el) {
      if (!el.code) {
        this.inputType = '';
        return;
      }
      this.inputType = el.code;
    }
  }
};
</script>
<style lang="less">
.roles .ivu-row {
  padding: 0 15px;
}
.roles .ivu-table-wrapper {
  margin-left: 0px;
}
.roles .ivu-col {
  height: 100%;
}

.ivu-tree .ivu-tree-children .ivu-tree-title {
  color: rgba(255, 255, 255, 0.65);
}
</style>
