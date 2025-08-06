import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaUsers,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaSyringe,
  FaFileAlt,
  FaEdit,
  FaList
} from 'react-icons/fa';
import {
  createVaccineType,
  getStudentsToVaccinate,
  sendVaccinationNotices,
  createVaccinationResult,
  sendVaccinationResults,
  getVaccinationResult,
  getVaccineTypes,
  getVaccinationConfirmations
} from '../services/vaccinationApi';
import VaccinationResultForm from './VaccinationResultForm';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
  // Check user role and authentication
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and role
    const accessToken = localStorage.getItem('access_token');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    
    setIsAuthenticated(!!accessToken);
    setUserRole(loggedInUser.role || loggedInUser.authorities?.[0] || null);
    
    console.log('🔐 VaccinationManagement - User Info:', {
      isAuthenticated: !!accessToken,
      userRole: loggedInUser.role || loggedInUser.authorities?.[0],
      userInfo: loggedInUser
    });
  }, []);

  // States for vaccine creation
  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: '',
    description: '',
    doseNumber: '',
    interval: ''
  });

  // States for student management
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [vaccineTypes, setVaccineTypes] = useState([]); // Danh sách vaccine từ database
  const [studentsToVaccinate, setStudentsToVaccinate] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState({}); // Trạng thái thông báo cho từng học sinh

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // States for vaccination results
  const [vaccinationResults, setVaccinationResults] = useState([]);
  const [resultForm, setResultForm] = useState({
    studentId: '',
    vaccineName: '',
    vaccinationDate: '',
    symptoms: '',
    notes: '',
    status: 'COMPLETED'
  });

  // States for UI
  const [activeTab, setActiveTab] = useState('create');
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmedStudents, setConfirmedStudents] = useState([]); // Danh sách học sinh phụ huynh đã xác nhận đồng ý tiêm

  useEffect(() => {
    loadVaccinationResults();
    loadVaccineTypes(); // Load danh sách vaccine từ database
    loadConfirmedStudents(); // Load danh sách học sinh phụ huynh đã xác nhận
  }, []);



  const loadVaccinationResults = async () => {
    try {
      const response = await getVaccinationResult();
      setVaccinationResults(response);
    } catch (error) {
      console.error('Lỗi tải kết quả tiêm chủng:', error);
    }
  };

  // Load danh sách vaccine types từ database
  const loadVaccineTypes = async () => {
    try {
      setLoading(true);
      const vaccineTypes = await getVaccineTypes();
      setVaccineTypes(vaccineTypes);
      console.log('✅ Vaccine types loaded from API:', vaccineTypes);

      // Nếu có vaccine và chưa chọn vaccine nào, tự động chọn vaccine đầu tiên
      if (vaccineTypes.length > 0 && !selectedVaccine) {
        setSelectedVaccine(vaccineTypes[0].name);
      }
    } catch (error) {
      console.error('Lỗi tải vaccine types:', error);
      setMessage('❌ Lỗi tải danh sách vaccine: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách học sinh phụ huynh đã xác nhận đồng ý tiêm
  const loadConfirmedStudents = async () => {
    try {
      setLoading(true);
      console.log('🔍 Đang lấy danh sách học sinh đã được phụ huynh xác nhận...');
      
      const response = await getVaccinationConfirmations();
      console.log('✅ Danh sách học sinh phụ huynh đã xác nhận:', response);
      
      // Chuyển đổi dữ liệu từ API response sang format phù hợp với UI
      // Dựa trên DTO VaccinationConfirmationResponse:
      // - studentId: UUID
      // - studentName: String
      // - vaccineName: String
      // - scheduledDate: LocalDate
      // - status: String
      // - confirmedAt: LocalDateTime
      const formattedStudents = response.map(confirmation => ({
        studentId: confirmation.studentId,
        studentCode: confirmation.studentId, // Sử dụng studentId làm studentCode
        studentName: confirmation.studentName,
        vaccineName: confirmation.vaccineName,
        vaccinationDate: confirmation.confirmedAt || confirmation.scheduledDate,
        parentEmail: 'N/A', // DTO không có trường này
        className: 'N/A', // DTO không có trường này
        status: confirmation.status,
        confirmedAt: confirmation.confirmedAt,
        scheduledDate: confirmation.scheduledDate
      }));
      
      setConfirmedStudents(formattedStudents);
      console.log('✅ Đã format dữ liệu cho UI:', formattedStudents);
    } catch (error) {
      console.error('Lỗi tải danh sách học sinh đã xác nhận:', error);
      setMessage('❌ Lỗi tải danh sách học sinh đã xác nhận: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Vaccine Creation
  const handleVaccineFormChange = (e) => {
    const { name, value } = e.target;
    setVaccineForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateVaccine = async (e) => {
    e.preventDefault();

    // Validation
    if (!vaccineForm.vaccineName.trim()) {
      setMessage('❌ Vui lòng nhập tên vaccine');
      return;
    }

    if (!vaccineForm.description.trim()) {
      setMessage('❌ Vui lòng nhập mô tả vaccine');
      return;
    }

    try {
      setLoading(true);

      // Chuyển đổi dữ liệu để phù hợp với CreateVaccineTypeRequest
      const vaccineData = {
        name: vaccineForm.vaccineName.trim(),
        description: vaccineForm.description.trim(),
        dosesRequired: parseInt(vaccineForm.doseNumber) || 1,
        intervalDays: parseInt(vaccineForm.interval) || 0
      };

      console.log('📤 Gửi dữ liệu vaccine:', vaccineData);

      await createVaccineType(vaccineData);
      setMessage('✅ Tạo loại vaccine thành công!');
      setVaccineForm({
        vaccineName: '',
        description: '',
        doseNumber: '',
        interval: ''
      });

      // Tự động load lại danh sách vaccine sau khi tạo thành công
      await loadVaccineTypes();
    } catch (error) {
      setMessage('❌ Lỗi tạo vaccine: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Student Management
  const handleGetStudentsToVaccinate = async () => {
    if (!selectedVaccine) {
      setMessage('❌ Vui lòng chọn loại vaccine');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Đang lấy danh sách học sinh chưa tiêm vaccine:', selectedVaccine);

      const response = await getStudentsToVaccinate(selectedVaccine);
      console.log('✅ Danh sách học sinh chưa tiêm từ API:', response);
      console.log('🔍 Chi tiết từng học sinh:');
      response.forEach((student, index) => {
        console.log(`=== HỌC SINH ${index + 1} ===`);
        console.log('📋 Tất cả fields:', Object.keys(student));
        console.log('🎯 Student Code fields:', {
          studentCode: student.studentCode,
          code: student.code,
          student_code: student.student_code,
          studentId: student.studentId,
          id: student.id,
          student_id: student.student_id
        });
        console.log('📧 Email fields:', {
          parentEmail: student.parentEmail,
          email: student.email,
          parent_email: student.parent_email,
          contactEmail: student.contactEmail,
          contact_email: student.contact_email
        });
        console.log('👤 Name fields:', {
          studentName: student.studentName,
          fullName: student.fullName,
          name: student.name,
          student_name: student.student_name
        });
        console.log('🏫 Class fields:', {
          className: student.className,
          class_name: student.class_name,
          class: student.class
        });
        console.log('📄 Full object:', student);
        console.log('========================');
      });

      setStudentsToVaccinate(response);
      
      // Reset trạng thái thông báo cho danh sách học sinh mới
      const resetStatus = {};
      response.forEach(student => {
        const studentId = student.studentId || student.studentCode || student.id;
        resetStatus[studentId] = 'waiting';
      });
      setNotificationStatus(prev => ({ ...prev, ...resetStatus }));
      
      setMessage(`✅ Tìm thấy ${response.length} học sinh chưa tiêm ${selectedVaccine} (dữ liệu từ khai báo sức khỏe)`);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách học sinh:', error);
      setMessage('❌ Lỗi lấy danh sách học sinh chưa tiêm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVaccinationNotices = async () => {
    if (studentsToVaccinate.length === 0) {
      setMessage('❌ Không có học sinh nào để gửi thông báo');
      return;
    }

    // Xác nhận trước khi gửi
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn gửi thông báo tiêm chủng ${selectedVaccine} cho ${studentsToVaccinate.length} học sinh?\n\n` +
      `📅 Ngày dự kiến: ${new Date().toLocaleDateString('vi-VN')}\n` +
      `📍 Địa điểm: Phòng y tế trường học\n` +
      `📝 Ghi chú: Thông báo tiêm chủng ${selectedVaccine} cho học sinh\n\n` +
      `Hệ thống sẽ tự động gửi email thông báo đến phụ huynh của ${studentsToVaccinate.length} học sinh.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      console.log('📧 Chuẩn bị gửi thông báo tiêm chủng...');
      console.log('🎯 Vaccine:', selectedVaccine);
      console.log('👥 Số học sinh:', studentsToVaccinate.length);

      // Cập nhật trạng thái thành "Chờ gửi thông báo" cho tất cả học sinh
      const newStatus = {};
      studentsToVaccinate.forEach(student => {
        const studentId = student.studentId || student.studentCode || student.id;
        newStatus[studentId] = 'pending';
      });
      setNotificationStatus(prev => ({ ...prev, ...newStatus }));

      // Tìm vaccine type ID từ selected vaccine name
      const selectedVaccineType = vaccineTypes.find(vaccine => vaccine.name === selectedVaccine);
      if (!selectedVaccineType) {
        throw new Error('Không tìm thấy thông tin vaccine type');
      }

      const request = {
        vaccineTypeId: selectedVaccineType.id || selectedVaccineType.vaccine_type_id,
        scheduledDate: new Date().toISOString(), // Format ISO datetime
        location: 'Phòng y tế trường học',
        note: `Thông báo tiêm chủng ${selectedVaccine} cho học sinh`,
        studentIds: studentsToVaccinate
          .filter(student => student.studentId || student.studentCode || student.id)
          .map(student => student.studentId || student.studentCode || student.id)
      };

      console.log('📋 Request body:', request);
      console.log('🎯 Vaccine Type ID:', request.vaccineTypeId);
      console.log('📅 Scheduled date:', request.scheduledDate);
      console.log('📍 Location:', request.location);
      console.log('📝 Note:', request.note);
      console.log('👥 Student IDs:', request.studentIds);
      console.log('📊 Số học sinh:', request.studentIds.length);

      // Kiểm tra có học sinh nào không
      if (request.studentIds.length === 0) {
        throw new Error('Không có học sinh nào để gửi thông báo');
      }

      console.log('✅ Số học sinh sẽ gửi thông báo:', request.studentIds.length);

      await sendVaccinationNotices(request);
      
      // Cập nhật trạng thái thành "Đã gửi thông báo" cho tất cả học sinh
      const sentStatus = {};
      studentsToVaccinate.forEach(student => {
        const studentId = student.studentId || student.studentCode || student.id;
        sentStatus[studentId] = 'sent';
      });
      setNotificationStatus(prev => ({ ...prev, ...sentStatus }));
      
      setMessage('✅ Đã gửi thông báo tiêm chủng thành công!');
      // Không xóa danh sách học sinh nữa
    } catch (error) {
      console.error('❌ Lỗi gửi thông báo:', error);
      setMessage('❌ Lỗi gửi thông báo: ' + error.message);
      
      // Reset trạng thái về "Chờ xác nhận" nếu gửi thất bại
      const resetStatus = {};
      studentsToVaccinate.forEach(student => {
        const studentId = student.studentId || student.studentCode || student.id;
        resetStatus[studentId] = 'waiting';
      });
      setNotificationStatus(prev => ({ ...prev, ...resetStatus }));
    } finally {
      setLoading(false);
    }
  };



  // Vaccination Results
  const handleResultFormChange = (e) => {
    const { name, value } = e.target;
    setResultForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateVaccinationResult = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createVaccinationResult(resultForm);
      setMessage('✅ Lưu kết quả tiêm thành công!');
      setResultForm({
        studentId: '',
        vaccineName: '',
        vaccinationDate: '',
        symptoms: '',
        notes: '',
        status: 'COMPLETED'
      });
      setShowResultForm(false);
      loadVaccinationResults();
    } catch (error) {
      setMessage('❌ Lỗi lưu kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVaccinationResults = async () => {
    try {
      setLoading(true);
      await sendVaccinationResults();
      setMessage('✅ Đã gửi kết quả tiêm chủng cho phụ huynh!');
    } catch (error) {
      setMessage('❌ Lỗi gửi kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ghi nhận kết quả tiêm chủng cho từng học sinh
  const handleRecordVaccinationResult = (student) => {
    setSelectedStudent(student);
    setShowResultForm(true);
  };

  // Xử lý khi form đóng
  const handleCloseResultForm = () => {
    setSelectedStudent(null);
    setShowResultForm(false);
  };

  // Xử lý khi ghi nhận thành công
  const handleResultSuccess = async () => {
    await loadVaccinationResults();
    setMessage(`✅ Đã ghi nhận kết quả tiêm chủng ${selectedVaccine} cho học sinh ${selectedStudent?.studentName || selectedStudent?.fullName || selectedStudent?.name || selectedStudent?.student_name}!`);
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="vaccination-management">
      <div className="vaccination-header">
        <h1><FaSyringe /> Quản Lý Tiêm Chủng</h1>
        <p>Hệ thống quản lý tiêm chủng cho học sinh</p>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="vaccination-tabs">
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <FaPlus /> Tạo Vaccine
        </button>
        <button
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <FaUsers /> Quản Lý Học Sinh
        </button>
        {userRole === 'ADMIN' || userRole === 'NURSE' || userRole === 'admin' || userRole === 'nurse' ? (
          <button
            className={`tab ${activeTab === 'vaccinated' ? 'active' : ''}`}
            onClick={() => setActiveTab('vaccinated')}
          >
            <FaList /> Danh Sách Học Sinh Đã Xác Nhận
          </button>
        ) : (
          <button
            className="tab disabled"
            title="Chỉ Admin và Nurse mới có quyền xem danh sách này"
            disabled
          >
            <FaList /> Danh Sách Học Sinh Đã Xác Nhận
          </button>
        )}
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <FaFileAlt /> Kết Quả Tiêm Chủng
        </button>
      </div>

      <div className="vaccination-content">
        {/* Create Vaccine Tab */}
        {activeTab === 'create' && (
          <div className="vaccine-creation">
            <h2><FaPlus /> Tạo Loại Vaccine Mới</h2>
            <form onSubmit={handleCreateVaccine} className="vaccine-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Vaccine *</label>
                  <input
                    type="text"
                    name="vaccineName"
                    value={vaccineForm.vaccineName}
                    onChange={handleVaccineFormChange}
                    required
                    placeholder="VD: Vaccine COVID-19"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả *</label>
                  <textarea
                    name="description"
                    value={vaccineForm.description}
                    onChange={handleVaccineFormChange}
                    required
                    placeholder="Mô tả chi tiết về vaccine"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số liều</label>
                  <input
                    type="number"
                    name="doseNumber"
                    value={vaccineForm.doseNumber}
                    onChange={handleVaccineFormChange}
                    placeholder="VD: 2"
                  />
                </div>
                <div className="form-group">
                  <label>Khoảng cách (ngày)</label>
                  <input
                    type="number"
                    name="interval"
                    value={vaccineForm.interval}
                    onChange={handleVaccineFormChange}
                    placeholder="VD: 28"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Vaccine'}
              </button>
            </form>
          </div>
        )}

        {/* Students Management Tab */}
        {activeTab === 'students' && (
          <div className="students-management">
            <h2><FaUsers /> Quản Lý Học Sinh Tiêm Chủng</h2>

            <div className="vaccine-selection">
              <div className="form-group">
                <label>Chọn Loại Vaccine</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={selectedVaccine}
                    onChange={(e) => setSelectedVaccine(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Chọn vaccine --</option>
                    {vaccineTypes.map((vaccine) => (
                      <option key={vaccine.id || vaccine.vaccine_type_id} value={vaccine.name}>
                        {vaccine.name} - {vaccine.description}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={loadVaccineTypes}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    disabled={loading}
                  >
                    {loading ? '⏳' : '🔄'}
                  </button>
                </div>
                {loading && <small style={{ color: '#667eea' }}>Đang tải danh sách vaccine...</small>}
                {vaccineTypes.length === 0 && !loading && (
                  <small style={{ color: '#e67e22' }}>Không có vaccine nào. Hãy tạo vaccine trước.</small>
                )}
                {vaccineTypes.length > 0 && (
                  <small style={{ color: '#27ae60' }}>✅ Đã tải {vaccineTypes.length} loại vaccine từ database</small>
                )}
              </div>
              <button
                onClick={handleGetStudentsToVaccinate}
                className="btn-secondary"
                disabled={!selectedVaccine || loading}
              >
                {loading ? 'Đang tải...' : 'Lấy Danh Sách Học Sinh Chưa Tiêm'}
              </button>
              <div style={{ marginTop: '10px' }}>
                <small style={{ color: '#666' }}>
                  🔍 Tìm kiếm học sinh chưa tiêm vaccine dựa trên khai báo sức khỏe
                </small>
              </div>
            </div>

            {studentsToVaccinate.length > 0 && (
              <div className="students-list">
                <h3>Danh Sách Học Sinh Chưa Tiêm {selectedVaccine}</h3>
                <div style={{
                  background: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  border: '1px solid #27ae60'
                }}>
                  <small style={{ color: '#27ae60' }}>
                    📋 Dữ liệu được lấy từ khai báo sức khỏe của học sinh
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
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsToVaccinate.map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentCode || 'N/A'}</td>
                          <td>{student.studentName || student.fullName || student.name || student.student_name || 'N/A'}</td>
                          <td>{student.className || student.class_name || student.class || 'N/A'}</td>
                          <td>{student.parentEmail || student.parent_email || student.email || 'N/A'}</td>
                          <td>
                            <span style={{ color: '#e67e22', fontSize: '12px' }}>
                              {student.reason || student.vaccinationStatus || 'Chưa tiêm vaccine'}
                            </span>
                          </td>
                          <td>
                            {(() => {
                              const studentId = student.studentId || student.studentCode || student.id;
                              const status = notificationStatus[studentId] || 'waiting';
                              
                              switch(status) {
                                case 'pending':
                                  return <span className="status pending">Chờ gửi thông báo</span>;
                                case 'sent':
                                  return <span className="status sent">Đã gửi thông báo</span>;
                                case 'waiting':
                                default:
                                  return <span className="status waiting">Chờ xác nhận</span>;
                              }
                            })()}
                          </td>
                          <td>
                            <button
                              onClick={() => handleRecordVaccinationResult(student)}
                              className="btn-record-result"
                              title="Ghi nhận kết quả tiêm chủng"
                              disabled={loading}
                            >
                              <FaEdit /> Ghi Nhận Kết Quả
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleSendVaccinationNotices}
                  className="btn-primary"
                  disabled={loading || studentsToVaccinate.length === 0}
                  style={{
                    opacity: studentsToVaccinate.length === 0 ? 0.6 : 1,
                    cursor: studentsToVaccinate.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FaEnvelope />
                  {loading ? 'Đang gửi...' : `Gửi Thông Báo Tiêm Chủng (${studentsToVaccinate.length} học sinh)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Confirmed Students List Tab */}
        {activeTab === 'vaccinated' && (
          <div className="confirmed-students">
            <h2><FaList /> Danh Sách Học Sinh Đã Xác Nhận Tiêm Chủng</h2>
            
                             {/* Permission Check */}
                 {userRole !== 'ADMIN' && userRole !== 'NURSE' && userRole !== 'admin' && userRole !== 'nurse' && (
                   <div style={{
                     background: '#fff3cd',
                     border: '1px solid #ffeaa7',
                     color: '#856404',
                     padding: '15px',
                     borderRadius: '8px',
                     marginBottom: '20px',
                     textAlign: 'center'
                   }}>
                     <strong>⚠️ Quyền Truy Cập Hạn Chế</strong><br />
                     Chỉ Admin và Nurse mới có quyền xem danh sách học sinh đã xác nhận tiêm chủng.<br />
                     Vui lòng liên hệ admin để được cấp quyền hoặc đăng nhập với tài khoản có quyền phù hợp.
                   </div>
                 )}
                 
                 {/* 403 Error Notification */}
                 {confirmedStudents.length === 0 && (userRole === 'ADMIN' || userRole === 'NURSE' || userRole === 'admin' || userRole === 'nurse') && (
                   <div style={{
                     background: '#f8d7da',
                     border: '1px solid #f5c6cb',
                     color: '#721c24',
                     padding: '15px',
                     borderRadius: '8px',
                     marginBottom: '20px',
                     textAlign: 'center'
                   }}>
                     <strong>🚫 Lỗi Truy Cập API</strong><br />
                     Không thể lấy dữ liệu từ server (Lỗi 403 Forbidden).<br />
                     <strong>Nguyên nhân có thể:</strong><br />
                     • Backend chưa cấu hình đúng quyền cho endpoint này<br />
                     • Token xác thực không hợp lệ hoặc đã hết hạn<br />
                     • Cần kiểm tra cấu hình Spring Security ở backend<br />
                     <br />
                     <em>Vui lòng kiểm tra console để xem chi tiết lỗi và liên hệ admin để khắc phục.</em>
                     <br /><br />
                     <button 
                       onClick={loadConfirmedStudents}
                       style={{
                         background: '#007bff',
                         color: 'white',
                         border: 'none',
                         padding: '8px 16px',
                         borderRadius: '4px',
                         cursor: 'pointer',
                         fontSize: '14px'
                       }}
                     >
                       🔄 Thử Lại
                     </button>
                   </div>
                 )}

            <div className="actions">
              <button
                onClick={loadConfirmedStudents}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm Mới'}
              </button>
              <div style={{ marginLeft: '10px' }}>
                <small style={{ color: '#666' }}>
                  📊 Hiển thị danh sách học sinh mà phụ huynh đã xác nhận đồng ý tiêm chủng
                </small>
              </div>
            </div>

            {confirmedStudents.length > 0 ? (
              <div className="confirmed-students-table">
                <div style={{
                  background: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  border: '1px solid #27ae60'
                }}>
                  <small style={{ color: '#27ae60' }}>
                    ✅ Hiển thị {confirmedStudents.length} học sinh đã được phụ huynh xác nhận đồng ý tiêm chủng
                  </small>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ Tên</th>
                      <th>Lớp</th>
                      <th>Vaccine</th>
                      <th>Ngày Xác Nhận</th>
                      <th>Email PH</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.studentCode || student.studentId || 'N/A'}</td>
                        <td>{student.studentName || 'N/A'}</td>
                        <td>{student.className || 'N/A'}</td>
                        <td>
                          <span style={{ 
                            color: '#27ae60', 
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {student.vaccineName || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {student.confirmedAt ? 
                            formatDate(student.confirmedAt) : 
                            (student.scheduledDate ? formatDate(student.scheduledDate) : 'N/A')
                          }
                        </td>
                        <td>{student.parentEmail || 'N/A'}</td>
                        <td>
                          <span className={`status ${student.status?.toLowerCase() || 'confirmed'}`}>
                            {student.status === 'CONFIRMED' ? '✅ Đã xác nhận' : 
                             student.status === 'PENDING' ? '⏳ Chờ xác nhận' :
                             student.status === 'REJECTED' ? '❌ Từ chối' :
                             '✅ Đã xác nhận'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleRecordVaccinationResult(student)}
                            className="btn-record-result"
                            title="Ghi nhận kết quả tiêm chủng"
                            disabled={loading}
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
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <FaList style={{ fontSize: '48px', color: '#6c757d', marginBottom: '20px' }} />
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
                    Chưa có học sinh nào được phụ huynh xác nhận
                  </h3>
                  <p style={{ color: '#6c757d', fontSize: '14px' }}>
                    Danh sách sẽ hiển thị khi phụ huynh xác nhận đồng ý tiêm chủng cho học sinh
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="vaccination-results">
            <h2><FaFileAlt /> Kết Quả Tiêm Chủng</h2>

            <div className="actions">
              <button
                onClick={loadVaccinationResults}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm Mới'}
              </button>
              <button
                onClick={handleSendVaccinationResults}
                className="btn-primary"
                disabled={loading}
              >
                <FaEnvelope /> Gửi Kết Quả Cho PH
              </button>
            </div>

            {vaccinationResults.length > 0 ? (
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ Tên</th>
                      <th>Vaccine</th>
                      <th>Ngày Tiêm</th>
                      <th>Triệu Chứng</th>
                      <th>Ghi Chú</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinationResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.studentCode}</td>
                        <td>{result.studentName}</td>
                        <td>{result.vaccineName}</td>
                        <td>{formatDate(result.vaccinationDate)}</td>
                        <td>{result.symptoms || 'Không có'}</td>
                        <td>{result.notes || 'Không có'}</td>
                        <td>
                          <span className={`status ${result.status?.toLowerCase() || 'pending'}`}>
                            {result.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang xử lý'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>Chưa có kết quả tiêm chủng nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vaccination Result Form Modal */}
      {showResultForm && selectedStudent && (
        <VaccinationResultForm
          student={selectedStudent}
          vaccineName={selectedVaccine}
          onClose={handleCloseResultForm}
          onSuccess={handleResultSuccess}
        />
      )}
    </div>
  );
};

export default VaccinationManagement; 