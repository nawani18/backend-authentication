import axios from "axios";

const api = axios.create({
  baseURL: "https://first-app-5879.onrender.com/api",
});

export default api;
