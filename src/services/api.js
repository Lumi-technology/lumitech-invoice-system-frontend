import axios from "axios";

const api = axios.create({
  baseURL: "https://lumitech-ledger-lumitech-ledger-backend--ed977d-145-223-98-212.traefik.me/", 
  // baseURL: "http://localhost:8081/",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;