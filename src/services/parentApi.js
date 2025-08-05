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

// Lấy danh sách học sinh của parent
export const getParentStudents = async () => {
  try {
    console.log('Calling getParentStudents API...');
    
    // Lấy thông tin user hiện tại
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userEmail = loggedInUser.email;
    
    console.log('Current user email:', userEmail);
    
    // Thử các endpoint khác nhau
    const endpoints = [
      '/api/parents/students',
      '/api/parent/students', 
      '/api/parents/children',
      '/api/parent/children',
      `/api/parents/students?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/students?email=${encodeURIComponent(userEmail)}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`Success with ${endpoint}:`, response);
        return response.data;
      } catch (err) {
        console.log(`Failed with ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    
    console.log('No API endpoint found, returning empty result');
    return { result: [] };
    
    // Nếu tất cả đều fail, trả về empty
    return { result: [] };
  } catch (error) {
    console.error('Failed to get students:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return { result: [] };
  }
};

// Tìm kiếm học sinh theo student code
export const searchStudentByCode = async (studentCode) => {
  try {
    console.log('=== TÌM KIẾM HỌC SINH THEO CODE ===');
    console.log('Student Code:', studentCode);
    
    // Thử các endpoint khác nhau để tìm kiếm học sinh
    const endpoints = [
      `/api/parents/students/search?studentCode=${encodeURIComponent(studentCode)}`,
      `/api/parent/students/search?studentCode=${encodeURIComponent(studentCode)}`,
      `/api/students/search?studentCode=${encodeURIComponent(studentCode)}`,
      `/api/parents/students?studentCode=${encodeURIComponent(studentCode)}`,
      `/api/parent/students?studentCode=${encodeURIComponent(studentCode)}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying search endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Success with search endpoint ${endpoint}:`, response);
        return response.data;
      } catch (err) {
        console.log(`❌ Failed with search endpoint ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    
    throw new Error('Không tìm thấy học sinh với mã số này');
  } catch (error) {
    console.error('❌ Error searching student by code:', error);
    throw error;
  }
};

// Gửi yêu cầu thuốc (cập nhật để hỗ trợ student code)
export const sendMedicalRequest = async (medicalRequestData) => {
  try {
    console.log('=== GỬI YÊU CẦU THUỐC ===');
    console.log('Data being sent:', JSON.stringify(medicalRequestData, null, 2));
    console.log('Student ID:', medicalRequestData.studentId);
    console.log('Student Code:', medicalRequestData.studentCode);
    
         // Sử dụng dữ liệu gốc, không tự động chuyển đổi
     let requestData = { ...medicalRequestData };
     
     // Log để debug
            console.log('📋 StudentId (using UUID):', {
         studentId: medicalRequestData.studentId,
         studentCode: medicalRequestData.studentCode,
         isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(medicalRequestData.studentId),
         type: typeof medicalRequestData.studentId
       });
    
    console.log('Final request data:', JSON.stringify(requestData, null, 2));
    
    // Thử các endpoint khác nhau
    const endpoints = [
      '/api/parents/medical-request',
      '/api/parent/medical-request'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.post(endpoint, requestData);
        console.log(`✅ Success with ${endpoint}:`, response);
        return response.data;
      } catch (err) {
        console.log(`❌ Failed with ${endpoint}:`, err.response?.status);
        console.log('Error details:', err.response?.data);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    
    throw new Error('No valid endpoint found');
  } catch (error) {
    console.error('❌ Error sending medical request:', error);
    throw error;
  }
};

// Lấy lịch uống thuốc của con
export const getSchedulesForParent = async () => {
  try {
    const response = await api.get('/api/parents/schedules');
    return response.data;
  } catch (error) {
    console.error('Error getting schedules:', error);
    throw error;
  }
};

// Lấy dữ liệu trực tiếp từ bảng parents_students
export const getParentStudentsFromDB = async () => {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userEmail = loggedInUser.email;
    
    console.log('Getting students from DB for email:', userEmail);
    
    // Thử các endpoint khác nhau để lấy dữ liệu từ bảng parents_students
    const endpoints = [
      `/api/parents/students-by-email?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/students-by-email?email=${encodeURIComponent(userEmail)}`,
      `/api/parents/students?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/students?email=${encodeURIComponent(userEmail)}`,
      `/api/parents/children?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/children?email=${encodeURIComponent(userEmail)}`,
      `/api/parents/students`,
      `/api/parent/students`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying DB endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`Success with DB endpoint ${endpoint}:`, response);
        return response.data;
      } catch (err) {
        console.log(`Failed with DB endpoint ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    
    console.log('All DB endpoints failed');
    throw new Error('No valid endpoint found');
    
    throw new Error('No valid endpoint found and no mock data available');
  } catch (error) {
    console.error('Error getting students from DB:', error);
    throw error;
  }
}; 

// Lấy danh sách thuốc phụ huynh đã gửi
export const getParentMedicalRequests = async () => {
  try {
    console.log('=== LẤY DANH SÁCH THUỐC PHỤ HUYNH ĐÃ GỬI ===');
    
    // Lấy thông tin user hiện tại
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userEmail = loggedInUser.email;
    
    console.log('Current user email:', userEmail);
    
    // Thử các endpoint khác nhau
    const endpoints = [
      '/api/parents/medical-requests',
      '/api/parent/medical-requests',
      `/api/parents/medical-requests?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/medical-requests?email=${encodeURIComponent(userEmail)}`,
      '/api/parents/medicine-requests',
      '/api/parent/medicine-requests',
      `/api/parents/medicine-requests?email=${encodeURIComponent(userEmail)}`,
      `/api/parent/medicine-requests?email=${encodeURIComponent(userEmail)}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Success with ${endpoint}:`, response);
        return response.data;
      } catch (err) {
        console.log(`❌ Failed with ${endpoint}:`, err.response?.status);
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    
    console.log('No API endpoint found, returning empty result');
    return { result: [] };
  } catch (error) {
    console.error('❌ Error getting medical requests:', error);
    return { result: [] };
  }
}; 