import React, { useState, useEffect } from 'react';
import { getParentMedicalRequests } from '../services/parentApi';

const ParentMedicineList = () => {
  const [medicalRequests, setMedicalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalRequests();
  }, []);

  const fetchMedicalRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getParentMedicalRequests();
      console.log('Medical requests response:', response);
      
      // Xử lý response data
      const requests = response.result || response.data || response || [];
      setMedicalRequests(Array.isArray(requests) ? requests : []);
      
    } catch (err) {
      console.error('Error fetching medical requests:', err);
      setError('Không thể tải danh sách thuốc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ xử lý', color: '#ff9800' },
      'APPROVED': { text: 'Đã duyệt', color: '#4caf50' },
      'REJECTED': { text: 'Từ chối', color: '#f44336' },
      'COMPLETED': { text: 'Hoàn thành', color: '#2196f3' },
      'IN_PROGRESS': { text: 'Đang xử lý', color: '#9c27b0' }
    };
    
    const statusInfo = statusMap[status] || { text: status || 'Không xác định', color: '#757575' };
    
    return (
      <span style={{
        backgroundColor: statusInfo.color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Đang tải danh sách thuốc...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: '20px'
      }}>
        <div style={{ color: '#f44336', fontSize: '18px' }}>{error}</div>
        <button 
          onClick={fetchMedicalRequests}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #e3f2fd',
          paddingBottom: '20px'
        }}>
          <h1 style={{ 
            color: '#1976d2', 
            margin: 0, 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            📋 Danh sách thuốc đã gửi
          </h1>
          <button 
            onClick={fetchMedicalRequests}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Làm mới
          </button>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {medicalRequests.length}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Tổng số yêu cầu</div>
          </div>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
              {medicalRequests.filter(r => r.status === 'APPROVED').length}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Đã duyệt</div>
          </div>
          <div style={{ 
            backgroundColor: '#fff3e0', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {medicalRequests.filter(r => r.status === 'PENDING').length}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Chờ xử lý</div>
          </div>
        </div>

        {/* Table */}
        {medicalRequests.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#666',
            fontSize: '18px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
            <div>Chưa có yêu cầu thuốc nào</div>
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
              Bạn có thể gửi yêu cầu thuốc mới từ menu "Gửi thuốc cho con"
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Học sinh</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Thuốc</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Ghi chú</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Ngày gửi</th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {medicalRequests.map((request, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {request.studentName || request.student?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {request.studentCode || request.student?.code || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {request.medications && Array.isArray(request.medications) ? (
                        <div>
                          {request.medications.map((med, idx) => (
                            <div key={idx} style={{ marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>
                                {med.medicineName || med.name || 'Thuốc không xác định'}
                              </span>
                              {med.dosage && (
                                <span style={{ color: '#666', fontSize: '12px' }}>
                                  {' '}- {med.dosage}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#666' }}>Không có thông tin thuốc</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ 
                        maxWidth: '200px', 
                        wordWrap: 'break-word',
                        color: '#666'
                      }}>
                        {request.note || request.description || 'Không có ghi chú'}
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      {formatDate(request.createdAt || request.createdDate || request.date)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {getStatusBadge(request.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentMedicineList; 