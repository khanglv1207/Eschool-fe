import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { getVaccinationNotifications } from '../services/vaccinationApi';
import './NotificationBadge.css';

const NotificationBadge = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await getVaccinationNotifications();
        // Chỉ đếm thông báo chờ xác nhận
        const pendingNotifications = data.filter(n => n.status === 'PENDING');
        setNotifications(pendingNotifications);
      } catch (error) {
        console.error('❌ Lỗi tải thông báo:', error);
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra nếu user là parent
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (user.role === 'PARENT') {
      loadNotifications();
    }
  }, []);

  // Chỉ hiển thị cho phụ huynh
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (user.role !== 'PARENT') {
    return null;
  }

  return (
    <div className="notification-badge-container">
      <a href="/vaccination-notifications" className="notification-badge">
        <FaBell className="bell-icon" />
        {notifications.length > 0 && (
          <span className="badge-count">{notifications.length}</span>
        )}
      </a>
    </div>
  );
};

export default NotificationBadge; 