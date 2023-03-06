import axios from '@/libs/api.request';

export const getTreeData = () => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/findAllToTree',
    method: 'get'
  });
};

export const getUserGroupListWithParm = (params, pageIndex, pageSize) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/findAllUserGroup',
    data: {
      data: params,
      emptyPage: true,
      pageParam: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    },
    method: 'post'
  });
};

export const addNewUserGroup = (userGroupObj) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/save',
    data: userGroupObj,
    method: 'post'
  });
};

export const updateUserGroup = (userGroupObj) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/update',
    data: userGroupObj,
    method: 'post'
  });
};

export const getUserGroupDetail = (id) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/findAllUserGroup',
    data: {
      data: {
        EQ_sysUserGroupDO_id: id
      },
      emptyPage: true,
      pageParam: {
        pageIndex: 1,
        pageSize: 1
      }
    },
    method: 'post'
  });
};

export const deleteUserGroups = (userGroupsIds) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/batchDelete',
    params: {
      ids: userGroupsIds
    },
    method: 'get'
  });
};
