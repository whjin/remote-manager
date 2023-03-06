// department api
import axios from '@/libs/api.request';

export const getOrganizeList = () => {
  return axios.request({
    url: '/sysmgr/sysOrganize/all',
    method: 'get'
  });
};

export const getOrganizeListWithParm = (id, organizeName, pageIndex, pageSize) => {
  return axios.request({
    url: '/sysmgr/sysOrganize/showList',
    data: {
      data: {
        EQ_sysOrganizeDO_parentId: id,
        LIKE_sysOrganizeDO_organizeName: organizeName,
        NE_sysOrganizeDO_id: id,
        NE_sysOrganizeDO_parentId: 0
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

export const getOrganizeDetail = (userId) => {
  return axios.request({
    url: '/sysmgr/sysOrganize/' + userId,
    method: 'get'
  });
};

export const addOrganize = (organize) => {
  return axios.request({
    url: '/sysmgr/sysOrganize/save',
    data: organize,
    method: 'post'
  });
};

export const updateOrganize = (organize) => {
  return axios.request({
    url: '/sysmgr/sysOrganize/update',
    data: organize,
    method: 'post'
  });
};

export const deleteOrganizes = (organizeIds) => {
  return axios.request({
    url: '/sysmgr/sysOrganize/batchDelete',
    params: {
      ids: organizeIds
    },
    method: 'get'
  });
};
