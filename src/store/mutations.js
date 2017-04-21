import moment from 'moment'

const mutations = {

  //设置menu active
  SET_ACTIVE_TAB(state, payload){
    state.activeTab = payload;
  },

  //设置sub active
  SET_DATA_ACTIVE_TAB(state, payload){
    state.hubActiveTab = payload;
  },

  //设置服务器状态
  SET_PROXY_STATE(state, payload){
    state.proxy_switch = payload;
  },

  //设置初始化信息
  SET_INIT_INFO(state, payload){
    _.extend(state, payload);
  },

  //设置是否建立ws连接
  SET_WS(state, payload){
    state.wsInited = payload;
  },

  //设置是否开启监控
  SET_RECORDING(state){
    state.recording = !state.recording;
  },

  //设置是否初始化监控列表
  SET_INIT_LIST(state, payload){
    state.initList = payload;
  },

  //设置列表筛选
  SET_WS_LIST_FILTER(state, payload){
    state.filter = payload;
  },

  //设置监控列表
  SET_WS_LIST(state, payload){

    moment.locale('zh-cn');

    payload.type === "init" ?
      payload.data.forEach((x) => x.timeZh = moment(x.startTime).format('lll')) :
      payload.data.timeZh = moment(payload.data.startTime).format('lll');

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

  //设置列表筛选分页项
  SET_FILTER(state, payload){
    state.filterSet = {
      ...state.filterSet, ...payload
    }
  }
};

export default mutations;
