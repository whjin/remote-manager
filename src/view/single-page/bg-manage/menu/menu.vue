<template>
  <div>
    <div class="title">菜单管理</div>
    <i-row>
      <i-split v-model="split" min="200" max="650">
        <i-col slot="left" class="treeCol">
          <tpl-tree tpl-name="Menu" ref="tplTree" :render="renderContent" platformUrl="sysmgr"></tpl-tree>
        </i-col>
        <i-col slot="right" class="tableCol">
          <span class="searchItemText">权限名称</span>
          <input v-model="menuName" class="searchItemInput" type="text">
          <i-button type="primary" style="display: inline-block;margin-left: 20px;" @click="getMenuInfoByMenuName">查询
          </i-button>
          <div class="tableFunction">
            <p>管理信息</p>
            <permission-button type="error"
                               label="删除选中"
                               perms="conf:menu:del"
                               @click="deleteModelChange('rows','')"/>
            <permission-button type="primary"
                               label="新增按钮"
                               perms="conf:menu:button"
                               @click="addButton"/>
            <permission-button type="primary"
                               label="新增菜单"
                               perms="conf:menu:add"
                               @click="addMenu"/>
          </div>
          <i-table border ref="table" :columns="columns" :data="organizeList"
                   style="height:calc(100% - 13vw)"
                   @on-selection-change="getSelectedRows"></i-table>
          <div class="tablePage selectionIcon">
            <i-page style="text-align: right"
                    :total="menuListLength" :page-size="pageSize" :page-size-opts="pageSizeOpts" :current="pageIndex"
                    show-total
                    @on-change="changePageIndex"
                    @on-page-size-change="changePageSize"
                    show-elevator show-sizer>
            </i-page>
          </div>
        </i-col>
      </i-split>
    </i-row>
    <!--确认框-->
    <confirm-box :confirmModel="confirmModel" :confirmActive="confirmActive" @passModel="updateConfirmModel($event)"
                 @confirmValue="confirmValue($event)"></confirm-box>
    <!--查看菜单信息的模态框-->
    <i-modal
      v-model="showInfoModal"
      title="查看菜单信息"
      @on-ok="showInfoModal = false"
      width="600"
    >
      <p slot="header" style="color:#f60;">
        <span class="title">查看{{ isMenu? '菜单' : '按钮' }}信息</span>
      </p>
      <div class="objInfoModal" style="height:100px;">
        <Tooltip :content="isMenu? '菜单' : '按钮'+selectedMenuInfo.menuName" placement="top-start">
          {{ isMenu? '菜单' : '按钮' }}名称：{{selectedMenuInfo.menuName}}
        </Tooltip>
        <Tooltip :content="selectedMenuInfo.parentName" placement="top-start">
          上级菜单：{{selectedMenuInfo.parentName}}
        </Tooltip>
        <Tooltip :content="selectedMenuInfo.urlOrCode" placement="top-start" style="overflow: visible;">
          菜单URL/编码：{{selectedMenuInfo.urlOrCode}}
        </Tooltip>
      </div>
      <div slot="footer">
        <i-button type="primary" class="confirmBtn" @click="showInfoModal = false">确定</i-button>
      </div>
    </i-modal>
    <!--修改菜单信息的模态框-->
    <i-modal v-model="showEditModal" width="740" @on-cancel="cancelSubmit('selectedMenuInfo')">
      <p slot="header" style="color:#f60;">
        <span class="title">{{isAddFunction?'新增':'修改'}}{{ isMenu? '菜单' : '按钮' }}信息</span>
      </p>
      <div style="height:120px; ">
        <i-form ref="selectedMenuInfo" :model="selectedMenuInfo" :label-width="120" :rules="ruleValidate">
          <i-form-item :label="isMenu? '菜单名称' : '按钮名称'" prop="menuName">
            <i-input v-model="selectedMenuInfo.menuName" placeholder="请输入权限名称"></i-input>
          </i-form-item>
          <i-form-item label="权限编码" prop="menuCode" v-show="!isMenu">
            <i-input v-model="selectedMenuInfo.menuCode" placeholder="请输入权限编码"></i-input>
          </i-form-item>
          <i-form-item label="上级菜单" prop="parentId">
            <i-input v-model="selectedMenuInfo.parentId" v-show="false" placeholder="上级菜单"></i-input>
            <i-input v-model="selectedMenuInfo.parentName" placeholder="上级菜单" disabled></i-input>
          </i-form-item>
          <i-form-item v-show="isMenu" label="菜单URL" prop="menuUrl">
            <i-input v-model="selectedMenuInfo.menuUrl" placeholder="请输入菜单URL"></i-input>
          </i-form-item>
          <i-form-item label="顺序" prop="indexNum">
            <i-input v-model="selectedMenuInfo.indexNum" placeholder="请输入顺序"></i-input>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button type="primary" class="cancelBtn" @click="cancelSubmit('selectedMenuInfo')">取消</Button>
        <Button type="primary" class="confirmBtn" @click="handleSubmit('selectedMenuInfo')">提交</Button>
      </div>
    </i-modal>
    <!--树的添加文件模态框-->
    <i-modal v-model="showFileModel" width="600">
      <p slot="header" style="color:#f60;">
        <span class="title">上传文件</span>
      </p>
      <div style="height:50px;">
        <i-form ref="menuFile" :label-width="100">
          <i-form-item label="权限名称">
            <i-upload action="//jsonplaceholder.typicode.com/posts/"
                      :before-upload="handleUpload"
                      accept=".xml"
                      style="width:470px;"
                      ref="menuFileUpload"><!--action为上传地址-->
              <span></span>
              <i-button>添加</i-button>
            </i-upload>
            <span style="color: red" v-show="fileTip">注：文件格式（.XML）</span>
          </i-form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button type="primary" class="cancelBtn" @click="cancelSubmit('menuFile')">取消</Button>
        <Button type="primary" class="confirmBtn" @click="importXml()">提交</Button>
      </div>
    </i-modal>
  </div>
