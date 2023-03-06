// 表格超出提示
export const tableTip = (h, params) => {
  if (params.row[params.column.key] == undefined || params.row[params.column.key] == '') {
    return h('div', params.row[params.column.key]);
  } else {
    return h('Tooltip', {
      props: {
        placement: 'top-start',
        transfer: true
      },
      style: {
        width: '100%'
      }
    }, [h('span', {
      style: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
        overflow: 'hidden',
        marginTop: '6px',
        display: 'inline-block'
      }
    }, params.row[params.column.key]),
    h('div', {
      slot: 'content',
      style: {
        whiteSpace: 'normal'
      }
    }, params.row[params.column.key])]);
  }
};
