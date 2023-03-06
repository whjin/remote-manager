import axios from "@/libs/api.request";

export const searchByCon = (params) => {
  return axios.request({
    url: "/sysmgr/meetInformation/findByCon",
    data: params,
    method: "post",
  });
};
export const getAuditDetailById = (id) => {
  return axios.request({
    url: "/sysmgr/meetInformation/getMeetDetailById",
    params: {
      id: id,
    },
    method: "get",
  });
};
export const getCurUserInfo = () => {
  return axios.request({
    url: "/sysmgr/sysUser/info",
    method: "post",
  });
};

export const listRoomByType = (type) => {
  return axios.request({
    url: "/sysmgr/meetRoomInfo/listByType",
    params: {
      type: type,
    },
    method: "get",
  });
};

export const submitAuditModel = (params) => {
  return axios.request({
    url: "/sysmgr/meetInformation/approval",
    data: params,
    method: "post",
  });
};

export const uploadImage = (formData) => {
  return axios.request({
    url: "/sysmgr/meetInformation/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "post",
  });
};

// 提讯室管理，查询提讯室信息
export const searchRoomInfo = (params) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/searchRoomInfo",
    data: params,
    method: "post",
  });
};

// 新增提讯室，查询关联房间
export const searchRemoteRoom = () => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/searchRemoteRoom",
    method: "post",
  });
};

// 查询所属组织信息
export const findOrganizeByType = (type) => {
  return axios.request({
    url: "/sysmgr/sysOrganize/findByType?type=" + type,
    method: "get",
  });
};

// 提讯室管理，新增|修改房间
export const save = (data) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/save",
    data: data,
    method: "post",
  });
};

// 提讯室管理，删除房间
export const roomDelete = (id) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/delete/" + id,
    method: "post",
  });
};

export const searchRybhName = (model, value, typeCode = "", pageParam = "") => {
  return axios.request({
    url: "/sysmgr/meetInformation/searchRybhName",
    data: {
      data: {
        model,
        typeCode,
        value,
      },
      pageParam,
    },
    method: "post",
  });
};

export const searchBoxDataUrl = (
  model,
  value,
  typeCode = "",
  pageParam = ""
) => {
  return axios.request({
    url: "/sysmgr/sysDictionaryField/selectionBoxData",
    data: {
      data: {
        model,
        typeCode,
        value,
      },
      pageParam,
    },
    method: "post",
  });
};
export const getByTypeCodeAndFieldValue = (typeCode, fieldValue) => {
  return axios.request({
    url: "/sysmgr/sysDictionaryField/getByTypeCodeAndFieldValue",
    params: {
      typeCode: typeCode,
      fieldValue: fieldValue,
    },
    method: "get",
  });
};
export const getRoomStatus = (typeCode, fieldValue) => {
  return axios.request({
    url: "/sysmgr/meetRoomInfo/getRoomUsedStatus",
    method: "get",
  });
};

export const validateLawyerRule = (params) => {
  return axios.request({
    url: "/sysmgr/meetInformation/validateLawyerRule",
    data: params,
    method: "post",
  });
};

export const getPopulationBankInfo = (idCard) => {
  return axios.request({
    url: "/sysmgr/meetInformation/getPopulationBankInfo",
    data: { idCard: idCard },
    method: "post",
  });
};

export const getFugitiveInfo = (idCard) => {
  return axios.request({
    url: "/sysmgr/meetInformation/getFugitiveInfo",
    data: { idCard: idCard },
    method: "post",
  });
};

export const getLawyerInfo = (rybh, config) => {
  return axios.request({
    url: "/sysmgr/meetInformation/queryLawyerInfo",
    data: {
      config: config,
      rybh: rybh,
    },
    method: "post",
  });
};
