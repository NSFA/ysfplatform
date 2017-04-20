const getters = {
  wsListFilter: state => {
    //仅展示50条消息
    if (!state.filter) {
      return state.wsList.slice(-50).reverse();
    }

    const filterList = state.wsList.filter(it => it.method.toLowerCase() === state.filter
    || it.protocol.toLowerCase() === state.filter
    || it.host.includes(state.filter)
    || it.path.includes(state.filter)
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
