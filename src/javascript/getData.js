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
      id:pid
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
