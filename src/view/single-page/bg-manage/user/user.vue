<template>
  <div>
    <div class="title">用户管理</div>
    <i-row>
      <i-split v-model="split" min="200" max="650">
        <i-col slot="left" class="treeCol">
          <tpl-tree tpl-name="Organize" @on-select-change="changeOrganizeId"></tpl-tree>
        </i-col>
        <i-col slot="right" class="tableCol">
          <span class="searchItemText">姓名</span>
          <input class="searchItemInput" type="text" v-model="searchData.userName">
          <i-button type="primary" style="display: inline-block;margin-left: 20px;" @click="searchParams()">查询</i-button>
          <div class="tableFunction">
            <p>管理信息</p>
            <permission-button type="error" label="删除选中" perms="conf:user:del" @click="deleteModelChange('')">
            </permission-button>
            <permission-button type="primary" label="新增" perms="conf:user:add" @click="openAddUserModal">
            </permission-button>
          </div>
          <i-table border ref="table" :columns="columns" :data="userList" style="height:calc(100% - 13vw)" @on-selection-change="getSelectedRows">
          </i-table>
          <div class="tablePage selectionIcon">
            <i-page style="text-align: right" show-total show-elevator show-sizer :current="pageIndex" :total="userListLength" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changePageIndex" @on-page-size-change="changePageSize">
            </i-page>
          </div>
        </i-col>
      </i-split>
    </i-row>
    <!--删除确认框-->
    <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)" @confirmValue="deleteRows($event)">
    </confirm-box>
    <!--重置密码确认框-->
    <confirm-box :confirmModel="resetPassModel" :confirmActive="resetPassActive" @passModel="updateResetPassModel($event)" @confirmValue="resetPassValue($event)">
    </confirm-box>
    <!--查看用户信息的模态框-->
    <i-modal width="600" v-model="isShowInfoModal" @on-ok="isShowInfoModal = false">
      <p slot="header">
        <span class="title">查看用户信息</span>
      </p>
      <div class="objInfoModal" style="height:290px;">
        <i-tooltip :content="selectedUser.userName" placement="top-start" v-show="selectedUser.userName">
          姓名：{{selectedUser.userName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.userName">
          姓名：{{selectedUser.userName}}
        </div>
        <i-tooltip :content="selectedUser.organizeName" placement="top-start" v-show="selectedUser.organizeName">
          所属部门：{{selectedUser.organizeName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.organizeName">
          所属部门：{{selectedUser.organizeName}}
        </div>
        <i-tooltip :content="selectedUser.accountName" placement="top-start" v-show="selectedUser.accountName">
          用户名：{{selectedUser.accountName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.accountName">
          用户名：{{selectedUser.accountName}}
        </div>
        <i-tooltip :content="selectedUser.userCode" placement="top-start" v-show="selectedUser.userCode">
          工号：{{selectedUser.userCode}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.userCode">
          工号：{{selectedUser.userCode}}
        </div>
        <i-tooltip :content="selectedUser.gender == 1 ? '男' : '女'" placement="top-start">
          性别：{{selectedUser.gender == 1 ? '男' : '女'}}
        </i-tooltip>
        <i-tooltip :content="selectedUser.mobilePhone" placement="top-start" v-show="selectedUser.mobilePhone">
          手机：{{selectedUser.mobilePhone}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.mobilePhone">
          手机：{{selectedUser.mobilePhone}}
        </div>
        <i-tooltip :content="selectedUser.idCard" placement="top-start" v-show="selectedUser.idCard">
          身份证号：{{selectedUser.idCard}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.idCard">
          身份证号：{{selectedUser.idCard}}
        </div>
        <i-tooltip :content="selectedUser.nativePlace" placement="top-start" v-show="selectedUser.nativePlace">
          籍贯：{{selectedUser.nativePlace}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.nativePlace">
          籍贯：{{selectedUser.nativePlace}}
        </div>
        <i-tooltip :content="selectedUser.email" placement="top-start" v-show="selectedUser.email">
          邮箱：{{selectedUser.email}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.email">
          邮箱：{{selectedUser.email}}
        </div>
        <i-tooltip :content="education" placement="top-start" v-show="education">
          学历：{{education}}
        </i-tooltip>
        <div class="unToolTip" v-show="!education">
          学历：{{education}}
        </div>
        <i-tooltip :content="selectedUser.major" placement="top-start" v-show="selectedUser.major">
          专业：{{selectedUser.major}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedUser.major">
          专业：{{selectedUser.major}}
        </div>
        <i-tooltip :content="selectedUser.enable == 1? '启用' : '禁用'" placement="top-start">
          状态：{{selectedUser.enable == 1? '启用' : '禁用'}}
        </i-tooltip>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="isShowInfoModal = false">确定</i-button>
      </div>
    </i-modal>
    <!--修改用户信息的模态框-->
    <i-modal v-model="showEditModal" width="800" @on-cancel="cancelSubmit('selectedUser')">
      <p slot="header">
        <span class="title">{{isAddFunction?'新增':'修改'}}用户信息</span>
      </p>
      <div class="userInfo">
        <i-form ref="selectedUser" :model="selectedUser" :label-width="120" :rules="ruleValidate">
          <i-form-item label="姓名" prop="userName">
            <i-input v-model="selectedUser.userName" placeholder="请输入名字" @οnkeyup="a()"></i-input>
          </i-form-item>
          <i-form-item label="所属部门" prop="organizeId">
            <i-select class="selectionIcon" ref="selectModel1" v-model="selectedUser.organizeId" placeholder="请选择所属部门">
              <i-option v-for="(item,index) in organizeListData" :value="item.id" :key="index">{{item.organizeName}}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="用户名" prop="accountName" :style="{'display': isAddFunction?'inline-block':'none'}">
            <i-input v-model="selectedUser.accountName" placeholder="请输入用户名"></i-input>
          </i-form-item>
          <i-form-item label="工号" prop="userCode">
            <i-input v-model="selectedUser.userCode" placeholder="请输入工号"></i-input>
          </i-form-item>
          <i-form-item label="密码" prop="password" :style="{'display': isAddFunction?'inline-block':'none'}">
            <i-input type="password" v-model="selectedUser.password" placeholder="请输入密码"></i-input>
          </i-form-item>
          <i-form-item label="确认密码" prop="password2" :style="{'display': isAddFunction?'inline-block':'none'}">
            <i-input type="password" v-model="selectedUser.password2" placeholder="请确认密码"></i-input>
          </i-form-item>
          <i-form-item label="性别" prop="gender">
            <i-radio-group v-model="selectedUser.gender" style="width:200px;">
              <i-radio :label="1">男</i-radio>
              <i-radio :label="2">女</i-radio>
            </i-radio-group>
          </i-form-item>
          <i-form-item label="手机" prop="mobilePhone">
            <i-input v-model="selectedUser.mobilePhone" placeholder="请输入手机"></i-input>
          </i-form-item>
          <i-form-item label="身份证号" prop="idCard">
            <i-input v-model="selectedUser.idCard" placeholder="请输入身份证号"></i-input>
          </i-form-item>
          <i-form-item label="籍贯" prop="nativePlace">
            <i-input v-model="selectedUser.nativePlace" placeholder="请输入籍贯"></i-input>
          </i-form-item>
          <i-form-item label="邮箱" prop="email">
            <i-input v-model="selectedUser.email" placeholder="请输入邮箱"></i-input>
          </i-form-item>
          <i-form-item label="学历" prop="education">
            <i-select ref="selectModel2" clearable v-model="selectedUser.education" placeholder="请输入学历">
              <i-option v-for="(item,index) in educationData" :value="item.id" :key="index">{{item.educationName}}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="专业" prop="major">
            <i-input v-model="selectedUser.major" placeholder="请输入专业"></i-input>
          </i-form-item>
          <i-form-item label="主题" prop="theme" v-show="false">
            <i-select clearable v-model="selectedUser.theme" placeholder="请选择主题" disabled>
              <i-option value="whiteTheme">白色</i-option>
              <i-option value="blackTheme">黑色</i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="启用" prop="enable">
            <i-checkbox v-model="selectedUser.enable" :true-value="1" :false-value="0">启用</i-checkbox>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" @click="cancelSubmit('selectedUser')" class="cancelBtn">取消</i-button>
        <i-button type="primary" @click="handleSubmit('selectedUser')" class="confirmBtn">提交</i-button>
      </div>
    </i-modal>
    <div class="user-role-tra-dialog">
      <i-modal v-model="showTransferDialog" width="600px;">
        <p slot="header">
          <span class="title">分配权限集合信息</span>
        </p>
        <div style="height:250px;">
          <i-transfer :data="userUnHadRole" :target-keys="userHadRole" :render-format="renderTransfer" filterable :filter-method="filterMethod" @on-change="handleChangeRole">
          </i-transfer>
        </div>
        <div slot="footer">
          <i-button type="primary" class="confirmBtn" @click="handleTransferCancel">确定</i-button>
        </div>
      </i-modal>
    </div>
  </div>
</template>

<script>
import {
  deleteUsers,
  addNewUser,
  updateUser,
  getUserExistRole,
  getUserUnExistRole,
  updateUserRoleById,
  resetPassword,
  sysOrganizeAll,
  getRoleData
} from '@/api/bg-manage/user';
import { loadTableData } from '@/api/bg-manage/table';
import { validateUserCode, validateGender, validateNormal, validateSpace, validateIdCard, validatePhone } from '@/libs/verification';
import { tableTip } from '@/libs/tableTip';
import TreeSelect from '_c/tree-select';
import DictionarySelect from '_c/dictionary-select';
import confirmBox from '_c/confirmBox';
import PermissionButton from '_c/permission-button';
import { hasPerms } from '@/libs/util';
import md5 from 'js-md5';

export default {
  name: 'user',
  components: {
    TreeSelect,
    confirmBox,
    PermissionButton,
    DictionarySelect
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (this.isAddFunction) {
        if (value == '' || value == undefined) {
          callback(new Error('密码不能为空'));
        } else {
          let reg = (/\s/g).test(value);
          if (reg) {
            callback(new Error('输入的字符不能含有空格'));
          } else if (!(/^(\w){6,20}$/).test(value)) {
            return callback(new Error('密码长度需在6-20位之内'));
          }
          if (this.selectedUser.password2 !== '') {
            // 对第二个密码框单独验证
            this.$refs.selectedUser.validateField('password2');
          }
          callback();
        }
      } else {
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (this.isAddFunction) {
        if (value == '' || value == undefined) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.selectedUser.password) {
          callback(new Error('两次输入的密码不匹配'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      split: 0.1,
      columns: [
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'userName',
          render: tableTip
        },
        {
          title: '工号',
          key: 'userCode',
          render: tableTip
        },
        {
          title: '性别',
          key: 'genderName',
          render: tableTip
        },
        {
          title: '手机',
          key: 'mobilePhone',
          render: tableTip
        },
        {
          title: '部门',
          key: 'organizeName',
          render: tableTip
        },
        {
          title: '状态',
          key: 'enableName',
          width: 50,
          render: tableTip
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
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
                  type: 'md-open',
                  size: '50px'
                },
                style: {
                  marginRight: '5px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openShowOrEditModal(params.row, 1);
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
            if (hasPerms('conf:user:edit', this.$store.state.app.permissionList)) {
              elementArray.push(h('span', [
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
                      this.openShowOrEditModal(params.row, -1);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '修改')])
              ]));
            }
            if (hasPerms('conf:user:del', this.$store.state.app.permissionList)) {
              elementArray.push(h('span', [
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
              ]));
            }
            if (hasPerms('conf:user:reset', this.$store.state.app.permissionList)) {
              elementArray.push(h('span', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [h('Icon', {
                  props: {
                    type: ' iconfont icon-zhongzhimima'
                  },
                  style: {
                    marginRight: '5px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.resetPass(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '重置密码')])
              ]));
            }
            if (hasPerms('conf:user:role', this.$store.state.app.permissionList)) {
              elementArray.push(h('span', [
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
                      this.showTransfer(params.row);
                    }
                  }
                }),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, '分配权限集合')])
              ]));
            }
            return h('div', elementArray);
          }
        }
      ],
      data: [], // 表格数据
      pageSize: 10, // 每页显示条数
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      dataCount: 0, // 总条数
      pageCurrent: 1, // 当前页
      userList: [],
      pageIndex: 1,
      isShowInfoModal: false,
      selectedUser: {
        userName: '',
        accountName: '',
        organizeId: this.organizeId,
        password: '',
        userCode: '',
        gender: 0,
        nativePlace: '',
        mobilePhone: '',
        idCard: '',
        password2: '',
        role: '',
        email: '',
        education: '',
        major: '',
        enable: 1,
        theme: ''
      },
      selectedIds: [],
      showEditModal: false,
      ruleValidate: {
        userName: [
          { required: true, message: '姓名长度应在1~10位之间', min: 1, max: 10, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '非法的邮箱地址', trigger: 'blur' }
        ],
        organizeId: [
          { required: true, validator: validateNormal, trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '用户名长度应在1~15位之间', min: 1, max: 15, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        userCode: [
          { required: true, validator: validateUserCode, trigger: 'blur' }
        ],
        idCard: [
          { required: true, validator: validateIdCard, trigger: 'blur' }
        ],
        gender: [
          { required: true, validator: validateGender, trigger: 'change' }
        ],
        mobilePhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      organizeId: '',
      userListLength: 0,
      isAddFunction: false,
      showTransferDialog: false,
      userHadRole: [],
      userUnHadRole: [],
      userId: '',
      time: false,
      organizeListData: [],
      roleListData: [],
      educationData: [{
        id: 0,
        educationName: '博士'
      }, {
        id: 1,
        educationName: '本科'
      }, {
        id: 2,
        educationName: '专科'
      }, {
        id: 3,
        educationName: '高中'
      }, {
        id: 4,
        educationName: '初中'
      }, {
        id: 5,
        educationName: '小学'
      }],
      confirmModel: false,
      deleteRow: '',
      confirmActive: '',
      resetPassModel: false,
      resetPassActive: '',
      education: '',
      searchData: {
        userName: '',
        roleName: ''
      }
    };
  },
  mounted () {
    this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
    // 获取部门
    this.sysOrganizeAll();
  },
  methods: {
    changePageIndex (index) {
      this.pageIndex = index;
      this.getUserListWithParm(this.organizeId, index, this.pageSize, this.searchData);
    },
    changePageSize (pageSize) {
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
        },
        {
          alias: 'T',
          name: 'user_name',
          operator: 'LIKE',
          type: 'STRING',
          value: searchData.userName
        },
        {
          alias: 'T3',
          name: 'ROLE_ID',
          operator: 'LIKE',
          type: 'LONG',
          value: searchData.roleName
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
    openAddUserModal () {
      if (this.organizeId == '') {
        this.$Message.error({
          content: '请先选择所属部门!',
          duration: 10,
          closable: true
        });
        return;
      }
      this.showEditModal = true;
      this.selectedUser = {};
      this.$refs.selectModel1.clearSingleSelect();
      this.$refs.selectModel2.clearSingleSelect();
      // this.$refs.selectModel3.clearSingleSelect();
      // 选择框的值不能清空，不然获取不了选择框的值，必须有一个默认值
      this.$set(this.selectedUser, 'userName', '');
      this.$set(this.selectedUser, 'organizeId', this.organizeId);
      this.$set(this.selectedUser, 'enable', 1);
      this.$set(this.selectedUser, 'theme', 'whiteTheme');
      this.isAddFunction = true;
    },
    // index >=0 时为显示 -1时为修改
    openShowOrEditModal (item, index) {
      if (index >= 0) {
        this.isShowInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }
      loadTableData('organize', [{
        name: 'id',
        value: item.id,
        alias: 'T'
      }], {
        pageIndex: 1,
        pageSize: 50
      }).then(res => {
        if (res.data.data.length) {
          this.selectedUser = res.data.data[0];
        }
        for (let i = 0; i < this.educationData.length; i++) {
          if (this.selectedUser.education == this.educationData[i].id) {
            this.education = this.educationData[i].educationName;
          }
        }
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 对密码进行加密
          if (this.isAddFunction) {
            /* this.selectedUser = Object.assign({}, this.selectedUser, {organizeId: this.organizeId}); */
            /* this.selectedUser.role = this.selectedUser.role.toString(); */
            this.selectedUser.password = md5(this.selectedUser.password);
            this.selectedUser.password2 = md5(this.selectedUser.password2);
            addNewUser(this.selectedUser).then(res => {
              if (res.data.state.code !== 5000) {
                this.$Message.success('新增用户成功!');
                this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
                this.showEditModal = false;
              }
            });
          } else {
            updateUser(this.selectedUser).then(res => {
              if (res.data.state.code !== 5000) {
                this.$Message.success('修改用户成功!');
                this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
                this.showEditModal = false;
              }
            });
          }
        } else {
          this.$Message.error({
            content: '校验失败!无法进行操作',
            duration: 10,
            closable: true
          });
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    cancelSubmit (name) {
      this.$refs[name].resetFields();
      this.showEditModal = false;
    },
    handleTransferCancel () {
      this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
      this.showTransferDialog = false;
    },
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    showTransfer (row) {
      this.showTransferDialog = true;
      this.userHadRole = [];
      this.userUnHadRole = [];
      this.userId = row.id;
      getUserUnExistRole(row.id).then(res => {
        this.userUnHadRole = res.data.data;
      });
      getUserExistRole(row.id).then(res => {
        this.userHadRole = res.data.data;
      });
    },
    handleChangeRole (targetKeys, direction, moveKeys) {
      if (targetKeys.length > 1) {
        this.$Message.error({
          content: '权限只能唯一',
          duration: 5,
          closable: true
        });
      } else {
        this.userHadRole = targetKeys;
        if (direction == 'right') {
          updateUserRoleById(this.userId, '', moveKeys.join()).then(res => {
            if (res.data.state.code == 200) {
              this.$Message.success('分配权限集合成功');
            } else {
              this.$Message.error({
                content: res.data.state.msg,
                duration: 5,
                closable: true
              });
            }
          });
        }
        if (direction == 'left') {
          updateUserRoleById(this.userId, moveKeys.join(), '').then(res => {
            if (res.data.state.code == 200) {
              this.$Message.success('分配权限集合成功');
            }
          });
        }
      }
    },
    renderTransfer (item) {
      return item.label;
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1;
    },
    sysOrganizeAll () {
      sysOrganizeAll().then(res => {
        let tempList = res.data.data;
        tempList.forEach(item => {
          this.organizeListData.push({
            organizeName: item.organizeName,
            id: item.id
          });
        });
        this.organizeId = '';
      });
    },
    resetPass (row) {
      this.resetPassModel = true;
      this.resetPassActive = '重置密码';
      this.deleteRow = row;
    },
    updateResetPassModel (el) {
      this.resetPassModel = el;
    },
    resetPassValue () {
      resetPassword(this.deleteRow.id, this.deleteRow.accountName).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success(res.data.state.msg);
          this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
        }
      });
      this.resetPassModel = false;
    },
    deleteModelChange (row) {
      this.confirmActive = '删除';
      if (row instanceof Object) {
        this.$refs.table.selectAll();
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
      deleteUsers(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.getUserListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    },
    sysRoleAll () {
      getRoleData().then(res => {
        let tempList = res.data.data;
        tempList.forEach(item => {
          this.roleListData.push({
            roleName: item.roleName,
            id: item.id
          });
        });
      });
    },
    searchParams () {
      this.getUserListWithParm(this.organizeId, 1, this.pageSize, this.searchData);
      this.pageIndex = 1;
    }
  }
};
</script>
<style type="less">
</style>
