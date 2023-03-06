import axios from '@/libs/api.request';

export const getAppointmentStatistics = () => {
  return axios.request({
    url: '/inquiry/inquiryManagement/getAppointmentStatistics',
    method: 'post'
  });
};

export const getAppointTrendData = (data) => {
  return axios.request({
    url: '/inquiry/inquiryManagement/getAppointmentTrendData',
    data: data,
    method: 'post'
  });
};

export const getRoomDetail = (data) => {
  return axios.request({
    url: '/inquiry/inquiryManagement/getRoomDetail',
    data: data,
    method: 'post'
  });
};
