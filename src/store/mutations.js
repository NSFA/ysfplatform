const mutations = {
  SET_ACTIVE_TAB(state, tab){
    state.activeTab = tab;
  },
  SET_DATA_ACTIVE_TAB(state, tab){
    state.hubActiveTab = tab;
  },
  SET_PROXY_STATE(state, proxy){
    state.proxy_switch = proxy;
  },
  SET_INIT_INFO(state, info){
    _.extend(state, info);
  }
};

export default mutations;
