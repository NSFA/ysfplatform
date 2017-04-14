import axios from 'axios';

/**
 * 登录接口
 * @param form
 * @returns {AxiosPromise}
 * @private
 */
export const _login = (form) => {
  return axios.post("/api/login", form);
};

/**
 * AnyProxy设置获取
 * @returns {AxiosPromise}
 * @private
 */
export const _getProxy = () => {
  return axios.get("/api/getProxy");
};

/**
 * AnyProxy设置
 * @param form
 * @returns {AxiosPromise}
 * @private
 */
export const _setProxy = (form) => {
  return axios.post("/api/setProxy", form);
};

/**
 * 获取API信息
 * @param pid
 * @returns {AxiosPromise}
 * @private
 */
export const _getApi = (pid) => {
  return axios.get("/api/getApi", {
    params: {
      id: pid
    }
  });
};

/**
 * 添加API信息
 * @param info
 * @returns {AxiosPromise}
 * @private
 */
export const _addApi = (info) => {
  return axios.post("/api/addApi", info);
};

/**
 * 删除API
 * @param pid
 * @returns {AxiosPromise}
 * @private
 */
export const _delApi = (pid) => {
  return axios.post("/api/delApi", pid);
};

/**
 * 获取API表
 * @returns {AxiosPromise}
 * @private
 */
export const _getApiList = () => {
  return axios.get("/api/getApiList");
};

/**
 * 获取ReqAPI信息
 * @param pid
 * @returns {AxiosPromise}
 * @private
 */
export const _getReqApi = (pid) => {
  return axios.get("/api/getReqApi", {
    params: {
      id: pid
    }
  });
};

/**
 * 添加ReqAPI信息
 * @param info
 * @returns {AxiosPromise}
 * @private
 */
export const _addReqApi = (info) => {
  return axios.post("/api/addReqApi", info);
};

/**
 * 删除ReqAPI
 * @param pid
 * @returns {AxiosPromise}
 * @private
 */
export const _delReqApi = (pid) => {
  return axios.post("/api/delReqApi", pid);
};

/**
 * 获取ReqAPI表
 * @returns {AxiosPromise}
 * @private
 */
export const _getReqApiList = () => {
  return axios.get("/api/getReqApiList");
};


export const _setApiStatus = (data) => {
  return axios.post("/api/setApiStatus",data);
};

export const _getInitData =()=>{
  return axios.get("/api/getInitData");
};


export const _getlatestLog =()=>{
  return axios.get("/api/latestLog");
};


export const _getQrCode =()=>{
  return axios.get("/api/getQrCode");
};


export const _getReqBody =(id)=>{
  return axios.get("/api/getReqBody",{
    params: {
      id: id
    }
  });
};


