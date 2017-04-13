const getters = {
  wsListFilter: state => {
    if (!state.filter) {
      return state.wsList;
    }
    return state.wsList.filter(it => it.method.toLowerCase() === state.filter
    || it.host.includes(state.filter)
    || it.path.includes(state.filter)
    || it.id === state.filter)
  }
};

export default getters;
