import api from './api';

export const updateParentProfile = async (profileData) => {
  try {
    const response = await api.put('/api/parents/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin parent profile
export const getParentProfile = async () => {
  try {
    console.log('📋 Lấy thông tin parent profile...');
    console.log('🔗 API endpoint: /api/parents/parent-profile');
    
    const response = await api.get('/api/parents/parent-profile');
    console.log('✅ Response:', response.data);
    console.log('📊 Response structure:', {
      code: response.data?.code,
      message: response.data?.message,
      result: response.data?.result
    });
    
    if (response.data && response.data.code === 1000) {
      console.log('✅ API call thành công, trả về data:', response.data.result);
      return response.data.result;
    } else {
      console.error('❌ API response không đúng format:', response.data);
      throw new Error(response.data?.message || 'Không lấy được thông tin parent profile');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy parent profile:', error);
    
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

// Lấy danh sách học sinh của phụ huynh
export const getParentStudents = async () => {
  try {
    console.log('📋 Lấy danh sách học sinh của phụ huynh...');
    const response = await api.get('/api/parents/students');
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

// Lấy danh sách con em của phụ huynh
export const getParentChildren = async () => {
  try {
    console.log('📋 Lấy danh sách con em của phụ huynh...');
    const response = await api.get('/api/parents/children');
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách con em');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách con em:', error);
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

// Lấy danh sách học sinh theo email
export const getStudentsByEmail = async (userEmail) => {
  try {
    console.log('📋 Lấy danh sách học sinh theo email:', userEmail);
    const response = await api.get(`/api/parents/students?email=${encodeURIComponent(userEmail)}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách học sinh');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách học sinh theo email:', error);
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

// Tìm kiếm học sinh theo mã học sinh
export const searchStudentByCode = async (studentCode) => {
  try {
    console.log('📋 Tìm kiếm học sinh theo mã:', studentCode);
    const response = await api.get(`/api/parents/students/search?studentCode=${encodeURIComponent(studentCode)}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || null;
    } else {
      throw new Error(response.data?.message || 'Không tìm thấy học sinh');
    }
  } catch (error) {
    console.error('❌ Lỗi tìm kiếm học sinh:', error);
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

// Lấy thông tin học sinh theo mã học sinh
export const getStudentByCode = async (studentCode) => {
  try {
    console.log('📋 Lấy thông tin học sinh theo mã:', studentCode);
    const response = await api.get(`/api/parents/students?studentCode=${encodeURIComponent(studentCode)}`);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || null;
    } else {
      throw new Error(response.data?.message || 'Không tìm thấy học sinh');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin học sinh:', error);
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

// Tạo yêu cầu y tế
export const createMedicalRequest = async (requestData) => {
  try {
    console.log('📋 Tạo yêu cầu y tế...', requestData);
    const response = await api.post('/api/parents/medical-request', requestData);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo yêu cầu y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo yêu cầu y tế:', error);
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

// Lấy danh sách yêu cầu y tế của phụ huynh
export const getParentMedicalRequests = async (userEmail = null) => {
  try {
    console.log('📋 Lấy danh sách yêu cầu y tế của phụ huynh...');
    let url = '/api/parents/medical-requests';
    if (userEmail) {
      url += `?email=${encodeURIComponent(userEmail)}`;
    }
    const response = await api.get(url);
    console.log('✅ Response:', response.data);

    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách yêu cầu y tế');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách yêu cầu y tế:', error);
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

// Lấy danh sách yêu cầu thuốc của phụ huynh
export const getParentMedicineRequests = async (userEmail = null) => {
  try {
    console.log('📋 Lấy danh sách yêu cầu thuốc của phụ huynh...');
    let url = '/api/parents/medicine-requests';
    if (userEmail) {
      url += `?email=${encodeURIComponent(userEmail)}`;
    }
    const response = await api.get(url);
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
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy thông tin học sinh theo email (cải tiến)
export const getStudentsByEmailImproved = async (userEmail) => {
  try {
    console.log('📋 Lấy thông tin học sinh theo email (cải tiến):', userEmail);
    
    // Thử các endpoint khác nhau
    const endpoints = [
      `/api/parents/students-by-email?email=${encodeURIComponent(userEmail)}`,
      `/api/parents/students?email=${encodeURIComponent(userEmail)}`,
      `/api/parents/children?email=${encodeURIComponent(userEmail)}`,
      '/api/parents/students'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Thử endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log('✅ Response:', response.data);

        if (response.data && response.data.code === 1000) {
          return response.data.result || [];
        }
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} không hoạt động:`, endpointError.message);
        continue;
      }
    }

    throw new Error('Không thể lấy thông tin học sinh từ bất kỳ endpoint nào');
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin học sinh:', error);
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