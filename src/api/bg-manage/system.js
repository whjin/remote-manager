import axios from '@/libs/api.request';

export const getSystemListWithParm = (organizeId, pageIndex, pageSize, appName) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/search',
    data: {
      data: {
        EQ_organizeId: organizeId,
        LIKE_appName: appName
      },
      emptyPage: true,
      pageParam: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    },
    method: 'post'
  });
};

export const addNewSystem = (systemObj) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/save',
    data: systemObj,
    method: 'post'
  });
};

export const deleteSystem = (systemIds) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/batchDelete',
    params: {
      ids: systemIds
    },
    method: 'get'
  });
};

export const getSystemDetail = (systemId) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/' + systemId,
    method: 'get'
  });
};

export const updateSystem = (system) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/update',
    data: system,
    method: 'post'
  });
};
