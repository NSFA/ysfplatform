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
 * 初始化数据
 * @returns {AxiosPromise}
 * @private
 */
export const _getInfo = () => {
  return axios.get("/api/getInfo");
};

/**
 * 服务器开关
 * @param status
 * @returns {AxiosPromise}
 * @private
 */
export const _setServerStatus = (status) => {
  return axios.post("/api/setInfo", status);
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
