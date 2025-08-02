import React from 'react';
import { FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';

function LatestDeclaration({ declaration, visible, onClose }) {
  if (!visible || !declaration) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            <FaCheckCircle style={{color: '#4CAF50', marginRight: 8}}/>
            Khai Báo Mới Nhất
          </h3>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.infoRow}>
            <FaUser style={styles.icon} />
            <span style={styles.label}>Học sinh:</span>
            <span style={styles.value}>{declaration.studentName || 'Chưa có thông tin'}</span>
          </div>
          
          <div style={styles.infoRow}>
            <FaClock style={styles.icon} />
            <span style={styles.label}>Thời gian:</span>
            <span style={styles.value}>
              {declaration.updatedAt ? new Date(declaration.updatedAt).toLocaleString('vi-VN') : 'Vừa khai báo'}
            </span>
          </div>
          
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Thông Tin Sức Khỏe:</h4>
            
            <div style={styles.field}>
              <strong>Dị ứng:</strong>
              <p style={styles.fieldValue}>{declaration.allergies || 'Không có'}</p>
            </div>
            
            <div style={styles.field}>
              <strong>Bệnh mãn tính:</strong>
              <p style={styles.fieldValue}>{declaration.chronicDiseases || 'Không có'}</p>
            </div>
            
            <div style={styles.field}>
              <strong>Tiền sử bệnh:</strong>
              <p style={styles.fieldValue}>{declaration.medicalHistory || 'Không có'}</p>
            </div>
            
            <div style={styles.field}>
              <strong>Thị lực:</strong>
              <p style={styles.fieldValue}>{declaration.eyesight || 'Chưa khai báo'}</p>
            </div>
            
            <div style={styles.field}>
              <strong>Thính lực:</strong>
              <p style={styles.fieldValue}>{declaration.hearing || 'Chưa khai báo'}</p>
            </div>
            
            <div style={styles.field}>
              <strong>Lịch sử tiêm chủng:</strong>
              <p style={styles.fieldValue}>{declaration.vaccinationRecord || 'Không có'}</p>
            </div>
          </div>
        </div>
        
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.okButton}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  content: {
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '8px 0'
  },
  icon: {
    color: '#5b86e5',
    marginRight: '8px',
    fontSize: '16px'
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: '8px',
    minWidth: '80px'
  },
  value: {
    color: '#666',
    flex: 1
  },
  section: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    color: '#2c3e50',
    fontSize: '16px',
    fontWeight: '600'
  },
  field: {
    marginBottom: '12px'
  },
  fieldValue: {
    margin: '5px 0 0 0',
    color: '#666',
    lineHeight: '1.4'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '15px',
    borderTop: '2px solid #f0f0f0'
  },
  okButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default LatestDeclaration; 