import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaPlus,
  FaUsers,
  FaEnvelope,
  FaCheck,
  FaStethoscope,
  FaFileAlt,
  FaEdit
} from 'react-icons/fa';
import {
  createMedicalCheckup,
  sendBroadcastCheckup,
  getStudentsNeedCheckup,
  sendHealthCheckupResults,
  getHealthCheckupResult,
  getMedicalCheckupNotices,
  getMedicalCheckupSchedules,
  getAllStudents,
  getCheckedStudents
} from '../services/healthCheckupApi';
import './HealthCheckupManagement.css';

const HealthCheckupManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function để tạo UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };

  // States for checkup type creation
  const [checkupForm, setCheckupForm] = useState({
    checkupName: '',
    checkupDate: '',
    description: '',
    frequency: '',
    requirements: ''
  });

  // States for student management
  const [selectedCheckup, setSelectedCheckup] = useState('');
  const [checkupTypes, setCheckupTypes] = useState([]); // Danh sách loại kiểm tra từ database
  const [studentsToCheckup, setStudentsToCheckup] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [studentsNeedCheckup, setStudentsNeedCheckup] = useState([]); // Học sinh cần kiểm tra từ DB
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // States for checkup results
  const [checkupResults, setCheckupResults] = useState([]);

  // States for UI
  const [activeTab, setActiveTab] = useState('create');

  // Load danh sách đợt kiểm tra y tế đã tạo
  const loadCheckupTypes = useCallback(async () => {
    try {
      setLoading(true);
      
      // Thử lấy danh sách đợt kiểm tra y tế đã tạo trước
      let checkupSchedules = [];
      try {
        checkupSchedules = await getMedicalCheckupSchedules();
        console.log('✅ Medical checkup schedules loaded from API:', checkupSchedules);
      } catch (error) {
        console.log('⚠️ Không thể lấy danh sách đợt kiểm tra, thử lấy thông báo...');
      }
      
      // Nếu không có đợt kiểm tra, thử lấy thông báo kiểm tra y tế
      if (checkupSchedules.length === 0) {
        try {
          const medicalCheckupNotices = await getMedicalCheckupNotices();
          console.log('✅ Medical checkup notices loaded from API:', medicalCheckupNotices);
          
          // Chuyển đổi dữ liệu từ MedicalCheckupNoticeResponse thành format phù hợp
          checkupSchedules = medicalCheckupNotices.map(notice => ({
            id: notice.id,
            name: notice.checkupTitle,
            date: notice.checkupDate,
            studentName: notice.studentName,
            className: notice.className,
            isConfirmed: notice.isConfirmed,
            sentAt: notice.sentAt,
            confirmedAt: notice.confirmedAt
          }));
        } catch (error) {
          console.log('⚠️ Không thể lấy thông báo kiểm tra y tế');
        }
      }
      
      // Lọc unique theo tên đợt kiểm tra để tránh trùng lặp
      const uniqueSchedules = checkupSchedules.reduce((acc, current) => {
        const name = current.name || current.checkupTitle || current.title || 'Không có tên';
        const exists = acc.find(item => 
          (item.name || item.checkupTitle || item.title) === name
        );
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      console.log('✅ Đã lọc unique:', uniqueSchedules.length, 'items từ', checkupSchedules.length, 'items gốc');
      setCheckupTypes(uniqueSchedules);

      // Nếu có loại kiểm tra và chưa chọn loại nào, tự động chọn loại đầu tiên
      if (uniqueSchedules.length > 0 && !selectedCheckup) {
        setSelectedCheckup(uniqueSchedules[0].name);
      }
    } catch (error) {
      console.error('❌ Lỗi load checkup types:', error);
      setMessage('❌ Lỗi tải danh sách đợt kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCheckup]);

  useEffect(() => {
    loadPendingCheckups();
    loadCheckupResults();
    loadCheckupTypes(); // Load danh sách loại kiểm tra từ database
    loadStudentsNeedCheckup(); // Load danh sách học sinh cần kiểm tra từ DB

    // Xử lý query parameter để chuyển tab
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab === 'results') {
      setActiveTab('results');
    }
  }, [loadCheckupTypes, location.search]);

  const loadPendingCheckups = async () => {
    try {
      setLoading(true);
      // Tạm thời sử dụng getAllStudents thay vì getStudentsNeedCheckup
      const response = await getAllStudents();
      console.log('📋 Students need checkup:', response);
      setPendingStudents(response);
    } catch (error) {
      console.error('❌ Error loading pending checkups:', error);
      setMessage('❌ Lỗi tải danh sách học sinh cần kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách học sinh cần kiểm tra từ database
  const loadStudentsNeedCheckup = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents(); // Sử dụng API getAllStudents thay vì getStudentsNeedCheckupFromDB
      console.log('📋 All students from DB:', response);
      setStudentsNeedCheckup(response);
    } catch (error) {
      console.error('❌ Error loading all students from DB:', error);
      setMessage('❌ Lỗi tải danh sách học sinh từ DB: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCheckupResults = async () => {
    try {
      setLoading(true);
      const response = await getCheckedStudents();
      setCheckupResults(response);
      console.log('📋 Checkup results loaded from API:', response);
    } catch (error) {
      console.error('Lỗi tải kết quả kiểm tra y tế:', error);
      setMessage('❌ Lỗi tải kết quả kiểm tra y tế: ' + error.message);
    } finally {
      setLoading(false);
    }
  };



  // Checkup Type Creation
  const handleCheckupFormChange = (e) => {
    const { name, value } = e.target;
    setCheckupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCheckup = async (e) => {
    e.preventDefault();

    // Validation
    if (!checkupForm.checkupName.trim()) {
      setMessage('❌ Vui lòng nhập tên lịch kiểm tra');
      return;
    }

    if (!checkupForm.description.trim()) {
      setMessage('❌ Vui lòng nhập nội dung kiểm tra');
      return;
    }

    if (!checkupForm.checkupDate) {
      setMessage('❌ Vui lòng chọn ngày kiểm tra');
      return;
    }

    try {
      setLoading(true);

      // Chuyển đổi dữ liệu để phù hợp với MedicalCheckupCreateRequest
      const checkupData = {
        checkupTitle: checkupForm.checkupName.trim(),
        checkupDate: checkupForm.checkupDate,
        content: checkupForm.description.trim()
      };

      console.log('📤 Gửi dữ liệu lịch kiểm tra:', checkupData);

      await createMedicalCheckup(checkupData);
      setMessage('✅ Tạo lịch kiểm tra y tế thành công!');
      setCheckupForm({
        checkupName: '',
        checkupDate: '',
        description: '',
        frequency: '',
        requirements: ''
      });

      // Tự động load lại danh sách loại kiểm tra sau khi tạo thành công
      await loadCheckupTypes();
    } catch (error) {
      setMessage('❌ Lỗi tạo lịch kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Student Management
  const handleGetStudentsToCheckup = async () => {
    if (!selectedCheckup) {
      setMessage('❌ Vui lòng chọn đợt kiểm tra y tế');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Đang lấy tất cả học sinh từ database...');

      // Gọi API để lấy tất cả học sinh từ database
      const response = await getAllStudents();
      console.log('✅ Tất cả học sinh từ database:', response);

      setStudentsToCheckup(response);
      setMessage(`✅ Tìm thấy ${response.length} học sinh để gửi thông báo cho đợt kiểm tra: ${selectedCheckup}`);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách học sinh:', error);
      setMessage('❌ Lỗi lấy danh sách học sinh: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCheckupNotices = async () => {
    if (studentsToCheckup.length === 0) {
      setMessage('❌ Không có học sinh nào để gửi thông báo');
      return;
    }

    // Xác nhận trước khi gửi
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn gửi thông báo kiểm tra y tế ${selectedCheckup} cho TOÀN THỂ ${studentsToCheckup.length} học sinh?\n\n` +
      `📅 Ngày dự kiến: ${new Date().toLocaleDateString('vi-VN')}\n` +
      `📍 Địa điểm: Phòng y tế trường học\n` +
      `📝 Ghi chú: Thông báo kiểm tra y tế ${selectedCheckup} cho toàn thể học sinh\n` +
      `⚠️ Lưu ý: Thông báo này sẽ được gửi cho TẤT CẢ học sinh, không cần xác nhận từ phụ huynh\n\n` +
      `Hệ thống sẽ tự động gửi email thông báo đến phụ huynh của ${studentsToCheckup.length} học sinh.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      console.log('📧 Chuẩn bị gửi thông báo kiểm tra y tế cho toàn thể học sinh...');
      console.log('🎯 Loại kiểm tra:', selectedCheckup);
      console.log('👥 Số học sinh toàn thể:', studentsToCheckup.length);

      // Tạo request cho API email
      const emailRequest = {
        checkupTitle: selectedCheckup,
        checkupDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
        location: 'Phòng y tế trường học',
        content: `Thông báo kiểm tra y tế ${selectedCheckup} cho học sinh`,
        studentIds: studentsToCheckup
          .filter(student => student.studentId || student.studentCode || student.id)
          .map(student => student.studentId || student.studentCode || student.id)
      };

      console.log('📋 Email request body:', emailRequest);

      // Kiểm tra có học sinh nào không
      if (emailRequest.studentIds.length === 0) {
        throw new Error('Không có học sinh nào để gửi thông báo');
      }

      console.log('✅ Số học sinh toàn thể sẽ gửi email thông báo:', emailRequest.studentIds.length);

      await sendBroadcastCheckup(emailRequest);
      setMessage('✅ Đã gửi thông báo kiểm tra y tế cho toàn thể học sinh thành công!');
      setStudentsToCheckup([]);
    } catch (error) {
      console.error('❌ Lỗi gửi thông báo:', error);
      setMessage('❌ Lỗi gửi thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Checkup Results


  const handleSendCheckupResults = async (checkupId, date) => {
    try {
      setLoading(true);
      setMessage('📧 Đang gửi kết quả khám sức khỏe qua email...');
      
      await sendHealthCheckupResults(checkupId, date);
      setMessage('✅ Đã gửi kết quả khám sức khỏe cho phụ huynh thành công!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Lỗi gửi kết quả khám sức khỏe:', error);
      setMessage('❌ Lỗi gửi kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="health-checkup-management">
      <div className="health-checkup-header">
        <h1><FaStethoscope /> Quản Lý Kiểm Tra Y Tế Định Kỳ</h1>
        <p>Hệ thống quản lý kiểm tra y tế định kỳ cho học sinh</p>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="health-checkup-tabs">
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <FaPlus /> Tạo Lịch Kiểm Tra
        </button>
        <button
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <FaUsers /> Quản Lý Học Sinh
        </button>
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <FaCheck /> Học Sinh Cần Kiểm Tra
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <FaFileAlt /> Kết Quả Kiểm Tra
        </button>
      </div>

      <div className="health-checkup-content">
        {/* Create Checkup Schedule Tab */}
        {activeTab === 'create' && (
          <div className="checkup-creation">
            <h2><FaPlus /> Tạo Lịch Kiểm Tra Y Tế Mới</h2>
            <form onSubmit={handleCreateCheckup} className="checkup-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Lịch Kiểm Tra *</label>
                  <input
                    type="text"
                    name="checkupName"
                    value={checkupForm.checkupName}
                    onChange={handleCheckupFormChange}
                    required
                    placeholder="VD: Kiểm tra sức khỏe định kỳ tháng 12"
                  />
                </div>
                <div className="form-group">
                  <label>Ngày Kiểm Tra *</label>
                  <input
                    type="date"
                    name="checkupDate"
                    value={checkupForm.checkupDate}
                    onChange={handleCheckupFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nội Dung Kiểm Tra *</label>
                  <textarea
                    name="description"
                    value={checkupForm.description}
                    onChange={handleCheckupFormChange}
                    required
                    placeholder="Mô tả chi tiết nội dung kiểm tra y tế"
                  />
                </div>
                <div className="form-group">
                  <label>Tần suất</label>
                  <input
                    type="text"
                    name="frequency"
                    value={checkupForm.frequency}
                    onChange={handleCheckupFormChange}
                    placeholder="VD: Định kỳ 6 tháng/lần"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Yêu cầu đặc biệt</label>
                  <textarea
                    name="requirements"
                    value={checkupForm.requirements}
                    onChange={handleCheckupFormChange}
                    placeholder="Yêu cầu đặc biệt cho lịch kiểm tra này"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Lịch Kiểm Tra'}
              </button>
            </form>
          </div>
        )}

        {/* Students Management Tab */}
        {activeTab === 'students' && (
          <div className="students-management">
            <h2><FaUsers /> Quản Lý Học Sinh Kiểm Tra Y Tế</h2>

            <div className="checkup-selection">
              <div className="form-group">
                <label>Chọn Đợt Kiểm Tra Y Tế</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={selectedCheckup}
                    onChange={(e) => setSelectedCheckup(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Chọn đợt kiểm tra y tế --</option>
                    {checkupTypes.map((checkup, index) => {
                      const name = checkup.name || checkup.checkupTitle || checkup.title || 'Không có tên';
                      return (
                        <option key={checkup.id || index} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={loadCheckupTypes}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    disabled={loading}
                  >
                    {loading ? '⏳' : '🔄'}
                  </button>
                </div>
                {loading && <small style={{ color: '#667eea' }}>Đang tải danh sách đợt kiểm tra y tế...</small>}
                {checkupTypes.length === 0 && !loading && (
                  <small style={{ color: '#e67e22' }}>Không có đợt kiểm tra y tế nào. Hãy tạo đợt kiểm tra trước.</small>
                )}
                {checkupTypes.length > 0 && (
                  <small style={{ color: '#27ae60' }}>✅ Đã tải {checkupTypes.length} đợt kiểm tra y tế từ database</small>
                )}
              </div>
              <button
                onClick={handleGetStudentsToCheckup}
                className="btn-secondary"
                disabled={!selectedCheckup || loading}
              >
                {loading ? 'Đang tải...' : 'Lấy Tất Cả Học Sinh Từ Database'}
              </button>
              <div style={{ marginTop: '10px' }}>
                <small style={{ color: '#666' }}>
                  🔍 Lấy tất cả học sinh từ database để gửi thông báo cho toàn thể học sinh
                </small>
                {checkupTypes.length > 0 && (
                  <div style={{ marginTop: '5px' }}>
                    <small style={{ color: '#27ae60', fontSize: '11px' }}>
                      ✨ Đã lọc {checkupTypes.length} đợt kiểm tra unique từ dữ liệu gốc
                    </small>
                  </div>
                )}
              </div>
            </div>

            {studentsToCheckup.length > 0 && (
              <div className="students-list">
                <h3>Danh Sách Tất Cả Học Sinh: {selectedCheckup}</h3>
                <div style={{
                  background: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  border: '1px solid #27ae60'
                }}>
                  <small style={{ color: '#27ae60' }}>
                    📋 Danh sách tất cả học sinh từ database, sẵn sàng gửi thông báo cho toàn thể học sinh
                  </small>
                </div>
                <div className="students-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã HS</th>
                        <th>Họ Tên</th>
                        <th>Lớp</th>
                        <th>Email PH</th>
                        <th>Lý Do</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsToCheckup.map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentCode || student.student_code || student.id || 'N/A'}</td>
                          <td>{student.studentName || student.fullName || student.name || student.student_name || 'N/A'}</td>
                          <td>{student.className || student.class_name || student.class || 'N/A'}</td>
                          <td>{student.parentEmail || student.parent_email || student.email || 'N/A'}</td>
                          <td>
                            <span style={{ color: '#e67e22', fontSize: '12px' }}>
                              Thông báo kiểm tra y tế định kỳ
                            </span>
                          </td>
                          <td>
                            <span className="status pending">Sẽ gửi thông báo</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleSendCheckupNotices}
                  className="btn-primary"
                  disabled={loading || studentsToCheckup.length === 0}
                  style={{
                    opacity: studentsToCheckup.length === 0 ? 0.6 : 1,
                    cursor: studentsToCheckup.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FaEnvelope />
                  {loading ? 'Đang gửi...' : `Gửi Thông Báo Kiểm Tra Y Tế (${studentsToCheckup.length} học sinh)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pending Checkups Tab */}
        {activeTab === 'pending' && (
          <div className="pending-checkups">
            <h2><FaCheck /> Danh Sách Học Sinh Để Kiểm Tra Y Tế</h2>

            {studentsNeedCheckup.length > 0 && (
              <div className="info-message" style={{
                background: '#d4edda',
                color: '#155724',
                padding: '10px 15px',
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #c3e6cb'
              }}>
                ✅ Tìm thấy {studentsNeedCheckup.length} học sinh từ database để kiểm tra y tế
              </div>
            )}

            <div className="actions">
              <button
                onClick={loadStudentsNeedCheckup}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Lấy Tất Cả Học Sinh Từ Database'}
              </button>

            </div>

            {studentsNeedCheckup.length > 0 ? (
              <div className="pending-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ Tên</th>
                      <th>Lớp</th>
                      <th>Email PH</th>
                      <th>Loại Kiểm Tra</th>
                      <th>Ngày Gửi TB</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsNeedCheckup.map((student, index) => (
                      <tr key={index}>
                        <td>{student.studentCode || student.student_code || student.id || 'N/A'}</td>
                        <td>{student.studentName || student.fullName || student.name || student.student_name || 'N/A'}</td>
                        <td>{student.className || student.class_name || student.class || 'N/A'}</td>
                        <td>{student.parentEmail || student.parent_email || student.email || 'N/A'}</td>
                        <td>{student.checkupType || student.checkup_title || 'Kiểm tra định kỳ'}</td>
                        <td>{student.sentAt ? formatDate(student.sentAt) : 'N/A'}</td>
                        <td>
                          <span className="status pending">Sẵn sàng kiểm tra</span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              console.log('🔍 Click button Ghi Nhận Kết Quả cho học sinh:', student);
                              console.log('🔍 Student object keys:', Object.keys(student));
                              console.log('🔍 Student ID fields:', {
                                studentId: student.studentId,
                                student_code: student.student_code,
                                id: student.id,
                                studentCode: student.studentCode
                              });
                              
                              // Tìm studentId đúng
                              const actualStudentId = student.studentId || student.student_code || student.id || student.studentCode;
                              console.log('🔍 Actual studentId to use:', actualStudentId);
                              
                              if (!actualStudentId) {
                                alert('❌ Không tìm thấy mã học sinh hợp lệ!');
                                return;
                              }
                              
                              // Lưu thông tin học sinh vào localStorage
                              const studentCode = student.studentCode || student.student_code || student.studentId || student.id;
                              console.log('🔍 StudentCode to save:', studentCode);
                              console.log('🔍 Student object for localStorage:', {
                                ...student,
                                studentId: actualStudentId,
                                studentCode: studentCode
                              });
                              localStorage.setItem('selectedStudent', JSON.stringify({
                                ...student,
                                studentId: actualStudentId, // Đảm bảo có studentId đúng
                                studentCode: studentCode // Thêm studentCode
                              }));
                              
                              // Chuyển sang trang nhập kết quả
                              navigate(`/health-checkup-result-form/${actualStudentId}`);
                            }}
                            className="btn-small"
                            style={{ backgroundColor: '#28a745', color: 'white' }}
                          >
                            <FaEdit /> Ghi Nhận Kết Quả
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>Không có học sinh nào trong database hoặc chưa load dữ liệu</p>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="checkup-results">
            <h2><FaFileAlt /> Kết Quả Kiểm Tra Y Tế</h2>

            <div className="actions">
              <button
                onClick={loadCheckupResults}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm Mới'}
              </button>
              <button
                onClick={() => {
                  // Lấy ngày hiện tại
                  const today = new Date().toISOString().split('T')[0];
                  // Tạo UUID cho checkupId
                  const checkupId = generateUUID();
                  handleSendCheckupResults(checkupId, today);
                }}
                className="btn-primary"
                disabled={loading}
              >
                <FaEnvelope /> Gửi Kết Quả Cho PH
              </button>
            </div>

            {checkupResults.length > 0 ? (
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ Tên</th>
                      <th>Lớp</th>
                      <th>Ngày Kiểm Tra</th>
                      <th>Chiều Cao (cm)</th>
                      <th>Cân Nặng (kg)</th>
                      <th>Y Tá Khám</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkupResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.studentId || 'N/A'}</td>
                        <td>{result.studentName || 'N/A'}</td>
                        <td>{result.className || 'N/A'}</td>
                        <td>{result.checkupDate ? formatDate(result.checkupDate) : 'N/A'}</td>
                        <td>{result.heightCm || 'N/A'}</td>
                        <td>{result.weightKg || 'N/A'}</td>
                        <td>{result.nurseName || 'N/A'}</td>
                        <td>
                          <span className="status completed">
                            Đã kiểm tra y tế định kỳ
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              const checkupId = generateUUID();
                              const checkupDate = result.checkupDate || new Date().toISOString().split('T')[0];
                              handleSendCheckupResults(checkupId, checkupDate);
                            }}
                            className="btn-small"
                            style={{ backgroundColor: '#667eea', color: 'white' }}
                            title="Gửi kết quả qua email cho phụ huynh"
                          >
                            <FaEnvelope /> Gửi Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>Chưa có kết quả kiểm tra y tế nào</p>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default HealthCheckupManagement; 