import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaStethoscope } from 'react-icons/fa';
import { saveCheckupResult } from '../services/healthCheckupApi';
import './HealthCheckupResultForm.css';

const HealthCheckupResultForm = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  // Helper function để tạo UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };

  // Helper function để validate UUID
  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const [formData, setFormData] = useState({
    studentId: studentId || '',
    checkupDate: new Date().toISOString().split('T')[0],
    heightCm: '',
    weightKg: '',
    visionLeft: '',
    visionRight: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  // Load thông tin học sinh từ localStorage hoặc params
  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem('selectedStudent') || '{}');
    console.log('🔍 Student data from localStorage:', studentData);
    
    if (studentData && (studentData.studentId || studentData.student_code || studentData.id || studentData.studentCode)) {
      setStudentInfo(studentData);
      
      // Tìm studentId đúng
      const actualStudentId = studentData.studentId || studentData.student_code || studentData.id || studentData.studentCode;
      console.log('🔍 Actual studentId found:', actualStudentId);
      
      setFormData(prev => ({
        ...prev,
        studentId: actualStudentId,
        studentName: studentData.studentName || studentData.fullName || studentData.name || studentData.student_name
      }));
    } else {
      console.log('❌ No valid student data found in localStorage');
      setMessage('❌ Không tìm thấy thông tin học sinh hợp lệ');
    }
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.heightCm || !formData.weightKg) {
      setMessage('❌ Vui lòng nhập chiều cao và cân nặng');
      return;
    }

    if (!formData.checkupDate) {
      setMessage('❌ Vui lòng chọn ngày kiểm tra');
      return;
    }

    if (parseFloat(formData.heightCm) <= 0 || parseFloat(formData.weightKg) <= 0) {
      setMessage('❌ Chiều cao và cân nặng phải lớn hơn 0');
      return;
    }

    // Kiểm tra có mã học sinh không
    const actualStudentId = studentInfo?.id || studentInfo?.studentId || studentInfo?.uuid;
    if (!actualStudentId) {
      setMessage('❌ Không tìm thấy ID học sinh hợp lệ. Vui lòng chọn lại học sinh.');
      console.error('❌ Missing studentId. StudentInfo:', studentInfo);
      return;
    }

    try {
      setLoading(true);
      console.log('💾 Lưu kết quả kiểm tra cho học sinh:', formData);

      // Tạo dữ liệu theo DTO CreateHealthCheckupRequest
      const resultData = {
        studentCode: studentInfo?.studentCode || studentInfo?.student_code || studentInfo?.studentId || studentInfo?.id, // Sử dụng dữ liệu thật từ backend
        checkupDate: formData.checkupDate, // LocalDate sẽ tự động parse từ "YYYY-MM-DD"
        heightCm: parseFloat(formData.heightCm) || 0,
        weightKg: parseFloat(formData.weightKg) || 0,
        visionLeft: formData.visionLeft || '',
        visionRight: formData.visionRight || '',
        notes: formData.notes || ''
      };

      // Kiểm tra studentCode có hợp lệ không
      if (!resultData.studentCode || resultData.studentCode === 'undefined' || resultData.studentCode === 'null') {
        setMessage('❌ Mã học sinh không hợp lệ. Vui lòng chọn lại học sinh.');
        console.error('❌ Invalid studentCode:', resultData.studentCode);
        console.error('❌ StudentInfo from backend:', studentInfo);
        return;
      }

      console.log('🔍 Final resultData to send:', resultData);
      console.log('🔍 studentCode type:', typeof resultData.studentCode);
      console.log('🔍 studentCode value:', resultData.studentCode);
      console.log('🔍 StudentInfo from backend:', studentInfo);

      await saveCheckupResult(resultData);
      setMessage('✅ Đã lưu thông tin khám sức khỏe thành công!');
      
      // Clear localStorage
      localStorage.removeItem('selectedStudent');
      
      // Chuyển về trang quản lý với tab kết quả kiểm tra
      setTimeout(() => {
        navigate('/health-checkup?tab=results');
      }, 2000);

    } catch (error) {
      console.error('❌ Lỗi lưu kết quả kiểm tra:', error);
      setMessage('❌ Lỗi lưu kết quả kiểm tra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-checkup-result-form">
      <div className="form-header">
        <button 
          onClick={() => navigate('/health-checkup')}
          className="back-btn"
        >
          <FaArrowLeft /> Quay Lại
        </button>
        <h1><FaStethoscope /> Ghi Nhận Kết Quả Kiểm Tra Y Tế</h1>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {studentInfo && (
        <div className="student-info">
          <h3><FaUser /> Thông Tin Học Sinh</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã HS:</label>
              <span>{studentInfo.studentCode || studentInfo.student_code || studentInfo.studentId || studentInfo.id}</span>
            </div>
            <div className="info-item">
              <label>ID HS:</label>
              <span>{studentInfo.id || studentInfo.studentId || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Họ Tên:</label>
              <span>{studentInfo.studentName || studentInfo.fullName || studentInfo.name || studentInfo.student_name}</span>
            </div>
            <div className="info-item">
              <label>Lớp:</label>
              <span>{studentInfo.className || studentInfo.class_name || studentInfo.class}</span>
            </div>
            <div className="info-item">
              <label>Email PH:</label>
              <span>{studentInfo.parentEmail || studentInfo.parent_email || studentInfo.email}</span>
            </div>
            <div className="info-item">
              <label>Dữ liệu Backend:</label>
              <span>{JSON.stringify(studentInfo, null, 2)}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="result-form">
        <div className="form-section">
          <h3>Thông Tin Kiểm Tra</h3>
          
                    <div className="form-group">
            <label>Ngày Kiểm Tra *</label>
            <input
              type="date"
              name="checkupDate"
              value={formData.checkupDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Chiều Cao (cm) *</label>
              <input
                type="number"
                step="0.1"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleInputChange}
                placeholder="VD: 150.5"
                required
              />
            </div>
            <div className="form-group">
              <label>Cân Nặng (kg) *</label>
              <input
                type="number"
                step="0.1"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleInputChange}
                placeholder="VD: 45.2"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thị Lực Mắt Trái</label>
              <input
                type="text"
                name="visionLeft"
                value={formData.visionLeft}
                onChange={handleInputChange}
                placeholder="VD: 10/10"
              />
            </div>
            <div className="form-group">
              <label>Thị Lực Mắt Phải</label>
              <input
                type="text"
                name="visionRight"
                value={formData.visionRight}
                onChange={handleInputChange}
                placeholder="VD: 10/10"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ghi Chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú thêm về kết quả kiểm tra..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/health-checkup')} 
            className="btn-secondary"
            disabled={loading}
          >
            Hủy
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu Thông Tin Khám Sức Khỏe
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthCheckupResultForm; 