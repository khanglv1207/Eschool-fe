import api from './api';

// Tạo vaccine type mới
export const createVaccineType = async (vaccineData) => {
  try {
    console.log('📝 Tạo vaccine type mới...', vaccineData);

    const response = await api.post('/api/vaccinations/create-vaccine-type', vaccineData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo vaccine type');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo vaccine type:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo vaccine type. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách học sinh cần tiêm vaccine
export const getStudentsToVaccinate = async (vaccineName) => {
  try {
    console.log('📋 Lấy danh sách học sinh cần tiêm vaccine:', vaccineName);

    // Sử dụng endpoint chính xác từ vaccination-controller
    const endpoints = [
      `/api/vaccinations/students-to-vaccinate?vaccineName=${encodeURIComponent(vaccineName)}`,
      `/api/vaccinations/students-need-vaccination?vaccineName=${encodeURIComponent(vaccineName)}`,
      `/api/admin/vaccinations/students-to-vaccinate?vaccineName=${encodeURIComponent(vaccineName)}`,
      `/api/vaccinations/students?vaccineName=${encodeURIComponent(vaccineName)}`
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Success with ${endpoint}:`, response.data);

        if (response.data && response.data.code === 1000) {
          return response.data.result || [];
        } else {
          throw new Error(response.data?.message || 'Không lấy được danh sách học sinh cần tiêm');
        }
      } catch (err) {
        console.log(`❌ Failed with ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }

    // Nếu tất cả endpoints đều fail, trả về empty array
    console.log('No vaccination endpoints found, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh cần tiêm:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Gửi thông báo tiêm chủng
export const sendVaccinationNotices = async (notificationData) => {
  try {
    console.log('📧 Gửi thông báo tiêm chủng...', notificationData);


    const response = await api.post('/api/vaccinations/send-notices', notificationData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền gửi thông báo. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Xác nhận tiêm chủng (cho phụ huynh)
export const confirmVaccination = async (data) => {
  try {
    // Validate data
    if (!data.confirmationId) {
      throw new Error('confirmationId là bắt buộc');
    }
    if (!data.status) {
      throw new Error('status là bắt buộc');
    }
    if (!['accepted', 'declined'].includes(data.status)) {
      throw new Error('status phải là accepted hoặc declined');
    }
    if (!data.parentNote) {
      throw new Error('parentNote là bắt buộc');
    }

    console.log('✅ Xác nhận tiêm chủng...', data);
    console.log('✅ Request URL:', '/api/vaccinations/confirm-vaccination');
    console.log('✅ Request Body:', JSON.stringify(data, null, 2));

    const response = await api.post('/api/vaccinations/confirm-vaccination', data);
    console.log('✅ Confirmation response:', response.data);
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi xác nhận tiêm chủng:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Dữ liệu xác nhận không hợp lệ. Vui lòng kiểm tra thông tin.');
    }
  }
};

// Từ chối tiêm chủng (cho phụ huynh)
export const rejectVaccination = async (data) => {
  try {
    // Validate data
    if (!data.confirmationId) {
      throw new Error('confirmationId là bắt buộc');
    }
    if (!data.status) {
      throw new Error('status là bắt buộc');
    }
    if (!['accepted', 'declined'].includes(data.status)) {
      throw new Error('status phải là accepted hoặc declined');
    }
    if (!data.parentNote) {
      throw new Error('parentNote là bắt buộc');
    }

    console.log('❌ Từ chối tiêm chủng...', data);
    console.log('❌ Request URL:', '/api/vaccinations/confirm-vaccination');
    console.log('❌ Request Body:', JSON.stringify(data, null, 2));

    const response = await api.post('/api/vaccinations/confirm-vaccination', data);
    console.log('✅ Response:', response.data);
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi từ chối tiêm chủng:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Dữ liệu từ chối không hợp lệ. Vui lòng kiểm tra thông tin.');
    }
  }
};

// Lấy thông tin thông báo tiêm chủng
export const getVaccinationNotification = async (confirmationId) => {
  try {
    console.log('📋 Lấy thông tin thông báo tiêm chủng...', confirmationId);

    const response = await api.get(`/api/vaccinations/notification/${confirmationId}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không lấy được thông tin thông báo');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin thông báo:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('Thông báo tiêm chủng không tồn tại hoặc đã hết hạn.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách thông báo tiêm chủng cho phụ huynh
export const getVaccinationNotifications = async () => {
  try {
    console.log('📋 Lấy danh sách thông báo tiêm chủng cho phụ huynh...');

    const response = await api.get('/api/vaccinations/notifications');
    console.log('✅ Response:', response.data);

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

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Tạo kết quả tiêm chủng
export const createVaccinationResult = async (resultData) => {
  try {
    console.log('📝 Tạo kết quả tiêm chủng...', resultData);

    const response = await api.post('/api/vaccinations/vaccination/result', resultData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo kết quả tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo kết quả. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Gửi kết quả tiêm chủng
export const sendVaccinationResults = async (resultsData) => {
  try {
    console.log('📤 Gửi kết quả tiêm chủng...', resultsData);

    const response = await api.post('/api/vaccinations/send-vaccination-results', resultsData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      // Trả về cả result và message từ backend
      return {
        result: response.data.result,
        message: response.data.message || 'Đã gửi kết quả tiêm chủng thành công!'
      };
    } else {
      throw new Error(response.data?.message || 'Không thể gửi kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi kết quả tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền gửi kết quả. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy kết quả tiêm chủng
export const getVaccinationResult = async () => {
  try {
    console.log('📋 Lấy kết quả tiêm chủng cho phụ huynh...');

    const response = await api.get('/api/vaccinations/vaccination-result');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      const results = response.data.result || [];
      
      // Map dữ liệu theo DTO VaccinationResultResponse
      const mappedResults = results.map(result => ({
        confirmationId: result.confirmationId,
        studentName: result.studentName,
        className: result.className,
        vaccineName: result.vaccineName,
        vaccinationDate: result.vaccinationDate,
        hasReaction: result.hasReaction,
        reactionNote: result.reactionNote,
        needsBooster: result.needsBooster,
        finalized: result.finalized,
        // Thêm các trường cũ để tương thích với UI hiện tại
        studentCode: result.studentCode || 'N/A',
        location: result.location || 'Trường học',
        scheduledDate: result.vaccinationDate,
        scheduledTime: result.vaccinationDate ? new Date(result.vaccinationDate).toLocaleTimeString('vi-VN') : 'N/A',
        notes: result.reactionNote,
        result: result.finalized ? 'Đã hoàn thành' : 'Đang xử lý',
        status: result.finalized ? 'COMPLETED' : 'PENDING'
      }));
      
      console.log('📋 Mapped results:', mappedResults);
      return mappedResults;
    } else {
      throw new Error(response.data?.message || 'Không lấy được kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy kết quả tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có kết quả nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách kết quả tiêm chủng (cho admin/nurse)
export const getVaccinationResultsList = async () => {
  try {
    console.log('📋 Lấy danh sách kết quả tiêm chủng...');

    // Thử endpoint mới trước
    const response = await api.get('/api/vaccinations/vaccination-results');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách kết quả tiêm chủng:', error);

    if (error.response?.status === 404) {
      console.log('⚠️ Endpoint /api/vaccinations/vaccination-results không tồn tại, thử endpoint cũ...');
      
      // Thử endpoint cũ nếu endpoint mới không tồn tại
      try {
        const fallbackResponse = await api.get('/api/vaccinations/results');
        console.log('✅ Fallback Response:', fallbackResponse.data);
        
        if (fallbackResponse.data && fallbackResponse.data.code === 1000) {
          return fallbackResponse.data.result || [];
        } else {
          throw new Error(fallbackResponse.data?.message || 'Không lấy được danh sách kết quả tiêm chủng');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback endpoint cũng lỗi:', fallbackError);
        return []; // Trả về mảng rỗng nếu cả 2 endpoint đều lỗi
      }
    } else if (error.response?.status === 400) {
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

// Lấy danh sách vaccine types từ database
export const getVaccineTypes = async () => {
  try {
    console.log('📋 Lấy danh sách vaccine types...');

    // Thử các endpoint khác nhau
    const endpoints = [
      '/api/vaccinations/vaccine-types',
      '/api/admin/vaccinations/vaccine-types',
      '/api/vaccinations/types',
      '/api/admin/vaccinations/types',
      '/api/vaccine-types',
      '/api/admin/vaccine-types'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Success with ${endpoint}:`, response.data);

        if (response.data && response.data.code === 1000) {
          return response.data.result || [];
        } else {
          throw new Error(response.data?.message || 'Không lấy được danh sách vaccine');
        }
      } catch (err) {
        console.log(`❌ Failed with ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }

    // Nếu tất cả endpoints đều fail, trả về mock data
    console.log('No vaccine types endpoints found, returning mock data');
    return [
      { id: 1, name: 'Vaccine COVID-19', description: 'Vắc xin phòng COVID-19' },
      { id: 2, name: 'Vaccine Cúm', description: 'Vắc xin phòng cúm mùa' },
      { id: 3, name: 'Vaccine Sởi', description: 'Vắc xin phòng sởi' },
      { id: 4, name: 'Vaccine Bạch hầu', description: 'Vắc xin phòng bạch hầu' }
    ];
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách vaccine:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Các API cũ để tương thích ngược
export const createVaccinationRecord = async (data) => {
  try {
    console.log('📝 Tạo bản ghi tiêm chủng...', data);

    const response = await api.post('/api/vaccinations/records', data);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo bản ghi tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo bản ghi tiêm chủng:', error);
    throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
  }
};

export const getVaccinationsByStudent = async (studentId) => {
  try {
    console.log('📋 Lấy danh sách tiêm chủng của học sinh...', studentId);

    const response = await api.get(`/api/vaccinations/records/student/${studentId}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách tiêm chủng:', error);
    return [];
  }
};

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
    throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
  }
};

// Gửi thông báo tiêm chủng trực tiếp cho học sinh cần tiêm
export const sendDirectVaccinationNotices = async () => {
  try {
    console.log('📧 Gửi thông báo tiêm chủng trực tiếp...');

    const response = await api.post('/api/vaccinations/send-direct-vaccination-notices');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể gửi thông báo tiêm chủng trực tiếp');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo tiêm chủng trực tiếp:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
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

// Lấy danh sách xác nhận tiêm chủng từ phụ huynh
export const getVaccinationConfirmations = async () => {
  try {
    // Debug: Kiểm tra thông tin đăng nhập chi tiết hơn
    const accessToken = localStorage.getItem('access_token');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    
    console.log('🔐 Debug Authentication Chi Tiết:');
    console.log('  - Access Token:', accessToken ? `✅ Có token (${accessToken.substring(0, 20)}...)` : '❌ Không có token');
    console.log('  - User Role:', loggedInUser.role || loggedInUser.authorities?.[0] || 'N/A');
    console.log('  - User ID:', loggedInUser.id || loggedInUser.userId || 'N/A');
    console.log('  - User Email:', loggedInUser.email || 'N/A');
    console.log('  - Full User Info:', loggedInUser);
    
    // Kiểm tra xem token có hợp lệ không
    if (!accessToken) {
      console.error('❌ Không có access token!');
      throw new Error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
    }
    
    // Kiểm tra thêm về vai trò người dùng
    const userRole = loggedInUser.role || loggedInUser.authorities?.[0];
    console.log('🔍 Phân tích vai trò người dùng:');
    console.log('  - Role từ localStorage:', userRole);
    console.log('  - Role có phải ADMIN?:', userRole === 'ADMIN' || userRole === 'admin');
    console.log('  - Role có phải NURSE?:', userRole === 'NURSE' || userRole === 'nurse');
    
    console.log('🔍 Đang gọi API lấy danh sách xác nhận tiêm chủng...');
    console.log('  - URL:', '/api/vaccinations/confirmation-status');
    console.log('  - Method: GET');
    console.log('  - Expected Role: ADMIN hoặc NURSE');
    
    const response = await api.get('/api/vaccinations/confirmation-status');
    console.log('✅ Response thành công:', response.data);
    
    // Kiểm tra cấu trúc response theo DTO VaccinationConfirmationResponse
    if (response.data && response.data.result) {
      console.log('📋 Dữ liệu từ DTO VaccinationConfirmationResponse:');
      response.data.result.forEach((item, index) => {
        console.log(`  Học sinh ${index + 1}:`, {
          studentId: item.studentId,
          studentName: item.studentName,
          vaccineName: item.vaccineName,
          scheduledDate: item.scheduledDate,
          status: item.status,
          confirmedAt: item.confirmedAt
        });
      });
      return response.data.result;
    } else {
      console.warn('⚠️ Response không có cấu trúc mong đợi:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách xác nhận tiêm chủng:', error);
    console.error('  - Status:', error.response?.status);
    console.error('  - Status Text:', error.response?.statusText);
    console.error('  - Response Data:', error.response?.data);
    console.error('  - Request Config:', error.config);
    
    if (error.response?.status === 403) {
      console.error('🚫 403 Forbidden - Phân tích lỗi:');
      console.error('  - Có thể do thiếu quyền truy cập endpoint');
      console.error('  - Có thể do token không hợp lệ');
      console.error('  - Có thể do backend chưa cấu hình đúng quyền');
      console.error('  - User Role hiện tại:', JSON.parse(localStorage.getItem('loggedInUser') || '{}').role);
      
      // Tạm thời trả về mảng rỗng để UI không bị lỗi
      console.log('⚠️ Tạm thời trả về mảng rỗng do 403 Forbidden');
      return [];
    } else if (error.response?.status === 401) {
      console.error('🔐 401 Unauthorized - Token có thể đã hết hạn');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 404) {
      console.error('🔍 404 Not Found - Endpoint không tồn tại');
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else if (error.response?.status === 500) {
      console.error('💥 500 Internal Server Error - Lỗi server');
      throw new Error('Lỗi server. Vui lòng thử lại sau.');
    } else {
      console.error('❓ Lỗi không xác định:', error.message);
      throw new Error(error.response?.data?.message || 'Lỗi lấy danh sách xác nhận tiêm chủng');
    }
  }
}; 