</template>

<script>
import {
  addMenuInfo,
  deleteMenuInfos,
  getMenuInfoListWithParm,
  importMenuByXml,
  updateMenuInfo
} from '@/api/bg-manage/configure';
import Border from '_c/border/borderWithTitle.vue';
import '@/view/single-page/bg-manage/menu/menu.less';
import confirmBox from '_c/confirmBox/index';
import { tableTip } from '@/libs/tableTip';
import { validateNormal, validateIndex } from '@/libs/verification';
import PermissionButton from '_c/permission-button/index';
import { hasPerms } from '@/libs/util';

export default {
  name: 'menu',
  components: {
    Border,
    confirmBox,
    PermissionButton
  },
  data () {
    const validateMenuCode = (rule, value, callback) => {
      if (this.isMenu) {
        callback();
      } else {
        if (!validateSpace(value, callback)) {
          validateNormal(rule, value, callback);
        }
      }
    };
    const validateMenuUrl = (rule, value, callback) => {
      if (!this.isMenu) {
        callback();
      } else {
        if (!validateSpace(value, callback)) {
          validateNormal(rule, value, callback);
        }
      }
    };
    const validateMenuName = (rule, value, callback) => {
      if (!validateSpace(value, callback)) {
        validateNormal(rule, value, callback);
      }
    };
    const validateSpace = (value, callback) => {
      let reg = (/\s/g).test(value);
      if (reg) {
        callback(new Error('输入的字符不能为空格'));
      } else {
        return reg;
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
          title: '权限名称',
          key: 'menuName',
          render: tableTip
        },
        {
          title: '菜单URL/编码',
          key: 'urlOrCode',
          render: tableTip
        },
        {
          title: '类型（菜单/按钮）',
          key: 'menuTypeName',
          render: tableTip
        },
        {
          title: '上级菜单',
          key: 'parentName',
          render: tableTip
        },
        {
          title: '顺序',
          key: 'indexNum',
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
                      this.showMenuInfo(params.row, 1);
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
                      this.showMenuInfo(params.row, true);
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
      isSelectList: false,
      isMenu: false,
      fileTip: false,
      organizeList: [],
      allOrganizeList: [],
      ruleValidate: {
        menuName: [
          { required: true, validator: validateMenuName, trigger: 'blur' }
        ],
        menuCode: [
          { required: true, validator: validateMenuCode, trigger: 'blur' }
        ],
        menuUrl: [
          { required: true, validator: validateMenuUrl, trigger: 'blur' }
        ],
        indexNum: [
          { required: true, validator: validateIndex, trigger: 'blur' }
        ]
      },
      processNode: {},
      pageIndex: 1,
      showInfoModal: false,
      showMenuInfoModal: false,
      organizeName: '',
      selectedMenuInfo: {
        menuName: '',
        menuCode: '',
        menuType: '',
        appCode: '',
        menuUrl: '',
        iconUrl: '',
        parentId: 0,
        parentName: '',
        indexNum: 0,
        urlOrCode: 0,
        path: ''
      },
      selectedIds: [],
      showEditModal: false,
      deleteRowObj: [],
      deleteEditModal: false,
      menuInfoId: '',
      addMenuInfoId: 0,
      menuName: '',
      addMenuName: '',
      addParentName: '',
      appCode: '',
      addAppCode: '',
      uploadFile: '',
      menuListLength: 0,
      isAddFunction: false,
      time: false,
      showFileModel: false,
      confirmModel: false,
      confirmActive: ''
    };
  },
  mounted () {
    // 获取菜单列表分页
    this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
  },
  methods: {
    renderContent (h, { root, node, data }) {
      let permsArray = [h('span', [h('span', {
        style: {
          color: 'rgba(255,255,255,0.4)'
        },
        on: {
          click: (ev) => {
            if (!node.node.selected) {
              this.processNode = data;
              this.$refs.tplTree.handleSelect(node.nodeKey); // 手动选择树节点
            }
            let treeNode = document.getElementsByClassName('ivu-tree-children');
            for (let i = 0; i < treeNode.length; i++) {
              let treeCon = treeNode[i].children[0].children[1].children[0].children[0];
              treeCon.style.color = 'rgba(255,255,255,0.4)';
              treeCon.style.fontWeight = 'normal';
            }
            if (node.node.selected) {
              ev.target.style.color = '#fff';
              ev.target.style.fontWeight = 'bolder';
            }
            this.changeMenuInfoId(data);
          }
        }
      }, data.title)])];
      if (hasPerms('conf:menu:upload', this.$store.state.app.permissionList)) {
        permsArray.push(h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add',
              style: {
                color: '#007AFF'
              }
            }),
            style: {
              padding: '0 2px',
              marginRight: '2px',
              border: '1px solid #007AFF',
              borderRadius: '4px',
              background: 'rgba(0,0,0,0)',
              color: '#007AFF'
            },
            on: {
              click: () => {
                this.addAppCode = data.treeParams.appCode;
                this.showFile();
              }
            }
          })
        ]));
      }
      if (data.treeParams.lastStart !== 'lv1') {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            color: 'rgba(255,255,255,0.4)'
          }
        }, [
          h('span', [
            h('span', {
              on: {
                click: (ev) => {
                  if (!node.node.selected) {
                    this.processNode = data;
                    this.$refs.tplTree.handleSelect(node.nodeKey); // 手动选择树节点
                  }
                  let treeNode = document.getElementsByClassName('ivu-tree-children');
                  for (let i = 0; i < treeNode.length; i++) {
                    let treeCon = treeNode[i].children[0].children[1].children[0].children[0];
                    treeCon.style.color = 'rgba(255,255,255,0.4)';
                    treeCon.style.fontWeight = 'normal';
                  }
                  if (node.node.selected) {
                    ev.target.style.color = '#fff';
                    ev.target.style.fontWeight = 'bolder';
                  }
                  this.changeMenuInfoId(data);
                }
              }
            }, data.title)
          ])
        ]);
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, permsArray);
      }
    },
    getMenuInfo () {
      let loadId = this.processNode.parentId == undefined ? this.processNode.id : this.processNode.parentId;
      this.$refs.tplTree.reloadNode(loadId);
    },
    changePageIndex (index) {
      this.pageIndex = index;
      this.isSelectList = true;
      this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize;
      this.isSelectList = true;
      this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
    },
    getMenuInfoByMenuName () {
      this.isSelectList = true;
      this.menuInfoId = null;
      this.appCode = null;
      this.pageIndex = 1;
      this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
    },
    getMenuInfoListWithParm (menuInfoId, menuName, appCode, pageIndex, pageSize) {
      getMenuInfoListWithParm(menuInfoId, menuName, appCode, pageIndex, pageSize).then(res => {
        this.organizeList = res.data.data;
        this.menuListLength = res.data.page.total;
      });
      this.isSelectList ? this.isSelectList = false : this.getMenuInfo();
    },
    changeMenuInfoId (currentObj) {
      this.isSelectList = true;
      this.appCode = currentObj.treeParams.appCode;
      if (currentObj.parentId == undefined) {
        this.menuInfoId = '0';
        this.addMenuInfoId = 0;
      } else {
        this.menuInfoId = currentObj.id;
        this.addMenuInfoId = currentObj.id;
      }

      this.addParentName = currentObj.treeParams.name;
      this.$set(this.selectedMenuInfo, 'parentName', currentObj.treeParams.name);
      this.addMenuName = currentObj.title;
      this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.index, this.pageSize);
    },
    openAddUserModal () {
      if (this.menuInfoId == '') {
        this.$Message.error('请先点击菜单树再进行新增操作');
        this.showEditModal = false;
        return;
      }

      if (this.processNode.treeParams.menuType == 'func') {
        this.$Message.error('按钮下无法添加菜单及按钮');
        this.showEditModal = false;
        return;
      }
      this.showEditModal = true;
      this.selectedMenuInfo = {};
      this.isAddFunction = true;
      this.selectedMenuInfo.appCode = this.appCode;
      this.selectedMenuInfo.parentName = this.addParentName;
    },
    addMenu () {
      this.openAddUserModal();
      this.isMenu = true;
      this.selectedMenuInfo.menuType = 'menu';
    },
    addButton () {
      this.openAddUserModal();
      this.isMenu = false;
      this.selectedMenuInfo.menuType = 'func';
    },
    showMenuInfo (item, isEditModal) {
      this.isMenu = item.menuType == 'menu';
      if (Number.isInteger(isEditModal)) {
        this.showInfoModal = true;
      } else {
        this.showEditModal = true;
        this.isAddFunction = false;
      }
      this.selectedMenuInfo = JSON.parse(JSON.stringify(item));
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isAddFunction) {
            this.selectedMenuInfo.parentId = this.addMenuInfoId;
            this.selectedMenuInfo = Object.assign({}, this.selectedMenuInfo, { menuInfoId: this.menuInfoId });
            addMenuInfo(this.selectedMenuInfo).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('新增成功!');
              }
              this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
            });
          } else {
            updateMenuInfo(this.selectedMenuInfo).then(res => {
              if (res.data.state.code == 200) {
                this.$Message.success('修改成功!');
              }
              this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
            });
          }
          this.showEditModal = false;
        } else {
          this.$Message.error('校验失败!无法进行操作');
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    cancelSubmit (name) {
      this.$refs[name].resetFields();
      this.showEditModal = false;
      this.showFileModel = false;
    },
    getSelectedRows (selectedRows) {
      this.selectedIds = [];
      selectedRows.forEach(item => {
        this.selectedIds.push(item.id);
      });
    },
    importXml () {
      if (this.uploadFile == '') {
        this.$Message.error('请选择文件');
      } else {
        if (!this.fileTip) {
          const formData = new window.FormData();
          formData.append('file', this.uploadFile);
          formData.append('appCode', this.addAppCode);
          importMenuByXml(formData).then(res => {
            if (res.data.state.code == 200) {
              this.$Message.success('操作成功');
            }
          });
        } else {
          this.$Message.error('请选择正确的文件格式');
        }
      }
    },
    handleUpload (file) {
      let reg = file.name.substr(file.name.lastIndexOf('.')).toLocaleLowerCase();
      if (reg !== '.xml') {
        this.fileTip = true;
      } else {
        this.fileTip = false;
        this.uploadFile = file;
      }
    },
    showFile () {
      this.$refs.menuFileUpload.clearFiles();
      this.uploadFile = {};
      this.fileTip = false;
      this.showFileModel = true;
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
    updateConfirmModel (el) {
      this.confirmModel = el;
      this.$refs.table.selectAll();
    },
    confirmValue () {
      this.deleteRows();
    },
    deleteRows () {
      deleteMenuInfos(this.selectedIds.toString()).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('操作成功');
          this.getMenuInfoListWithParm(this.menuInfoId, this.menuName, this.appCode, this.pageIndex, this.pageSize);
        }
      });
      this.$refs.table.selectAll();
      this.confirmModel = false;
    }
  }
};
</script>

<style>
  .objInfoModal > div .ivu-tooltip-rel {
    margin-bottom: 14px;
    overflow: initial;
  }
</style>
