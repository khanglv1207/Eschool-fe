import api from './api';

// Cập nhật trạng thái đơn thuốc
export const updateMedicationStatus = async (requestId, status, note = '') => {
  try {
    console.log('🔄 Cập nhật trạng thái đơn thuốc...', { requestId, status, note });
    const requestData = {
      requestId: requestId,
      status: status,
      note: note
    };
    console.log('📤 Request data:', requestData);
    console.log('🔍 Debug: Gọi API PUT /api/nurse/update-medication-status');
    
    const response = await api.put('/api/nurse/update-medication-status', requestData);
    console.log('✅ Update status response:', response.data);
    console.log('🔍 Debug: Response code:', response.data?.code);
    console.log('🔍 Debug: Response message:', response.data?.message);
    
    if (response.data && response.data.code === 1000) {
      console.log('✅ Cập nhật trạng thái thành công!');
      return response.data;
    } else {
      console.error('❌ Response không thành công:', response.data);
      throw new Error(response.data?.message || 'Cập nhật trạng thái thất bại');
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn thuốc:', error);
    console.error('🔍 Debug: Error response:', error.response?.data);
    console.error('🔍 Debug: Error status:', error.response?.status);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách đơn thuốc đang chờ xác nhận
export const getPendingMedicationRequests = async () => {
  try {
    console.log('📋 Lấy danh sách đơn thuốc đang chờ xác nhận...');
    const response = await api.get('/api/nurse/medication-requests/pending');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách đơn thuốc đang chờ');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách đơn thuốc đang chờ:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy lịch uống thuốc hôm nay của học sinh
export const getTodaySchedulesByStudent = async (studentId) => {
  try {
    console.log('📋 Lấy lịch uống thuốc hôm nay của học sinh:', studentId);
    const response = await api.get(`/api/nurse/today-schedules/${studentId}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được lịch uống thuốc hôm nay');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch uống thuốc hôm nay:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
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

// Phê duyệt đơn thuốc
export const approveMedicationRequest = async (requestId, nurseNote = '') => {
  try {
    console.log('✅ Phê duyệt đơn thuốc...', { requestId, nurseNote });
    const response = await api.put(`/api/nurse/medication-requests/${requestId}/approve`, {
      nurseNote: nurseNote
    });
    console.log('✅ Approval response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi phê duyệt đơn thuốc:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Từ chối đơn thuốc
export const rejectMedicationRequest = async (requestId, nurseNote = '') => {
  try {
    console.log('❌ Từ chối đơn thuốc...', { requestId, nurseNote });
    const response = await api.put(`/api/nurse/medication-requests/${requestId}/reject`, {
      nurseNote: nurseNote
    });
    console.log('✅ Rejection response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi từ chối đơn thuốc:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 

// Lấy thông tin thuốc chi tiết
export const getMedicationDetails = async (medicationId) => {
  try {
    console.log('📋 Lấy thông tin thuốc chi tiết:', medicationId);
    const response = await api.get(`/api/medications/${medicationId}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không lấy được thông tin thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin thuốc:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 

export const getSchedulesForParent = async () => {
  try {
    console.log('📋 Lấy lịch uống thuốc cho phụ huynh...');
    const response = await api.get('/api/schedules');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được lịch uống thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch uống thuốc:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 

// Lấy lịch uống thuốc hôm nay cho tất cả học sinh
export const getTodaySchedulesForAllStudents = async () => {
  try {
    console.log('📋 Lấy lịch uống thuốc hôm nay cho tất cả học sinh...');
    const response = await api.get('/api/nurse/today-schedules');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được lịch uống thuốc hôm nay');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch uống thuốc hôm nay:', error);
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 