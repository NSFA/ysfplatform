const mutations = {
  SET_ACTIVE_TAB(state, tab){
    state.activeTab = tab;
  },
  SET_DATA_ACTIVE_TAB(state, tab){
    state.hubActiveTab = tab;
  },
  SET_PROXY_STATE(state, proxy){
    state.proxy_switch = proxy;
  }
};

export default mutations;
