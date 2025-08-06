import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaFileAlt, FaCalendar, FaUser, FaInfoCircle, FaSync, FaEye, FaRuler, FaWeight } from 'react-icons/fa';
import { getCheckupResults, getCheckupResultsNew } from '../services/healthCheckupApi';
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
      
      // Thử API mới trước, nếu không có thì dùng API cũ
      let data;
      try {
        data = await getCheckupResultsNew();
        console.log('✅ Dữ liệu kết quả kiểm tra y tế (API mới):', data);
      } catch (newApiError) {
        console.log('⚠️ API mới không khả dụng, thử API cũ...');
        data = await getCheckupResults();
        console.log('✅ Dữ liệu kết quả kiểm tra y tế (API cũ):', data);
      }
      
      console.log('📊 Số lượng kết quả:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('📋 Chi tiết kết quả đầu tiên:', data[0]);
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
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
            <FaFileAlt style={{ fontSize: '32px' }} />
            Kết Quả Kiểm Tra Y Tế
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.9
          }}>
            Lịch sử kết quả kiểm tra y tế định kỳ của con em bạn
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          {error && (
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              color: '#721c24',
              background: '#f8d7da',
              border: '2px solid #f5c6cb'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Actions */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <button
              onClick={loadResults}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
              }}
            >
              <FaSync />
              Làm Mới Danh Sách
            </button>
          </div>

          {/* Results List */}
          {results.length > 0 ? (
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
                <FaFileAlt style={{ color: '#667eea' }} />
                Danh sách kết quả ({results.length})
              </h3>

              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {results.map((result, index) => (
                  <div key={index} style={{
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          background: result.hasChecked ? '#28a745' : '#ffc107',
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <FaStethoscope />
                          {result.hasChecked ? 'Đã kiểm tra' : 'Chưa kiểm tra'}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        color: '#6c757d'
                      }}>
                        {getCheckupDateDisplay(result)}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      {/* Student Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaUser style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {result.studentName || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {result.className || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Height Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaRuler style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {result.heightCm ? `${result.heightCm} cm` : 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Chiều cao
                          </div>
                        </div>
                      </div>

                      {/* Weight Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaWeight style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {result.weightKg ? `${result.weightKg} kg` : 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Cân nặng
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vision Info */}
                    {(result.visionLeft || result.visionRight) && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <FaEye style={{ color: '#667eea', fontSize: '16px' }} />
                          <div>
                            <div style={{ fontWeight: '600', color: '#495057' }}>
                              {result.visionLeft || 'N/A'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                              Thị lực trái
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <FaEye style={{ color: '#667eea', fontSize: '16px' }} />
                          <div>
                            <div style={{ fontWeight: '600', color: '#495057' }}>
                              {result.visionRight || 'N/A'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                              Thị lực phải
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {result.notes && (
                      <div style={{
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '10px',
                        marginTop: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#495057',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                          <FaInfoCircle />
                          Ghi chú
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6c757d',
                          lineHeight: '1.5'
                        }}>
                          {result.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '15px',
              border: '2px solid #e9ecef'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
              <h3 style={{ color: '#495057', marginBottom: '10px' }}>
                Chưa có kết quả kiểm tra y tế
              </h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Hiện tại không có kết quả kiểm tra y tế nào dành cho con em của bạn.
              </p>
              <button
                onClick={loadResults}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
                }}
              >
                <FaSync />
                Làm Mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckupResults; 