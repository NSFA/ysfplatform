const getters = {
  wsListFilter: state => {
    //仅展示50条消息
    if (!state.filter) {
      return state.wsList.slice(-50).reverse();
    }

    const filterList = state.wsList.filter(it => it.method === state.filter
    || it.protocol.toLowerCase() === state.filter
    || it.host.indexOf(state.filter) > -1
    || it.path.indexOf(state.filter) > -1
    || it.statusCode == state.filter
    || it.id == state.filter);

    state.filterSet.total = filterList.length;
    //筛选
    const start = (state.filterSet.currentPage - 1) * state.filterSet.pageSize;
    const end = state.filterSet.currentPage * state.filterSet.pageSize;
    return filterList.slice(start, end)
  }
};

export default getters;
