import axios from '@/libs/api.request';

export const getTreeData = () => {
  return axios.request({
    url: '/sysmgr/sysDictionaryType/findAllToTree',
    method: 'get'
  });
};

export const searchDataDictionaryListWithParm = (params, pageIndex, pageSize) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/findAllDictionaryField',
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

export const saveDictionaryField = (dictionaryFieldObj, typeName, typeId) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/save/' + typeName + '/' + typeId,
    data: dictionaryFieldObj,
    method: 'post'
  });
};

export const updateDictionaryField = (dictionaryFieldObj, typeName, typeId) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/update/' + typeName + '/' + typeId,
    data: dictionaryFieldObj,
    method: 'post'
  });
};

export const getDataDictionaryDetail = (id) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/findAllDictionaryField',
    data: {
      data: {
        EQ_sysDictionaryFieldDO_id: id
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

export const deleteDataDictionarys = (dataDictionaryIds) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryField/batchDelete',
    params: {
      ids: dataDictionaryIds
    },
    method: 'get'
  });
};

export const getDictionaryTypeDetail = (id) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryType/findSingleDictionaryTypeById',
    data: {
      data: {
        id: id
      }
    },
    method: 'post'
  });
};

export const saveDictionaryType = (dictionaryTypeObj, appName) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryType/save/' + appName,
    data: dictionaryTypeObj,
    method: 'post'
  });
};

export const updateDictionaryType = (dictionaryTypeObj, appName) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryType/update/' + appName,
    data: dictionaryTypeObj,
    method: 'post'
  });
};

export const getAppInfoDetail = (appId) => {
  return axios.request({
    url: '/sysmgr/sysAppInfo/' + appId,
    method: 'get'
  });
};

export const deleteDictionaryTypeById = (dictionaryTypeId) => {
  return axios.request({
    url: '/sysmgr/sysDictionaryType/batchDelete/',
    params: {
      ids: dictionaryTypeId
    },
    method: 'get'
  });
};
