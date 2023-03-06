import axios from '@/libs/api.request';

export const getRoleWithParam = (pageIndex, pageSize, roleName, type) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/search',
    data: {
      data: {
        LIKE_roleName: roleName,
        EQ_type: type
      },
      pageParam: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    },
    method: 'post'
  });
};

export const addNewRole = (roleObj) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/save',
    data: roleObj,
    method: 'post'
  });
};

export const updateRole = (role) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/update',
    data: role,
    method: 'post'
  });
};

export const getRoleDetail = (roleId) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/' + roleId,
    method: 'get'
  });
};

export const deleteRole = (roleId) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/delete/',
    params: {
      id: roleId
    },
    method: 'get'
  });
};

export const getTreeByRoleId = (roleId) => {
  return axios.request({
    url: '/sysmgr/sysMenuInfo/getTreeByRoleId/',
    params: {
      id: roleId
    },
    method: 'get'
  });
};

export const updateMenuRoleConf = (roleId, menuItems) => {
  return axios.request({
    url: '/sysmgr/sysFuncRoleConf/renew',
    data: {
      roleId,
      menuItems
    },
    method: 'post'
  });
};

export const deleteRoles = (roleIds) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/batchDelete',
    params: {
      ids: roleIds
    },
    method: 'get'
  });
};

export const searchBoxDataUrl = (model, value, typeCode = '', pageParam = '') => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/selectionBoxData',
    data: {
      data: {
        model,
        typeCode,
        value
      },
      pageParam
    },
    method: 'post'
  });
};
