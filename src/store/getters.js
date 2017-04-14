const getters = {
  wsListFilter: state => {
    if (!state.filter) {
      return state.wsList.slice(state.wsList.length - 50);
    }
    return state.wsList.filter(it => it.method.toLowerCase() === state.filter
    || it.protocol.toLowerCase() === state.filter
    || it.host.includes(state.filter)
    || it.path.includes(state.filter)
    || it.statusCode == state.filter
    || it.id == state.filter)
  }
};

export default getters;
