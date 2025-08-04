import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaClipboardList, FaStethoscope, FaFileMedical, FaBell, FaCheckCircle, FaTimesCircle, FaSync } from 'react-icons/fa';

function MedicalCheckup() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notificationContent, setNotificationContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // Gọi API để lấy danh sách học sinh từ backend
      // const response = await getStudents();
      // setStudents(response.data || []);
      
      // Tạm thời sử dụng mock data cho đến khi có API thật
      const mockStudents = [
        { id: 1, name: 'Nguyễn Văn A', class: '6A1', parentEmail: 'parent1@email.com', status: 'pending' },
        { id: 2, name: 'Trần Thị B', class: '6A2', parentEmail: 'parent2@email.com', status: 'pending' },
        { id: 3, name: 'Lê Văn C', class: '6A3', parentEmail: 'parent3@email.com', status: 'pending' },
        { id: 4, name: 'Phạm Thị D', class: '6A4', parentEmail: 'parent4@email.com', status: 'pending' },
        { id: 5, name: 'Hoàng Văn E', class: '6A5', parentEmail: 'parent5@email.com', status: 'pending' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Lỗi tải danh sách học sinh:', error);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleSendNotifications = async () => {
    if (selectedStudents.length === 0) {
      setMessage('Vui lòng chọn ít nhất một học sinh!');
      setMessageType('error');
      return;
    }

    if (!notificationContent.trim()) {
      setMessage('Vui lòng nhập nội dung thông báo!');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      // Gọi API thật để gửi thông báo
      // const response = await sendHealthCheckupNotification({
      //   studentIds: selectedStudents,
      //   content: notificationContent
      // });
      
      // Tạm thời sử dụng mock API call cho đến khi có API thật
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage('Đã gửi thông báo kiểm tra y tế định kỳ thành công!');
      setMessageType('success');

      // Reset form
      setSelectedStudents([]);
      setNotificationContent('');

    } catch (error) {
      setMessage('Có lỗi xảy ra khi gửi thông báo!');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Inter, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '18px',
      opacity: 0.9,
    },
    content: {
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      marginBottom: '30px',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    notificationForm: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '16px',
      fontFamily: 'inherit',
      resize: 'vertical',
    },
    studentList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    studentCard: {
      background: 'white',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    studentCardSelected: {
      border: '2px solid #667eea',
      background: '#f0f4ff',
    },
    studentInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    studentName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    studentClass: {
      color: '#666',
      fontSize: '14px',
    },
    studentEmail: {
      color: '#888',
      fontSize: '12px',
      marginTop: '5px',
    },
    checkbox: {
      marginRight: '10px',
    },
    selectAllButton: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    sendButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '0 auto',
      boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
    },
    sendButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    message: {
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    messageSuccess: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    messageError: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    statLabel: {
      fontSize: '14px',
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaStethoscope style={{ marginRight: '10px' }} />
          Quản lý Kiểm tra Y tế định kỳ
        </h1>
        <p style={styles.subtitle}>
          Gửi thông báo và quản lý lịch khám sức khỏe định kỳ cho học sinh
        </p>
      </div>

      {/* Statistics */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{students.length}</div>
          <div style={styles.statLabel}>Tổng học sinh</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{selectedStudents.length}</div>
          <div style={styles.statLabel}>Đã chọn</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {students.filter(s => s.status === 'confirmed').length}
          </div>
          <div style={styles.statLabel}>Đã xác nhận</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {students.filter(s => s.status === 'pending').length}
          </div>
          <div style={styles.statLabel}>Chờ xác nhận</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Notification Form */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <FaBell style={{ color: '#667eea' }} />
            Nội dung thông báo
          </h3>
          <div style={styles.notificationForm}>
            <textarea
              style={styles.textarea}
              placeholder="Nhập nội dung thông báo kiểm tra y tế định kỳ..."
              value={notificationContent}
              onChange={(e) => setNotificationContent(e.target.value)}
            />
          </div>
        </div>

        {/* Student Selection */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <FaClipboardList style={{ color: '#667eea' }} />
            Chọn học sinh cần kiểm tra
          </h3>

          <button
            style={styles.selectAllButton}
            onClick={handleSelectAll}
          >
            {selectedStudents.length === students.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>

          <div style={styles.studentList}>
            {students.map(student => (
              <div
                key={student.id}
                style={{
                  ...styles.studentCard,
                  ...(selectedStudents.includes(student.id) && styles.studentCardSelected)
                }}
                onClick={() => handleStudentSelection(student.id)}
              >
                <div style={styles.studentInfo}>
                  <div>
                    <div style={styles.studentName}>{student.name}</div>
                    <div style={styles.studentClass}>Lớp: {student.class}</div>
                    <div style={styles.studentEmail}>{student.parentEmail}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                    style={styles.checkbox}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            ...styles.message,
            ...(messageType === 'success' ? styles.messageSuccess : styles.messageError)
          }}>
            {message}
          </div>
        )}

        {/* Send Button */}
        <button
          style={{
            ...styles.sendButton,
            ...(loading && styles.sendButtonDisabled)
          }}
          onClick={handleSendNotifications}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSync style={{ animation: 'spin 1s linear infinite' }} />
              Đang gửi...
            </>
          ) : (
            <>
              <FaBell />
              Gửi thông báo kiểm tra y tế định kỳ
            </>
          )}
        </button>
      </div>

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