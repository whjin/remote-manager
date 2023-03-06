<template>
  <div>
    <div class="title">数据字典</div>
    <i-row>
      <i-split v-model="split" min="200" max="650" >
        <i-col slot="left" class="treeCol">
          <tpl-tree tpl-name="Dictionary" ref="tplTree" :render="renderContent"></tpl-tree>
        </i-col>
        <i-col slot="right" class="tableCol">
          <span class="searchItemText">字段名称</span><input v-model="name" class="searchItemInput" type="text">
          <span v-if="isHeadShow">
            <span class="searchItemText">所属分类</span><input v-model="type" class="searchItemInput" type="text">
          </span>
          <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="selectedByParams">查询</i-button>
          <div class="tableFunction">
            <p>管理信息</p>
            <permission-button type="error"
                               label="删除选中"
                               perms="conf:dictionary:del"
                               @click="deleteModelChange('field','')" />
            <permission-button type="primary"
                               label="新增"
                               perms="conf:dictionary:add"
                               @click="openAddDataDictionaryModal" />
          </div>
          <i-table border
                   ref="table"
                   :columns="columns"
                   :data="dataDictionaryList"
                   style="height:calc(100% - 13vw)"
                   @on-selection-change="getSelectedRows">
          </i-table>
          <div class="tablePage selectionIcon">
            <i-page style="text-align: right"
                    show-total
                    show-elevator
                    show-sizer
                    :total="dataDictionaryListLength"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    ref="pages"
                    @on-change="changePageIndex"
                    @on-page-size-change="changePageSize">
            </i-page>
          </div>
        </i-col>
      </i-split>
    </i-row>
    <!--删除确认框-->
    <confirm-box :confirmModel="confirmModel"
                 :confirmActive="confirmActive"
                 @passModel="updateConfirmModel($event)"
                 @confirmValue="deleteRows($event)">
    </confirm-box>
    <!--查看数据字典信息的模态框-->
    <i-modal width="600" v-model="showInfoModal" @on-ok="showInfoModal = false">
      <p slot="header">
        <span class="title">查看数据字典信息</span>
      </p>
      <div class="objInfoModal" style="height:100px;">
        <i-tooltip :content="selectedDataDictionary.fieldName" placement="top-start" v-show="selectedDataDictionary.fieldName">
          字段名称：{{selectedDataDictionary.fieldName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedDataDictionary.fieldName">
          字段名称：{{selectedDataDictionary.fieldName}}
        </div>
        <i-tooltip :content="selectedDataDictionary.fieldValue" placement="top-start" v-show="selectedDataDictionary.fieldValue">
        字段值：{{selectedDataDictionary.fieldValue}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedDataDictionary.fieldValue">
          字段值：{{selectedDataDictionary.fieldValue}}
        </div>
        <i-tooltip :content="selectedDataDictionary.typeName" placement="top-start" v-show="selectedDataDictionary.typeName">
          所属分类：{{selectedDataDictionary.typeName}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedDataDictionary.typeName">
          所属分类：{{selectedDataDictionary.typeName}}
        </div>
        <i-tooltip :content="selectedDataDictionary.fieldDesc" placement="top-start" v-show="selectedDataDictionary.fieldDesc">
          顺序：{{selectedDataDictionary.fieldDesc}}
        </i-tooltip>
        <div class="unToolTip" v-show="!selectedDataDictionary.fieldDesc">
          顺序：{{selectedDataDictionary.fieldDesc}}
        </div>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="closeShowInfoModal(selectedDataDictionary.typeName)">确定</i-button>
      </div>
    </i-modal>
    <!--修改数据字典信息的模态框-->
    <i-modal v-model="showDictionaryFieldEditModal" width="720" @on-cancel="cancelSubmit('selectedDictionaryField')">
      <p slot="header">
        <span class="title">{{isAddDictionaryFieldFunction?'新增':'修改'}}数据字典信息</span>
      </p>
      <div class="userInfo" style="height:120px;">
        <i-form ref="selectedDictionaryField" :model="selectedDataDictionary" :label-width="120" :rules="DictionaryFieldRuleValidate">
          <i-form-item label="字段名称" prop="fieldName">
            <i-input v-model="selectedDataDictionary.fieldName" placeholder="请输入字段名称"></i-input>
          </i-form-item>
          <i-form-item label="字段值" prop="fieldValue">
            <i-input v-model="selectedDataDictionary.fieldValue" placeholder="请输入字段值"></i-input>
          </i-form-item>
          <i-form-item label="所属分类" prop="typeName">
            <i-input v-model="selectedDataDictionary.typeName" disabled placeholder="请输入所属分类" style="opacity: 1;cursor: not-allowed;color: #ccc;"></i-input>
          </i-form-item>
          <i-form-item label="顺序" prop="fieldDesc">
            <i-input v-model="selectedDataDictionary.fieldDesc" placeholder="请输入顺序"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" class="cancelBtn" @click="cancelSubmit('selectedDictionaryField')">取消</i-button>
        <i-button type="primary" class="confirmBtn" @click="handleSubmit('selectedDictionaryField')">提交</i-button>
      </div>
    </i-modal>
    <!--修改数据字典类型信息的模态框-->
    <i-modal v-model="showDictionaryTypeEditModal" width="720" @on-cancel="cancelSubmit('selectedDictionaryType')">
      <p slot="header">
        <span class="title">{{isAddDictionaryTypeFunction?'新增':'修改'}}数据字典类型信息</span>
      </p>
      <div class="userInfo" style="height:120px;">
        <i-form ref="selectedDictionaryType" :model="selectedDictionaryType" :label-width="120" :rules="DictionaryTypeRuleValidate">
          <i-form-item label="类型名称" prop="typeName">
            <i-input v-model="selectedDictionaryType.typeName" placeholder="请输入类型名称"></i-input>
          </i-form-item>
          <i-form-item label="类型编码" prop="typeCode">
            <i-input v-model="selectedDictionaryType.typeCode" placeholder="请输入类型编码"></i-input>
          </i-form-item>
          <i-form-item label="所属系统" prop="appName">
            <i-input v-model="selectedDictionaryType.appName" disabled placeholder="请输入所属系统"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <i-button type="primary" class="cancelBtn" @click="cancelSubmit('selectedDictionaryType')">取消</i-button>
        <i-button type="primary" class="confirmBtn" @click="handleDictionaryTypeSubmit('selectedDictionaryType')">提交</i-button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import { searchDataDictionaryListWithParm, getDataDictionaryDetail, deleteDataDictionarys, saveDictionaryField, updateDictionaryField, getDictionaryTypeDetail, saveDictionaryType, updateDictionaryType, getAppInfoDetail, deleteDictionaryTypeById } from '@/api/bg-manage/dataDictionary';
import TreeSelect from '_c/tree-select/index';
import confirmBox from '_c/confirmBox/index';
import PermissionButton from '_c/permission-button/index';
import { tableTip } from '@/libs/tableTip';
import { validateSpace } from '@/libs/verification';
import { hasPerms } from '@/libs/util';
export default {
  name: 'dictionary',
  components: {
    TreeSelect,
    confirmBox,
    PermissionButton
  },
  data () {
    const fieldDescCheck = (rule, value, callback) => {
      if (value == '' || value == undefined || /^[0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error('顺序为正整数'));
      }
    };
    const fieldValueCheck = (rule, value, callback) => {
      if (/^[A-Za-z0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error('由字母或者数字组成'));
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
          title: '字段名称',
          key: 'fieldName',
          render: tableTip
        },
        {
          title: '字段值',
          key: 'fieldValue',
          render: tableTip
        },
        {
          title: '所属分类',
          key: 'typeName',
          render: tableTip
        },
        {
          title: '顺序',
          key: 'fieldDesc',
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
                      this.showDataDictionaryInfo(params.row, 1);
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
                      this.showDataDictionaryInfo(params.row, true);
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
                      this.deleteModelChange('field', params.row);
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
      selectedDataDictionary: {
        fieldName: '',
        fieldValue: '',
        typeName: '',
        fieldDesc: ''
      },
      selectedDictionaryType: {
        typeName: '',
        typeCode: '',
        appName: ''
      },
      data: [], // 表格数据
      pageSize: 10, // 每页显示条数
      pageSizeOpts: [10, 15, 20], // 每页显示条数的配置
      dataCount: 0, // 总条数
      pageCurrent: 1, // 当前页
      dataDictionaryList: [],
      pageIndex: 1,
      dataDictionaryListLength: 0,
      params: {
        EQ_sysDictionaryTypeDO_appCode: '',
        EQ_sysDictionaryFieldDO_id: '',
        EQ_sysDictionaryFieldDO_typeId: '',
        LIKE_sysDictionaryFieldDO_fieldName: '',
        LIKE_sysDictionaryTypeDO_typeName: ''
      },
      processNode: {},
      id: '',
      parentId: '',
      appCode: '',
      name: '',
      type: '',
      typeName: '',
      typeId: '',
      isShowInfoModal: false,
      showDictionaryFieldEditModal: false,
      showDictionaryTypeEditModal: false,
      isAddDictionaryFieldFunction: false,
      isAddDictionaryTypeFunction: false,
      showDeleteModel: false,
      time: false,
      showInfoModal: false,
      isHeadShow: true,
      DictionaryTypeRuleValidate: {
        typeName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ]
      },
      DictionaryFieldRuleValidate: {
        fieldName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', validator: validateSpace, trigger: 'blur' }
        ],
        fieldValue: [
          { required: true, validator: fieldValueCheck, trigger: 'blur' }
        ],
        fieldDesc: [
          { validator: fieldDescCheck, trigger: 'blur' }
        ]
      },
      selectedIds: [],
      confirmModel: false,
      deleteType: '',
      confirmActive: '',
      selectNode: {}
    };
  },
  mounted () {
    this.getDataDictionaryListWithParm(this.params, this.pageIndex, this.pageSize);
  },
  methods: {
    renderContent (h, { root, node, data }) {
      let addArray = [];
      if (hasPerms('conf:dictionary:type:add', this.$store.state.app.permissionList)) {
        addArray.push(h('span', {
          style: {
            display: 'inline-block',
            position: 'absolute',
            right: '5px'
          }
        }, [h('Icon', {
          props: {
            type: 'ios-add'
          },
          style: {
            marginRight: '2px',
            border: '1px solid rgb(0, 122, 255)',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0)',
            color: 'rgb(0, 122, 255)!important'
          },
          on: {
            click: () => {
              this.processNode = data;
              this.openAddDictionaryTypeModal(data.id);
            }
          }
        })]));
      }
      let editAndDelArray = [];
      if (hasPerms('conf:dictionary:type:edit', this.$store.state.app.permissionList)) {
        editAndDelArray.push();
      }
      if (hasPerms('conf:dictionary:type:del', this.$store.state.app.permissionList)) {
        editAndDelArray.push();
      }
      if (data.treeParams.CHILDCOUNT !== undefined) {
        return h('span', {
          style: {
            display: 'inline-block'
          }
        }, [
          h('span', [
            h('span', {
              on: {
                click: (ev) => {
                  if (this.selectNode.target) {
                    this.selectNode.target.style.color = 'rgba(255,255,255,0.65)';
                  }
                  ev.target.style.color = '#fff';
                  ev.target.style.fontWeight = 'bolder';
                  this.selectNode = ev;
                  this.changeDictionaryAppCode(data.treeParams.BMCLASSID);
                }
              }
            }, data.title)
          ]),
          addArray
        ]);
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            width: 'calc(100% - 60px)'
          }
        }, [
          h('span',
            {
              style: {
                width: '100%'
              }
            }, [
              h('Tooltip',
                {
                  style: {
                    width: '100%'
                  },
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                }, [
                  h('span', {
                    style: {
                      width: '100%',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    },
                    on: {
                      click: (ev) => {
                        if (this.selectNode.target) {
                          this.selectNode.target.style.color = 'rgba(255,255,255,0.65)';
                        }
                        ev.target.style.color = '#fff';
                        ev.target.style.fontWeight = 'bolder';
                        this.selectNode = ev;
                        this.changeDictionaryTypeId(data);
                      }
                    }
                  }, data.title),
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal'
                    }
                  }, data.title)
                ])
            ]),
          h('span', {
            style: {
              display: 'inline-block',
              position: 'absolute',
              right: '5px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-create'
              }),
              style: {
                padding: '0px 2px',
                marginRight: '2px',
                border: '1px solid rgb(0, 122, 255)',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0)',
                color: 'rgb(0, 122, 255)!important'
              },
              on: {
                click: () => {
                  this.processNode = data;
                  this.openUpdateDictionaryTypeModal(data.id);
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove'
              }),
              style: {
                padding: '0px 2px',
                marginRight: '2px',
                border: '1px solid rgb(0, 122, 255)',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0)',
                color: 'rgb(0, 122, 255)'
              },
              on: {
                click: () => {
                  this.processNode = data;
                  this.deleteModelChange('type', data);
                }
              }
            })
          ])
        ]);
      }
    },
    getSysDictionaryType () {
      this.$refs.tplTree.reloadTree();
    },
    selectedByParams () {
      this.params = {};
      this.pageIndex = 1;
      this.$refs['pages'].currentPage = 1;
      this.params.LIKE_sysDictionaryFieldDO_fieldName = this.name;
      this.params.LIKE_sysDictionaryTypeDO_typeName = this.type;
      this.getDataDictionaryListWithParm(this.params, this.pageIndex, this.pageSize);
    },
    changePageIndex (index) {
      this.pageIndex = index;
      this.getDataDictionaryListWithParm(this.params, this.pageIndex, this.pageSize);
    },
    closeShowInfoModal (item) {
      this.selectedDataDictionary = {};
      this.selectedDataDictionary.typeName = item;
      this.showInfoModal = false;
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.getDataDictionaryListWithParm(this.params, this.index, pageSize);
    },
    getDataDictionaryListWithParm (params, pageIndex, pageSize) {
      searchDataDictionaryListWithParm(params, pageIndex, pageSize).then(res => {
        this.dataDictionaryList = res.data.data;
        this.dataDictionaryListLength = res.data.page.total;
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    cancelSubmit (name) {
      let typeName = this.selectedDataDictionary.typeName;
      this.$refs[name].resetFields();
      this.showDictionaryFieldEditModal = false;
      this.showDictionaryTypeEditModal = false;
      this.showDeleteModel = false;
      this.selectedDataDictionary = {};
      this.selectedDataDictionary.typeName = typeName;
    },
    changeDictionaryTypeId (item) {
      this.params = {};
      this.params.EQ_sysDictionaryFieldDO_typeId = item.id;
      this.selectedDataDictionary.typeName = item.title;
      this.selectedDictionaryType.id = item.parentId;
      this.typeId = item.id;
      this.$refs['pages'].currentPage = 1;
      this.getDataDictionaryListWithParm(this.params, 1, this.pageSize);
      this.params = {};
      this.params.EQ_sysDictionaryFieldDO_typeId = item.id;
      this.type = item.title;
      this.isHeadShow = false;
    },
    changeDictionaryAppCode (item) {
      this.params = {};
      this.selectedDataDictionary = {};
      this.params.EQ_sysDictionaryTypeDO_appCode = item;
      this.$refs['pages'].currentPage = 1;
      this.getDataDictionaryListWithParm(this.params, 1, this.pageSize);
      this.params = {};
      this.type = '';
      this.isHeadShow = true;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddDictionaryFieldFunction) {
            this.selectedDataDictionary = Object.assign({}, this.selectedDataDictionary, { id: this.id });
            saveDictionaryField(this.selectedDataDictionary, this.selectedDataDictionary.typeName, this.typeId).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('新增数据字典信息成功!');
              }
              let data = {
                'EQ_sysDictionaryFieldDO_id': this.id,
                'LIKE_sysDictionaryTypeDO_typeName': this.selectedDataDictionary.typeName
              };
              let typeName = this.selectedDataDictionary.typeName;
              this.selectedDataDictionary = {};
              this.selectedDataDictionary.typeName = typeName;
              this.getDataDictionaryListWithParm(data, this.pageIndex, this.pageSize);
            });
          } else {
            updateDictionaryField(this.selectedDataDictionary, this.selectedDataDictionary.typeName, this.selectedDataDictionary.typeId).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('修改数据字典信息成功!');
              }
              let data = {
                'EQ_sysDictionaryFieldDO_id': this.id,
                'LIKE_sysDictionaryTypeDO_typeName': this.selectedDataDictionary.typeName
              };
              let typeName = this.selectedDataDictionary.typeName;
              this.selectedDataDictionary = {};
              this.selectedDataDictionary.typeName = typeName;
              this.getDataDictionaryListWithParm(data, this.pageIndex, this.pageSize);
            });
          }
          this.showDictionaryFieldEditModal = false;
        } else {
          this.$Message.error('校验失败!无法进行操作');
        }
      });
    },
    handleDictionaryTypeSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddDictionaryTypeFunction) {
            this.selectedDictionaryType = Object.assign({}, this.selectedDictionaryType, { typeId: this.typeId });
            saveDictionaryType(this.selectedDictionaryType, this.selectedDictionaryType.appName).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('新增数据字典类型成功!');
              }
              this.$refs.tplTree.reloadNode(this.processNode.id);
            });
          } else {
            updateDictionaryType(this.selectedDictionaryType, this.selectedDictionaryType.appName).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('修改数据字典类型成功!');
              }
              this.$refs.tplTree.reloadNode(this.processNode.parentId);
            });
          }
          this.id = '';
          this.showDictionaryTypeEditModal = false;
        } else {
          this.$Message.error('校验失败!无法进行操作');
        }
      });
    },
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    showDataDictionaryInfo (item, isEditModal) {
      if (Number.isInteger(isEditModal)) {
        this.showInfoModal = true;
      } else {
        this.showDictionaryFieldEditModal = true;
        this.isAddDictionaryFieldFunction = false;
      }
      getDataDictionaryDetail(item.id).then(res => {
        this.selectedDataDictionary = res.data.data[0];
      });
    },
    openAddDataDictionaryModal () {
      if (this.selectedDataDictionary.typeName == '' || this.selectedDataDictionary.typeName == undefined) {
        this.$Message.error('请先从左边选择一个字段名称');
      } else {
        this.showDictionaryFieldEditModal = true;
        this.isAddDictionaryFieldFunction = true;
      }
    },
    openUpdateDictionaryTypeModal (item) {
      this.isAddDictionaryTypeFunction = false;
      getDictionaryTypeDetail(item).then(res => {
        this.selectedDictionaryType = res.data.data;
      });
      this.showDictionaryTypeEditModal = true;
    },
    openAddDictionaryTypeModal (item) {
      this.isAddDictionaryTypeFunction = true;
      getAppInfoDetail(item).then(res => {
        this.selectedDictionaryType = {};
        this.selectedDictionaryType.appName = res.data.data.appName;
      });
      this.showDictionaryTypeEditModal = true;
    },
    deleteModelChange (item, row) {
      this.confirmActive = '删除';
      if (item == 'field') {
        this.deleteType = 'field';
        if (row !== '') {
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
      } else {
        this.deleteType = 'type';
        this.selectedIds = row.id;
        this.parentId = row.parentId;
        this.confirmModel = true;
      }
    },
    updateConfirmModel (el) {
      this.$refs.table.selectAll();
      this.confirmModel = el;
    },
    deleteRows () {
      if (this.deleteType == 'field') {
        deleteDataDictionarys(this.selectedIds.toString()).then(res => {
          if (res.data.state.code == 200) {
            let data = {
              'EQ_sysDictionaryFieldDO_typeId': this.params.EQ_sysDictionaryFieldDO_typeId
            };
            this.getDataDictionaryListWithParm(data, this.pageIndex, this.pageSize);
          }
        });
      } else {
        deleteDictionaryTypeById(this.selectedIds.toString()).then(res => {
          if (res.data.state.code == 200) {
            this.$refs.tplTree.reloadNode(this.parentId);
          }
        });
      }
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

  .ivu-input[disabled], fieldset[disabled] .ivu-input {
    opacity: 1;
    cursor: not-allowed;
    color: #ccc;
    background: #111A2D;
  }

</style>
