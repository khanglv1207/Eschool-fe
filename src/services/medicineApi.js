import api from './api';

// Lấy tất cả yêu cầu thuốc từ database (cho Admin)
export const getMedicineRequests = async () => {
  try {
    console.log('📋 Lấy danh sách yêu cầu thuốc...');
    
    // Sử dụng API của nurse để lấy tất cả đơn thuốc
    const response = await api.get('/api/nurse/medication-requests/pending');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách yêu cầu thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách yêu cầu thuốc:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có yêu cầu nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Cập nhật trạng thái yêu cầu thuốc (cho Admin - sử dụng API của nurse)
export const updateMedicineStatus = async (requestId, status) => {
  try {
    console.log('📝 Cập nhật trạng thái yêu cầu thuốc...', { requestId, status });
    
    const response = await api.put('/api/nurse/update-medication-status', {
      requestId: requestId,
      status: status
    });
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể cập nhật trạng thái');
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền cập nhật. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('Yêu cầu thuốc không tồn tại.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Tạo yêu cầu thuốc mới (cho phụ huynh)
// TODO: Tạo API endpoint cho việc tạo medication request
export const createMedicineRequest = async (requestData) => {
  try {
    console.log('📝 Tạo yêu cầu thuốc mới...', requestData);
    
    // TODO: Tạo API endpoint /api/medicines/requests cho việc tạo yêu cầu thuốc
    // Hiện tại tạm thời trả về mock data
    console.log('⚠️ API endpoint chưa được tạo, trả về mock data');
    
    return {
      id: Date.now(),
      status: 'PENDING',
      message: 'Yêu cầu thuốc đã được gửi thành công'
    };
    
    // const response = await api.post('/api/medicines/requests', requestData);
    // console.log('✅ Response:', response.data);
    
    // if (response.data && response.data.code === 1000) {
    //   return response.data.result;
    // } else {
    //   throw new Error(response.data?.message || 'Không thể tạo yêu cầu thuốc');
    // }
  } catch (error) {
    console.error('❌ Lỗi tạo yêu cầu thuốc:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo yêu cầu. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy yêu cầu thuốc của phụ huynh
export const getParentMedicineRequests = async () => {
  try {
    console.log('📋 Lấy yêu cầu thuốc của phụ huynh...');
    
    // Tạm thời sử dụng API của nurse để lấy đơn thuốc
    // TODO: Tạo API riêng cho parent requests
    const response = await api.get('/api/nurse/medication-requests/pending');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      // Lọc chỉ lấy đơn thuốc của phụ huynh hiện tại
      const allRequests = response.data.result || [];
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const filteredRequests = allRequests.filter(request => 
        request.parentId === currentUser.id || 
        request.parentEmail === currentUser.email
      );
      return filteredRequests;
    } else {
      throw new Error(response.data?.message || 'Không lấy được yêu cầu thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy yêu cầu thuốc:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có yêu cầu nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách đơn thuốc đang chờ xác nhận (cho y tá)
export const getPendingMedicationRequests = async () => {
  try {
    console.log('📋 Lấy danh sách đơn thuốc đang chờ xác nhận...');
    
    const response = await api.get('/api/nurse/medication-requests/pending');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách đơn thuốc chờ xác nhận');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách đơn thuốc chờ xác nhận:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có yêu cầu nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Cập nhật trạng thái đơn thuốc
export const updateMedicationStatus = async (requestData) => {
  try {
    console.log('📝 Cập nhật trạng thái đơn thuốc...', requestData);
    
    const response = await api.put('/api/nurse/update-medication-status', requestData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể cập nhật trạng thái đơn thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn thuốc:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền cập nhật. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('Đơn thuốc không tồn tại.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy lịch uống thuốc hôm nay của học sinh
export const getTodaySchedules = async (studentId) => {
  try {
    console.log('📅 Lấy lịch uống thuốc hôm nay...', studentId);
    
    const response = await api.get(`/api/nurse/today-schedules/${studentId}`);
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
    } else if (error.response?.status === 404) {
      return []; // Không có lịch nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Đánh dấu lịch đã uống thuốc
export const markScheduleAsTaken = async (scheduleId) => {
  try {
    console.log('✅ Đánh dấu đã uống thuốc...', scheduleId);
    
    const response = await api.put(`/api/nurse/mark-schedule-as-taken/${scheduleId}`);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể đánh dấu đã uống thuốc');
    }
  } catch (error) {
    console.error('❌ Lỗi đánh dấu đã uống thuốc:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền cập nhật. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('Lịch uống thuốc không tồn tại.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 