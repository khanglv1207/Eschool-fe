import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaUsers, 
  FaEnvelope, 
  FaCheck, 
  FaTimes, 
  FaStethoscope, 
  FaFileAlt,
  FaEdit,
  FaBell,
  FaClipboardList,
  FaFileMedical
} from 'react-icons/fa';
import './MedicalCheckup.css';

function MedicalCheckup() {
  // States for checkup type creation
  const [checkupForm, setCheckupForm] = useState({
    checkupName: '',
    description: '',
    frequency: '',
    requirements: ''
  });

  // States for student management
  const [selectedCheckup, setSelectedCheckup] = useState('');
  const [checkupTypes, setCheckupTypes] = useState([]);
  const [studentsToCheckup, setStudentsToCheckup] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // States for checkup results
  const [checkupResults, setCheckupResults] = useState([]);
  const [resultForm, setResultForm] = useState({
    studentId: '',
    checkupName: '',
    checkupDate: '',
    height: '',
    weight: '',
    bloodPressure: '',
    vision: '',
    notes: '',
    status: 'COMPLETED'
  });

  // States for UI
  const [activeTab, setActiveTab] = useState('create');
  const [showResultForm, setShowResultForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingCheckups();
    loadCheckupResults();
    loadCheckupTypes();
  }, []);

  const loadPendingCheckups = async () => {
    try {
      setLoading(true);
      // Mock API call - trong thực tế sẽ gọi API thật
      const mockPendingStudents = [
        { id: 1, name: 'Nguyễn Văn A', class: '6A1', parentEmail: 'parent1@email.com', status: 'pending' },
        { id: 2, name: 'Trần Thị B', class: '6A2', parentEmail: 'parent2@email.com', status: 'pending' },
        { id: 3, name: 'Lê Văn C', class: '6A3', parentEmail: 'parent3@email.com', status: 'pending' },
        { id: 4, name: 'Phạm Thị D', class: '6A4', parentEmail: 'parent4@email.com', status: 'pending' },
        { id: 5, name: 'Hoàng Văn E', class: '6A5', parentEmail: 'parent5@email.com', status: 'pending' },
      ];
      setPendingStudents(mockPendingStudents);
    } catch (error) {
      setMessage('❌ Lỗi tải danh sách học sinh cần kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCheckupResults = async () => {
    try {
      // Mock API call
      const mockResults = [
        { id: 1, studentName: 'Nguyễn Văn A', checkupName: 'Kiểm tra sức khỏe định kỳ', checkupDate: '2024-01-15', status: 'COMPLETED' },
        { id: 2, studentName: 'Trần Thị B', checkupName: 'Kiểm tra sức khỏe định kỳ', checkupDate: '2024-01-16', status: 'COMPLETED' },
      ];
      setCheckupResults(mockResults);
    } catch (error) {
      console.error('Lỗi tải kết quả kiểm tra:', error);
    }
  };

  const loadCheckupTypes = async () => {
    try {
      setLoading(true);
      // Mock API call
      const mockCheckupTypes = [
        { id: 1, name: 'Kiểm tra sức khỏe định kỳ', description: 'Khám tổng quát sức khỏe học sinh', frequency: '6 tháng/lần' },
        { id: 2, name: 'Kiểm tra thị lực', description: 'Kiểm tra thị lực và tư vấn', frequency: '1 năm/lần' },
        { id: 3, name: 'Kiểm tra răng miệng', description: 'Khám răng và tư vấn vệ sinh', frequency: '1 năm/lần' },
      ];
      setCheckupTypes(mockCheckupTypes);
      console.log('✅ Checkup types loaded:', mockCheckupTypes);
      
      if (mockCheckupTypes.length > 0 && !selectedCheckup) {
        setSelectedCheckup(mockCheckupTypes[0].name);
      }
    } catch (error) {
      console.error('Lỗi tải checkup types:', error);
      setMessage('❌ Lỗi tải danh sách loại kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckupFormChange = (e) => {
    setCheckupForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateCheckup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('✅ Đã tạo loại kiểm tra mới thành công!');
      setCheckupForm({
        checkupName: '',
        description: '',
        frequency: '',
        requirements: ''
      });
      
      // Reload checkup types
      await loadCheckupTypes();
    } catch (error) {
      setMessage('❌ Lỗi tạo loại kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStudentsToCheckup = async () => {
    if (!selectedCheckup) {
      setMessage('❌ Vui lòng chọn loại kiểm tra!');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStudents = [
        { id: 1, name: 'Nguyễn Văn A', class: '6A1', parentEmail: 'parent1@email.com', reason: 'Chưa kiểm tra định kỳ' },
        { id: 2, name: 'Trần Thị B', class: '6A2', parentEmail: 'parent2@email.com', reason: 'Đến hạn kiểm tra' },
        { id: 3, name: 'Lê Văn C', class: '6A3', parentEmail: 'parent3@email.com', reason: 'Cần kiểm tra lại' },
      ];
      
      setStudentsToCheckup(mockStudents);
      setMessage('✅ Đã tải danh sách học sinh cần kiểm tra!');
    } catch (error) {
      setMessage('❌ Lỗi tải danh sách học sinh: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCheckupNotices = async () => {
    if (studentsToCheckup.length === 0) {
      setMessage('❌ Không có học sinh nào để gửi thông báo!');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('✅ Đã gửi thông báo kiểm tra y tế định kỳ thành công!');
      setStudentsToCheckup([]);
    } catch (error) {
      setMessage('❌ Lỗi gửi thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultFormChange = (e) => {
    setResultForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateCheckupResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('✅ Đã lưu kết quả kiểm tra thành công!');
      setResultForm({
        studentId: '',
        checkupName: '',
        checkupDate: '',
        height: '',
        weight: '',
        bloodPressure: '',
        vision: '',
        notes: '',
        status: 'COMPLETED'
      });
      setShowResultForm(false);
      
      // Reload results
      await loadCheckupResults();
    } catch (error) {
      setMessage('❌ Lỗi lưu kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCheckupResults = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage('✅ Đã gửi kết quả kiểm tra cho phụ huynh thành công!');
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
    <div className="medical-checkup-container">
      {/* Header */}
      <div className="medical-checkup-header">
        <h1 className="medical-checkup-title">
          <FaStethoscope style={{ marginRight: '10px' }} />
          Quản lý Kiểm tra Y tế định kỳ
        </h1>
        <p className="medical-checkup-subtitle">
          Tạo loại kiểm tra, quản lý học sinh và gửi thông báo kiểm tra sức khỏe định kỳ
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="medical-checkup-tabs">
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <FaPlus /> Tạo Loại Kiểm Tra
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

      {/* Tab Content */}
      <div className="medical-checkup-content">
        {/* Create Checkup Tab */}
        {activeTab === 'create' && (
          <div className="create-checkup">
            <h2><FaPlus /> Tạo Loại Kiểm Tra Mới</h2>
            <form onSubmit={handleCreateCheckup} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Loại Kiểm Tra *</label>
                  <input
                    type="text"
                    name="checkupName"
                    value={checkupForm.checkupName}
                    onChange={handleCheckupFormChange}
                    required
                    placeholder="VD: Kiểm tra sức khỏe định kỳ"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả *</label>
                  <textarea
                    name="description"
                    value={checkupForm.description}
                    onChange={handleCheckupFormChange}
                    required
                    placeholder="Mô tả chi tiết về loại kiểm tra"
                    className="textarea"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tần suất</label>
                  <input
                    type="text"
                    name="frequency"
                    value={checkupForm.frequency}
                    onChange={handleCheckupFormChange}
                    placeholder="VD: 6 tháng/lần"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Yêu cầu</label>
                  <input
                    type="text"
                    name="requirements"
                    value={checkupForm.requirements}
                    onChange={handleCheckupFormChange}
                    placeholder="VD: Nhịn ăn 8 tiếng"
                    className="input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Loại Kiểm Tra'}
              </button>
            </form>
          </div>
        )}

        {/* Students Management Tab */}
        {activeTab === 'students' && (
          <div className="students-management">
            <h2><FaUsers /> Quản Lý Học Sinh Kiểm Tra</h2>
            
            <div className="checkup-selection">
              <div className="form-group">
                <label>Chọn Loại Kiểm Tra</label>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <select 
                    value={selectedCheckup} 
                    onChange={(e) => setSelectedCheckup(e.target.value)}
                    disabled={loading}
                    className="input"
                    style={{flex: 1}}
                  >
                    <option value="">-- Chọn loại kiểm tra --</option>
                    {checkupTypes.map((checkup) => (
                      <option key={checkup.id} value={checkup.name}>
                        {checkup.name} - {checkup.description}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={loadCheckupTypes}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    {loading ? '⏳' : '🔄'}
                  </button>
                </div>
                {loading && <small style={{color: '#667eea'}}>Đang tải danh sách kiểm tra...</small>}
                {checkupTypes.length === 0 && !loading && (
                  <small style={{color: '#e67e22'}}>Không có loại kiểm tra nào. Hãy tạo loại kiểm tra trước.</small>
                )}
                {checkupTypes.length > 0 && (
                  <small style={{color: '#27ae60'}}>✅ Đã tải {checkupTypes.length} loại kiểm tra từ database</small>
                )}
              </div>
              <button 
                onClick={handleGetStudentsToCheckup}
                className="btn-secondary"
                disabled={!selectedCheckup || loading}
              >
                {loading ? 'Đang tải...' : 'Lấy Danh Sách Học Sinh Cần Kiểm Tra'}
              </button>
              <div style={{marginTop: '10px'}}>
                <small style={{color: '#666'}}>
                  🔍 Tìm kiếm học sinh cần kiểm tra dựa trên khai báo sức khỏe
                </small>
              </div>
            </div>

            {studentsToCheckup.length > 0 && (
              <div className="students-list">
                <h3>Danh Sách Học Sinh Cần Kiểm Tra {selectedCheckup}</h3>
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
                  <table className="table">
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
                      {studentsToCheckup.map(student => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.class}</td>
                          <td>{student.parentEmail}</td>
                          <td>{student.reason}</td>
                          <td>
                            <span className="status-pending">Chờ kiểm tra</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  onClick={handleSendCheckupNotices}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi Thông Báo Kiểm Tra'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pending Students Tab */}
        {activeTab === 'pending' && (
          <div className="pending-students">
            <h2><FaCheck /> Học Sinh Cần Kiểm Tra</h2>
            <div className="students-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã HS</th>
                    <th>Họ Tên</th>
                    <th>Lớp</th>
                    <th>Email PH</th>
                    <th>Loại Kiểm Tra</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td>{student.parentEmail}</td>
                      <td>Kiểm tra sức khỏe định kỳ</td>
                      <td>
                        <span className="status-pending">Chờ xác nhận</span>
                      </td>
                      <td>
                        <button 
                          onClick={() => {
                            setResultForm(prev => ({...prev, studentId: student.id}));
                            setShowResultForm(true);
                          }}
                          className="btn-small"
                        >
                          <FaEdit /> Nhập Kết Quả
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="results">
            <h2><FaFileAlt /> Kết Quả Kiểm Tra</h2>
            <div className="results-actions">
              <button 
                onClick={() => setShowResultForm(true)}
                className="btn-primary"
              >
                <FaPlus /> Thêm Kết Quả Mới
              </button>
              <button 
                onClick={handleSendCheckupResults}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Kết Quả Cho Phụ Huynh'}
              </button>
            </div>
            <div className="students-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã HS</th>
                    <th>Họ Tên</th>
                    <th>Loại Kiểm Tra</th>
                    <th>Ngày Kiểm Tra</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {checkupResults.map(result => (
                    <tr key={result.id}>
                      <td>{result.id}</td>
                      <td>{result.studentName}</td>
                      <td>{result.checkupName}</td>
                      <td>{formatDate(result.checkupDate)}</td>
                      <td>
                        <span className="status-completed">Hoàn thành</span>
                      </td>
                      <td>
                        <button className="btn-small">
                          <FaFileAlt /> Xem Chi Tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Result Form Modal */}
      {showResultForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nhập Kết Quả Kiểm Tra</h3>
            <form onSubmit={handleCreateCheckupResult} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Loại Kiểm Tra</label>
                  <input
                    type="text"
                    name="checkupName"
                    value={resultForm.checkupName}
                    onChange={handleResultFormChange}
                    placeholder="Kiểm tra sức khỏe định kỳ"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Ngày Kiểm Tra</label>
                  <input
                    type="date"
                    name="checkupDate"
                    value={resultForm.checkupDate}
                    onChange={handleResultFormChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Chiều Cao (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={resultForm.height}
                    onChange={handleResultFormChange}
                    placeholder="150"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Cân Nặng (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={resultForm.weight}
                    onChange={handleResultFormChange}
                    placeholder="45"
                    className="input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Huyết Áp</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={resultForm.bloodPressure}
                    onChange={handleResultFormChange}
                    placeholder="120/80"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Thị Lực</label>
                  <input
                    type="text"
                    name="vision"
                    value={resultForm.vision}
                    onChange={handleResultFormChange}
                    placeholder="10/10"
                    className="input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ghi Chú</label>
                <textarea
                  name="notes"
                  value={resultForm.notes}
                  onChange={handleResultFormChange}
                  placeholder="Ghi chú về kết quả kiểm tra..."
                  className="textarea"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu Kết Quả'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowResultForm(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default MedicalCheckup;
