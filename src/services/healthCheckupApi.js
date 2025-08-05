import api from './api';

// Tạo loại kiểm tra y tế
export const createHealthCheckupType = async (checkupData) => {
  try {
    console.log('📋 Tạo loại kiểm tra y tế...', checkupData);

    const response = await api.post('/api/health-checkups/types', checkupData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo loại kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo loại kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu kiểm tra y tế không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo kiểm tra y tế. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Tạo lịch kiểm tra y tế
export const createMedicalCheckup = async (checkupData) => {
  try {
    console.log('📋 Tạo lịch kiểm tra y tế...', checkupData);
    console.log('✅ Request URL:', '/api/admin/create-checkup');
    console.log('✅ Request Body:', JSON.stringify(checkupData, null, 2));

    const response = await api.post('/api/admin/create-checkup', checkupData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo lịch kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo lịch kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu lịch kiểm tra không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo lịch kiểm tra. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách học sinh cần kiểm tra y tế
export const getStudentsToCheckup = async (checkupType) => {
  try {
    console.log('📋 Lấy danh sách học sinh cần kiểm tra y tế:', checkupType);

    const response = await api.get(`/api/health-checkups/students-to-checkup?checkupType=${checkupType}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh cần kiểm tra');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh cần kiểm tra:', error);

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

// Gửi thông báo kiểm tra y tế
export const sendHealthCheckupNotices = async (noticeData) => {
  try {
    console.log('📧 Gửi thông báo kiểm tra y tế...', noticeData);

    const response = await api.post('/api/health-checkups/send-notices', noticeData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu thông báo không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền gửi thông báo. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Gửi thông báo kiểm tra y tế qua email
export const sendBroadcastCheckup = async (emailData) => {
  try {
    console.log('📧 Gửi thông báo kiểm tra y tế qua email...', emailData);
    console.log('✅ Request URL:', '/api/mail/checkup/send-notices');
    console.log('✅ Request Body:', JSON.stringify(emailData, null, 2));

    const response = await api.post('/api/mail/checkup/send-notices', emailData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo kiểm tra y tế qua email');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo kiểm tra y tế qua email:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu email không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền gửi email. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Xác nhận kiểm tra y tế (cho phụ huynh)
export const confirmHealthCheckup = async (confirmationId, message) => {
  try {
    console.log('✅ Xác nhận kiểm tra y tế...', { confirmationId, message });
    console.log('✅ Request URL:', '/api/health-checkups/confirm-checkup');
    console.log('✅ Request Body:', JSON.stringify({ confirmationId, status: 'ACCEPTED', parentNote: message }, null, 2));

    const response = await api.put('/api/health-checkups/confirm-checkup', { 
      confirmationId, 
      status: 'ACCEPTED',
      parentNote: message 
    });
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể xác nhận kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi xác nhận kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu xác nhận không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền xác nhận. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Từ chối kiểm tra y tế (cho phụ huynh)
export const rejectHealthCheckup = async (confirmationId, message) => {
  try {
    console.log('❌ Từ chối kiểm tra y tế...', { confirmationId, message });
    console.log('✅ Request URL:', '/api/health-checkups/confirm-checkup');
    console.log('✅ Request Body:', JSON.stringify({ confirmationId, status: 'REJECTED', parentNote: message }, null, 2));

    const response = await api.put('/api/health-checkups/confirm-checkup', { 
      confirmationId, 
      status: 'REJECTED',
      parentNote: message 
    });
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể từ chối kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi từ chối kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu từ chối không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền từ chối. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách học sinh cần kiểm tra y tế (cho y tá)
export const getStudentsNeedCheckup = async () => {
  try {
    console.log('📋 Lấy danh sách học sinh cần kiểm tra y tế...');

    const response = await api.get('/api/admin/get-all-student-parent');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh cần kiểm tra');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh cần kiểm tra:', error);

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

// Ghi nhận kết quả kiểm tra y tế
export const createHealthCheckupResult = async (resultData) => {
  try {
    console.log('📝 Ghi nhận kết quả kiểm tra y tế...', resultData);

    const response = await api.post('/api/health-checkups/results', resultData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể ghi nhận kết quả kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi ghi nhận kết quả kiểm tra y tế:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu kết quả không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền ghi nhận kết quả. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Gửi kết quả khám sức khỏe qua email cho phụ huynh
export const sendHealthCheckupResults = async (checkupId, date) => {
  try {
    console.log('📧 Gửi kết quả khám sức khỏe qua email...', { checkupId, date });
    const requestData = {
      checkupId: checkupId,
      date: date
    };
    console.log('📤 Request data:', requestData);
    
    const response = await api.post('/api/mail/checkup/send-results', requestData);
    console.log('✅ Send results response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi kết quả khám sức khỏe');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi kết quả khám sức khỏe:', error);
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

// Lấy kết quả kiểm tra y tế (cho phụ huynh)
export const getHealthCheckupResult = async () => {
  try {
    console.log('📋 Lấy kết quả kiểm tra y tế...');

    const response = await api.get('/api/admin/get-all-student-parent');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được kết quả kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy kết quả kiểm tra y tế:', error);

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

// Lấy danh sách loại kiểm tra y tế
export const getHealthCheckupTypes = async () => {
  try {
    console.log('📋 Lấy danh sách loại kiểm tra y tế...');

    const response = await api.get('/api/health-checkups/types');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách loại kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách loại kiểm tra y tế:', error);

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

// Lấy thông báo kiểm tra y tế (cho phụ huynh)
export const getHealthCheckupNotifications = async () => {
  try {
    console.log('📋 Lấy danh sách thông báo kiểm tra y tế cho phụ huynh...');

    const response = await api.get('/api/health-checkups/notifications');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách thông báo kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách thông báo kiểm tra y tế:', error);

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

// Lấy danh sách thông báo kiểm tra y tế (cho admin/nurse)
export const getMedicalCheckupNotices = async () => {
  try {
    console.log('📋 Lấy danh sách thông báo kiểm tra y tế cho admin/nurse...');

    const response = await api.get('/api/nurse/medical-checkup-notices');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách thông báo kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách thông báo kiểm tra y tế:', error);

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

// Lấy danh sách đợt kiểm tra y tế đã tạo (cho admin/nurse)
export const getMedicalCheckupSchedules = async () => {
  try {
    console.log('📋 Lấy danh sách đợt kiểm tra y tế đã tạo...');

    const response = await api.get('/api/nurse/medical-checkup-notices');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách đợt kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách đợt kiểm tra y tế:', error);

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

// Lấy tất cả học sinh từ database
export const getAllStudents = async () => {
  try {
    console.log('👥 Lấy tất cả học sinh từ database...');
    const response = await api.get('/api/admin/get-all-student-parent');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh:', error);
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

// Lấy danh sách học sinh cần kiểm tra (đã được gửi thông báo)
export const getStudentsNeedCheckupFromDB = async () => {
  try {
    console.log('👥 Lấy danh sách học sinh cần kiểm tra từ database...');
    const response = await api.get('/api/admin/get-students-need-checkup');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh cần kiểm tra');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh cần kiểm tra:', error);
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

// Lưu kết quả kiểm tra y tế vào database
export const saveCheckupResult = async (resultData) => {
  try {
    console.log('💾 Lưu kết quả kiểm tra y tế vào database...', resultData);
    console.log('✅ Request URL:', '/api/nurse/health-checkup');
    console.log('✅ Request Body:', JSON.stringify(resultData, null, 2));
    console.log('🔍 studentId in request:', resultData.studentId);
    console.log('🔍 studentId type:', typeof resultData.studentId);
    console.log('🔍 studentCode in request:', resultData.studentCode);
    console.log('🔍 studentCode type:', typeof resultData.studentCode);
    console.log('🔍 Backend data being sent:', resultData);

    const response = await api.post('/api/nurse/health-checkup', resultData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể lưu kết quả kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lưu kết quả kiểm tra y tế:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Request data sent:', resultData);
    console.error('❌ studentCode sent:', resultData.studentCode);
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Dữ liệu kết quả không hợp lệ. Vui lòng kiểm tra thông tin.';
      console.error('❌ Backend error details:', error.response?.data);
      throw new Error(errorMessage);
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền lưu kết quả. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách kết quả kiểm tra y tế từ database
export const getCheckupResultsFromDB = async () => {
  try {
    console.log('📋 Lấy danh sách kết quả kiểm tra y tế từ database...');
    const response = await api.get('/api/admin/get-checkup-results');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách kết quả kiểm tra');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách kết quả kiểm tra:', error);
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

// Lấy danh sách học sinh đã khám sức khỏe
export const getCheckedStudents = async () => {
  try {
    console.log('📋 Lấy danh sách học sinh đã khám sức khỏe...');
    const response = await api.get('/api/nurse/checked-students');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh đã khám');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh đã khám:', error);
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

// Lấy kết quả kiểm tra y tế cho phụ huynh
export const getCheckupResults = async () => {
  try {
    console.log('📋 Lấy kết quả kiểm tra y tế...');
    const response = await api.get('/api/parents/checkup-result');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được kết quả kiểm tra y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy kết quả kiểm tra y tế:', error);
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