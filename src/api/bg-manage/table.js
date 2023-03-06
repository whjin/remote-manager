import axios from '@/libs/api.request';

export const loadTableData = (tableName, expressions, pageParam) => {
  return axios.request({
    url: '/inquiry/table/loadData',
    data: {
      tableName: tableName,
      emptyPage: true,
      expressions: expressions,
      pageParam: Object.assign({
        pageIndex: 1,
        pageSize: 10,
        order: '',
        sortType: 'ASC'
      }, pageParam)
    },
    method: 'post'
  });
};
