import api from "./api";
import { handleError } from "./api";

// Đăng nhập
export const loginUser = async (data) => {
  try {
    const response = await api.post("/api/users/login", data);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    const errorObj = errorMsg ? new Error(errorMsg) : error;
    handleError(errorObj);
  }
}; //

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