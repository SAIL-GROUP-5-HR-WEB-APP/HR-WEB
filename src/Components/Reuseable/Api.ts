import axios from "axios";

const Api = axios.create({
  baseURL: "https://zyrahr-backend.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
