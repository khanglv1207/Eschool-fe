import api from './api';

// Cập nhật trạng thái đơn thuốc
export const updateMedicationStatus = async (request) => {
  try {
    const response = await api.put('/api/nurse/update-medication-status', request);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn thuốc:', error);
    throw new Error(error.response?.data?.message || 'Cập nhật trạng thái đơn thuốc thất bại');
  }
};

// Lấy danh sách đơn thuốc đang chờ xác nhận
export const getPendingMedicationRequests = async () => {
  try {
    const response = await api.get('/api/nurse/medication-requests/pending');
    return response.data.result;
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách đơn thuốc chờ xác nhận:', error);
    throw new Error(error.response?.data?.message || 'Lấy danh sách đơn thuốc thất bại');
  }
};

// Lấy lịch uống thuốc hôm nay của học sinh
export const getTodaySchedulesByStudent = async (studentId) => {
  try {
    const response = await api.get(`/api/nurse/today-schedules/${studentId}`);
    return response.data.result;
  } catch (error) {
    console.error('❌ Lỗi lấy lịch uống thuốc hôm nay:', error);
    throw new Error(error.response?.data?.message || 'Lấy lịch uống thuốc thất bại');
  }
};

// Đánh dấu lịch đã uống thuốc
export const markScheduleAsTaken = async (scheduleId) => {
  try {
    const response = await api.put(`/api/nurse/mark-schedule-as-taken/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi đánh dấu đã uống thuốc:', error);
    throw new Error(error.response?.data?.message || 'Đánh dấu đã uống thuốc thất bại');
  }
};

// Lấy tất cả đơn thuốc (cho Admin)
export const getAllMedicationRequests = async () => {
  try {
    const response = await api.get('/api/nurse/medication-requests/pending');
    return response.data.result;
  } catch (error) {
    console.error('❌ Lỗi lấy tất cả đơn thuốc:', error);
    throw new Error(error.response?.data?.message || 'Lấy danh sách đơn thuốc thất bại');
  }
};

// Lấy đơn thuốc của phụ huynh
export const getParentMedicationRequests = async () => {
  try {
    const response = await api.get('/api/nurse/medication-requests/pending');
    // Filter theo user hiện tại (mock)
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const filteredRequests = response.data.result.filter(request => 
      request.parentEmail === user.email
    );
    return filteredRequests;
  } catch (error) {
    console.error('❌ Lỗi lấy đơn thuốc phụ huynh:', error);
    throw new Error(error.response?.data?.message || 'Lấy đơn thuốc thất bại');
  }
}; 