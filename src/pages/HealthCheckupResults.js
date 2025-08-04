import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaFileAlt, FaCalendar, FaUser, FaChartLine } from 'react-icons/fa';
import { getHealthCheckupResult } from '../services/healthCheckupApi';
import './HealthCheckupResults.css';

const HealthCheckupResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      console.log('📋 Lấy kết quả kiểm tra y tế...');
      
      const response = await getHealthCheckupResult();
      console.log('📋 Health checkup results loaded:', response);
      
      setResults(response);
    } catch (error) {
      console.error('❌ Lỗi lấy kết quả kiểm tra y tế:', error);
      setMessage('❌ Lỗi tải kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="health-checkup-results">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải kết quả kiểm tra y tế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-checkup-results">
      <div className="results-header">
        <h1><FaFileAlt /> Kết Quả Kiểm Tra Y Tế</h1>
        <p>Lịch sử kết quả kiểm tra y tế định kỳ của con em bạn</p>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="results-stats">
        <div className="stat-card">
          <div className="stat-number">{results.length}</div>
          <div className="stat-label">Tổng kết quả</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {results.filter(r => r.status === 'COMPLETED').length}
          </div>
          <div className="stat-label">Hoàn thành</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {results.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="stat-label">Đang xử lý</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {results.filter(r => r.status === 'CANCELLED').length}
          </div>
          <div className="stat-label">Đã hủy</div>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={loadResults} className="btn-refresh">
          <FaFileAlt /> Làm Mới Danh Sách
        </button>
      </div>

      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result, index) => (
            <div key={index} className="result-card">
              <div className="result-header">
                <div className="result-type">
                  <FaStethoscope />
                  <span>{result.checkupType || 'Kiểm tra y tế định kỳ'}</span>
                </div>
                <div className="result-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(result.status) }}
                  >
                    {getStatusText(result.status)}
                  </span>
                </div>
              </div>

              <div className="result-content">
                <div className="result-info">
                  <div className="info-item">
                    <FaCalendar />
                    <span>Ngày kiểm tra: {result.checkupDate ? formatDate(result.checkupDate) : 'Chưa có'}</span>
                  </div>
                  <div className="info-item">
                    <FaUser />
                    <span>Học sinh: {result.studentName || 'N/A'}</span>
                  </div>
                </div>

                <div className="result-details">
                  <h4>Chi tiết kết quả:</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Chiều cao:</label>
                      <span>{result.height ? `${result.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Cân nặng:</label>
                      <span>{result.weight ? `${result.weight} kg` : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Huyết áp:</label>
                      <span>{result.bloodPressure || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Thị lực:</label>
                      <span>{result.vision || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Thính lực:</label>
                      <span>{result.hearing || 'N/A'}</span>
                    </div>
                  </div>

                  {result.notes && (
                    <div className="result-notes">
                      <label>Ghi chú:</label>
                      <p>{result.notes}</p>
                    </div>
                  )}
                </div>

                {result.height && result.weight && (
                  <div className="bmi-section">
                    <h4>Chỉ số BMI:</h4>
                    <div className="bmi-calculator">
                      {(() => {
                        const height = parseFloat(result.height) / 100; // Convert to meters
                        const weight = parseFloat(result.weight);
                        const bmi = weight / (height * height);
                        
                        let bmiCategory = '';
                        let bmiColor = '';
                        
                        if (bmi < 18.5) {
                          bmiCategory = 'Thiếu cân';
                          bmiColor = '#ffc107';
                        } else if (bmi < 25) {
                          bmiCategory = 'Bình thường';
                          bmiColor = '#28a745';
                        } else if (bmi < 30) {
                          bmiCategory = 'Thừa cân';
                          bmiColor = '#fd7e14';
                        } else {
                          bmiCategory = 'Béo phì';
                          bmiColor = '#dc3545';
                        }

                        return (
                          <div className="bmi-result">
                            <div className="bmi-value">
                              <span className="bmi-number">{bmi.toFixed(1)}</span>
                              <span className="bmi-unit">kg/m²</span>
                            </div>
                            <div 
                              className="bmi-category"
                              style={{ backgroundColor: bmiColor }}
                            >
                              {bmiCategory}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <FaFileAlt />
          </div>
          <h3>Chưa có kết quả kiểm tra y tế</h3>
          <p>Hiện tại không có kết quả kiểm tra y tế nào dành cho con em của bạn.</p>
          <button onClick={loadResults} className="btn-refresh">
            <FaFileAlt /> Làm Mới
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthCheckupResults; 