import axios from '@/libs/api.request';

export const getMeetVideoMessage = () => {
  return axios.request({
    url: '/sysmgr/meetVideoMessage/all',
    method: 'get'
  });
};