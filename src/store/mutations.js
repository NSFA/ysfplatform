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
  },
  SET_WS(state, info){
    state.wsInited = info;
  },
  SET_RECORDING(state){
    state.recording = !state.recording;
  },
  SET_INIT_LIST(state){
    state.initList = true;
  },
  SET_WS_LIST_FILTER(state, filter){
    state.filter = filter;
  },
  SET_WS_LIST(state, obj){
    switch (obj.type) {
      case "init":
        state.wsList = obj.data;
        break;
      case "add":
        state.wsList.push(obj.data);
        break;
      case "clear":
        state.wsList = [];
        break;
      case "change":
        _.extend(state.wsList[obj.index], obj.data);
        break;
      default:
        break;
    }
  }
};

export default mutations;
