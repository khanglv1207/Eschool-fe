import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaFileAlt, FaCalendar, FaUser, FaInfoCircle, FaSync } from 'react-icons/fa';
import { getCheckupResults } from '../services/healthCheckupApi';
import './HealthCheckupResults.css';

const HealthCheckupResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Lấy kết quả kiểm tra y tế...');
      console.log('🔍 API Endpoint: /api/parents/checkup-result');
      
      const data = await getCheckupResults();
      console.log('✅ Dữ liệu kết quả kiểm tra y tế:', data);
      console.log('📊 Số lượng kết quả:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('📋 Chi tiết kết quả đầu tiên:', data[0]);
        console.log('📅 checkupDate:', data[0].checkupDate);
        console.log('📅 checkup_date:', data[0].checkup_date);
        console.log('📅 checkupDate:', data[0].checkupDate);
        console.log('📅 date:', data[0].date);
        console.log('📅 createdAt:', data[0].createdAt);
        console.log('📅 created_at:', data[0].created_at);
        console.log('📅 updatedAt:', data[0].updatedAt);
        console.log('📅 updated_at:', data[0].updated_at);
        console.log('📅 All keys:', Object.keys(data[0]));
      }
      
      setResults(data);
    } catch (error) {
      console.error('❌ Lỗi tải kết quả kiểm tra y tế:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày kiểm tra';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('❌ Lỗi format date:', dateString, error);
      return 'Ngày không hợp lệ';
    }
  };

  // Hàm tìm ngày kiểm tra từ nhiều trường có thể có
  const getCheckupDate = (result) => {
    // Thử các trường có thể có ngày kiểm tra
    const possibleDateFields = [
      'checkupDate',
      'checkup_date', 
      'date',
      'createdAt',
      'created_at',
      'updatedAt',
      'updated_at',
      'checkupTime',
      'checkup_time'
    ];
    
    for (const field of possibleDateFields) {
      if (result[field]) {
        console.log(`📅 Tìm thấy ngày ở trường ${field}:`, result[field]);
        return result[field];
      }
    }
    
    console.log('❌ Không tìm thấy ngày kiểm tra trong:', result);
    return null;
  };

  // Hàm hiển thị trạng thái kiểm tra
  const getCheckupStatus = (result) => {
    if (result.hasChecked === true) {
      return 'Đã kiểm tra y tế định kỳ';
    } else if (result.hasChecked === false) {
      return 'Chưa kiểm tra y tế định kỳ';
    } else {
      return 'Trạng thái không xác định';
    }
  };

  // Hàm hiển thị ngày kiểm tra hoặc thông báo
  const getCheckupDateDisplay = (result) => {
    const checkupDate = getCheckupDate(result);
    
    if (checkupDate) {
      return formatDate(checkupDate);
    } else if (result.hasChecked === true) {
      return 'Đã kiểm tra (chưa có ngày cụ thể)';
    } else if (result.hasChecked === false) {
      return 'Chưa kiểm tra';
    } else {
      return 'Chưa có thông tin';
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

  if (error) {
    return (
      <div className="health-checkup-results">
        <div className="error-container">
          <FaInfoCircle />
          <h3>Lỗi tải kết quả</h3>
          <p>{error}</p>
          <button onClick={loadResults} className="btn-retry">
            <FaSync /> Thử lại
          </button>
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

      <div className="results-actions">
        <button onClick={loadResults} className="btn-refresh">
          <FaSync /> Làm Mới Danh Sách
        </button>
        

      </div>

      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result, index) => (
            <div key={index} className="result-card">
              <div className="result-header">
                <div className="result-type">
                  <FaStethoscope />
                  <span>Kiểm tra y tế định kỳ</span>
                </div>
                <div className="result-status">
                  <span className="status-badge completed">
                    {getCheckupStatus(result)}
                  </span>
                </div>
              </div>

              <div className="result-content">
                <div className="result-info">
                  <div className="info-item">
                    <FaUser />
                    <span>Học sinh: {result.studentName || 'N/A'}</span>
                  </div>
                  {result.className && (
                    <div className="info-item">
                      <FaUser />
                      <span>Lớp: {result.className}</span>
                    </div>
                  )}

                </div>

                <div className="result-details">
                  <h4>Chi tiết kết quả:</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Chiều cao:</label>
                      <span>{result.heightCm ? `${result.heightCm} cm` : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Cân nặng:</label>
                      <span>{result.weightKg ? `${result.weightKg} kg` : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Thị lực trái:</label>
                      <span>{result.visionLeft || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Thị lực phải:</label>
                      <span>{result.visionRight || 'N/A'}</span>
                    </div>
                  </div>

                  {result.notes && (
                    <div className="result-notes">
                      <label>Ghi chú:</label>
                      <p>{result.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <FaInfoCircle />
          </div>
          <h3>Chưa có kết quả kiểm tra y tế</h3>
          <p>Hiện tại không có kết quả kiểm tra y tế nào dành cho con em của bạn.</p>
          <button onClick={loadResults} className="btn-refresh">
            <FaSync /> Làm Mới
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthCheckupResults; 