import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3002/",
  timeout: 20000,
});

export default axiosInstance;
