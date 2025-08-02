import api from './api';

export const healthProfileApi = {
  // Tạo hoặc cập nhật health profile
  createOrUpdateHealthProfile: async (data) => {
    try {
      console.log('📤 Sending data to backend:', JSON.stringify(data, null, 2));
      const response = await api.post('/api/parents/health-profile', data);
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
      const response = await api.get('/health-declaration/latest');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Không thể tải thông tin khai báo mới nhất.");
    }
  }
};

export default healthProfileApi; 