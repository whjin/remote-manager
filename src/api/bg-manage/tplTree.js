import axios from '@/libs/api.request';

export const loadTreeData = (node, callback, url) => {
  axios.request({
    url: url ? '/' + url + '/tree/loadData' : '/inquiry/tree/loadData',
    data: node,
    method: 'post'
  }).then(res => {
    if (res && res.data.state.code == '200') {
      const children = res.data.data;
      if (children.length) {
        node.children = children;

        if (callback) callback(node.children);
      }
    }
  });
};

export const filterNode = (node, url) => {
  return axios.request({
    url: url ? '/' + url + '/tree/loadData' : '/inquiry/tree/loadData',
    data: node,
    method: 'post'
  });
};
