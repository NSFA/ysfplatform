const state = {
  activeTab: 1, //左侧激活的Tab
  hubActiveTab: "1", //API设置中激活的Tab
  recording: true, // 是否在监听记录
  wsInited: false, //是否初始
  wsList:[], //记录
  filter:"", //筛选项
  initList:false, //是否初始监控列表
  filterSet:{
    currentPage:1,
    pageSize:20,
    total:0
  }
};

export default state;
