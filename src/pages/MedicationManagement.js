import React, { useState, useEffect } from 'react';
import { 
  FaPills, 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaUserMd, 
  FaUsers,
  FaEye,
  FaEdit,
  FaSync,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  getPendingMedicationRequests,
  updateMedicationStatus,
  getTodaySchedulesByStudent,
  markScheduleAsTaken,
  getAllMedicationRequests,
  getParentMedicationRequests
} from '../services/medicationApi';
import './MedicationManagement.css';

const MedicationManagement = () => {
  const [medicationRequests, setMedicationRequests] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [userRole, setUserRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const role = user.role || 'PARENT';
    setUserRole(role);
    
    loadMedicationRequests();
  }, []);

  const loadMedicationRequests = async () => {
    setLoading(true);
    try {
      let requests = [];
      
      if (userRole === 'ADMIN') {
        requests = await getAllMedicationRequests();
      } else if (userRole === 'NURSE') {
        requests = await getPendingMedicationRequests();
      } else {
        requests = await getParentMedicationRequests();
      }
      
      setMedicationRequests(requests);
      setMessage('✅ Tải danh sách đơn thuốc thành công!');
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTodaySchedules = async (studentId) => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const schedules = await getTodaySchedulesByStudent(studentId);
      setTodaySchedules(schedules);
      setMessage('✅ Tải lịch uống thuốc hôm nay thành công!');
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    setLoading(true);
    try {
      await updateMedicationStatus({
        requestId: requestId,
        status: status
      });
      
      // Cập nhật local state
      setMedicationRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: status }
            : request
        )
      );
      
      setMessage(`✅ Cập nhật trạng thái thành công!`);
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (scheduleId) => {
    setLoading(true);
    try {
      await markScheduleAsTaken(scheduleId);
      
      // Cập nhật local state
      setTodaySchedules(prev => 
        prev.map(schedule => 
          schedule.id === scheduleId 
            ? { ...schedule, isTaken: true }
            : schedule
        )
      );
      
      setMessage('✅ Đánh dấu đã uống thuốc thành công!');
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    if (studentId) {
      loadTodaySchedules(studentId);
    } else {
      setTodaySchedules([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'status-pending', text: 'Chờ xác nhận' },
      'APPROVED': { class: 'status-approved', text: 'Đã duyệt' },
      'REJECTED': { class: 'status-rejected', text: 'Từ chối' },
      'COMPLETED': { class: 'status-completed', text: 'Hoàn thành' }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    return <span className={config.class}>{config.text}</span>;
  };

  const getActionButtons = (request) => {
    if (userRole === 'PARENT') {
      return (
        <button className="btn-small">
          <FaEye /> Xem Chi Tiết
        </button>
      );
    }

    if (request.status === 'PENDING') {
      return (
        <div className="action-buttons">
          <button 
            onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
            className="btn-small btn-success"
            disabled={loading}
          >
            <FaCheck /> Duyệt
          </button>
          <button 
            onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
            className="btn-small btn-danger"
            disabled={loading}
          >
            <FaTimes /> Từ Chối
          </button>
        </div>
      );
    }

    return (
      <button className="btn-small">
        <FaEdit /> Chỉnh Sửa
      </button>
    );
  };

  const filteredRequests = medicationRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.medicationName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatistics = () => {
    const total = medicationRequests.length;
    const pending = medicationRequests.filter(r => r.status === 'PENDING').length;
    const approved = medicationRequests.filter(r => r.status === 'APPROVED').length;
    const rejected = medicationRequests.filter(r => r.status === 'REJECTED').length;
    const completed = medicationRequests.filter(r => r.status === 'COMPLETED').length;

    return { total, pending, approved, rejected, completed };
  };

  const stats = getStatistics();

  return (
    <div className="medication-management-container">
      {/* Header */}
      <div className="medication-management-header">
        <h1 className="medication-management-title">
          <FaPills style={{ marginRight: '10px' }} />
          Quản lý Thuốc
        </h1>
        <p className="medication-management-subtitle">
          {userRole === 'ADMIN' && 'Quản lý tất cả đơn thuốc trong hệ thống'}
          {userRole === 'NURSE' && 'Quản lý đơn thuốc và lịch uống thuốc của học sinh'}
          {userRole === 'PARENT' && 'Theo dõi đơn thuốc của con em'}
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="statistics">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Tổng đơn thuốc</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Chờ xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Đã duyệt</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Hoàn thành</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="medication-tabs">
        <button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <FaPills /> Đơn Thuốc
        </button>
        {(userRole === 'NURSE' || userRole === 'ADMIN') && (
          <button 
            className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            <FaClock /> Lịch Uống Thuốc
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="medication-content">
        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="requests-tab">
            <div className="controls">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên học sinh hoặc thuốc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="REJECTED">Từ chối</option>
                  <option value="COMPLETED">Hoàn thành</option>
                </select>
              </div>
              <button 
                onClick={loadMedicationRequests}
                className="btn-secondary"
                disabled={loading}
              >
                <FaSync /> Làm mới
              </button>
            </div>

            <div className="requests-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã HS</th>
                    <th>Họ Tên</th>
                    <th>Lớp</th>
                    <th>Tên Thuốc</th>
                    <th>Liều Lượng</th>
                    <th>Ngày Gửi</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.studentId}</td>
                      <td>{request.studentName}</td>
                      <td>{request.className}</td>
                      <td>{request.medicationName}</td>
                      <td>{request.dosage}</td>
                      <td>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{getActionButtons(request)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRequests.length === 0 && !loading && (
                <div className="empty-state">
                  <FaPills style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                  <p>Không có đơn thuốc nào</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedules Tab (Nurse/Admin only) */}
        {activeTab === 'schedules' && (userRole === 'NURSE' || userRole === 'ADMIN') && (
          <div className="schedules-tab">
            <div className="student-selector">
              <label>Chọn học sinh:</label>
              <select
                value={selectedStudent}
                onChange={handleStudentChange}
                className="student-select"
              >
                <option value="">-- Chọn học sinh --</option>
                {medicationRequests
                  .filter(request => request.status === 'APPROVED')
                  .map(request => (
                    <option key={request.studentId} value={request.studentId}>
                      {request.studentName} - {request.className}
                    </option>
                  ))
                }
              </select>
            </div>

            {selectedStudent && (
              <div className="schedules-list">
                <h3>Lịch Uống Thuốc Hôm Nay</h3>
                <div className="schedules-grid">
                  {todaySchedules.map(schedule => (
                    <div key={schedule.id} className={`schedule-card ${schedule.isTaken ? 'taken' : ''}`}>
                      <div className="schedule-header">
                        <h4>{schedule.medicationName}</h4>
                        <span className={`status ${schedule.isTaken ? 'taken' : 'pending'}`}>
                          {schedule.isTaken ? 'Đã uống' : 'Chưa uống'}
                        </span>
                      </div>
                      <div className="schedule-details">
                        <p><strong>Liều lượng:</strong> {schedule.dosage}</p>
                        <p><strong>Thời gian:</strong> {schedule.time}</p>
                        <p><strong>Ghi chú:</strong> {schedule.notes || 'Không có'}</p>
                      </div>
                      {!schedule.isTaken && (
                        <button
                          onClick={() => handleMarkAsTaken(schedule.id)}
                          className="btn-primary"
                          disabled={loading}
                        >
                          <FaCheck /> Đánh Dấu Đã Uống
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {todaySchedules.length === 0 && (
                  <div className="empty-state">
                    <FaClock style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                    <p>Không có lịch uống thuốc nào hôm nay</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationManagement; 