import api from './api';

export const healthProfileApi = {
  // Tạo hoặc cập nhật health profile
  createOrUpdateHealthProfile: async (data) => {
    try {
      // Đảm bảo dữ liệu khớp với HealthProfileRequest
      const healthProfileData = {
        allergies: data.allergies || '',
        chronicDiseases: data.chronicDiseases || '',
        medicalHistory: data.medicalHistory || '',
        eyesight: data.eyesight || '',
        hearing: data.hearing || '',
        vaccinationRecord: data.vaccinationRecord || ''
      };
      
      console.log('📤 Sending HealthProfileRequest to backend:', JSON.stringify(healthProfileData, null, 2));
      const response = await api.post('/api/parents/health-profile', healthProfileData);
      console.log('✅ Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend error:', error.response?.data);
      
      // Xử lý lỗi cụ thể từ backend
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes("Không tìm thấy phụ huynh")) {
          throw new Error("Tài khoản chưa được thiết lập phụ huynh. Vui lòng liên hệ admin để được hỗ trợ.");
        } else if (errorMessage.includes("Không tìm thấy học sinh")) {
          throw new Error("Chưa có học sinh được liên kết với tài khoản. Vui lòng liên hệ admin để được hỗ trợ.");
        } else {
          throw new Error(errorMessage);
        }
      }
      
      // Lỗi mạng hoặc server
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 403) {
        throw new Error("❌ Lỗi quyền truy cập: Tài khoản không có quyền khai báo sức khỏe. Vui lòng liên hệ admin để được cấp quyền PARENT.");
      } else if (error.response?.status === 404) {
        throw new Error("Không tìm thấy API endpoint. Vui lòng liên hệ admin.");
      } else if (error.response?.status >= 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau.");
      } else {
        throw new Error("Có lỗi xảy ra khi gửi khai báo sức khỏe.");
      }
    }
  },

  // Lấy health profile của user hiện tại
  getHealthProfile: async () => {
    try {
      const response = await api.get('/api/parents/health-profile');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Không thể tải thông tin sức khỏe.");
    }
  },

  // Lấy thông tin mới khai báo
  getLatestHealthDeclaration: async () => {
    try {
      console.log('📋 Lấy thông tin khai báo mới nhất từ database...');
      const response = await api.get('/api/parents/health-declaration/latest');
      console.log('✅ Latest declaration response:', response.data);
      
      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || 'Không lấy được thông tin khai báo mới nhất');
      }
    } catch (error) {
      console.error('❌ Lỗi lấy thông tin khai báo mới nhất:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        throw new Error('❌ Lỗi quyền truy cập: Tài khoản không có quyền xem thông tin khai báo.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin.');
      } else {
        throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
    }
  },

  // Lấy danh sách khai báo sức khỏe từ database
  getHealthDeclarations: async () => {
    try {
      console.log('📋 Lấy danh sách khai báo sức khỏe từ database...');
      // Tạm thời sử dụng endpoint có sẵn
      const response = await api.get('/api/parents/health-declaration/latest');
      console.log('✅ Response:', response.data);
      
      if (response.data && response.data.code === 1000) {
        // Nếu có dữ liệu, trả về array với 1 item
        const result = response.data.result;
        return result ? [result] : [];
      } else {
        throw new Error(response.data?.message || 'Không lấy được danh sách khai báo');
      }
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách khai báo:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        throw new Error('❌ Lỗi quyền truy cập: Tài khoản không có quyền xem danh sách khai báo.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin.');
      } else {
        throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
    }
  }
};

export default healthProfileApi; 