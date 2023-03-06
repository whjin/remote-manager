import axios from '@/libs/api.request';

export const getAuditDataByParams = (params) => {
  return axios.request({
    url: '/sysmgr/odsYyLshj/getYyLshjInfo',
    data: params,
    method: 'post'
  });
};

export const getRoomCountByParams = (params) => {
  return axios.request({
    url: '/sysmgr/odsYyLshj/getYyRoomInfo',
    data: params,
    method: 'post'
  });
};

export const submitAuditResult = (params) => {
  return axios.request({
    url: '/sysmgr/odsYyLshj/submitAuditResult',
    data: params,
    method: 'post'
  });
};
