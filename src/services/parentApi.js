import api from "./api";

export const updateParentProfile = async (profileData) => {
  try {
    const response = await api.post("/api/parents/update-profile", profileData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Cập nhật thông tin phụ huynh thất bại");
  }
};

export const getParentProfile = async () => {
  try {
    const response = await api.get("/api/parents/profile");
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không lấy được thông tin phụ huynh");
  }
}; 