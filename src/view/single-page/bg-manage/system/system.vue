<template>
  <div>
    <div class="title">子系统管理</div>
    <i-row style="width: 100%;">
      <i-col class="tableCol" style="border: 0;">
        <div class="top-header">
          <span class="searchItemText">系统名称</span>
          <input placeholder="请输入名称..." class="searchItemInput" type="text" v-model="searchData">
          <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="searchParams">查询</i-button>
        </div>
        <div class="tableFunction">
          <p>管理信息</p>
          <permission-button type="error"
                             label="删除选中"
                             perms="conf:system:del"
                             @click="deleteModelChange('')" />
          <permission-button type="primary"
                             label="新增"
                             perms="conf:system:add"
                             @click="openAddSystemModal" />
        </div>
        <i-table style="height:calc(100% - 11vw);position:absolute;"
                 ref="table"
                 border
                 :columns="columns"
                 :data="systemList"
                 @on-selection-change="getSelectedRows">
        </i-table>
        <div class="tablePage selectionIcon">
          <i-page style="text-align: right"
                  ref="pages"
                  :total="systemListLength"
                  :current="pageIndex"
                  :page-size="pageSize"
                  :page-size-opts="pageSizeOpts"
                  show-total show-elevator show-sizer
                  @on-change="changePageIndex"
                  @on-page-size-change="changePageSize">
          </i-page>
        </div>
      </i-col>
    </i-row>
    <!--确认框-->
    <confirm-box :confirmModel="confirmModel"
                 :confirmActive="confirmActive"
                 @passModel="updateConfirmModel($event)"
                 @confirmValue="deleteRows($event)">
    </confirm-box>
    <div class="add-role-dialog" >
      <i-modal
        @on-cancel="cancelSubmit('addSystem')"
        v-model="showEditModal"
        width="700px;">
        <p slot="header" style="color:#f60;">
          <span class="title">{{isAddFunction?'新增':'修改'}}系统信息</span>
        </p>
        <div class="objInfoModal" style="height:100px;">
          <i-form ref="addSystem"
                  :model="addSystem"
                  :label-width="110"
                  :rules="ruleValidate" >
            <i-form-item label="系统名称" prop="appName">
              <i-input v-model="addSystem.appName" placeholder="请输入系统名称"></i-input>
            </i-form-item>
            <i-form-item label="系统编码" prop="appCode" :style="{'display': isAddFunction?'inline-block':'none'}">
              <i-input v-model="addSystem.appCode" placeholder="请输入系统编码"></i-input>
            </i-form-item>
            <i-form-item label="系统排序" prop="appIndex">
              <i-input v-model="addSystem.appIndex" placeholder="请输入系统排序"></i-input>
            </i-form-item>
            <i-form-item label="链接地址" prop="appUrl">
              <i-input v-model="addSystem.appUrl" placeholder="请输入链接地址"></i-input>
            </i-form-item>
          </i-form>
        </div>
        <div slot="footer">
          <i-button type="primary" class="cancelBtn" @click="cancelSubmit('addSystem')">取消</i-button>
          <i-button type="primary" class="confirmBtn" @click="handleSubmit('addSystem')">提交</i-button>
        </div>
      </i-modal>
    </div>
    <i-modal v-model="isShowInfoModal"
             @on-ok="isShowInfoModal = false">
      <p slot="header" style="color:#f60;">
        <span class="title">查看系统信息</span>
      </p>
      <div class="objInfoModal" style="height:80px;">
        <i-tooltip :content="addSystem.appName" placement="top-start" v-show="addSystem.appName">
          系统名称：{{addSystem.appName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!addSystem.appName">
          系统名称：{{addSystem.appName}}
        </div>
        <i-tooltip :content="addSystem.appCode" placement="top-start" v-show="addSystem.appCode">
          系统编码：{{addSystem.appCode}}
        </i-tooltip>
        <div class="unToolTip" v-show="!addSystem.appCode">
          系统编码：{{addSystem.appCode}}
        </div>
        <i-tooltip :content="addSystem.appIndex" placement="top-start" v-show="addSystem.appIndex">
          系统排序：{{addSystem.appIndex}}
        </i-tooltip>
        <div class="unToolTip" v-show="!addSystem.appIndex">
          系统排序：{{addSystem.appIndex}}
        </div>
        <i-tooltip :content="addSystem.appUrl" placement="top-start" v-show="addSystem.appUrl">
          链接地址：{{addSystem.appUrl}}
        </i-tooltip>
        <div class="unToolTip" v-show="!addSystem.appUrl">
          链接地址：{{addSystem.appUrl}}
        </div>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="isShowInfoModal = false">确定</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import { getSystemListWithParm, addNewSystem, deleteSystem, getSystemDetail, updateSystem } from '@/api/bg-manage/system';
import confirmBox from '_c/confirmBox';
import PermissionButton from '_c/permission-button';
import { tableTip } from '@/libs/tableTip';
import { validateIndex, validateNormal, validateSpace } from '@/libs/verification';
export default {
  name: 'system',
  components: {
    confirmBox,
    PermissionButton
  },
  data () {
    return {
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
          title: '系统名称',
          key: 'appName',
          render: tableTip
        },
        {
          title: '系统编码',
          key: 'appCode',
          render: tableTip
        },
        {
          title: '链接地址',
          key: 'appUrl',
          render: tableTip
        },
        {
          title: '系统排序',
          key: 'appIndex',
          sortable: true,
          render: tableTip
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
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
                      this.showSystemInfo(params.row, 1);
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
                      this.showSystemInfo(params.row, true);
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
              ])
            ]
            );
          }
        }
      ],
      ruleValidate: {
        appName: [
          { required: true, validator: validateNormal, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        appCode: [
          { required: true, validator: validateNormal, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        appUrl: [
          { required: true, validator: validateNormal, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        appIndex: [
          { required: true, validator: validateIndex, trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ]
      },
      addSystem: {
        appName: '',
        appCode: '',
        appUrl: '',
        appIndex: ''
      },
      organizeId: '',
      systemList: [],
      systemListLength: 1,
      pageSize: 10, // 每页显示条数
      pageIndex: 1,
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      showEditModal: false,
      isAddFunction: false,
      isShowInfoModal: false,
      selectedIds: [],
      time: false,
      confirmModel: false,
      confirmActive: '',
      searchData: ''
    };
  },
  mounted () {
    this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
  },
  methods: {
    getSystemListWithParm (organizeId, pageIndex, pageSize, appName) {
      getSystemListWithParm(organizeId, pageIndex, pageSize, appName).then(res => {
        this.systemList = res.data.data;
        this.systemListLength = res.data.page.total;
      });
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
    },
    changePageIndex (index) {
      this.pageIndex = index;
      this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
    },
    openAddSystemModal () {
      this.addSystem = {};
      this.showEditModal = true;
      this.isAddFunction = true;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddFunction) {
            this.addSystem = Object.assign({}, this.addSystem, { organizeId: this.organizeId });
            addNewSystem(this.addSystem).then(res => {
              if (res.data.state.code !== 5000) {
                this.$Message.success('新增系统成功!');
                this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
                this.showEditModal = false;
              }
            });
          } else {
            updateSystem(this.addSystem).then(res => {
              if (res.data.state.code !== 5000) {
                this.$Message.success('修改系统成功!');
                this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
                this.showEditModal = false;
              }
            });
          }
        } else {
          this.$Message.error({
            content: '校验失败,无法进行操作!',
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
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    showSystemInfo (item, isEditModal) {
      if (Number.isInteger(isEditModal)) {
        this.isShowInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }
      getSystemDetail(item.id).then(res => {
        this.addSystem = res.data.data;
      });
    },
    deleteModelChange (row) {
      this.confirmActive = '删除';
      if (row !== '') {
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
      deleteSystem(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.getSystemListWithParm(this.organizeId, this.pageIndex, this.pageSize, this.searchData);
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    },
    searchParams () {
      this.getSystemListWithParm(this.organizeId, 1, this.pageSize, this.searchData);
      this.pageIndex = 1;
    }
  }
};
</script>
<style scoped>
  .ivu-col {
    position: relative;
    display: block;
    height: 100%;
  }
</style>
