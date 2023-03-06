import axios from '@/libs/api.request';

export const getArtemisConfig = () => {
  return axios.request({
    url: '/interface/parameter/getArtemisConfig',
    method: 'get'
  });
};

// 获取监控点预览取流URL
export const getPreviewURLs = (params) => {
  return axios.request({
    url: '/interface/preview/getPreviewURLs',
    data: {
      data: {
        cameraIndexCode: params.cameraIndexCode,
        protocol: params.protocol
      }
    },
    method: 'post'
  });
};

// 获取监控点回放取流URL
export const getPlaybackURLs = (params) => {
  return axios.request({
    url: '/interface/playback/getPlaybackURLs',
    data: {
      data: {
        cameraIndexCode: params.cameraIndexCode,
        protocol: params.protocol,
        beginTime: params.beginTime,
        endTime: params.endTime
      }
    },
    method: 'post'
  });
};
