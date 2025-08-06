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
      return response.data.result;
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
    console.log('📋 Lấy kết quả tiêm chủng...');

    const response = await api.get('/api/vaccinations/vaccination-result');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
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