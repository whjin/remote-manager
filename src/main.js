import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import config from '@/config';
import './index.less';
import '@/assets/icons/iconfont.css';
import TreeTable from 'tree-table-vue';
import VOrgTree from 'v-org-tree';
import 'default-passive-events';
import 'v-org-tree/dist/v-org-tree.css';
import '@/components/common/common.less';
import '@/components/common/normalComDialog.less';
import TplTree from '@/components/tpl-tree';
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView)
Vue.use(TreeTable)
Vue.use(VOrgTree)

// 生产环境关闭控制台提示
Vue.config.productionTip = false

// 全局注册应用配置
Vue.prototype.$config = config

// 自定义指令 v-has
// 避免v-if会随着应用的运行会频繁触发更新
Vue.directive('has', {
  bind: function(el, binding) {
    if (el.parentNode && !binding.value) el.parentNode.removeChild(el);
  }
})

const components = [
  TplTree
]

//自定义组件注册到全局
components.forEach(component => {
  Vue.component(component.name, component)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
