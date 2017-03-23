import axios from 'axios';

export const _login= (form) => {
  return axios.post("/api/login", form);
};

export const _getInfo= () => {
  return axios.get("/api/getInfo");
};

export const _setServerStatus= (status) => {
  return axios.post("/api/setServerStatus",status);
};

export const _getProxy= () => {
  return axios.get("/api/getProxy");
};

export const _setProxy= (form) => {
  return axios.post("/api/setProxy",form);
};
