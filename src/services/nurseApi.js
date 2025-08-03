import api from './api';

export const nurseApi = {
  // Lấy thông tin nurse hiện tại (dựa trên user đang đăng nhập)
  getCurrentNurse: async () => {
    try {
      console.log('🔍 Đang gọi API /api/nurse/get-all-nurse...');
      const response = await api.get('/api/nurse/get-all-nurse');
      console.log('👩‍⚕️ All nurses from API:', response.data);
      
      const nurses = response.data.result || [];
      console.log('📋 Số lượng nurses:', nurses.length);
      console.log('📋 Nurses data:', nurses);
      
      if (nurses.length > 0) {
        const selectedNurse = nurses[0];
        console.log('✅ Chọn nurse đầu tiên:', selectedNurse);
        return selectedNurse; // Trả về nurse đầu tiên
      } else {
        throw new Error('Không có nurse nào trong hệ thống');
      }
    } catch (error) {
      console.error('❌ Error fetching nurse info:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw new Error('Không thể lấy thông tin nurse');
    }
  },

  // Lấy danh sách tất cả nurses
  getAllNurses: async () => {
    try {
      const response = await api.get('/api/nurse/get-all-nurse');
      return response.data.result || [];
    } catch (error) {
      console.error('❌ Error fetching nurses:', error.response?.data);
      throw new Error('Không thể lấy danh sách nurses');
    }
  },

  // Lấy nurse theo ID
  getNurseById: async (nurseId) => {
    try {
      // Tạm thời lấy tất cả và filter theo ID
      const response = await api.get('/api/nurse/get-all-nurse');
      const nurses = response.data.result || [];
      const nurse = nurses.find(n => n.nurseId === nurseId || n.id === nurseId);
      
      if (nurse) {
        return nurse;
      } else {
        throw new Error('Không tìm thấy nurse với ID này');
      }
    } catch (error) {
      console.error('❌ Error fetching nurse by ID:', error.response?.data);
      throw new Error('Không thể lấy thông tin nurse');
    }
  }
};

export default nurseApi; 