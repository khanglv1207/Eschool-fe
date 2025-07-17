import api from "./api";
import { handleError } from "./api";
import axios from "axios";

// ==================== USER MANAGEMENT ====================
// Lấy danh sách tất cả users
export const getAllUsers = async () => {
    try {
        const response = await api.get("/api/users/get-all-user");
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách người dùng");
    }
};

// Tạo user mới
export const createUser = async (userData) => {
    try {
        const response = await api.post("/api/admin/users", userData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo user mới");
    }
};

// Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/api/admin/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật user");
    }
};

// Xóa user
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa user");
    }
};

// Thay đổi role của user
export const changeUserRole = async (userId, newRole) => {
    try {
        const response = await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể thay đổi role");
    }
};

// ==================== STUDENT MANAGEMENT ====================
// Hiển thị danh sách học sinh 
export const getAllParentStudent = async () => {
    try {
        const response = await api.get("/api/admin/get-all-student-parent");
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách học sinh/phụ huynh");
    }
};
export const createParent = async ({ email, fullName }) => {
    try {
        const response = await api.post("/api/mail/create-parent", { email, fullName });
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo phụ huynh mới");
    }
}


// Tạo học sinh mới (kết nối BE thật)
export const createStudentParent = async (studentData) => {
    try {
        const response = await api.post("/api/admin/create-student-parent", studentData);
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo học sinh mới");
    }
};

