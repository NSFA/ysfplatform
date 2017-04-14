const getters = {
  wsListFilter: state => {
    if (!state.filter) {
      return state.wsList.slice(state.wsList.length-50,-1).reverse();
    }
    return state.wsList.filter(it => it.method.toLowerCase() === state.filter
    || it.host.includes(state.filter)
    || it.path.includes(state.filter)
    || it.id == state.filter).reverse()
  }
};

export default getters;
