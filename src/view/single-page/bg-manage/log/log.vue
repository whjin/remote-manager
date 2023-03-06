<template>
  <div>
    <div class="title">操作日志</div>
    <i-row>
      <i-col class="tableCol">
        <span class="searchItemText">模块</span>
        <i-select class="selectionIcon" v-model="searchCon.data.logModule">
          <i-option v-for="(item, index) in logModuleList" :value="item.id" :key="index">{{ item.name }}</i-option>
        </i-select>
        <span class="searchItemText" v-if="searchCon.data.logType == 'OPERATION'">操作人</span>
        <input v-if="searchCon.data.logType == 'OPERATION'" v-model="searchCon.data.logUser" class="searchItemInput" type="text">
        <span class="searchItemText">操作内容</span>
        <input v-model="searchCon.data.logContent" class="searchItemInput" type="text">
        <div style="height: 10px;"></div>
        <span class="searchItemText">时间</span>
        <i-date-picker type="datetime" @on-change="setLogDateStart" format="yyyy-MM-dd HH:mm:ss" v-model="logDateStart" placeholder="请输入日期">
        </i-date-picker>
        <span class="searchItemText">至</span>
        <i-date-picker type="datetime" v-model="logDateEnd" @on-change="setLogDateEnd" format="yyyy-MM-dd HH:mm:ss" placeholder="请输入日期">
        </i-date-picker>
        <i-button type="primary" style="display: inline-block;margin-left:20px;" @click="searchByCon">查询</i-button>
        <div style="height: 10px;"></div>
        <i-table border ref="table" :columns="columns" :data="logList" style="height:520px;">
        </i-table>
        <div class="tablePage">
          <i-page style="text-align: right" show-total show-elevator show-sizer :current="searchCon.pageParam.pageIndex" :total="total" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changePageIndex" @on-page-size-change="changePageSize">
          </i-page>
        </div>
      </i-col>
    </i-row>
  </div>
</template>

<script>
import {
  findLogByCon
} from '@/api/bg-manage/log';
import Border from '_c/border/borderWithTitle.vue';
import PermissionButton from '_c/permission-button';
import { tableTip } from '@/libs/tableTip';

export default {
  name: 'log',
  components: {
    Border,
    PermissionButton,
    tableTip
  },
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '操作人',
          key: 'user'
        },
        {
          title: 'IP地址',
          key: 'ip'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '内容',
          key: 'content',
          render: tableTip
        }
      ],
      logList: [],
      logDateStart: '',
      logDateEnd: '',
      logTypeList: [
        {
          name: '操作日志',
          id: 'OPERATION'
        },
        {
          name: '运行日志',
          id: 'RUNTIME'
        }
      ],
      logModuleList: [
        {
          name: '远程提讯',
          id: 'remote_inquiry'
        }],
      logLevelList: [
        {
          name: 'ERROR',
          id: 'ERROR'
        },
        {
          name: 'INFO',
          id: 'INFO'
        }
      ],
      total: 0,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20],
      searchCon: {
        needPage: true,
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        data: {
          logType: 'OPERATION',
          logModule: 'remote_inquiry',
          logContent: '',
          logDateStart: '',
          logSateEnd: '',
          logUser: ''
        }
      }
    };
  },
  mounted () {
    this.searchByCon();
  },
  methods: {
    searchByPage () {
      if (this.searchCon.pageParam.pageSize * this.searchCon.pageParam.pageIndex > 10000) {
        this.$Message.error('最多查询前10000条数据,请缩小查询范围');
        return;
      }
      findLogByCon(this.searchCon).then(res => {
        this.logList = res.data.data;
        this.total = res.data.page.total;
      });
    },
    searchByCon () {
      if (this.searchCon.pageParam.pageSize * this.searchCon.pageParam.pageIndex > 10000) {
        this.$Message.error('最多查询前10000条数据,请缩小查询范围');
        return;
      }
      this.searchCon.pageParam.pageIndex = 1;
      findLogByCon(this.searchCon).then(res => {
        this.logList = res.data.data;
        this.total = res.data.page.total;
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
    setLogDateStart (date) {
      this.searchCon.data.logDateStart = date;
    },
    setLogDateEnd (date) {
      this.searchCon.data.logDateEnd = date;
    }
  }

};
</script>