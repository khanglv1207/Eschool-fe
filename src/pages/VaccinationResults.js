import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaUser, FaSyringe, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { getVaccinationResult } from '../services/vaccinationApi';

function VaccinationResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await getVaccinationResult();
      setResults(data);
      console.log('📋 Vaccination results loaded:', data);
    } catch (error) {
      console.error('❌ Lỗi tải kết quả tiêm chủng:', error);
      setMessage('❌ Lỗi tải kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang chờ';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <FaCheckCircle />;
      case 'PENDING': return <FaExclamationTriangle />;
      case 'CANCELLED': return <FaTimesCircle />;
      default: return <FaInfoCircle />;
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
            Đang tải kết quả tiêm chủng...
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
            <FaSyringe style={{ fontSize: '32px' }} />
            Kết quả tiêm chủng
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.9
          }}>
            Lịch sử tiêm chủng của con bạn
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          {message && (
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              color: message.includes("✅") ? '#155724' : '#721c24',
              background: message.includes("✅") ? '#d4edda' : '#f8d7da',
              border: `2px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {message}
            </div>
          )}

          {/* Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(40, 167, 69, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {results.filter(r => r.status === 'COMPLETED').length}
              </div>
              <div style={{ fontSize: '14px' }}>Đã hoàn thành</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {results.filter(r => r.status === 'PENDING').length}
              </div>
              <div style={{ fontSize: '14px' }}>Đang chờ</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(220, 53, 69, 0.3)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {results.filter(r => r.status === 'CANCELLED').length}
              </div>
              <div style={{ fontSize: '14px' }}>Đã hủy</div>
            </div>
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
                <FaSyringe style={{ color: '#667eea' }} />
                Danh sách kết quả tiêm chủng ({results.length})
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
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          background: getStatusColor(result.status),
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {getStatusIcon(result.status)}
                          {getStatusText(result.status)}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        color: '#6c757d'
                      }}>
                        {result.vaccinationDate ? new Date(result.vaccinationDate).toLocaleDateString('vi-VN') : 'N/A'}
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

                      {/* Vaccine Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaSyringe style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {result.vaccineName || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {result.location || 'Trường học'}
                          </div>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaCalendarAlt style={{ color: '#667eea', fontSize: '16px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#495057' }}>
                            {result.vaccinationDate ? new Date(result.vaccinationDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {result.vaccinationDate ? new Date(result.vaccinationDate).toLocaleTimeString('vi-VN') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      {/* Reaction Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaExclamationTriangle style={{ 
                          color: result.hasReaction ? '#dc3545' : '#28a745', 
                          fontSize: '16px' 
                        }} />
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: result.hasReaction ? '#dc3545' : '#28a745' 
                          }}>
                            {result.hasReaction ? 'Có phản ứng' : 'Không có phản ứng'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Tình trạng phản ứng
                          </div>
                        </div>
                      </div>

                      {/* Booster Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaCheckCircle style={{ 
                          color: result.needsBooster ? '#ffc107' : '#28a745', 
                          fontSize: '16px' 
                        }} />
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: result.needsBooster ? '#ffc107' : '#28a745' 
                          }}>
                            {result.needsBooster ? 'Cần tiêm nhắc' : 'Không cần tiêm nhắc'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Khuyến nghị tiêm nhắc
                          </div>
                        </div>
                      </div>

                      {/* Finalized Status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaCheckCircle style={{ 
                          color: result.finalized ? '#28a745' : '#ffc107', 
                          fontSize: '16px' 
                        }} />
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: result.finalized ? '#28a745' : '#ffc107' 
                          }}>
                            {result.finalized ? 'Đã hoàn thành' : 'Đang xử lý'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            Trạng thái kết quả
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.reactionNote && (
                      <div style={{
                        background: result.hasReaction ? '#fff3cd' : '#f8f9fa',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: result.hasReaction ? '#856404' : '#495057',
                        marginBottom: '15px',
                        border: result.hasReaction ? '1px solid #ffeaa7' : 'none'
                      }}>
                        <strong>Ghi chú phản ứng:</strong> {result.reactionNote}
                      </div>
                    )}

                    {result.notes && !result.reactionNote && (
                      <div style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#495057',
                        marginBottom: '15px'
                      }}>
                        <strong>Ghi chú:</strong> {result.notes}
                      </div>
                    )}

                    {result.result && (
                      <div style={{
                        background: '#e8f5e8',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#155724',
                        marginBottom: '15px'
                      }}>
                        <strong>Kết quả:</strong> {result.result}
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
                Chưa có kết quả tiêm chủng
              </h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Hiện tại chưa có kết quả tiêm chủng nào cho con của bạn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VaccinationResults; 