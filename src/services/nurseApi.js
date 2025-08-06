import api from './api';

// ==================== NURSE API ====================

// Lấy lịch trình hôm nay của học sinh
export const getTodaySchedules = async (studentId) => {
  try {
    const response = await api.get(`/api/nurse/today-schedules/${studentId}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể lấy lịch trình hôm nay");
  }
};

// Lấy danh sách yêu cầu thuốc đang chờ xử lý
export const getPendingMedicationRequests = async () => {
  try {
    const response = await api.get("/api/nurse/medication-requests/pending");
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể lấy danh sách yêu cầu thuốc đang chờ");
  }
};

// Lấy danh sách học sinh đã xác nhận
export const getConfirmedStudents = async () => {
  try {
    const response = await api.get("/api/nurse/confirmed-students");
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể lấy danh sách học sinh đã xác nhận");
  }
};

// Gửi kết quả kiểm tra sức khỏe
export const submitHealthCheckup = async (checkupData) => {
  try {
    const response = await api.post("/api/nurse/health-checkup", checkupData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể gửi kết quả kiểm tra sức khỏe");
  }
};

// Cập nhật trạng thái thuốc
export const updateMedicationStatus = async (medicationData) => {
  try {
    const response = await api.put("/api/nurse/update-medication-status", medicationData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể cập nhật trạng thái thuốc");
  }
};

// Đánh dấu lịch trình đã thực hiện
export const markScheduleAsTaken = async (scheduleId) => {
  try {
    const response = await api.put(`/api/nurse/mark-schedule-as-taken/${scheduleId}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể đánh dấu lịch trình đã thực hiện");
  }
};

// Lấy danh sách tất cả y tá
export const getAllNurses = async () => {
  try {
    const response = await api.get("/api/nurse/get-all-nurse");
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể lấy danh sách y tá");
  }
};

// Cập nhật thông tin y tá
export const updateNurse = async (nurseData) => {
  try {
    const response = await api.put("/api/nurse/update-nurse", nurseData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể cập nhật thông tin y tá");
  }
};

// Tạo y tá mới
export const createNurse = async (nurseData) => {
  try {
    const response = await api.post("/api/nurse/create-nurse", nurseData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể tạo y tá mới");
  }
};

// Xóa y tá
export const deleteNurse = async (nurseId) => {
  try {
    const response = await api.delete(`/api/nurse/delete-nurse/${nurseId}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    throw new Error(errorMsg || "Không thể xóa y tá");
  }
};

// Lấy thông tin nurse hiện tại (dựa trên user đang đăng nhập)
export const getCurrentNurse = async () => {
  try {
    console.log('🔍 Đang gọi API /api/nurse/get-all-nurse...');
    const response = await api.get('/api/nurse/get-all-nurse');
    console.log('👩‍⚕️ All nurses from API:', response.data);

    const nurses = response.data.result || [];
    console.log('📋 Số lượng nurses:', nurses.length);
    console.log('📋 Nurses data:', nurses);

    if (nurses.length > 0) {
      const selectedNurse = nurses[0];
      console.log('✅ Chọn nurse đầu tiên:', selectedNurse);
      return selectedNurse; // Trả về nurse đầu tiên
    } else {
      throw new Error('Không có nurse nào trong hệ thống');
    }
  } catch (error) {
    console.error('❌ Error fetching nurse info:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw new Error('Không thể lấy thông tin nurse');
  }
};

// Lấy tất cả danh sách y tá
export const getAllNursesList = async () => {
  try {
    console.log('🔍 Đang gọi API /api/nurse/get-all-nurse...');
    const response = await api.get('/api/nurse/get-all-nurse');
    console.log('👩‍⚕️ All nurses from API:', response.data);

    const nurses = response.data.result || [];
    console.log('📋 Số lượng nurses:', nurses.length);
    console.log('📋 Nurses data:', nurses);

    return nurses;
  } catch (error) {
    console.error('❌ Error fetching all nurses:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw new Error('Không thể lấy danh sách y tá');
  }
};

// Lấy nurse theo ID
export const getNurseById = async (nurseId) => {
  try {
    // Tạm thời lấy tất cả và filter theo ID
    const response = await api.get('/api/nurse/get-all-nurse');
    const nurses = response.data.result || [];
    const nurse = nurses.find(n => n.nurseId === nurseId || n.id === nurseId);

    if (nurse) {
      return nurse;
    } else {
      throw new Error('Không tìm thấy nurse với ID này');
    }
  } catch (error) {
    console.error('❌ Error fetching nurse by ID:', error.response?.data);
    throw new Error('Không thể lấy thông tin nurse');
  }
};

export const nurseApi = {
  getCurrentNurse,
  getAllNurses,
  getAllNursesList,
  getNurseById,
  getTodaySchedules,
  getPendingMedicationRequests,
  getConfirmedStudents,
  submitHealthCheckup,
  updateMedicationStatus,
  markScheduleAsTaken,
  updateNurse,
  createNurse,
  deleteNurse
};

export default nurseApi; 