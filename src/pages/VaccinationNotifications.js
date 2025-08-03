import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaSyringe } from 'react-icons/fa';
import { getVaccineNotifications, confirmVaccine, rejectVaccine } from '../services/vaccinationApi';
import './VaccinationNotifications.css';

const VaccinationNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const data = await getVaccineNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo:', error);
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (notificationId) => {
    try {
      setMessage('');
      await confirmVaccine(notificationId, 'Phụ huynh đã đồng ý tiêm vaccine');
      setMessage('✅ Đã xác nhận tiêm vaccine!');
      loadNotifications();
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      setMessage('');
      await rejectVaccine(notificationId, 'Phụ huynh đã từ chối tiêm vaccine');
      setMessage('❌ Đã từ chối tiêm vaccine!');
      loadNotifications();
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  const pendingCount = notifications.filter(n => n.status === 'PENDING').length;

  return (
    <div className="vaccination-notifications">
      <div className="notifications-header">
        <h1>
          <FaBell className="header-icon" />
          Thông báo tiêm chủng
        </h1>
        {pendingCount > 0 && (
          <span className="pending-badge">{pendingCount} chờ xác nhận</span>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="notifications-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-container">
            <FaBell className="empty-icon" />
            <h3>Không có thông báo tiêm chủng</h3>
            <p>Hiện tại không có thông báo tiêm chủng nào cho con em của bạn.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={index} className={`notification-card ${notification.status.toLowerCase()}`}>
                <div className="card-header">
                  <div className="vaccine-info">
                    <FaSyringe className="vaccine-icon" />
                    <h3>{notification.vaccineName}</h3>
                  </div>
                  <span className={`status-badge ${notification.status.toLowerCase()}`}>
                    {notification.status === 'PENDING' && 'Chờ xác nhận'}
                    {notification.status === 'CONFIRMED' && 'Đã đồng ý'}
                    {notification.status === 'REJECTED' && 'Đã từ chối'}
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="student-info">
                    <p><strong>Học sinh:</strong> {notification.studentName}</p>
                    <p><strong>Lớp:</strong> {notification.className}</p>
                    <p><strong>Ngày tiêm:</strong> {new Date(notification.vaccinationDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  
                  {notification.status === 'PENDING' && (
                    <div className="action-buttons">
                      <button 
                        className="confirm-btn"
                        onClick={() => handleConfirm(notification.id)}
                      >
                        <FaCheck />
                        Đồng ý
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleReject(notification.id)}
                      >
                        <FaTimes />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationNotifications; 