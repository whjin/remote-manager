// configure api
import axios from '@/libs/api.request';

export const getTreeData = () => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/findAllToTree',
    method: 'get'
  });
};

export const getMenuInfoListWithParm = (id, menuName, appCode, pageIndex, pageSize) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/showList',
    data: {
      data: {
        EQ_sysMenuInfoDO_parentId: id,
        LIKE_sysMenuInfoDO_menuName: menuName,
        EQ_sysMenuInfoDO_appCode: appCode
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

export const addMenuInfo = (menuInfo) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/save',
    data: menuInfo,
    method: 'post'
  });
};

export const updateMenuInfo = (menuInfo) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/update',
    data: menuInfo,
    method: 'post'
  });
};

export const deleteMenuInfos = (userIds) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/batchDelete',
    params: {
      ids: userIds
    },
    method: 'get'
  });
};

export const getMenuInfoDetail = (userId) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/' + userId,
    method: 'get'
  });
};

export const importMenuByXml = (formData) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/importMenuByXml',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post'
  });
};
