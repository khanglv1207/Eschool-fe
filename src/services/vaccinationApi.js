import api from './api';

// Tạo loại vaccine mới
export const createVaccineType = async (vaccineData) => {
  try {
    console.log('📝 Tạo loại vaccine mới...', vaccineData);

    const response = await api.post('/api/vaccinations/create-vaccine-type', vaccineData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo loại vaccine');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo loại vaccine:', error);

    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || 'Dữ liệu vaccine không hợp lệ';
      console.error('Chi tiết lỗi 400:', error.response.data);
      throw new Error(`Dữ liệu vaccine không hợp lệ: ${errorMessage}`);
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo vaccine. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy danh sách học sinh cần tiêm vaccine
export const getStudentsToVaccinate = async (vaccineName) => {
  try {
    console.log('📋 Lấy danh sách học sinh cần tiêm vaccine:', vaccineName);

    const response = await api.get(`/api/vaccinations/students-to-vaccinate?vaccineName=${vaccineName}`);
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

// Gửi thông báo tiêm chủng
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

// Xác nhận tiêm chủng (cho phụ huynh)
export const confirmVaccination = async (confirmationData) => {
  try {
    console.log('✅ Xác nhận tiêm chủng...', confirmationData);
    console.log('✅ Request URL:', '/api/vaccinations/confirm-vaccination');
    console.log('✅ Request Body:', JSON.stringify(confirmationData, null, 2));

    const response = await api.post('/api/vaccinations/confirm-vaccination', confirmationData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể xác nhận tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi xác nhận tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu xác nhận không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền xác nhận. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Từ chối tiêm chủng (cho phụ huynh)
export const rejectVaccination = async (rejectionData) => {
  try {
    console.log('❌ Từ chối tiêm chủng...', rejectionData);

    const response = await api.post('/api/vaccinations/reject-vaccination', rejectionData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể từ chối tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi từ chối tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu từ chối không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền từ chối. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
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

// Ghi nhận kết quả tiêm chủng
export const createVaccinationResult = async (resultData) => {
  try {
    console.log('📝 Ghi nhận kết quả tiêm chủng...', resultData);

    const response = await api.post('/api/vaccinations/vaccination/result', resultData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể ghi nhận kết quả tiêm chủng');
    }
  } catch (error) {
    console.error('❌ Lỗi ghi nhận kết quả tiêm chủng:', error);

    if (error.response?.status === 400) {
      throw new Error('Dữ liệu kết quả không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền ghi nhận kết quả. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Gửi kết quả tiêm chủng cho phụ huynh
export const sendVaccinationResults = async () => {
  try {
    console.log('📧 Gửi kết quả tiêm chủng cho phụ huynh...');

    const response = await api.post('/api/vaccinations/send-vaccination-results');
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
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin để cấu hình backend.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy kết quả tiêm chủng (cho phụ huynh)
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

    const response = await api.get('/api/vaccinations/vaccine-types');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách vaccine');
    }
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