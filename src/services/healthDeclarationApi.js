import api from './api';

// Lấy danh sách khai báo sức khỏe của user hiện tại
export const getUserHealthDeclarations = async () => {
  try {
    console.log('📋 Lấy danh sách khai báo sức khỏe...');
    
    const response = await api.get('/api/health-declarations/user');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách khai báo sức khỏe');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách khai báo sức khỏe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có khai báo nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy tất cả khai báo sức khỏe (cho admin/nurse)
export const getAllHealthDeclarations = async () => {
  try {
    console.log('📋 Lấy tất cả khai báo sức khỏe...');
    
    const response = await api.get('/api/health-declarations');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error(response.data?.message || 'Không lấy được danh sách khai báo sức khỏe');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy tất cả khai báo sức khỏe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return []; // Không có khai báo nào
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Tạo khai báo sức khỏe mới
export const createHealthDeclaration = async (declarationData) => {
  try {
    console.log('📝 Tạo khai báo sức khỏe mới...', declarationData);
    
    const response = await api.post('/api/health-declarations', declarationData);
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể tạo khai báo sức khỏe');
    }
  } catch (error) {
    console.error('❌ Lỗi tạo khai báo sức khỏe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền tạo khai báo. Vui lòng liên hệ admin.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Cập nhật trạng thái khai báo sức khỏe
export const updateHealthDeclarationStatus = async (declarationId, status) => {
  try {
    console.log('📝 Cập nhật trạng thái khai báo sức khỏe...', { declarationId, status });
    
    const response = await api.put(`/api/health-declarations/${declarationId}/status`, {
      status: status
    });
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không thể cập nhật trạng thái');
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái khai báo sức khỏe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền cập nhật. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      throw new Error('Khai báo sức khỏe không tồn tại.');
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
};

// Lấy thống kê khai báo sức khỏe
export const getHealthDeclarationStats = async () => {
  try {
    console.log('📊 Lấy thống kê khai báo sức khỏe...');
    
    const response = await api.get('/api/health-declarations/stats');
    console.log('✅ Response:', response.data);
    
    if (response.data && response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || 'Không lấy được thống kê');
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thống kê khai báo sức khỏe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.');
    } else if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập. Vui lòng liên hệ admin.');
    } else if (error.response?.status === 404) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    } else {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  }
}; 