import axios from '@/libs/api.request';

export const searchPersonByCon = (params) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/findPersonByCon',
    data: params,
    method: 'post'
  });
};
export const searchByCon = (params) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/findByCon',
    data: params,
    method: 'post'
  });
};
export const saveCase = (params) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/saveCase',
    data: params,
    method: 'post'
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
export const savePerson = (params) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/savePerson',
    data: params,
    method: 'post'
  });
};
export const findPersonByCaseNo = (caseNo) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/findPersonByCaseNo',
    params: { caseNo: caseNo },
    method: 'get'
  });
};
export const batchDelete = (id) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/delete?id=' + id,
    method: 'post'
  });
};
export const findShareListById = (id) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/findShareListById',
    params: {
      id: id
    },
    method: 'get'
  });
};
export const saveShareList = (id, shareList) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/saveShareList',
    data: {
      id: id,
      shareList: shareList
    },
    method: 'post'
  });
};
export const getOrganizeList = () => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/getOrganizeList',
    method: 'get'
  });
};
export const findByOne = (id) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/' + id,
    method: 'get'
  });
};
export const saveFile = (ids) => {
  return axios.request({
    url: '/inquiry/inquiryCaseManagement/saveFile',
    data: {
      ids: ids
    },
    method: 'post'
  });
};
