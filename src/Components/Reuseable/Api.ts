// src/Components/Reuseable/Api.ts
import axios from "axios";

const Api = axios.create({
  baseURL: "https://zyrahr-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token automatically to every request
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // match your login storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;
