<template>
  <div style="width: 100%;height: 100%;padding:5vw 1.11vw;">
    <choose-sys-box v-for="(item,idx) in navigationList" :title="item.title" :imgName="item.imgName" :key="idx" :path="item.path" />
  </div>
</template>

<script>
import ChooseSysBox from '_c/chooseBox/chooseSysBox';
import config from '@/config';
import { getModuleApi } from '@/api/login';

export default {
  name: 'choosePlatform',
  components: {
    ChooseSysBox,
    config
  },
  mounted () {
    getModuleApi().then(res => {
      const moduleList = res.data.data;
      // 通过模块的中文名进行push
      moduleList.forEach(item => {
        switch (item) {
          case '所情态势':
            this.navigationList.push({ title: '所情态势', imgName: 'situation', path: '/situationNew' });
            break;
          case '所情统计':
            this.navigationList.push({ title: '统计记录', imgName: 'situation', path: '/situation' });
            break;
          case '指挥调度':
            this.navigationList.push({ title: '指挥调度', imgName: 'controlCommand', path: '' });
            break;
          case '岗位模式':
            this.navigationList.push({ title: '岗位模式', imgName: 'position', path: '/position' });
            break;
          case '视频应用':
            this.navigationList.push({ title: '视频应用', imgName: 'video', path: '/video' });
            break;
          case '绩效考核':
            this.navigationList.push({ title: '绩效考核', imgName: 'kpi', path: '/kpi' });
            break;
          case '风险管理':
            this.navigationList.push({ title: '风险管理', imgName: 'risk', path: '/risk' });
            break;
          case '电子地图':
            this.navigationList.push({ title: '电子地图', imgName: 'elecMap', path: config.uwbElecMapBaseURL });
            break;
          case '智能运维':
            this.navigationList.push({ title: '智能运维', imgName: 'elecMap', path: '/devOps' });
            break;
          case '消费管理':
            this.navigationList.push({ title: '消费管理', imgName: 'shop', path: '/shop' });
            break;
          case '警情管理':
            this.navigationList.push({ title: '警情管理', imgName: 'police', path: '/police' });
            break;
          case '用户管理':
            this.navigationList.push({ title: '用户管理', imgName: 'background', path: config.monitoringBaseURL });
            break;
          case '系统管理':
            this.navigationList.push({ title: '系统管理', imgName: 'system', path: '/system' });
            break;
          case '伙房管理':
            this.navigationList.push({ title: '伙房管理', imgName: 'kitchen', path: '/food' });
            break;
        }
      });
    });
  },
  data () {
    return {
      navigationList: []
    };
  },
  methods: {}
};
</script>

<style scoped>

</style>
