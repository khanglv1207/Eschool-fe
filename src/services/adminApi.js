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
        const response = await api.put(`/api/users/update-user/${userId}`, userData);
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
        throw new Error(errorMsg || "Không thể tạo tài khoản");
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
export const getAllManagers = async (page = 1, size = 10, search = "") => {
    try {
        const response = await api.get("/api/admin/managers", { params: { page, size, search } });
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
export const getAllSchoolNurses = async () => {
    try {
        const response = await api.get("/api/nurse/get-all-nurse");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách y tá trường học");
    }
};

// Tạo y tá trường học mới
export const createSchoolNurse = async (nurseData) => {
    try {
        const response = await api.post("/api/nurse/create-nurse", nurseData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo y tá trường học mới");
    }
};

// Cập nhật thông tin y tá trường học
export const updateSchoolNurse = async (nurseData) => {
    try {
        const response = await api.put("/api/nurse/update-nurse", nurseData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật y tá trường học");
    }
};

// Xóa y tá trường học
export const deleteSchoolNurse = async (nurseId) => {
    try {
        const response = await api.delete(`/api/nurse/delete-nurse/${nurseId}`);
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
        const response = await api.get("/api/admin/blogs", { params: { page, size, search } });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách blogs");
    }
};

// Tạo blog mới
export const createBlog = async (blogData) => {
    try {
        const config = blogData instanceof FormData ? {} : { headers: { 'Content-Type': 'application/json' } };
        const response = await api.post("/api/admin/blogs", blogData, config);
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

// Thay đổi trạng thái blog
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





// ==================== Medical Management =====================
export const getAllMedicalRecords = async () => {
    try {
        const response = await api.get("/api/admin/get-all-medical-record");
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách hồ sơ y tế");
    }
};

export const createMedicalRecord = async (medicalData) => {
    try {
        const response = await api.post("/api/admin/create-medical-record", medicalData);
        return response.data.result;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo hồ sơ y tế mới");
    }
}
export const updateMedicalRecord = async (medicalId, medicalData) => {
    try {
        const response = await api.put(`/api/admin/medical-records/${medicalId}`, medicalData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể cập nhật hồ sơ y tế");
    }
};
export const deleteMedicalRecord = async (medicalId) => {
    try {
        const response = await api.delete(`/api/admin/medical-records/${medicalId}`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xóa hồ sơ y tế");
    }
};
export const importMedicalExcel = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post("/api/admin/import-medical-records", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể import hồ sơ y tế từ Excel");
    }
}
// ==================== VACCINATION MANAGEMENT ====================

// Lấy danh sách kết quả tiêm chủng
export const getVaccinationResults = async () => {
    try {
        const response = await api.get("/api/vaccinations/vaccination-result");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách kết quả tiêm chủng");
    }
};

// Lấy danh sách học sinh cần tiêm chủng
export const getStudentsToVaccinate = async (vaccineName) => {
    try {
        const response = await api.get("/api/vaccinations/students-to-vaccinate", {
            params: { vaccineName }
        });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách học sinh cần tiêm chủng");
    }
};

// Lấy danh sách học sinh cần tiêm chủng (không cần vaccineName)
export const getStudentsNeedVaccination = async () => {
    try {
        const response = await api.get("/api/vaccinations/students-need-vaccination");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách học sinh cần tiêm chủng");
    }
};

// Gửi kết quả tiêm chủng
export const sendVaccinationResult = async (resultData) => {
    try {
        const response = await api.post("/api/vaccinations/vaccination/result", resultData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể gửi kết quả tiêm chủng");
    }
};

// Gửi kết quả tiêm chủng (endpoint khác)
export const sendVaccinationResults = async () => {
    try {
        const response = await api.post("/api/vaccinations/send-vaccination-results");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể gửi kết quả tiêm chủng");
    }
};

// Gửi thông báo tiêm chủng
export const sendVaccinationNotices = async (noticeData) => {
    try {
        const response = await api.post("/api/vaccinations/send-vaccination-notices", noticeData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể gửi thông báo tiêm chủng");
    }
};

// Tạo loại vaccine mới
export const createVaccineType = async (vaccineData) => {
    try {
        const response = await api.post("/api/vaccinations/create-vaccine-type", vaccineData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể tạo loại vaccine mới");
    }
};

// Xác nhận tiêm chủng
export const confirmVaccination = async (confirmationData) => {
    try {
        const response = await api.post("/api/vaccinations/confirm-vaccination", confirmationData);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể xác nhận tiêm chủng");
    }
};

// Lấy danh sách tiêm chủng đang chờ xử lý (giữ lại cho tương thích)
export const getPendingVaccinations = async () => {
    try {
        const response = await api.get("/api/vaccinations/students-need-vaccination");
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể lấy danh sách tiêm chủng đang chờ xử lý");
    }
};

// Gửi thông báo (giữ lại cho tương thích)
export const sendNotification = async (accountId) => {
    try {
        const response = await api.post("/api/admin/notifications/send", { accountId });
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message;
        throw new Error(errorMsg || "Không thể gửi thông báo");
    }
};