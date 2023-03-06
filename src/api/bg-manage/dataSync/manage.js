import axios from '@/libs/api.request';

export const getDataListByParams = (params) => {
  return axios.request({
    url: '/dataSync/dataSubscribe/querySubscribeData',
    data: params,
    method: 'post'
  });
};

export const subscribeData = (params) => {
  return axios.request({
    url: '/dataSync/dataSubscribe/subscribeByType',
    data: { dataItems: params },
    method: 'post'
  });
};

export const unsubscribeData = (params) => {
  return axios.request({
    url: '/dataSync/dataSubscribe/unsubscribeByType',
    data: params,
    method: 'post'
  });
};
