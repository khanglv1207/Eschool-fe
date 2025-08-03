import React, { useState, useEffect } from 'react';
import { FaPills, FaFilter, FaEye, FaCheck, FaTimes, FaSync, FaDownload } from 'react-icons/fa';
import { getMedicineRequests, updateMedicineStatus, getParentMedicineRequests, getPendingMedicationRequests } from '../../services/medicineApi';

function MedicineListManagement() {
  const [medicineRequests, setMedicineRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  
  // Kiểm tra role để hiển thị khác nhau
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === 'ADMIN';
  const isNurse = user.role === 'NURSE';
  const isParent = user.role === 'PARENT';

  useEffect(() => {
    loadMedicineRequests();
  }, []);

  const loadMedicineRequests = async () => {
    try {
      setLoading(true);
      let requests;
      
      if (isParent) {
        // Phụ huynh chỉ thấy yêu cầu của mình
        requests = await getParentMedicineRequests();
      } else if (isNurse) {
        // Y tá thấy đơn thuốc chờ duyệt
        requests = await getPendingMedicationRequests();
      } else {
        // Admin thấy tất cả yêu cầu
        requests = await getMedicineRequests();
      }
      
      // Transform API response to match component expectations
      const transformedRequests = requests.map(request => ({
        id: request.requestId || request.id,
        studentName: request.studentName || 'Không có tên học sinh',
        studentCode: request.studentCode || 'N/A',
        className: request.className || 'N/A',
        medicineName: request.medicineName || 'Thuốc chưa được chỉ định',
        dosage: request.dosage || 'N/A',
        frequency: request.frequency || 'N/A',
        note: request.note || '',
        parentName: request.parentName || 'Không có tên phụ huynh',
        parentPhone: request.parentPhone || 'N/A',
        status: request.status || 'PENDING',
        createdAt: request.requestDate || request.createdAt || new Date().toISOString()
      }));
      
      setMedicineRequests(transformedRequests);
      console.log('📋 Medicine requests loaded:', transformedRequests);
    } catch (error) {
      console.error('❌ Lỗi tải danh sách thuốc:', error);
      setMessage('❌ Lỗi tải danh sách thuốc: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setLoading(true);
      await updateMedicineStatus(requestId, newStatus);
      setMessage(`✅ Đã cập nhật trạng thái thành ${newStatus === 'APPROVED' ? 'duyệt' : 'từ chối'}`);
      loadMedicineRequests(); // Reload data
    } catch (error) {
      console.error('❌ Lỗi cập nhật trạng thái:', error);
      setMessage('❌ Lỗi cập nhật trạng thái: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = medicineRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = searchTerm === '' || 
      request.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicineName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status) => {
    return medicineRequests.filter(req => req.status === status).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'APPROVED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Đã từ chối';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ color: '#667eea', fontSize: '18px', fontWeight: '600' }}>
            Đang tải danh sách thuốc...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '25px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '40px 30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
          
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <FaPills style={{ marginRight: '15px', fontSize: '32px' }} />
            {isParent ? 'Danh sách thuốc đã gửi' : 'Quản lý yêu cầu thuốc'}
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.9,
            position: 'relative',
            zIndex: 1
          }}>
            {isParent 
              ? 'Xem danh sách yêu cầu thuốc của bạn'
              : 'Quản lý tất cả yêu cầu thuốc từ phụ huynh'
            }
          </div>
          
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `}</style>
        </div>

        {/* Content */}
        <div style={{ padding: '50px' }}>
          {message && (
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              color: message.includes("✅") ? '#155724' : '#721c24',
              background: message.includes("✅") ? '#d4edda' : '#f8d7da',
              border: `2px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`,
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              {message}
            </div>
          )}

          {/* Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 15px 30px rgba(102, 126, 234, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.3)';
            }}
            >
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                {medicineRequests.length}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>
                {isParent ? 'Yêu cầu của bạn' : 'Tổng số yêu cầu'}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: '#fff',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 15px 30px rgba(76, 175, 80, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 20px 40px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 30px rgba(76, 175, 80, 0.3)';
            }}
            >
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                {getStatusCount('APPROVED')}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>
                Đã duyệt
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: '#fff',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 15px 30px rgba(255, 152, 0, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 20px 40px rgba(255, 152, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 30px rgba(255, 152, 0, 0.3)';
            }}
            >
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                {getStatusCount('PENDING')}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>
                Chờ xử lý
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              color: '#fff',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 15px 30px rgba(244, 67, 54, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 20px 40px rgba(244, 67, 54, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 30px rgba(244, 67, 54, 0.3)';
            }}
            >
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                {getStatusCount('REJECTED')}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9 }}>
                Đã từ chối
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '30px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: '#fff',
                padding: '12px 18px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <FaFilter style={{ color: '#667eea', fontSize: '16px' }} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    cursor: 'pointer',
                    background: '#fff',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">Tất cả</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="REJECTED">Đã từ chối</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm theo tên học sinh, phụ huynh hoặc tên thuốc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                />
              </div>

              <button
                onClick={loadMedicineRequests}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 25px',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading ? 0.6 : 1,
                  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                <FaSync />
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
          </div>

          {/* Medicine Requests Table */}
          {filteredRequests.length > 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                color: '#495057', 
                marginBottom: '25px',
                fontSize: '20px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaPills style={{ color: '#667eea' }} />
                Danh sách yêu cầu thuốc ({filteredRequests.length} kết quả)
              </h3>

              <div style={{ 
                overflowX: 'auto',
                background: '#fff',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff'
                    }}>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        👤 Thông tin học sinh
                      </th>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        💊 Thông tin thuốc
                      </th>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        👨‍👩‍👧‍👦 Phụ huynh
                      </th>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        📅 Ngày gửi
                      </th>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'left', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        📊 Trạng thái
                      </th>
                      <th style={{ 
                        padding: '18px 15px', 
                        textAlign: 'center', 
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}>
                        ⚙️ Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={index} style={{
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        background: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f0f8ff';
                        e.target.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = index % 2 === 0 ? '#fff' : '#f8f9fa';
                        e.target.style.transform = 'scale(1)';
                      }}
                      >
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontWeight: '700', color: '#495057', fontSize: '15px' }}>
                            👤 {request.studentName || 'Không có tên'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                            🆔 Mã: {request.studentCode || 'N/A'} | 🏫 Lớp: {request.className || 'N/A'}
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontWeight: '700', color: '#495057', fontSize: '15px' }}>
                            💊 {request.medicineName || 'Không có tên thuốc'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                            📏 {request.dosage || 'N/A'} | ⏰ {request.frequency || 'N/A'}
                          </div>
                          {request.note && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#856404', 
                              fontStyle: 'italic',
                              marginTop: '6px',
                              padding: '4px 8px',
                              background: '#fff3cd',
                              borderRadius: '4px',
                              border: '1px solid #ffeaa7'
                            }}>
                              📝 {request.note}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontWeight: '700', color: '#495057', fontSize: '15px' }}>
                            👨‍👩‍👧‍👦 {request.parentName || 'Không có tên'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                            📞 {request.parentPhone || 'Không có SĐT'}
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600' }}>
                            📅 {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6c757d',
                            marginTop: '4px',
                            padding: '2px 6px',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            🕐 {new Date(request.createdAt).toLocaleTimeString('vi-VN')}
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            background: getStatusColor(request.status),
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '25px',
                            fontSize: '12px',
                            fontWeight: '600',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                          }}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {request.status === 'PENDING' && (isAdmin || isNurse) && (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                disabled={loading}
                                style={{
                                  background: '#28a745',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <FaCheck />
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                disabled={loading}
                                style={{
                                  background: '#dc3545',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <FaTimes />
                                Từ chối
                              </button>
                            </div>
                          )}
                          {request.status === 'PENDING' && isParent && (
                            <span style={{ fontSize: '12px', color: '#ffc107', fontWeight: '600' }}>
                              Chờ xử lý
                            </span>
                          )}
                          {request.status !== 'PENDING' && (
                            <span style={{ fontSize: '12px', color: '#6c757d' }}>
                              {request.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
              <h3 style={{ color: '#495057', marginBottom: '10px' }}>
                Chưa có yêu cầu thuốc nào
              </h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                {filteredRequests.length === 0 && medicineRequests.length > 0 
                  ? 'Không có yêu cầu nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có yêu cầu thuốc nào được gửi từ phụ huynh.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicineListManagement; 