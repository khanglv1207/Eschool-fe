import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaUsers, 
  FaEnvelope, 
  FaCheck, 
  FaTimes, 
  FaSyringe, 
  FaFileAlt,
  FaEdit
} from 'react-icons/fa';
import { 
  createVaccineType, 
  getStudentsToVaccinate, 
  sendVaccinationNotices,
  getStudentsNeedVaccination,
  createVaccinationResult,
  sendVaccinationResults,
  getVaccinationResult,
  getVaccineTypes
} from '../services/vaccinationApi';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
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
  const [pendingStudents, setPendingStudents] = useState([]);
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

  useEffect(() => {
    loadPendingVaccinations();
    loadVaccinationResults();
    loadVaccineTypes(); // Load danh sách vaccine từ database
  }, []);

  const loadPendingVaccinations = async () => {
    try {
      setLoading(true);
      const response = await getStudentsNeedVaccination();
      setPendingStudents(response);
    } catch (error) {
      setMessage('❌ Lỗi tải danh sách học sinh cần tiêm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      
      const request = {
        vaccineName: selectedVaccine,
        scheduledDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
        location: 'Phòng y tế trường học',
        note: `Thông báo tiêm chủng ${selectedVaccine} cho học sinh`,
        studentIds: studentsToVaccinate
          .filter(student => student.studentId || student.studentCode || student.id)
          .map(student => student.studentId || student.studentCode || student.id)
      };
      
      console.log('📋 Request body:', request);
      console.log('🎯 Vaccine:', request.vaccineName);
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
      setMessage('✅ Đã gửi thông báo tiêm chủng thành công!');
      setStudentsToVaccinate([]);
    } catch (error) {
      console.error('❌ Lỗi gửi thông báo:', error);
      setMessage('❌ Lỗi gửi thông báo: ' + error.message);
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
      loadPendingVaccinations();
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
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <FaCheck /> Học Sinh Cần Tiêm
        </button>
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
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <select 
                    value={selectedVaccine} 
                    onChange={(e) => setSelectedVaccine(e.target.value)}
                    disabled={loading}
                    style={{flex: 1}}
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
                    style={{padding: '8px 12px', fontSize: '12px'}}
                    disabled={loading}
                  >
                    {loading ? '⏳' : '🔄'}
                  </button>
                </div>
                {loading && <small style={{color: '#667eea'}}>Đang tải danh sách vaccine...</small>}
                {vaccineTypes.length === 0 && !loading && (
                  <small style={{color: '#e67e22'}}>Không có vaccine nào. Hãy tạo vaccine trước.</small>
                )}
                {vaccineTypes.length > 0 && (
                  <small style={{color: '#27ae60'}}>✅ Đã tải {vaccineTypes.length} loại vaccine từ database</small>
                )}
              </div>
              <button 
                onClick={handleGetStudentsToVaccinate}
                className="btn-secondary"
                disabled={!selectedVaccine || loading}
              >
                {loading ? 'Đang tải...' : 'Lấy Danh Sách Học Sinh Chưa Tiêm'}
              </button>
              <div style={{marginTop: '10px'}}>
                <small style={{color: '#666'}}>
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
                  <small style={{color: '#27ae60'}}>
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
                            <span style={{color: '#e67e22', fontSize: '12px'}}>
                              {student.reason || student.vaccinationStatus || 'Chưa tiêm vaccine'}
                            </span>
                          </td>
                          <td>
                            <span className="status pending">Chờ xác nhận</span>
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

        {/* Pending Vaccinations Tab */}
        {activeTab === 'pending' && (
          <div className="pending-vaccinations">
            <h2><FaCheck /> Học Sinh Cần Tiêm Chủng</h2>
            
            <div className="actions">
              <button 
                onClick={loadPendingVaccinations}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm Mới Danh Sách'}
              </button>
              <button 
                onClick={() => setShowResultForm(true)}
                className="btn-primary"
              >
                <FaPlus /> Ghi Nhận Kết Quả Tiêm
              </button>
            </div>

            {pendingStudents.length > 0 ? (
              <div className="pending-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ Tên</th>
                      <th>Lớp</th>
                      <th>Vaccine</th>
                      <th>Email PH</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.studentCode}</td>
                        <td>{student.studentName}</td>
                        <td>{student.className}</td>
                        <td>{student.vaccineName}</td>
                        <td>{student.parentEmail}</td>
                        <td>
                          <span className="status confirmed">Đã xác nhận</span>
                        </td>
                        <td>
                          <button 
                            onClick={() => {
                              setResultForm(prev => ({
                                ...prev,
                                studentId: student.studentId,
                                vaccineName: student.vaccineName
                              }));
                              setShowResultForm(true);
                            }}
                            className="btn-small"
                          >
                            <FaEdit /> Ghi Kết Quả
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>Không có học sinh nào cần tiêm chủng</p>
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
                          <span className={`status ${result.status.toLowerCase()}`}>
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
      {showResultForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Ghi Nhận Kết Quả Tiêm Chủng</h3>
              <button 
                onClick={() => setShowResultForm(false)}
                className="close-btn"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateVaccinationResult} className="result-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Học Sinh</label>
                  <input
                    type="text"
                    name="studentId"
                    value={resultForm.studentId}
                    onChange={handleResultFormChange}
                    required
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Loại Vaccine</label>
                  <input
                    type="text"
                    name="vaccineName"
                    value={resultForm.vaccineName}
                    onChange={handleResultFormChange}
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày Tiêm *</label>
                  <input
                    type="date"
                    name="vaccinationDate"
                    value={resultForm.vaccinationDate}
                    onChange={handleResultFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Trạng Thái</label>
                  <select
                    name="status"
                    value={resultForm.status}
                    onChange={handleResultFormChange}
                  >
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="PENDING">Đang xử lý</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Triệu Chứng (nếu có)</label>
                <textarea
                  name="symptoms"
                  value={resultForm.symptoms}
                  onChange={handleResultFormChange}
                  placeholder="Mô tả triệu chứng sau tiêm..."
                />
              </div>
              <div className="form-group">
                <label>Ghi Chú</label>
                <textarea
                  name="notes"
                  value={resultForm.notes}
                  onChange={handleResultFormChange}
                  placeholder="Ghi chú thêm..."
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowResultForm(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu Kết Quả'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement; 