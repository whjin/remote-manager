<template>
  <div>
    <div class="title">部门管理</div>
    <i-row>
      <i-split v-model="split" min="200" max="650">
        <i-col slot="left" class="treeCol">
          <tpl-tree tpl-name="Organize" ref="organzieTree" :render="renderContent"></tpl-tree>
        </i-col>
        <i-col slot="right" class="tableCol">
          <span class="searchItemText">部门</span>
          <input v-model="organizeName" class="searchItemInput" type="text">
          <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="selectByParams">查询</i-button>
          <div class="tableFunction">
            <p>管理信息</p>
            <permission-button perms="conf:dept:del" type="error" label="删除选中" @click="deleteModelChange('rows','')" />
            <permission-button perms="conf:dept:add" type="primary" label="新增" @click="openAddOrganizeModal" />
          </div>
          <i-table border ref="table" :columns="columns" :data="organizeList" style="height:calc(100% - 13vw)" @on-selection-change="getSelectedRows"></i-table>
          <div class="tablePage selectionIcon">
            <i-page style="text-align: right" :total="organizeListLength" :page-size="pageSize" :current="pageIndex" :page-size-opts="pageSizeOpts" show-total @on-change="changePageIndex" @on-page-size-change="changePageSize" show-elevator show-sizer>
            </i-page>
          </div>
        </i-col>
      </i-split>
    </i-row>
    <!--确认框-->
    <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)" @confirmValue="confirmValue($event)"></confirm-box>
    <!--查看部门信息的模态框-->
    <i-modal v-model="showOrganizeInfoModal" width="30" title="查看部门信息" @on-ok="showOrganizeInfoModal = false">
      <p slot="header" style="color:#f60;">
        <span class="title">查看部门信息</span>
      </p>
      <div class="objInfoModal" style="height:80px;">
        <Tooltip :content="selectedOrganize.organizeName" placement="top-start">
          部门：{{selectedOrganize.organizeName}}
        </Tooltip>
        <Tooltip :content="selectedOrganize.parentName" placement="top-start">
          上级部门：{{selectedOrganize.parentName}}
        </Tooltip>
        <Tooltip :content="selectedOrganize.organizeCode" placement="top-start">
          部门编码：{{selectedOrganize.organizeCode}}
        </Tooltip>
        <Tooltip :content="selectedOrganize.organizeType" placement="top-start">
          部门类型：{{selectedOrganize.organizeType === 1 ? '提讯远程' : '在押远程'}}
        </Tooltip>
        <Tooltip :content="selectedOrganize.orderNo" placement="top-start">
          排序：{{selectedOrganize.orderNo}}
        </Tooltip>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="showOrganizeInfoModal = false">确定</i-button>
      </div>
    </i-modal>
    <!--修改部门信息的模态框-->
    <i-modal v-model="showEditModal" width="390" @on-ok="showOrganizeInfoModal = false" @on-cancel="cancelSubmit('selectedOrganize')">
      <p slot="header" style="color:#f60;">
        <span class="title">{{isAddFunction?'添加':'修改'}}部门信息</span>
      </p>
      <div class="objInfoModal" style="height:290px;">
        <i-form ref="selectedOrganize" :model="selectedOrganize" :rules="ruleValidate" :label-width="90">
          <i-form-item label="部门" prop="organizeName">
            <i-input v-model="selectedOrganize.organizeName" placeholder="请输入部门"></i-input>
          </i-form-item>
          <i-form-item v-show="isAddFunction" label="上级部门" prop="parentId">
            <i-input v-model="selectedOrganize.parentId" v-show="false" placeholder="上级部门"></i-input>
            <i-input v-model="addParentName" placeholder="上级部门" disabled></i-input>
          </i-form-item>
          <i-form-item label="部门编码" prop="organizeCode">
            <i-input v-model="selectedOrganize.organizeCode" :disabled="!isAddFunction" placeholder="请输入部门编码"></i-input>
          </i-form-item>
          <i-form-item label="部门类型" prop="organizeType">
            <i-select class="selectionIcon" v-model="selectedOrganize.organizeType" ref="organizeType">
              <i-option v-for="(item, index) in roomTypeList" :value="item.id" :key="index">{{ item.value }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="排序" prop="orderNo">
            <i-input v-model="selectedOrganize.orderNo" placeholder="请输入排序"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button type="primary" class="cancelBtn" @click="cancelSubmit('selectedOrganize')">取消</Button>
        <Button type="primary" class="confirmBtn" @click="handleSubmit('selectedOrganize')">提交</Button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import {
  getOrganizeDetail,
  getOrganizeList,
  getOrganizeListWithParm,
  addOrganize,
  updateOrganize,
  deleteOrganizes
} from '@/api/bg-manage/department';
import Border from '_c/border/borderWithTitle.vue';
import confirmBox from '_c/confirmBox';
import { tableTip } from '@/libs/tableTip';
import { validateIndex, validateNormal, validateSpace } from '@/libs/verification';
import Caspanel from 'iview/src/components/cascader/caspanel';
import PermissionButton from '_c/permission-button';
import { hasPerms } from '@/libs/util';

export default {
  name: 'department',
  components: {
    Caspanel,
    Border,
    confirmBox,
    PermissionButton
  },
  data () {
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
          title: '部门',
          key: 'organizeName',
          render: tableTip
        },
        {
          title: '上级部门',
          key: 'parentName',
          render: tableTip
        },
        {
          title: '部门编码',
          key: 'organizeCode',
          render: tableTip
        },
        {
          title: '排序',
          key: 'orderNo',
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
                      this.showOrganizeInfo(params.row, 1);
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
                      this.showOrganizeInfo(params.row, true);
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
                      this.deleteModelChange('row', params.row);
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
            ]);
          }
        }
      ],
      data: [], // 表格数据
      pageSize: 10, // 每页显示条数
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      dataCount: 0, // 总条数
      pageCurrent: 1, // 当前页
      treeData: [],
      organizeList: [],
      allOrganizeList: [],
      pageIndex: 1,
      isShowInfoModal: false,
      showOrganizeInfoModal: false,
      organizeName: '',
      ruleValidate: {
        organizeName: [
          { required: true, validator: validateSpace, trigger: 'blur' },
          { required: true, validator: validateNormal, trigger: 'blur' }
        ],
        orderNo: [
          { required: true, validator: validateIndex, trigger: 'blur' }
        ],
        organizeCode: [
          { required: true, validator: validateNormal, trigger: 'blur' }
        ]
      },
      selectedOrganize: {
        id: 0,
        organizeCode: '',
        organizeName: '',
        organizeType: '',
        isDeleted: 0,
        parentId: 0,
        parentName: '',
        orderNo: 0,
        path: ''
      },
      roomTypeList: [{
        id: 1,
        value: '提讯远程'
      }, {
        id: 2,
        value: '在押远程'
      }],
      selectedIds: [],
      showEditModal: false,
      deleteRowObj: [],
      deleteEditModal: false,
      organizeId: '',
      addParentName: '',
      organizeListLength: 0,
      isAddFunction: false,
      time: false,
      confirmModel: false,
      deleteType: '',
      deleteRow: '',
      confirmActive: '',
      selectNode: {}
    };
  },
  mounted () {
    // 获取组机构列表
    this.getOrganizeList();
    // 获取组机构列表分页
    this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
  },
  methods: {
    getSysOrganization () {
      this.$refs.organzieTree.reloadTree();
    },
    renderContent (h, { root, node, data }) {
      let permsArray = [h('span', [h('span', data.title)])];
      if (hasPerms('conf:dept:edit', this.$store.state.app.permissionList)) {
        permsArray.push(h('span', {
          style: {
            display: 'inline-block',
            right: '5px'
          }
        }, [h('Button', {
          props: Object.assign({}, this.buttonProps, {
            icon: 'md-create'
          }),
          style: {
            padding: '0 2px',
            marginRight: '2px',
            border: '1px solid #0A4081',
            borderRadius: '4px',
            background: '#111A2D',
            color: '#fff'
          },
          on: {
            click: () => {
              this.showOrganizeInfo(data, true);
            }
          }
        })]));
      }
      if (data.treeParams.ROOTID == '0') {
        return h('span', {
          style: {
            display: 'inline-block',
            color: node.node.selected ? 'rgba(255, 255, 255)' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: node.node.selected ? 'bolder' : 'normal'
          },
          on: {
            click: (obj) => {
              if (!node.node.selected) {
                this.$refs.organzieTree.handleSelect(node.nodeKey); // 手动选择树节点
                this.selectNode = data;
              }
              this.changeOrganizeId(data);
            }
          }
        }, permsArray);
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            color: node.node.selected ? 'rgba(255, 255, 255)' : 'rgba(255, 255, 255, 0.65)',
            fontWeight: node.node.selected ? 'bolder' : 'normal'
          },
          on: {
            click: (obj) => {
              if (!node.node.selected) {
                this.$refs.organzieTree.handleSelect(node.nodeKey); // 手动选择树节点
                this.selectNode = data;
              }
              this.changeOrganizeId(data);
            }
          }
        }, [
          h('span', [
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              position: 'absolute',
              right: '5px'
            }
          })
        ]);
      }
    },
    getOrganizeList () {
      getOrganizeList().then(res => {
        this.allOrganizeList = res.data.data;
      });
    },
    changePageIndex (index) {
      this.pageIndex = index;
      this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
    },
    selectByParams () {
      this.pageIndex = 1;
      this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
    },
    getOrganizeListWithParm (organizeId, organizeName, pageIndex, pageSize) {
      getOrganizeListWithParm(organizeId, organizeName, pageIndex, pageSize).then(res => {
        this.organizeList = res.data.data;
        this.organizeListLength = res.data.page.total;
      });
    },
    changeOrganizeId (currentObj) {
      this.addParentName = currentObj.title;
      this.organizeId = currentObj.id;
      this.pageIndex = 1;
      this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
    },
    openAddOrganizeModal () {
      if (this.organizeId == '') {
        this.$Message.error('请先点击部门树再进行新增操作');
        this.showEditModal = false;
        return;
      }
      this.showEditModal = true;
      this.selectedOrganize = {};
      this.selectedOrganize.parentId = this.organizeId;
      // this.selectedOrganize.orderNo = 0;
      this.isAddFunction = true;
    },
    showOrganizeInfo (item, isEditModal) {
      if (Number.isInteger(isEditModal)) {
        this.showOrganizeInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }

      getOrganizeDetail(item.id).then(res => {
        this.selectedOrganize = res.data.data.organize;
        this.selectedOrganize.parentName = res.data.data.parentName;
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddFunction) {
            this.selectedOrganize.parentId = this.organizeId;
            addOrganize(this.selectedOrganize).then(res => {
              if (res.data.state.code === 200) {
                this.$Message.success('新增部门成功!');
                this.showEditModal = false;
                this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);

                this.$refs.organzieTree.reloadTree();
              }
            });
          } else {
            updateOrganize(this.selectedOrganize).then(res => {
              if (res.data.state.code === 200) {
                this.$Message.success('修改部门成功!');
                this.showEditModal = false;
                this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);

                if (this.selectNode.nodeKey === 0) {
                  this.$refs.organzieTree.reloadTree();
                } else {
                  this.$refs.organzieTree.reloadTree();
                }
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
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    updateConfirmModel (el) {
      this.confirmModel = el;
      this.$refs.table.selectAll();
    },
    deleteModelChange (item, row) {
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
    confirmValue () {
      this.deleteRows();
    },
    deleteRows () {
      deleteOrganizes(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.getOrganizeListWithParm(this.organizeId, this.organizeName, this.pageIndex, this.pageSize);
          this.$Message.success(res.data.data);
          this.$refs.organzieTree.reloadTree();
        } else {
          this.$Message.error(res.data.data || "请求报错");
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    }
  }
};
</script>
