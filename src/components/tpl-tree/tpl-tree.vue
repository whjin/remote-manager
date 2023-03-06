<template>
  <div class="treeBox" style="margin-top: 6px;height: 92%;width: 100%;">
    <Input v-model="inputVal" v-if="hasQuery" :placeholder="queryTip" search enter-button @on-search="search" />
    <Tree
      v-bind="$attrs"
      v-on="$listeners"
      :data="treeData"
      :load-data="loadData"
      ref="tree"
    />
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { loadTreeData, filterNode } from '@/api/bg-manage/tplTree';
export default {
  name: 'TplTree',
  props: {
    tplName: {
      type: String,
      default: undefined
    },
    serviceName: {
      type: String,
      default: ''
    },
    queryParams: {
      type: Object,
      default () {
        return {};
      }
    },
    /* 需要查询参数的时候，自己实现树逻辑，此时只能是同步树 */
    hasQuery: {
      type: Boolean,
      default: false
    },
    queryTip: {
      type: String,
      default: '请输入查询参数'
    },
    initData: {
      type: Boolean,
      default: true
    },
    platformUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputVal: '',
      treeData: [],
      nodeMap: {},
      spinShow: false
    };
  },
  created () {
    if (this.initData) {
      this.reloadTree();
    }
  },
  methods: {
    loadData (node, callback) {
      loadTreeData(node, children => {
        this.setNodeMap(children);
        callback(children);
      }, this.platformUrl);
    },
    getData () {
      return this.treeData;
    },
    reloadTree () {
      /* 可以外部调用此接口重新加载树 */
      /* queryParams有两种情况，第一种是异步加载的时候，此时的查询参数是可预测的(某级树上的查询)，走框架默认；另一种是无法预测的查询，这种情况需要自己实现service逻辑 */
      loadTreeData({
        treeName: this.tplName,
        serviceName: this.serviceName,
        queryParams: this.queryParams
      }, children => {
        this.setNodeMap(children);
        this.treeData = children;
      }, this.platformUrl);
    },
    reloadNode (nodeId) {
      /* 重新加载当前节点的孩子节点,只针对没有自定义查询框的时候有效，因为此时的查询相当于同步加载所有数据 */
      if (nodeId) {
        const node = this.getNode(nodeId);
        loadTreeData(node, children => {
          this.setNodeMap(children);
          if (node) {
            node.children = children;
          }
        }, this.platformUrl);
      } else {
        this.reloadTree();
      }
    },
    getArray (data) {
      data.render = (h, params) => {
        return h('span', [
          h('Tooltip', {
            props: {
              placement: 'top-start',
              transfer: true
            }
          }, [h('span', {
            on: {
              click: () => {}
            }
          }, params.data.title), h('div', { slot: 'content' }, params.data.title)])
        ]);
      };
    },
    setNodeMap (nodes) {
      /* 内部调用 */
      if (nodes && nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          this.nodeMap[node.id] = node;
          // this.getArray(this.nodeMap[node.id]);
        }
      }
    },
    getNode (id) {
      return this.nodeMap[id];
    },
    getSelectedNodes () {
      return this.$refs.tree.getSelectedNodes();
    },
    getCheckedNodes () {
      return this.$refs.tree.getCheckedNodes();
    },
    updateTreeDown (node, changes = {}) {
      this.$refs.tree.updateTreeDown(node, changes = {});
    },
    updateTreeUp (nodeKey) {
      this.$refs.tree.updateTreeUp(nodeKey);
    },
    handleSelect (nodeKey) {
      this.$refs.tree.handleSelect(nodeKey);
    },
    handleCheck ({ checked, nodeKey }) {
      this.$refs.tree.handleCheck({ checked, nodeKey });
    },
    getCheckedAndIndeterminateNodes () {
      return this.$refs.tree.getCheckedAndIndeterminateNodes();
    },
    search () {
      if (this.inputVal) {
        this.spinShow = true;
        filterNode({
          treeName: this.tplName,
          serviceName: this.serviceName,
          queryParams: Object.assign(this.queryParams, {
            'query': this.inputVal
          })
        }, this.platformUrl).then(res => {
          this.spinShow = false;
          if (res.data.state.code == 200) {
            this.treeData = res.data.data;
          }
        });
      } else {
        this.reloadTree();
      }
    }
  }
};

</script>

<!--<style lang="less">-->
<!--  /*树超出省略号*/-->
<!--.treeCol {-->
<!--  overflow-x: hidden;-->
<!--}-->
<!--.ivu-tree-children{-->
<!--  >li>span:nth-child(2){-->
<!--    display:inline-block;-->
<!--    width:calc(~"100% - 12px");-->
<!--    height:19px;-->
<!--    div{-->
<!--      width:100%;-->
<!--      height:19px;-->
<!--      >span{-->
<!--        display: inline-block;-->
<!--        width: 100%;-->
<!--        text-overflow: ellipsis;-->
<!--        overflow: hidden;-->
<!--        height:19px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
