// src/services/api.js
import axios from "axios";

// Cấu hình của Axios
const API_BASE_URL = "http://localhost:8080"; // Backend server URL
export const ACCESS_TOKEN = "access_token";

const isClient = typeof window !== "undefined";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = isClient ? localStorage.getItem(ACCESS_TOKEN) : null;
    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Nếu là FormData, để trình duyệt tự thêm Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }



    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm xử lý lỗi
const handleError = (error) => {
  if (error.response) {
    // Lỗi từ server với status code
    console.error("Server Error:", error.response.data);
    throw new Error(error.response.data.message || "Lỗi từ server");
  } else if (error.request) {
    // Lỗi không nhận được response
    console.error("Network Error:", error.request);
    throw new Error("Không thể kết nối đến server");
  } else {
    // Lỗi khác
    console.error("Error:", error.message);
    throw error;
  }
};

export default api;
export { handleError };
