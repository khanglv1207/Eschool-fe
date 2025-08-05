import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaSyringe, FaExclamationTriangle, FaEye, FaPlus } from 'react-icons/fa';
import { createVaccinationResult } from '../services/vaccinationApi';
import './VaccinationResultForm.css';

const VaccinationResultForm = ({ student, vaccineName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    confirmationId: student?.confirmationId || student?.id || '',
    vaccinationDate: new Date().toISOString().slice(0, 16), // Format cho datetime-local
    notes: '',
    hasReaction: false,
    followUpNeeded: false,
    needsBooster: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');

      // Validate required fields
      if (!formData.confirmationId) {
        setMessage('❌ Vui lòng nhập ID xác nhận');
        return;
      }

      if (!formData.vaccinationDate) {
        setMessage('❌ Vui lòng chọn ngày tiêm chủng');
        return;
      }

      // Convert date to ISO string for backend
      const resultData = {
        ...formData,
        vaccinationDate: new Date(formData.vaccinationDate).toISOString()
      };

      console.log('📝 Ghi nhận kết quả tiêm chủng:', resultData);

      await createVaccinationResult(resultData);
      
      setMessage('✅ Ghi nhận kết quả tiêm chủng thành công!');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close form after 2 seconds
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Lỗi ghi nhận kết quả:', error);
      setMessage('❌ Lỗi ghi nhận kết quả: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="vaccination-result-form-overlay">
      <div className="vaccination-result-form-modal">
        <div className="form-header">
          <h2>
            <FaSyringe /> Ghi Nhận Kết Quả Tiêm Chủng
          </h2>
          <button onClick={handleCancel} className="close-btn">
            <FaTimes />
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="student-info">
          <h3>Thông Tin Học Sinh</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Họ Tên:</label>
              <span>{student?.studentName || student?.fullName || student?.name || student?.student_name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Mã HS:</label>
              <span>{student?.studentCode || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Lớp:</label>
              <span>{student?.className || student?.class_name || student?.class || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Vaccine:</label>
              <span>{vaccineName}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="result-form">
          <div className="form-section">
            <h3>Thông Tin Tiêm Chủng</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>ID Xác Nhận *</label>
                <input
                  type="text"
                  name="confirmationId"
                  value={formData.confirmationId}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập ID xác nhận"
                />
              </div>
              <div className="form-group">
                <label>Ngày & Giờ Tiêm *</label>
                <input
                  type="datetime-local"
                  name="vaccinationDate"
                  value={formData.vaccinationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ghi chú về kết quả tiêm chủng..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Đánh Giá Sau Tiêm</h3>
            
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="hasReaction"
                  name="hasReaction"
                  checked={formData.hasReaction}
                  onChange={handleInputChange}
                />
                <label htmlFor="hasReaction">
                  <FaExclamationTriangle /> Có phản ứng phụ
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="followUpNeeded"
                  name="followUpNeeded"
                  checked={formData.followUpNeeded}
                  onChange={handleInputChange}
                />
                <label htmlFor="followUpNeeded">
                  <FaEye /> Cần theo dõi thêm
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="needsBooster"
                  name="needsBooster"
                  checked={formData.needsBooster}
                  onChange={handleInputChange}
                />
                <label htmlFor="needsBooster">
                  <FaPlus /> Cần tiêm nhắc lại
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              <FaTimes /> Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave />
              {loading ? 'Đang lưu...' : 'Lưu Kết Quả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinationResultForm; 