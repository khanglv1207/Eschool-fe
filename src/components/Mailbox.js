import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTimes, FaCheck, FaSyringe } from 'react-icons/fa';
import { getVaccineNotifications, confirmVaccine, rejectVaccine } from '../services/vaccinationApi';
import './Mailbox.css';

const Mailbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotifications();
    
    // Tự động refresh thông báo mỗi 30 giây
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Debug: Hiển thị thông tin user
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      console.log('📮 Mailbox - User info:', {
        email: user.email,
        parentEmail: user.parentEmail,
        role: user.role,
        fullName: user.fullName
      });
      
      const data = await getVaccineNotifications();
      console.log('📋 Notifications loaded:', data);
      setNotifications(data);
    } catch (error) {
      console.error('❌ Lỗi tải thông báo:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (notificationId, studentId) => {
    try {
      setMessage('');
      await confirmVaccine(notificationId, 'Phụ huynh đã đồng ý tiêm vaccine');
      setMessage('✅ Đã xác nhận tiêm chủng!');
      loadNotifications();
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  const handleReject = async (notificationId, studentId) => {
    try {
      setMessage('');
      await rejectVaccine(notificationId, 'Phụ huynh đã từ chối tiêm vaccine');
      setMessage('❌ Đã từ chối tiêm chủng!');
      loadNotifications();
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  // Chỉ hiển thị cho phụ huynh
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (user.role !== 'PARENT') {
    return null;
  }

  const pendingCount = notifications.filter(n => n.status === 'PENDING').length;

  return (
    <div className="mailbox-container">
      {/* Mailbox Icon */}
      <div className="mailbox-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaEnvelope className="envelope-icon" />
        {pendingCount > 0 && (
          <span className="mail-count">{pendingCount}</span>
        )}
      </div>

      {/* Mailbox Dropdown */}
      {isOpen && (
        <div className="mailbox-dropdown">
          <div className="dropdown-header">
            <h3>📮 Hòm thư</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="dropdown-content">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="empty">
                <FaEnvelope className="empty-icon" />
                <p>Không có thông báo mới</p>
              </div>
            ) : (
              <div className="notifications">
                {notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <div className="item-icon">
                      <FaSyringe />
                    </div>
                    <div className="item-content">
                      <h4>{notification.vaccineName}</h4>
                      <p className="student-info">
                        {notification.studentName} - {notification.className}
                      </p>
                      <p className="date">
                        {new Date(notification.vaccinationDate).toLocaleDateString('vi-VN')}
                      </p>
                      
                      {notification.status === 'PENDING' && (
                        <div className="actions">
                          <button
                            onClick={() => handleConfirm(notification.id)}
                            className="btn-confirm"
                          >
                            <FaCheck /> Đồng ý
                          </button>
                          <button
                            onClick={() => handleReject(notification.id)}
                            className="btn-reject"
                          >
                            <FaTimes /> Từ chối
                          </button>
                        </div>
                      )}
                      
                      {notification.status === 'CONFIRMED' && (
                        <span className="status confirmed">✅ Đã xác nhận</span>
                      )}
                      
                      {notification.status === 'REJECTED' && (
                        <span className="status rejected">❌ Đã từ chối</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-footer">
            <button onClick={loadNotifications} className="refresh-btn">
              🔄 Làm mới
            </button>
            <button onClick={() => window.location.href = '/vaccination-notifications'} className="view-all-btn">
              👁️ Xem tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mailbox; 