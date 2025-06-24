import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

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
