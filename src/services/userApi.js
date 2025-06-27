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

// Đổi mật khẩu lần đầu
export const firstChangePassword = async (userId, newPassword) => {
  try {
    const response = await api.post("/api/mail/change-password-first-time", { userId, newPassword });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Đổi mật khẩu thất bại");
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/api/users/request-password-reset", { email });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không gửi được OTP");
  }
};

export const verifyOtp = async (email, otpCode) => {
  try {
    const response = await api.post("/api/users/verify-otp", { email, otpCode });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "OTP không hợp lệ");
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post("/api/users/reset-password", { email, newPassword });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Đổi mật khẩu thất bại");
  }
};