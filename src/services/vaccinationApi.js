import api from './api';

// Tạo loại vaccine mới
export const createVaccineType = async (vaccineData) => {
  try {
    console.log('📋 Tạo loại vaccine mới...', vaccineData);
    
    const response = await api.post('/api/vaccines', vaccineData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo loại vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo loại vaccine:', error);
    throw new Error('Không thể tạo loại vaccine. Vui lòng thử lại sau.');
  }
};

// Lấy danh sách học sinh cần tiêm vaccine
export const getStudentsToVaccinate = async (vaccineName) => {
  try {
    console.log('📋 Lấy danh sách học sinh cần tiêm vaccine...', vaccineName);
    
    const response = await api.get(`/api/vaccinations/students-to-vaccinate?vaccineName=${encodeURIComponent(vaccineName)}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh:', error);
    throw new Error('Không thể lấy danh sách học sinh. Vui lòng thử lại sau.');
  }
};

// Gửi thông báo tiêm chủng cho phụ huynh
export const sendVaccinationNotices = async (notificationData) => {
  try {
    console.log('📧 Gửi thông báo tiêm chủng...', notificationData);
    console.log('🔗 API endpoint: /api/vaccinations/send-vaccination-notices');
    console.log('📋 Request body:', JSON.stringify(notificationData, null, 2));
    
    const response = await api.post('/api/vaccinations/send-vaccination-notices', notificationData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo tiêm chủng:', error);
    console.error('📊 Error response:', error.response?.data);
    console.error('🔢 Status code:', error.response?.status);
    console.error('📋 Error details:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Dữ liệu thông báo không hợp lệ';
      console.error('❌ 400 Bad Request - Chi tiết:', error.response.data);
      throw new Error(`Dữ liệu thông báo không hợp lệ: ${errorMessage}`);
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền gửi thông báo. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy thông báo tiêm chủng cho phụ huynh theo userId
export const getVaccinationNotifications = async () => {
  try {
    console.log('📋 Lấy danh sách thông báo tiêm chủng cho phụ huynh...');
    
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const userId = user.id || user.userId;
    
    console.log('👤 User info:', { userId: userId, role: user.role });
    
    if (!userId) {
      throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
    }
    
    // Lấy thông báo theo userId từ database
    const response = await api.get(`/api/vaccinations/parent-notifications/user/${userId}`);
    console.log('✅ Response (by userId):', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách thông báo');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách thông báo:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      console.log('📝 Không có thông báo nào cho user này');
      return []; // Không có thông báo nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy thông báo real-time khi user đăng nhập
export const getRealTimeNotifications = async () => {
  try {
    console.log('📡 Lấy thông báo real-time...');
    
    const response = await api.get('/api/vaccinations/notifications/realtime');
    console.log('✅ Real-time Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được thông báo real-time');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông báo real-time:', error);
    return [];
  }
};

// Lấy thông báo tiêm chủng theo userId từ database
export const getVaccinationNotificationsByUserId = async (userId) => {
  try {
    console.log('📋 Lấy thông báo tiêm chủng theo userId:', userId);
    
    const response = await api.get(`/api/vaccinations/parent-notifications/user/${userId}`);
    console.log('✅ Response (by userId):', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách thông báo');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông báo theo userId:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      console.log('📝 Không có thông báo nào cho user này');
      return []; // Không có thông báo nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách học sinh cần tiêm (cho y tá)
export const getStudentsNeedVaccination = async () => {
  try {
    console.log('📋 Lấy danh sách học sinh cần tiêm...');
    
    const response = await api.get('/api/vaccinations/students-need-vaccination');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh cần tiêm');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh cần tiêm:', error);
    throw new Error('Không thể lấy danh sách học sinh cần tiêm. Vui lòng thử lại sau.');
  }
};

// Tạo kết quả tiêm chủng
export const createVaccinationResult = async (resultData) => {
  try {
    console.log('📋 Tạo kết quả tiêm chủng...', resultData);
    
    const response = await api.post('/api/vaccinations/results', resultData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo kết quả tiêm chủng:', error);
    throw new Error('Không thể tạo kết quả tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Gửi kết quả tiêm chủng cho phụ huynh
export const sendVaccinationResults = async () => {
  try {
    console.log('📧 Gửi kết quả tiêm chủng...');
    
    const response = await api.post('/api/vaccinations/send-results');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi kết quả tiêm chủng:', error);
    throw new Error('Không thể gửi kết quả tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Lấy kết quả tiêm chủng
export const getVaccinationResult = async () => {
  try {
    console.log('📋 Lấy kết quả tiêm chủng...');
    
    const response = await api.get('/api/vaccinations/results');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy kết quả tiêm chủng:', error);
    throw new Error('Không thể lấy kết quả tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Lấy danh sách loại vaccine
export const getVaccineTypes = async () => {
  try {
    console.log('📋 Lấy danh sách loại vaccine...');
    
    const response = await api.get('/api/vaccines');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách loại vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách loại vaccine:', error);
    throw new Error('Không thể lấy danh sách loại vaccine. Vui lòng thử lại sau.');
  }
};

// Tạo bản ghi tiêm chủng
export const createVaccinationRecord = async (data) => {
  try {
    console.log('📋 Tạo bản ghi tiêm chủng...', data);
    
    const response = await api.post('/api/vaccinations/records', data);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo bản ghi tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo bản ghi tiêm chủng:', error);
    throw new Error('Không thể tạo bản ghi tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Lấy lịch sử tiêm chủng của học sinh
export const getVaccinationsByStudent = async (studentId) => {
  try {
    console.log('📋 Lấy lịch sử tiêm chủng của học sinh...', studentId);
    
    const response = await api.get(`/api/vaccinations/student/${studentId}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được lịch sử tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử tiêm chủng:', error);
    throw new Error('Không thể lấy lịch sử tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Xóa bản ghi tiêm chủng
export const deleteVaccinationRecord = async (recordId) => {
  try {
    console.log('🗑️ Xóa bản ghi tiêm chủng...', recordId);
    
    const response = await api.delete(`/api/vaccinations/records/${recordId}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể xóa bản ghi tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi xóa bản ghi tiêm chủng:', error);
    throw new Error('Không thể xóa bản ghi tiêm chủng. Vui lòng thử lại sau.');
  }
};

// Lấy thông báo tiêm chủng theo confirmationId
export const getVaccinationNotification = async (confirmationId) => {
  try {
    console.log('📋 Lấy thông báo tiêm chủng theo confirmationId...', confirmationId);
    
    const response = await api.get(`/api/vaccinations/notification/${confirmationId}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không lấy được thông tin thông báo');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin thông báo:', error);
    throw new Error('Không thể lấy thông tin thông báo. Vui lòng thử lại sau.');
  }
};

// ===== HỆ THỐNG THÔNG BÁO TIÊM VACCINE MỚI =====

// Gửi thông báo tiêm vaccine cho phụ huynh
export const sendVaccineNotification = async (notificationData) => {
  try {
    console.log('📧 Gửi thông báo tiêm vaccine...', notificationData);
    
    const response = await api.post('/api/vaccine-notifications/send', notificationData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo tiêm vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo tiêm vaccine:', error);
    throw new Error('Không thể gửi thông báo tiêm vaccine. Vui lòng thử lại sau.');
  }
};

// Lấy thông báo tiêm vaccine cho phụ huynh
export const getVaccineNotifications = async () => {
  try {
    console.log('📋 Lấy thông báo tiêm vaccine...');
    
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const userId = user.id || user.userId;
    
    if (!userId) {
      throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
    }
    
    // Sử dụng API endpoint có sẵn
    const response = await api.get(`/api/vaccinations/parent-notifications/user/${userId}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được thông báo tiêm vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông báo tiêm vaccine:', error);
    throw new Error('Không thể lấy thông báo tiêm vaccine. Vui lòng thử lại sau.');
  }
};

// Phụ huynh đồng ý tiêm vaccine
export const confirmVaccine = async (notificationId, parentNote = '') => {
  try {
    console.log('✅ Phụ huynh đồng ý tiêm vaccine...', { notificationId, parentNote });
    
    // Sử dụng DTO VaccinationConfirmationRequest
    const requestData = {
      confirmationId: notificationId,
      status: 'CONFIRMED',
      parentNote: parentNote
    };
    
    console.log('📋 Request data theo DTO:', requestData);
    
    const response = await api.post('/api/vaccinations/confirm-vaccination', requestData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể xác nhận tiêm vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi xác nhận tiêm vaccine:', error);
    throw new Error('Không thể xác nhận tiêm vaccine. Vui lòng thử lại sau.');
  }
};

// Phụ huynh từ chối tiêm vaccine
export const rejectVaccine = async (notificationId, parentNote = '') => {
  try {
    console.log('❌ Phụ huynh từ chối tiêm vaccine...', { notificationId, parentNote });
    
    // Sử dụng DTO VaccinationConfirmationRequest
    const requestData = {
      confirmationId: notificationId,
      status: 'REJECTED',
      parentNote: parentNote
    };
    
    console.log('📋 Request data theo DTO:', requestData);
    
    const response = await api.post('/api/vaccinations/confirm-vaccination', requestData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể từ chối tiêm vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi từ chối tiêm vaccine:', error);
    throw new Error('Không thể từ chối tiêm vaccine. Vui lòng thử lại sau.');
  }
}; 