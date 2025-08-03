import React, { useState, useEffect } from "react";
import { FaBell, FaSyringe, FaCheck, FaTimes } from "react-icons/fa";
import { getVaccinationNotifications } from "../services/vaccinationApi";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [vaccinationNotifications, setVaccinationNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  // Load vaccination notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await getVaccinationNotifications();
        setVaccinationNotifications(notifications);
        console.log('📋 Vaccination notifications:', notifications);
      } catch (error) {
        console.error('❌ Lỗi tải thông báo tiêm chủng:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Không tìm thấy thông tin người dùng</h2>
          <a href="/" className="btn primary">
            ⬅ Quay về Trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-in">
        <h2 style={styles.title}>Thông tin hồ sơ</h2>

        <div style={styles.infoGroup}>
          <label>Họ tên:</label>
          <span>{user.fullName}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Số điện thoại:</label>
          <span>{user.phone}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Ngày sinh:</label>
          <span>{user.dob}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Giới tính:</label>
          <span>{user.gender}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Tên đăng nhập:</label>
          <span>{user.username}</span>
        </div>
        <div style={styles.infoGroup}>
          <label>Mật khẩu:</label>
          <span>{user.password}</span>
        </div>

        <div style={styles.buttonGroup}>
          <a href="/" className="btn primary">
            ⬅ Quay về
          </a>
          <button onClick={handleLogout} className="btn primary outline">
            Đăng xuất
          </button>
        </div>

        {/* Vaccination Notifications Section */}
        {vaccinationNotifications.length > 0 && (
          <div style={{
            marginTop: '30px',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{
              color: '#495057',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaBell style={{ color: '#667eea' }} />
              Thông báo tiêm chủng
            </h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {vaccinationNotifications.map((notification, index) => (
                <div key={index} style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '15px',
                  border: '1px solid #dee2e6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      <FaSyringe style={{ marginRight: '8px', color: '#667eea' }} />
                      {notification.vaccineName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                      Học sinh: {notification.studentName} - Lớp: {notification.className}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      Ngày dự kiến: {new Date(notification.scheduledDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {notification.status === 'PENDING' && (
                      <>
                        <a
                          href={`/vaccination-confirmation?id=${notification.confirmationId}`}
                          style={{
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaCheck />
                          Xác nhận
                        </a>
                        <a
                          href={`/vaccination-confirmation?id=${notification.confirmationId}`}
                          style={{
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaTimes />
                          Từ chối
                        </a>
                      </>
                    )}
                    {notification.status === 'CONFIRMED' && (
                      <span style={{
                        background: '#28a745',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ✅ Đã xác nhận
                      </span>
                    )}
                    {notification.status === 'REJECTED' && (
                      <span style={{
                        background: '#dc3545',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ❌ Đã từ chối
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        .fade-in {
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          text-decoration: none;
          margin-left: 12px;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn.primary {
          background-color: #1E90FF;
          color: white;
          border: none;
        }

        .btn.primary:hover {
          background-color: #1976d2;
        }

        .btn.primary.outline {
          background-color: white;
          color: #1E90FF;
          border: 2px solid #1E90FF;
        }

        .btn.primary.outline:hover {
          background-color: #e6f0ff;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to right, #e3f2fd, #f0f8ff)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "30px",
    color: "#1E90FF",
    fontWeight: 700,
  },
  infoGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "18px",
    fontSize: "17px",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
  },
};

export default Profile;
