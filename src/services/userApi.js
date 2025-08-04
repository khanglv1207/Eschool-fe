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

export const linkParentStudent = async (parentId, studentId, relationship) => {
  try {
    const response = await api.post("/api/parents-students", {
      parent_id: parentId,
      student_id: studentId,
      relationship: relationship
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Liên kết phụ huynh-học sinh thất bại");
  }
};

export const updateParentProfile = async (profileData, token) => {
  try {
    const response = await api.post("/api/parents/update-profile-parent", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Cập nhật thông tin phụ huynh thất bại");
  }
};

export const updateStudentProfile = async (studentId, studentData, token) => {
  try {
    const response = await api.post(`/api/students/update-profile-student/${String(studentId)}`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Cập nhật thông tin học sinh thất bại");
  }
};

// Xác nhận phụ huynh chuẩn bị khám sức khỏe
export const confirmParentCheckup = async (confirmationId) => {
  try {
    const response = await api.get(`/api/students/parent-checkup-confirm`, {
      params: { confirmationId }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Xác nhận khám sức khỏe thất bại");
  }
};

// Lấy danh sách học sinh đã xác nhận khám sức khỏe
export const getConfirmedStudents = async (checkupId) => {
  try {
    const response = await api.get('/api/nurses/check-confirmStudent', {
      params: { checkupId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không lấy được danh sách học sinh đã xác nhận');
  }
};

// Lưu kết quả khám sức khỏe
export const updateCheckupResult = async (confirmationId, resultData) => {
  try {
    const response = await api.put(`/api/nurses/checkup-result/${confirmationId}`, resultData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lưu kết quả khám thất bại');
  }
};