// Cập nhật thông tin học sinh
export const updateStudent = async (studentId, studentData) => {
    try {
        const response = await api.put(`/api/admin/students/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật học sinh");
    }
};

// Xóa học sinh
export const deleteStudent = async (studentId) => {
    try {
        const response = await api.delete(`/api/admin/students/${studentId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa học sinh");
    }
};

// Xóa học sinh/phụ huynh
export const deleteStudentParent = async (id) => {
    try {
        const response = await api.delete(`/api/admin/delete-student-parent/${id}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa học sinh/phụ huynh");
    }
};

// Thay đổi trạng thái học sinh
export const changeStudentStatus = async (studentId, status) => {
    try {
        const response = await api.patch(`/api/admin/students/${studentId}/status`, { status });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể thay đổi trạng thái học sinh");
    }
};

// Import học sinh từ Excel
export const importStudent = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post("/api/students/import-student", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể import học sinh từ Excel");
    }
};

// Import parent student từ Excel (theo Swagger API)
export const importParentStudentExcel = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Sửa endpoint cho đúng với BE
    const response = await api.post("/api/students/import-parent-students", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Cập nhật học sinh/phụ huynh
export const updateStudentParent = async (studentParentData) => {
    try {
        const response = await api.put("/api/admin/update-student-parent", studentParentData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật học sinh/phụ huynh");
    }
};

// ==================== MANAGER MANAGEMENT ====================
// Lấy danh sách managers
export const getAllManagers = async (page = 1, size = 10, search = "") => {
    try {
        const response = await api.get("/api/admin/managers", {
            params: { page, size, search }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách managers");
    }
};

// Tạo manager mới
export const createManager = async (managerData) => {
    try {
        const response = await api.post("/api/admin/managers", managerData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo manager mới");
    }
};

// Cập nhật thông tin manager
export const updateManager = async (managerId, managerData) => {
    try {
        const response = await api.put(`/api/admin/managers/${managerId}`, managerData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật manager");
    }
};

// Xóa manager
export const deleteManager = async (managerId) => {
    try {
        const response = await api.delete(`/api/admin/managers/${managerId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa manager");
    }
};

// ==================== SCHOOL NURSE MANAGEMENT ====================
// Lấy danh sách y tá trường học
export const getAllSchoolNurses = async (page = 1, size = 10, search = "") => {
    try {
        const response = await api.get("/api/admin/school-nurses", {
            params: { page, size, search }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách y tá trường học");
    }
};

// Tạo y tá trường học mới
export const createSchoolNurse = async (nurseData) => {
    try {
        const response = await api.post("/api/admin/school-nurses", nurseData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo y tá trường học mới");
    }
};

// Cập nhật thông tin y tá trường học
export const updateSchoolNurse = async (nurseId, nurseData) => {
    try {
        const response = await api.put(`/api/admin/school-nurses/${nurseId}`, nurseData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật y tá trường học");
    }
};

// Xóa y tá trường học
export const deleteSchoolNurse = async (nurseId) => {
    try {
        const response = await api.delete(`/api/admin/school-nurses/${nurseId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa y tá trường học");
    }
};

// ==================== BLOG MANAGEMENT ====================
// Lấy danh sách blogs
export const getAllBlogs = async (page = 1, size = 10, search = "") => {
    try {
        const response = await api.get("/api/admin/blogs", {
            params: { page, size, search }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách blogs");
    }
};

// Tạo blog mới
export const createBlog = async (blogData) => {
    try {
        const response = await api.post("/api/admin/blogs", blogData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo blog mới");
    }
};

// Cập nhật blog
export const updateBlog = async (blogId, blogData) => {
    try {
        const response = await api.put(`/api/admin/blogs/${blogId}`, blogData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật blog");
    }
};

// Xóa blog
export const deleteBlog = async (blogId) => {
    try {
        const response = await api.delete(`/api/admin/blogs/${blogId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa blog");
    }
};

// Thay đổi trạng thái blog (publish/unpublish)
export const changeBlogStatus = async (blogId, status) => {
    try {
        const response = await api.patch(`/api/admin/blogs/${blogId}/status`, { status });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể thay đổi trạng thái blog");
    }
};

// ==================== FEEDBACK MANAGEMENT ====================
// Lấy danh sách feedback
export const getAllFeedbacks = async (page = 1, size = 10, search = "") => {
    try {
        const response = await api.get("/api/admin/feedbacks", {
            params: { page, size, search }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách feedback");
    }
};

// Xem chi tiết feedback
export const getFeedbackById = async (feedbackId) => {
    try {
        const response = await api.get(`/api/admin/feedbacks/${feedbackId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy chi tiết feedback");
    }
};

// Phản hồi feedback
export const replyToFeedback = async (feedbackId, replyData) => {
    try {
        const response = await api.post(`/api/admin/feedbacks/${feedbackId}/reply`, replyData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể phản hồi feedback");
    }
};

// Xóa feedback
export const deleteFeedback = async (feedbackId) => {
    try {
        const response = await api.delete(`/api/admin/feedbacks/${feedbackId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa feedback");
    }
};

// Thay đổi trạng thái feedback
export const changeFeedbackStatus = async (feedbackId, status) => {
    try {
        const response = await api.patch(`/api/admin/feedbacks/${feedbackId}/status`, { status });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể thay đổi trạng thái feedback");
    }
};

// ==================== DASHBOARD STATISTICS ====================
// Lấy thống kê tổng quan
export const getDashboardStats = async () => {
    try {
        const response = await api.get("/api/admin/dashboard/stats");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy thống kê dashboard");
    }
};

// Lấy biểu đồ dữ liệu
export const getDashboardCharts = async (period = "month") => {
    try {
        const response = await api.get("/api/admin/dashboard/charts", {
            params: { period }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy dữ liệu biểu đồ");
    }
};

// Lấy hoạt động gần đây
export const getRecentActivities = async (limit = 10) => {
    try {
        const response = await api.get("/api/admin/dashboard/recent-activities", {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy hoạt động gần đây");
    }
};

// ==================== SYSTEM SETTINGS ====================
// Lấy cài đặt hệ thống
export const getSystemSettings = async () => {
    try {
        const response = await api.get("/api/admin/settings");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy cài đặt hệ thống");
    }
};

// Cập nhật cài đặt hệ thống
export const updateSystemSettings = async (settingsData) => {
    try {
        const response = await api.put("/api/admin/settings", settingsData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật cài đặt hệ thống");
    }
};

// ==================== BACKUP & EXPORT ====================
// Xuất dữ liệu
export const exportData = async (dataType, format = "excel") => {
    try {
        const response = await api.get("/api/admin/export", {
            params: { type: dataType, format },
            responseType: "blob"
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xuất dữ liệu");
    }
};

// Tạo backup
export const createBackup = async () => {
    try {
        const response = await api.post("/api/admin/backup");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo backup");
    }
};

// Lấy danh sách backup
export const getBackupList = async () => {
    try {
        const response = await api.get("/api/admin/backup");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách backup");
    }
};

