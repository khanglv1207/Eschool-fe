import api from './api';

export const updateParentProfile = async (profileData) => {
  try {
    const response = await api.put('/api/parents/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getParentProfile = async () => {
  try {
    const response = await api.get('/api/parents/profile');
    return response.data;
  } catch (error) {
    throw error;
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

// Gửi yêu cầu thuốc
export const sendMedicalRequest = async (medicalRequestData) => {
  try {
    console.log('=== GỬI YÊU CẦU THUỐC ===');
    console.log('Data being sent:', JSON.stringify(medicalRequestData, null, 2));
    console.log('Student ID:', medicalRequestData.studentId);
    
    // Thử các endpoint khác nhau
    const endpoints = [
      '/api/parents/medical-request',
      '/api/parent/medical-request'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.post(endpoint, medicalRequestData);
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