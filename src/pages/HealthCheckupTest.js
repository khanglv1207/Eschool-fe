import React, { useState } from 'react';
import { FaStethoscope, FaCheck, FaTimes } from 'react-icons/fa';
import { confirmHealthCheckup, getHealthCheckupNotifications } from '../services/healthCheckupApi';
import './HealthCheckupTest.css';

const HealthCheckupTest = () => {
  const [confirmationId, setConfirmationId] = useState('');
  const [decision, setDecision] = useState('ACCEPTED');
  const [reason, setReason] = useState('Test confirmation');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const handleTestConfirmation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const confirmationData = {
        confirmationId: confirmationId || 'test-uuid-123',
        status: decision,
        parentNote: reason
      };

      console.log('📤 Sending confirmation data:', confirmationData);

      const result = await confirmHealthCheckup(confirmationData);
      
      console.log('✅ Confirmation response:', result);
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('❌ Error:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const result = await getHealthCheckupNotifications();
      setNotifications(result);
      console.log('📋 Notifications loaded:', result);
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      setResponse(`Error loading notifications: ${error.message}`);
    } finally {
      setLoadingNotifications(false);
    }
  };

  return (
    <div className="health-checkup-test">
      <div className="test-header">
        <h1><FaStethoscope /> Test API Kiểm Tra Y Tế</h1>
        <p>Trang test để kiểm tra các API kiểm tra y tế</p>
      </div>

      <div className="test-sections">
        {/* Test Confirmation API */}
        <div className="test-section">
          <h2><FaCheck /> Test API Xác Nhận Kiểm Tra Y Tế</h2>
          <form onSubmit={handleTestConfirmation} className="test-form">
            <div className="form-group">
              <label>Confirmation ID:</label>
              <input
                type="text"
                value={confirmationId}
                onChange={(e) => setConfirmationId(e.target.value)}
                placeholder="Nhập confirmation ID hoặc để trống để dùng test ID"
              />
            </div>

            <div className="form-group">
              <label>Quyết định:</label>
              <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="DECLINED">DECLINED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lý do:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do xác nhận/từ chối"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-test" disabled={loading}>
              {loading ? 'Đang test...' : 'Test API Xác Nhận'}
            </button>
          </form>
        </div>

        {/* Test Get Notifications API */}
        <div className="test-section">
          <h2><FaStethoscope /> Test API Lấy Thông Báo Kiểm Tra Y Tế</h2>
          <button 
            onClick={handleLoadNotifications} 
            className="btn-test"
            disabled={loadingNotifications}
          >
            {loadingNotifications ? 'Đang tải...' : 'Test API Lấy Thông Báo'}
          </button>

          {notifications.length > 0 && (
            <div className="notifications-preview">
              <h3>Thông báo đã tải ({notifications.length}):</h3>
              <div className="notifications-list">
                {notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <strong>Loại kiểm tra:</strong> {notification.checkupType || 'N/A'}<br/>
                    <strong>Ngày dự kiến:</strong> {notification.scheduledDate || 'N/A'}<br/>
                    <strong>Địa điểm:</strong> {notification.location || 'N/A'}<br/>
                    <strong>Ghi chú:</strong> {notification.note || 'N/A'}<br/>
                    <strong>Trạng thái:</strong> {notification.status || 'PENDING'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Response Display */}
        {response && (
          <div className="response-section">
            <h3>Response:</h3>
            <pre className="response-json">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckupTest; 