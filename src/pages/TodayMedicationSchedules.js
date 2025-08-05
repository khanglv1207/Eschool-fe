import React, { useState, useEffect } from 'react';
import { FaPills, FaClock, FaCheck, FaTimes, FaUser, FaInfoCircle, FaFilter, FaSync, FaEdit } from 'react-icons/fa';
import { getPendingMedicationRequests, updateMedicationStatus } from '../services/medicationApi';
import './TodayMedicationSchedules.css';

const TodayMedicationSchedules = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Đang tải danh sách đơn thuốc đang chờ...');
      
      const data = await getPendingMedicationRequests();
      console.log('✅ Dữ liệu đơn thuốc đang chờ:', data);
      setRequests(data);
    } catch (error) {
      console.error('❌ Lỗi tải đơn thuốc đang chờ:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status, note = '') => {
    try {
      console.log('✅ Cập nhật trạng thái đơn thuốc:', { requestId, status, note });
      await updateMedicationStatus(requestId, status, note);
      
      // Cập nhật trạng thái trong state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.requestId === requestId 
            ? { ...request, status: status }
            : request
        )
      );
      
      console.log('✅ Đã cập nhật trạng thái thành công!');
      setShowModal(false);
      setSelectedRequest(null);
      setUpdateStatus('');
      setUpdateNote('');
    } catch (error) {
      console.error('❌ Lỗi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái: ' + error.message);
    }
  };

  const openUpdateModal = (request, status) => {
    setSelectedRequest(request);
    setUpdateStatus(status);
    setUpdateNote('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setUpdateStatus('');
    setUpdateNote('');
  };

  const confirmUpdate = () => {
    if (!selectedRequest || !updateStatus) return;
    
    const note = updateNote.trim() || (updateStatus === 'APPROVED' ? 'Đã phê duyệt' : 'Đã từ chối');
    handleUpdateStatus(selectedRequest.requestId, updateStatus, note);
  };

  const getFilteredAndSearchedRequests = () => {
    let filtered = requests;

    // Filter theo trạng thái
    switch (filter) {
      case 'pending':
        filtered = requests.filter(request => request.status === 'PENDING');
        break;
      case 'approved':
        filtered = requests.filter(request => request.status === 'APPROVED');
        break;
      case 'rejected':
        filtered = requests.filter(request => request.status === 'REJECTED');
        break;
      default:
        filtered = requests;
    }

    // Search theo tên học sinh hoặc tên phụ huynh
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.studentName?.toLowerCase().includes(term) ||
        request.parentName?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return (
          <span className="status-badge approved">
            <FaCheck /> Đã phê duyệt
          </span>
        );
      case 'REJECTED':
        return (
          <span className="status-badge rejected">
            <FaTimes /> Đã từ chối
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="status-badge pending">
            <FaClock /> Đang chờ
          </span>
        );
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="today-schedules-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải danh sách đơn thuốc đang chờ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-schedules-container">
        <div className="error-message">
          <FaTimes />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button onClick={loadPendingRequests} className="btn-retry">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const filteredRequests = getFilteredAndSearchedRequests();
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalCount = requests.length;

  return (
    <div className="today-schedules-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>
            <FaPills /> Đơn Thuốc Đang Chờ Xác Nhận
          </h1>
          <p className="subtitle">
            Quản lý các đơn thuốc từ phụ huynh đang chờ xử lý
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon total">
              <FaPills />
            </div>
            <div className="stat-content">
              <h3>{totalCount}</h3>
              <p>Tổng số</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon pending">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{pendingCount}</h3>
              <p>Đang chờ</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon approved">
              <FaCheck />
            </div>
            <div className="stat-content">
              <h3>{approvedCount}</h3>
              <p>Đã phê duyệt</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rejected">
              <FaTimes />
            </div>
            <div className="stat-content">
              <h3>{rejectedCount}</h3>
              <p>Đã từ chối</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-filter-section">
          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh hoặc phụ huynh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter Buttons */}
          <div className="filter-controls">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <FaFilter /> Tất cả ({totalCount})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              <FaClock /> Đang chờ ({pendingCount})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              <FaCheck /> Đã phê duyệt ({approvedCount})
            </button>
            <button
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              <FaTimes /> Đã từ chối ({rejectedCount})
            </button>
          </div>
        </div>
        
        <button onClick={loadPendingRequests} className="btn-refresh">
          <FaSync /> Làm mới
        </button>
      </div>

      {/* Content */}
      <div className="schedules-content">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <FaInfoCircle />
            <h3>Không có đơn thuốc</h3>
            <p>
              {filter === 'all' 
                ? 'Hiện tại không có đơn thuốc nào.'
                : filter === 'pending'
                ? 'Không có đơn thuốc nào đang chờ xử lý.'
                : filter === 'approved'
                ? 'Chưa có đơn thuốc nào được phê duyệt.'
                : 'Chưa có đơn thuốc nào bị từ chối.'
              }
              {searchTerm && ' Không tìm thấy kết quả phù hợp.'}
            </p>
          </div>
        ) : (
          <div className="schedules-grid">
            {filteredRequests.map((request) => (
              <div key={request.requestId} className="schedule-card">
                <div className="schedule-header">
                  <div className="student-info">
                    <FaUser />
                    <span className="student-name">{request.studentName}</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="medication-info">
                  <h3 className="medication-name">
                    <FaPills /> Đơn thuốc từ phụ huynh
                  </h3>
                  <div className="medication-details">
                    <p className="parent-name">
                      <strong>Phụ huynh:</strong> {request.parentName}
                    </p>
                    <p className="request-date">
                      <strong>Ngày gửi:</strong> {formatDate(request.requestDate)}
                    </p>
                    {request.note && (
                      <p className="note">
                        <strong>Ghi chú:</strong> {request.note}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="schedule-footer">
                  <div className="request-id">
                    <strong>ID:</strong> {request.requestId}
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => openUpdateModal(request, 'APPROVED')}
                        className="btn-approve"
                      >
                        <FaCheck /> Phê duyệt
                      </button>
                      <button
                        onClick={() => openUpdateModal(request, 'REJECTED')}
                        className="btn-reject"
                      >
                        <FaTimes /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FaEdit /> Cập nhật trạng thái đơn thuốc
              </h3>
              <button onClick={closeModal} className="modal-close">
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-summary">
                <p><strong>Học sinh:</strong> {selectedRequest.studentName}</p>
                <p><strong>Phụ huynh:</strong> {selectedRequest.parentName}</p>
                <p><strong>Ngày gửi:</strong> {formatDate(selectedRequest.requestDate)}</p>
                <p><strong>Trạng thái mới:</strong> 
                  <span className={`status-badge ${updateStatus.toLowerCase()}`}>
                    {updateStatus === 'APPROVED' ? 'Phê duyệt' : 'Từ chối'}
                  </span>
                </p>
              </div>
              
              <div className="form-group">
                <label>Ghi chú (tùy chọn):</label>
                <textarea
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Nhập ghi chú cho việc cập nhật trạng thái..."
                  rows="3"
                  className="form-textarea"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-cancel">
                Hủy
              </button>
              <button onClick={confirmUpdate} className="btn-confirm">
                <FaCheck /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayMedicationSchedules; 