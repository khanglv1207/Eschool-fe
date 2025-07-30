import api from "./api";

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

// Lấy danh sách tất cả y tá (từ adminApi để tương thích)
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