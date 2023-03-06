<template>
  <i-content class="main-content-con">
    <div class="tableFunction" style="margin-bottom:10px">
      <i-button type="primary" style="display: inline-block;" @click="batchSubscribeData('')">批量订阅</i-button>
    </div>
    <i-table border
             :columns="columns"
             :data="dataList"
             style="height:calc(100% - 450px)"
             @on-selection-change="getSelectedRows">
    >
    </i-table>
    <div class="tablePage">
      <i-page style="text-align: right"
              show-total
              show-elevator
              show-sizer
              :total="dataListLength"
              :page-size="searchCon.pageParam.pageSize"
              :page-size-opts="pageSizeOpts"
              @on-change="changePageIndex"
              @on-page-size-change="changePageSize">
      </i-page>
    </div>
  </i-content>
</template>
<script>
import { getDataListByParams, subscribeData, unsubscribeData } from '@/api/bg-manage/dataSync/manage';
import NormalButton from '_c/normal-button';
export default {
  name: 'dataSync',
  components: {
    NormalButton
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '订阅数据类型',
          key: 'type'
        },
        {
          title: '数据项编码',
          key: 'dataItem'
        },
        {
          title: '目的表',
          key: 'destinationTable'
        },
        {
          title: '订阅状态',
          key: 'statusCn'
        },
        {
          title: '状态变更时间',
          key: 'statusChangeTime'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h(NormalButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '订阅',
                  disabled: params.row.status == '1'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.subscribeData(params.row.dataItem);
                  }
                }
              }), h(NormalButton, {
                props: {
                  type: 'primary',
                  size: 'small',
                  label: '取消订阅',
                  disabled: params.row.status !== '1'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.unsubscribeData(params.row.dataItem);
                  }
                }
              })
            ]);
          }
        }
      ],
      dataRows: '',
      dataList: [],
      dataListLength: 0,
      searchCon: {
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        }
      },
      pageSizeOpts: [10, 15, 20]
    };
  },
  computed: {
  },
  methods: {
    getDataList () {
      this.getDataListByParams(this.searchCon);
    },
    getDataListByParams (params) {
      getDataListByParams(params).then(res => {
        this.dataList = res.data.data;
        this.dataListLength = res.data.page.total;
      });
    },
    changePageIndex (index) {
      this.searchCon.pageParam.pageIndex = index;
      this.getAuditingList(this.searchCon);
    },
    changePageSize (size) {
      this.searchCon.pageParam.pageSize = size;
      this.getAuditingList(this.searchCon);
    },
    getSelectedRows (selectedRows) {
      this.dataRows = '';
      selectedRows.forEach(item => {
        this.dataRows += item.dataItem + ',';
      });
      this.dataRows = this.dataRows.substring(0, this.dataRows.length - 1);
    },
    batchSubscribeData () {
      if (this.dataRows.length == 0) {
        this.$Message.error({
          content: '未选中任何数据,无法进行操作!',
          duration: 10,
          closable: true
        });
      } else {
        subscribeData(this.dataRows).then(res => {
          if (res.data.state.code == 200) {
            this.$Message.success('批量订阅成功!');
            this.getDataList();
          }
        });
      }
    },
    subscribeData (type) {
      subscribeData(type).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('订阅成功!');
          this.getDataList();
        }
      });
    },
    unsubscribeData (type) {
      unsubscribeData(type).then(res => {
        if (res.data.state.code == 200) {
          this.$Message.success('取消订阅成功!');
          this.getDataList();
        }
      });
    }
  },
  watch: {
  },
  mounted () {
    this.getDataList();
  }
};
</script>
<style lang="less" scoped>
  .ivu-message{
    z-index:999999999!important;
  }
  .menuInfoBox{
    width:14.5%;
    height:130px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(52, 108, 234, 0.27);
    margin: 0 1% 4px 1%;
    float:left;
    .infoBox{
      width:95%;
      height:118px;
      background:rgba(227,234,254,1);
      border-radius:4px;
      margin: 6px 9px;
      overflow: auto;
      font: 14px Microsoft YaHei;
      color:rgba(85,85,85,1);
      .areaName{
        display: block;
        height: 16px;
        width: 100px;
        margin: 5px auto;
        font-weight:bold;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .menuInfo{
        display: block;
        width: 100px;
        margin: 0 auto;
        line-height:35px;
        text-align: center;
      }
      .roomInfoBox{
        width:50%;
        float: left;
      }
    }
  }
  .ivu-tabs-content-animated{
    height: 100%;
  }
</style>
