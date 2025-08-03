import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaSyringe } from 'react-icons/fa';
import { confirmVaccination, rejectVaccination, getVaccinationNotification } from '../services/vaccinationApi';

function VaccinationConfirmation() {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationId, setConfirmationId] = useState('');

  useEffect(() => {
    // Lấy confirmationId từ URL params
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setConfirmationId(id);

    if (id) {
      loadNotification(id);
    } else {
      setLoading(false);
      setMessage('❌ Không tìm thấy thông báo tiêm chủng');
    }
  }, []);

  const loadNotification = async (id) => {
    try {
      setLoading(true);
      const data = await getVaccinationNotification(id);
      setNotification(data);
      console.log('📋 Thông báo tiêm chủng:', data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo:', error);
      setMessage('❌ Không thể tải thông tin thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await confirmVaccination({
        confirmationId: confirmationId,
        status: 'CONFIRMED',
        note: 'Phụ huynh đồng ý cho con tiêm chủng'
      });
      setMessage('✅ Đã xác nhận đồng ý tiêm chủng!');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (error) {
      console.error('❌ Lỗi xác nhận:', error);
      setMessage('❌ Lỗi xác nhận: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setSubmitting(true);
      await rejectVaccination({
        confirmationId: confirmationId,
        status: 'REJECTED',
        note: 'Phụ huynh từ chối tiêm chủng'
      });
      setMessage('❌ Đã từ chối tiêm chủng');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (error) {
      console.error('❌ Lỗi từ chối:', error);
      setMessage('❌ Lỗi từ chối: ' + error.message);
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Không tìm thấy thông báo</h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            {message || 'Thông báo tiêm chủng không tồn tại hoặc đã hết hạn.'}
          </p>
          <button
            onClick={() => window.location.href = '/profile'}
            style={{
              background: '#667eea',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Về trang chủ
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
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            <FaEnvelope style={{ marginRight: '10px' }} />
            Xác nhận tiêm chủng
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Vui lòng xác nhận đồng ý hoặc từ chối tiêm chủng cho con của bạn
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          {message && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600',
              color: message.includes("✅") ? '#155724' : '#721c24',
              background: message.includes("✅") ? '#d4edda' : '#f8d7da',
              border: `1px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {message}
            </div>
          )}

          {/* Notification Details */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ color: '#495057', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <FaSyringe style={{ marginRight: '10px', color: '#667eea' }} />
              Thông tin tiêm chủng
            </h3>

            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaSyringe style={{ marginRight: '10px', color: '#667eea', width: '20px' }} />
                <span style={{ fontWeight: '600', color: '#495057' }}>Loại vaccine:</span>
                <span style={{ marginLeft: '10px', color: '#6c757d' }}>{notification.vaccineName}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ marginRight: '10px', color: '#667eea', width: '20px' }} />
                <span style={{ fontWeight: '600', color: '#495057' }}>Ngày dự kiến:</span>
                <span style={{ marginLeft: '10px', color: '#6c757d' }}>
                  {new Date(notification.scheduledDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaMapMarkerAlt style={{ marginRight: '10px', color: '#667eea', width: '20px' }} />
                <span style={{ fontWeight: '600', color: '#495057' }}>Địa điểm:</span>
                <span style={{ marginLeft: '10px', color: '#6c757d' }}>{notification.location}</span>
              </div>

              {notification.note && (
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaEnvelope style={{ marginRight: '10px', color: '#667eea', width: '20px', marginTop: '2px' }} />
                  <span style={{ fontWeight: '600', color: '#495057' }}>Ghi chú:</span>
                  <span style={{ marginLeft: '10px', color: '#6c757d' }}>{notification.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Information */}
          <div style={{
            background: '#e8f4fd',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            border: '2px solid #bee5eb'
          }}>
            <h3 style={{ color: '#0c5460', marginBottom: '20px' }}>
              Thông tin học sinh
            </h3>

            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#0c5460' }}>Mã học sinh:</span>
                <span style={{ color: '#0c5460' }}>{notification.studentCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#0c5460' }}>Họ tên:</span>
                <span style={{ color: '#0c5460' }}>{notification.studentName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#0c5460' }}>Lớp:</span>
                <span style={{ color: '#0c5460' }}>{notification.className}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              style={{
                background: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaCheck />
              {submitting ? 'Đang xử lý...' : 'Đồng ý tiêm chủng'}
            </button>

            <button
              onClick={handleReject}
              disabled={submitting}
              style={{
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaTimes />
              {submitting ? 'Đang xử lý...' : 'Từ chối tiêm chủng'}
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: '30px',
            padding: '15px',
            background: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffeaa7',
            textAlign: 'center'
          }}>
            <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
              <strong>Lưu ý:</strong> Việc tiêm chủng sẽ được thực hiện theo đúng quy trình y tế và dưới sự giám sát của nhân viên y tế nhà trường.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationConfirmation; 