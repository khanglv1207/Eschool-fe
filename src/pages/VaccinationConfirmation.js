import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaUser, FaSyringe, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { confirmVaccination, getVaccinationNotification } from '../services/vaccinationApi';

function VaccinationConfirmation() {
  const { confirmationId } = useParams();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [decision, setDecision] = useState(''); // 'confirm' or 'reject'
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadNotification();
  }, [confirmationId]);

  const loadNotification = async () => {
    try {
      setLoading(true);
      const data = await getVaccinationNotification(confirmationId);
      setNotification(data);
      console.log('📋 Vaccination notification loaded:', data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo tiêm chủng:', error);
      setMessage('❌ Lỗi tải thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do xác nhận!');
      return;
    }

    try {
      setSubmitting(true);
      setDecision('confirm');
      
      const confirmationData = {
        confirmationId: confirmationId,
        decision: 'CONFIRMED',
        reason: reason,
        confirmedAt: new Date().toISOString()
      };

      console.log('✅ Sending confirmation data:', confirmationData);
      
      const response = await confirmVaccination(confirmationData);
      
      console.log('✅ Confirmation response:', response);
      
      setMessage('✅ Xác nhận tiêm chủng thành công!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Lỗi xác nhận tiêm chủng:', error);
      setMessage('❌ Lỗi xác nhận: ' + error.message);
      setDecision('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }

    try {
      setSubmitting(true);
      setDecision('reject');
      
      const rejectionData = {
        confirmationId: confirmationId,
        decision: 'REJECTED',
        reason: reason,
        rejectedAt: new Date().toISOString()
      };

      console.log('❌ Sending rejection data:', rejectionData);
      
      const response = await confirmVaccination(rejectionData);
      
      console.log('✅ Rejection response:', response);
      
      setMessage('✅ Đã từ chối tiêm chủng thành công!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Lỗi từ chối tiêm chủng:', error);
      setMessage('❌ Lỗi từ chối: ' + error.message);
      setDecision('');
    } finally {
      setSubmitting(false);
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

  if (!notification) {
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
          maxWidth: '500px',
          width: '90%'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#495057', marginBottom: '15px' }}>
            Thông báo không tồn tại
          </h2>
          <p style={{ color: '#6c757d', marginBottom: '25px' }}>
            Thông báo tiêm chủng này không tồn tại hoặc đã hết hạn.
          </p>
          <button
            onClick={() => navigate('/parent-dashboard')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Quay về trang chủ
          </button>
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
        maxWidth: '800px',
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
            <FaSyringe style={{ fontSize: '32px' }} />
            Thông báo tiêm chủng
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.9
          }}>
            Vui lòng xác nhận hoặc từ chối thông báo tiêm chủng cho con của bạn
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

          {/* Notification Details */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
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
              <FaInfoCircle style={{ color: '#667eea' }} />
              Thông tin tiêm chủng
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* Student Information */}
              <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ 
                  color: '#495057', 
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaUser style={{ color: '#667eea' }} />
                  Thông tin học sinh
                </h4>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Tên học sinh:</strong> {notification.studentName || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Mã học sinh:</strong> {notification.studentCode || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Lớp:</strong> {notification.className || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Vaccination Information */}
              <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ 
                  color: '#495057', 
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaSyringe style={{ color: '#667eea' }} />
                  Thông tin vaccine
                </h4>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Loại vaccine:</strong> {notification.vaccineName || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Ngày tiêm:</strong> {notification.vaccinationDate ? new Date(notification.vaccinationDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Địa điểm:</strong> {notification.location || 'Trường học'}
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ 
                  color: '#495057', 
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCalendarAlt style={{ color: '#667eea' }} />
                  Lịch tiêm chủng
                </h4>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Thời gian:</strong> {notification.scheduledTime || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Ghi chú:</strong> {notification.notes || 'Không có'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Form */}
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
              <FaExclamationTriangle style={{ color: '#ffc107' }} />
              Quyết định của phụ huynh
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#495057', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                Lý do {decision === 'confirm' ? 'xác nhận' : decision === 'reject' ? 'từ chối' : 'quyết định'}:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={decision === 'confirm' ? 'Nhập lý do xác nhận tiêm chủng...' : decision === 'reject' ? 'Nhập lý do từ chối tiêm chủng...' : 'Nhập lý do quyết định...'}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '2px solid #e9ecef',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleConfirm}
                disabled={submitting || decision === 'reject'}
                style={{
                  background: decision === 'confirm' 
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                    : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: submitting || decision === 'reject' ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: submitting || decision === 'reject' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!submitting && decision !== 'reject') {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && decision !== 'reject') {
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <FaCheckCircle />
                {submitting && decision === 'confirm' ? 'Đang xác nhận...' : 'Xác nhận tiêm chủng'}
              </button>

              <button
                onClick={handleReject}
                disabled={submitting || decision === 'confirm'}
                style={{
                  background: decision === 'reject'
                    ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                    : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: submitting || decision === 'confirm' ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: submitting || decision === 'confirm' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!submitting && decision !== 'confirm') {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && decision !== 'confirm') {
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <FaTimesCircle />
                {submitting && decision === 'reject' ? 'Đang từ chối...' : 'Từ chối tiêm chủng'}
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              <p>⚠️ Vui lòng cân nhắc kỹ trước khi đưa ra quyết định.</p>
              <p>Thông tin này sẽ được gửi đến nhà trường để xử lý.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationConfirmation; 