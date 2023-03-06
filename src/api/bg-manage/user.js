import axios from '@/libs/api.request';

export const getTreeData = () => {
  return axios.request({
    url: '/sysmgr/sysOrganize/findAllToTree',
    method: 'get'
  });
};

/* export const getUserListWithParm = (organizeId, pageIndex, pageSize) => {
  return axios.request({
    url: 'sysUser/search',
    data: {
      data: {
        EQ_organizeId: organizeId
      },
      'emptyPage': true,
      'pageParam': {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    },
    method: 'post'
  });
}; */

export const getUserListWithParm = (organizeId, pageIndex, pageSize) => {
  return axios.request({
    url: '/sysmgr/sysUser/findByDynamic',
    data: {
      data: {
        EQ_organizeId: organizeId,
        LIKE_sysUserDO_userName: 't'
      },
      emptyPage: true,
      pageParam: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        order: 'id',
        sortType: 'DESC'
      },
      expressions: [
        {
          'alias': 'O',
          'name': 'PATH',
          'operator': 'LIKE',
          'type': 'STRING',
          'value': organizeId
        }
      ]
    },
    method: 'post'
  });
};

export const addNewUser = (userObj) => {
  return axios.request({
    url: '/sysmgr/sysUser/save',
    data: userObj,
    method: 'post'
  });
};

export const updateUser = (user) => {
  return axios.request({
    url: '/sysmgr/sysUser/update',
    data: user,
    method: 'post'
  });
};

export const deleteUsers = (userIds) => {
  return axios.request({
    url: '/sysmgr/sysUser/batchDelete',
    params: {
      ids: userIds
    },
    method: 'get'
  });
};

export const getUserDetail = (userId) => {
  return axios.request({
    url: '/sysmgr/sysUser/' + userId,
    method: 'get'
  });
};

export const getUserExistRole = (roleId) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/getRolesByUserId',
    params: {
      id: roleId
    },
    method: 'get'
  });
};

export const getUserUnExistRole = (roleId) => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/getUnRolesByUserId',
    params: {
      id: roleId
    },
    method: 'get'
  });
};

export const updateUserRoleById = (userId, delRoleStr, addRoleStr) => {
  return axios.request({
    url: '/sysmgr/sysUser/distributeRole',
    params: {
      id: userId,
      delRoleStr: delRoleStr,
      addRoleStr: addRoleStr
    },
    method: 'get'
  });
};

export const getPositionByUserToken = () => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/findAllToTree',
    method: 'get'
  });
};
export const getUserGroupDetail = (id) => {
  return axios.request({
    url: '/sysmgr/sysUserGroup/findSingleUserGroupById',
    data: {
      data: {
        id: id
      }
    },
    method: 'post'
  });
};

export const resetPassword = (userIds, accountName) => {
  return axios.request({
    url: '/sysmgr/sysUser/reset',
    params: {
      id: userIds,
      accountName: accountName
    },
    method: 'get'
  });
};

export const sysOrganizeAll = () => {
  return axios.request({
    url: '/sysmgr/sysOrganize/all',
    method: 'get'
  });
};

export const updatePassword = (user) => {
  return axios.request({
    url: '/sysmgr/sysUser/updatePassword',
    params: {
      id: user.id,
      newPassword: user.newPassword,
      oldPassword: user.oldPassword
    },
    method: 'get'
  });
};

export const getRoleData = () => {
  return axios.request({
    url: '/sysmgr/sysRoleInfo/search',
    data: {
      data: {
        EQ_type: 'POST'
      },
      'emptyPage': true,
      'pageParam': {
        pageIndex: 1,
        pageSize: 50
      }
    },
    method: 'post'
  });
};
