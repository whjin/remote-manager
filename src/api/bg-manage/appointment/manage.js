import axios from "@/libs/api.request";

export const searchByParams = (params) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/queryAppointmentInfo",
    data: params,
    method: "post",
  });
};
export const searchQueryByParams = (params) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/queryInfo",
    data: params,
    method: "post",
  });
};
export const queryVideoInfo = (params) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/queryVideoInfo",
    data: params,
    method: "post",
  });
};

export const download = (url) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/download/",
    params: { url: url },
    method: "get",
    responseType: "arraybuffer",
  });
};

export const searchBoxDataUrl = (
  model,
  value,
  typeCode = "",
  pageParam = ""
) => {
  return axios.request({
    url: "/inquiry/inquiryCaseManagement/queryCaseNoList",
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

export const queryInfoByNo = (caseNo) => {
  return axios.request({
    url: "/inquiry/inquiryCaseManagement/queryInfoByNo",
    params: {
      caseNo: caseNo,
    },
    method: "post",
  });
};

export const queryPersonListByNo = (params) => {
  return axios.request({
    url: "/inquiry/inquiryCasePersonnel/queryPersonListByNo",
    data: params,
    method: "post",
  });
};

export const saveAppointmentData = (data) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/addAppointment",
    data: data,
    method: "post",
  });
};

export const saveAuditAppointmentData = (params) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/addAuditAppointment",
    data: params,
    method: "post",
  });
};

export const initLocalRoomList = () => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/initLocalRoomList",
    method: "post",
  });
};

export const initDisableLocalRoomList = (type, datestr) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/initDisableLocalRoomList",
    params: {
      roomType: type,
      appointmentDate: datestr,
    },
    method: "post",
  });
};

export const initRemoteRoomList = (time, datestr, unitCode) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/initRemoteRoomList",
    params: {
      timeQuantum: time,
      appointmentDate: datestr,
      unitCode: unitCode,
    },
    method: "post",
  });
};

export const ifAudited = (id) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/ifAudited",
    params: {
      id: id,
    },
    method: "post",
  });
};

export const burnVideoById = (id) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/burnVideoById",
    params: {
      id: id,
    },
    method: "post",
  });
};

export const overdueCancel = (id) => {
  return axios.request({
    url: "/inquiry/inquiryManagement/overdueCancel",
    params: {
      id: id,
    },
    method: "post",
  });
};

export const getSelectPlace = () => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/initUnitList",
    method: "post",
  });
};

// 获取通用模板
export const searchDefaultTemp = (params) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/searchDefaultTempName",
    data: params,
    method: "post",
  });
};

// 新增|修改通用模板
export const uploadDefaultTemplate = (formData) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/uploadDefaultTemplate",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "post",
  });
};

// 删除通用模板
export const deleteDefaultTemplate = (roomId) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/deleteDefaultTemplate",
    data: { fileId: roomId },
    method: "post",
  });
};

// 通用模板排序
export const orderDefaultTemp = (action, tempId) => {
  return axios.request({
    url: "/inquiry/inquiryRoomInfo/orderDefaultTemp",
    params: {
      action: action,
      tempId: tempId,
    },
    method: "post",
  });
};
