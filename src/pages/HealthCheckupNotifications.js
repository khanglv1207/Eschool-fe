import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaCheck, FaTimes, FaCalendar, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { getHealthCheckupNotifications, confirmHealthCheckup } from '../services/healthCheckupApi';
import './HealthCheckupNotifications.css';

const HealthCheckupNotifications = () => {
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
      console.log('📋 Lấy danh sách thông báo kiểm tra y tế cho phụ huynh...');
      
      const response = await getHealthCheckupNotifications();
      console.log('📋 Health checkup notifications loaded:', response);
      
      setNotifications(response);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách thông báo:', error);
      setMessage('❌ Lỗi tải thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

      const handleConfirm = async (notification, parentNote = 'Phụ huynh xác nhận kiểm tra y tế') => {
    try {
      setProcessingId(`notification-${notification.id || 'temp'}`);
      setMessage('');
      
      // Chuyển đổi confirmationId thành UUID format nếu cần
      let confirmationId = notification.id || generateUUID();
      
      // Đảm bảo confirmationId là UUID format hợp lệ
      if (typeof confirmationId === 'string' && confirmationId.includes('-')) {
        // Đã là UUID format
        confirmationId = confirmationId;
      } else {
        // Chuyển đổi thành UUID format
        confirmationId = generateUUID();
      }

      const confirmationData = {
        confirmationId: confirmationId, // Sử dụng ID thật từ notification nếu có
        status: 'ACCEPTED', // Backend yêu cầu ACCEPTED thay vì CONFIRMED
        parentNote: parentNote
      };

      console.log('✅ Sending confirmation data:', confirmationData);
      console.log('✅ ConfirmationId type:', typeof confirmationId);
      console.log('✅ ConfirmationId value:', confirmationId);

      const response = await confirmHealthCheckup(confirmationData);

      console.log('✅ Confirmation response:', response);

      setMessage('✅ Xác nhận kiểm tra y tế thành công!');

      // Reload notifications after successful confirmation
      setTimeout(() => {
        loadNotifications();
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('❌ Lỗi xác nhận kiểm tra y tế:', error);
      setMessage('❌ Lỗi xác nhận: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

      const handleReject = async (notification, parentNote = 'Phụ huynh từ chối kiểm tra y tế') => {
    try {
      setProcessingId(`notification-${notification.id || 'temp'}`);
      setMessage('');
      
      // Chuyển đổi confirmationId thành UUID format nếu cần
      let confirmationId = notification.id || generateUUID();
      
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

      const response = await confirmHealthCheckup(rejectionData);

      console.log('✅ Rejection response:', response);

      setMessage('✅ Đã từ chối kiểm tra y tế thành công!');

      // Reload notifications after successful rejection
      setTimeout(() => {
        loadNotifications();
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('❌ Lỗi từ chối kiểm tra y tế:', error);
      setMessage('❌ Lỗi từ chối: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="health-checkup-notifications">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông báo kiểm tra y tế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-checkup-notifications">
      <div className="notifications-header">
        <h1><FaStethoscope /> Thông Báo Kiểm Tra Y Tế</h1>
        <p>Danh sách thông báo kiểm tra y tế định kỳ cho con em của bạn</p>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-number">{notifications.length}</div>
          <div className="stat-label">Tổng thông báo</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {notifications.filter(n => n.status === 'PENDING').length}
          </div>
          <div className="stat-label">Chờ xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {notifications.filter(n => n.status === 'CONFIRMED').length}
          </div>
          <div className="stat-label">Đã xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {notifications.filter(n => n.status === 'REJECTED').length}
          </div>
          <div className="stat-label">Đã từ chối</div>
        </div>
      </div>

      <div className="notifications-actions">
        <button onClick={loadNotifications} className="btn-refresh">
          <FaInfoCircle /> Làm Mới Danh Sách
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-card">
              <div className="notification-header">
                <div className="notification-type">
                  <FaStethoscope />
                  <span>{notification.checkupType || 'Kiểm tra y tế định kỳ'}</span>
                </div>
                <div className="notification-status">
                  <span className={`status ${notification.status?.toLowerCase() || 'pending'}`}>
                    {notification.status === 'PENDING' ? 'Chờ xác nhận' :
                     notification.status === 'CONFIRMED' ? 'Đã xác nhận' :
                     notification.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ xác nhận'}
                  </span>
                </div>
              </div>

              <div className="notification-content">
                <div className="notification-info">
                  <div className="info-item">
                    <FaCalendar />
                    <span>Ngày dự kiến: {notification.scheduledDate ? formatDate(notification.scheduledDate) : 'Chưa lên lịch'}</span>
                  </div>
                  <div className="info-item">
                    <FaMapMarkerAlt />
                    <span>Địa điểm: {notification.location || 'Phòng y tế trường học'}</span>
                  </div>
                  {notification.note && (
                    <div className="info-item">
                      <FaInfoCircle />
                      <span>Ghi chú: {notification.note}</span>
                    </div>
                  )}
                </div>

                {(!notification.status || notification.status === 'PENDING') && (
                  <div className="notification-actions">
                    <button
                      onClick={() => handleConfirm(notification)}
                      className="btn-confirm"
                      disabled={processingId === `notification-${notification.id || 'temp'}`}
                    >
                      <FaCheck />
                      {processingId === `notification-${notification.id || 'temp'}` ? 'Đang xử lý...' : 'Xác Nhận'}
                    </button>
                    <button
                      onClick={() => handleReject(notification)}
                      className="btn-reject"
                      disabled={processingId === `notification-${notification.id || 'temp'}`}
                    >
                      <FaTimes />
                      {processingId === `notification-${notification.id || 'temp'}` ? 'Đang xử lý...' : 'Từ Chối'}
                    </button>
                  </div>
                )}

                {(notification.status === 'CONFIRMED' || notification.status === 'REJECTED') && (
                  <div className="notification-result">
                    <div className={`result-badge ${notification.status.toLowerCase()}`}>
                      {notification.status === 'CONFIRMED' ? '✅ Đã xác nhận' : '❌ Đã từ chối'}
                    </div>
                    {notification.parentNote && (
                      <div className="result-note">
                        <strong>Ghi chú:</strong> {notification.parentNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications">
          <div className="no-notifications-icon">
            <FaStethoscope />
          </div>
          <h3>Chưa có thông báo kiểm tra y tế</h3>
          <p>Hiện tại không có thông báo kiểm tra y tế nào dành cho con em của bạn.</p>
          <button onClick={loadNotifications} className="btn-refresh">
            <FaInfoCircle /> Làm Mới
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthCheckupNotifications; 