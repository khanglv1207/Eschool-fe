import api from "./api";
import { handleError } from "./api";
import axios from "axios";

// Đăng nhập
export const loginUser = async (data) => {
  try {
    const response = await axios.post("http://localhost:8080/api/users/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Đăng nhập thất bại");
  }
};

// Kiểm tra token
export const introspectToken = async (data) => {
  try {
    const response = await api.post("/api/users/introspect", data);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    const errorObj = errorMsg ? new Error(errorMsg) : error;
    handleError(errorObj);
  }
};