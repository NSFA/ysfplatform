const mutations = {

  SET_ACTIVE_TAB(state, payload){
    state.activeTab = payload;
  },

  SET_DATA_ACTIVE_TAB(state, payload){
    state.hubActiveTab = payload;
  },

  SET_PROXY_STATE(state, payload){
    state.proxy_switch = payload;
  },

  SET_INIT_INFO(state, payload){
    _.extend(state, payload);
  },

  SET_WS(state, payload){
    state.wsInited = payload;
  },

  SET_RECORDING(state){
    state.recording = !state.recording;
  },

  SET_INIT_LIST(state){
    state.initList = true;
  },

  SET_WS_LIST_FILTER(state, payload){
    state.filter = payload;
  },

  SET_WS_LIST(state, payload){
    switch (payload.type) {
      case "init":
        state.wsList = payload.data;
        break;
      case "add":
        state.wsList.push(payload.data);
        break;
      case "clear":
        state.wsList = [];
        break;
      case "change":
        _.extend(state.wsList[payload.index], payload.data);
        break;
      default:
        break;
    }
  },

  SET_FILTER(state, payload){
    state.filterSet = {
      ...state.filterSet, ...payload
    }
  }
};

export default mutations;
