const axios = require("axios");
const { HOST } = require("@/utils/constenst");

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});
