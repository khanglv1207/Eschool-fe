import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaClock, FaSyringe, FaUser } from 'react-icons/fa';
import { getVaccineNotifications, confirmVaccine, rejectVaccine } from '../services/vaccinationApi';
import './VaccinationNotification.css';

const VaccinationNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getVaccineNotifications();
      setNotifications(data);
      console.log('📋 Thông báo tiêm chủng:', data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo:', error);
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (notificationId, studentId) => {
    try {
      setMessage('');
      await confirmVaccine(notificationId, 'Phụ huynh đã đồng ý tiêm vaccine');
      setMessage('✅ Đã xác nhận tiêm chủng thành công!');
      loadNotifications(); // Reload danh sách
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  const handleReject = async (notificationId, studentId) => {
    try {
      setMessage('');
      await rejectVaccine(notificationId, 'Phụ huynh đã từ chối tiêm vaccine');
      setMessage('❌ Đã từ chối tiêm chủng!');
      loadNotifications(); // Reload danh sách
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="notification-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông báo...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-empty">
        <FaBell className="empty-icon" />
        <h3>Không có thông báo tiêm chủng</h3>
        <p>Hiện tại không có thông báo tiêm chủng nào cho con em của bạn.</p>
      </div>
    );
  }

  return (
    <div className="vaccination-notification">
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="notification-header">
        <h2>
          <FaBell className="header-icon" />
          Thông Báo Tiêm Chủng
        </h2>
        <button onClick={loadNotifications} className="refresh-btn">
          <FaClock /> Làm mới
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="notification-header-card">
              <div className="notification-icon">
                <FaSyringe />
              </div>
              <div className="notification-info">
                <h3>{notification.vaccineName}</h3>
                <p className="student-info">
                  <FaUser /> {notification.studentName} - {notification.className}
                </p>
                <p className="notification-date">
                  <FaClock /> Ngày tiêm: {new Date(notification.vaccinationDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className={`status-badge ${notification.status.toLowerCase()}`}>
                {notification.status === 'PENDING' && 'Chờ xác nhận'}
                {notification.status === 'CONFIRMED' && 'Đã xác nhận'}
                {notification.status === 'REJECTED' && 'Đã từ chối'}
              </div>
            </div>

            {notification.status === 'PENDING' && (
              <div className="notification-actions">
                <button
                  onClick={() => handleConfirm(notification.id, notification.studentId)}
                  className="btn-confirm"
                >
                  <FaCheck /> Đồng ý
                </button>
                <button
                  onClick={() => handleReject(notification.id, notification.studentId)}
                  className="btn-reject"
                >
                  <FaTimes /> Từ chối
                </button>
              </div>
            )}

            {notification.note && (
              <div className="notification-note">
                <strong>Ghi chú:</strong> {notification.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaccinationNotification; 