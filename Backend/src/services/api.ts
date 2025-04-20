import axios from "axios";

export const api = axios.create({
  baseURL: "http://20.244.56.144/evaluation-service",
  timeout: 5000,
});
