import React, { useState } from 'react';
import { sendVaccinationNotices } from '../services/vaccinationApi';

function VaccinationCreateTest() {
  const [formData, setFormData] = useState({
    vaccineName: '',
    scheduledDate: '',
    location: 'Trường học',
    note: '',
    studentIds: []
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setResult('');
      
      // Convert date to proper format
      const notificationData = {
        ...formData,
        scheduledDate: formData.scheduledDate,
        studentIds: formData.studentIds.length > 0 ? formData.studentIds : ['test-student-id']
      };

      console.log('🧪 Creating vaccination notification with data:', notificationData);
      
      const response = await sendVaccinationNotices(notificationData);
      
      console.log('✅ Test response:', response);
      setResult(JSON.stringify(response, null, 2));
      
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#495057', 
          marginBottom: '30px' 
        }}>
          🧪 Test Tạo Thông Báo Tiêm Chủng
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Tên Vaccine:
            </label>
            <input
              type="text"
              name="vaccineName"
              value={formData.vaccineName}
              onChange={handleInputChange}
              placeholder="Ví dụ: Vaccine COVID-19"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Ngày Tiêm:
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Địa điểm:
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ví dụ: Trường học"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Ghi chú:
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Ghi chú về thông báo tiêm chủng..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Đang tạo thông báo...' : 'Tạo thông báo tiêm chủng'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              marginBottom: '15px', 
              color: '#495057' 
            }}>
              API Response:
            </h3>
            <pre style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              overflow: 'auto',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccinationCreateTest; 