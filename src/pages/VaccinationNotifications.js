import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaSyringe, FaCalendarAlt, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getVaccinationNotifications, confirmVaccination } from '../services/vaccinationApi';

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

function VaccinationNotifications() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getVaccinationNotifications();
      setNotifications(data);
      console.log('📋 Vaccination notifications loaded:', data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo tiêm chủng:', error);
      setMessage('❌ Lỗi tải thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (notification, parentNote = 'Phụ huynh xác nhận tiêm chủng') => {
    try {
      // Debug: Kiểm tra JWT token
      const token = localStorage.getItem('access_token');
      console.log('🔐 JWT Token:', token);
      console.log('🔐 Token exists:', !!token);
      console.log('🔐 Token length:', token?.length);
      
      // Debug: Kiểm tra notification object
      console.log('📋 Full notification object:', notification);
      console.log('📋 Notification keys:', Object.keys(notification));
      console.log('📋 Has confirmationId:', 'confirmationId' in notification);
      console.log('📋 confirmationId value:', notification.confirmationId);
      console.log('📋 Has confirmation_id:', 'confirmation_id' in notification);
      console.log('📋 confirmation_id value:', notification.confirmation_id);
      console.log('📋 Has id:', 'id' in notification);
      console.log('📋 id value:', notification.id);
      
      setProcessingId(`notification-${notification.confirmationId || 'temp'}`);
      setMessage('');
      
      // Luôn sử dụng confirmationId từ backend
      let confirmationId = notification.confirmationId || generateUUID();
      
      // Đảm bảo confirmationId là UUID format hợp lệ
      if (typeof confirmationId === 'string' && confirmationId.includes('-')) {
        // Đã là UUID format
        confirmationId = confirmationId;
      } else {
        // Chuyển đổi thành UUID format
        confirmationId = generateUUID();
      }
      
      // Chỉ gửi đúng 3 field theo VaccinationConfirmationRequest DTO
      const confirmationData = {
        confirmationId: confirmationId,
        status: 'ACCEPTED', // Backend yêu cầu ACCEPTED thay vì CONFIRMED
        parentNote: parentNote
      };

      console.log('✅ Sending confirmation data:', confirmationData);
      console.log('✅ Notification object:', notification);
      console.log('✅ ConfirmationId type:', typeof confirmationId);
      console.log('✅ ConfirmationId value:', confirmationId);
      
      const response = await confirmVaccination(confirmationData);
      
      console.log('✅ Confirmation response:', response);
      
      setMessage('✅ Xác nhận tiêm chủng thành công!');
      
      // Reload notifications after successful confirmation
      setTimeout(() => {
        loadNotifications();
        setMessage('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Lỗi xác nhận tiêm chủng:', error);
      setMessage('❌ Lỗi xác nhận: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (notification, parentNote = 'Phụ huynh từ chối tiêm chủng') => {
    try {
      setProcessingId(`notification-${notification.confirmationId || 'temp'}`);
      setMessage('');
      
      // Luôn sử dụng confirmationId từ backend
      let confirmationId = notification.confirmationId || generateUUID();
      
      // Đảm bảo confirmationId là UUID format hợp lệ
      if (typeof confirmationId === 'string' && confirmationId.includes('-')) {
        // Đã là UUID format
        confirmationId = confirmationId;
      } else {
        // Chuyển đổi thành UUID format
        confirmationId = generateUUID();
      }
      
      const rejectionData = {
        confirmationId: confirmationId, // Sử dụng ID thật từ notification nếu có
        status: 'DECLINED', // Backend yêu cầu DECLINED thay vì REJECTED
        parentNote: parentNote
      };

      console.log('❌ Sending rejection data:', rejectionData);
      console.log('❌ ConfirmationId type:', typeof confirmationId);
      console.log('❌ ConfirmationId value:', confirmationId);
      
      const response = await confirmVaccination(rejectionData);
      
      console.log('✅ Rejection response:', response);
      
      setMessage('✅ Đã từ chối tiêm chủng thành công!');
      
      // Reload notifications after successful rejection
      setTimeout(() => {
        loadNotifications();
        setMessage('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Lỗi từ chối tiêm chủng:', error);
      setMessage('❌ Lỗi từ chối: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Các function này có thể được sử dụng sau này
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'PENDING': return '#ffc107';
  //     case 'CONFIRMED': return '#28a745';
  //     case 'REJECTED': return '#dc3545';
  //     case 'COMPLETED': return '#17a2b8';
  //     default: return '#6c757d';
  //   }
  // };

  // const getStatusText = (status) => {
  //   switch (status) {
  //     case 'PENDING': return 'Chờ xác nhận';
  //     case 'CONFIRMED': return 'Đã xác nhận';
  //     case 'REJECTED': return 'Đã từ chối';
  //     case 'COMPLETED': return 'Đã hoàn thành';
  //     default: return 'Không xác định';
  //   }
  // };

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case 'PENDING': return <FaExclamationTriangle />;
  //     case 'CONFIRMED': return <FaCheckCircle />;
  //     case 'REJECTED': return <FaTimesCircle />;
  //     case 'COMPLETED': return <FaCheckCircle />;
  //     default: return <FaBell />;
  //   }
  // };

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
            Đang tải thông báo tiêm chủng...
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
        maxWidth: '1200px',
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
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <FaBell style={{ fontSize: '32px' }} />
            Thông báo tiêm chủng
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.9
          }}>
            Danh sách thông báo tiêm chủng cho con của bạn
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
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
              border: `2px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {message}
            </div>
          )}

          {/* Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {notifications.length}
              </div>
              <div style={{ fontSize: '14px' }}>Tổng thông báo</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(40, 167, 69, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {notifications.filter(n => n.vaccineName).length}
              </div>
              <div style={{ fontSize: '14px' }}>Có thông tin vaccine</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {notifications.filter(n => n.scheduledDate).length}
              </div>
              <div style={{ fontSize: '14px' }}>Có lịch tiêm</div>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(0,0,0,0.1)'
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
                <FaBell style={{ color: '#667eea' }} />
                Danh sách thông báo ({notifications.length})
              </h3>

              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {notifications.map((notification, index) => (
                  <div key={index} style={{
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                  }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      {/* Vaccine Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaSyringe style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {notification.vaccineName || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Loại vaccine
                          </div>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaCalendarAlt style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {notification.location || 'Trường học'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Địa điểm tiêm
                          </div>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaCalendarAlt style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {notification.scheduledDate ? new Date(notification.scheduledDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Ngày tiêm dự kiến
                          </div>
                        </div>
                      </div>
                    </div>

                    {notification.note && (
                      <div style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#495057',
                        marginBottom: '15px'
                      }}>
                        <strong>Ghi chú:</strong> {notification.note}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => navigate(`/vaccination-confirmation/notification-${index}`)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaEye />
                        Xem chi tiết
                      </button>

                      <button
                        onClick={() => handleConfirm(notification)}
                        disabled={processingId === `notification-${notification.confirmationId || 'temp'}`}
                        style={{
                          background: processingId === `notification-${notification.confirmationId || 'temp'}`
                            ? '#ccc' 
                            : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: processingId === `notification-${notification.confirmationId || 'temp'}` ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          opacity: processingId === `notification-${notification.confirmationId || 'temp'}` ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (processingId !== `notification-${notification.confirmationId || 'temp'}`) {
                            e.target.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (processingId !== `notification-${notification.confirmationId || 'temp'}`) {
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <FaCheckCircle />
                        {processingId === `notification-${notification.confirmationId || 'temp'}` ? 'Đang xác nhận...' : 'Xác nhận'}
                      </button>

                      <button
                        onClick={() => handleReject(notification)}
                        disabled={processingId === `notification-${notification.confirmationId || 'temp'}`}
                        style={{
                          background: processingId === `notification-${notification.confirmationId || 'temp'}`
                            ? '#ccc' 
                            : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: processingId === `notification-${notification.confirmationId || 'temp'}` ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          opacity: processingId === `notification-${notification.confirmationId || 'temp'}` ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (processingId !== `notification-${notification.confirmationId || 'temp'}`) {
                            e.target.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (processingId !== `notification-${notification.confirmationId || 'temp'}`) {
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <FaTimesCircle />
                        {processingId === `notification-${notification.confirmationId || 'temp'}` ? 'Đang từ chối...' : 'Từ chối'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '15px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
              <h3 style={{ color: '#495057', marginBottom: '10px' }}>
                Chưa có thông báo tiêm chủng
              </h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Hiện tại chưa có thông báo tiêm chủng nào cho con của bạn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VaccinationNotifications; 