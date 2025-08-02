import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaMoon, FaSun } from "react-icons/fa";

function KhaiBaoSucKhoe() {
  const [declarations, setDeclarations] = useState([]);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu chưa đăng nhập thì chuyển về trang chủ
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.location.href = "/";
      return;
    }
    const data = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
    // Lấy userId hoặc email hiện tại
    const userObj = JSON.parse(loggedInUser);
    const userId = userObj && (userObj.id || userObj.userId || userObj.user_id || userObj.email);
    // Lọc chỉ lấy khai báo của user này
    setDeclarations(data.filter(item => item.userId === userId));
  }, []);

  const handleKhaiBao = () => {
    // Chuyển đến trang form khai báo sức khỏe mới
    navigate("/health-declaration-form");
  };

  const handleViewList = () => {
    // Chuyển đến trang danh sách khai báo sức khỏe
    navigate("/health-declaration-list");
  };



  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>🩺 Khai Báo Sức Khỏe</h2>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button
              onClick={() => setDark(d => !d)}
              style={{...styles.iconButton, ...(dark ? styles.iconButtonDark : {})}}
              title={dark ? 'Chuyển sáng' : 'Chuyển tối'}
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={handleViewList}
              style={styles.button}
              className="ripple"
            >
              <FaSearch style={{ marginRight: 8, fontSize: 18 }} /> Xem danh sách
            </button>
            <button
              onClick={handleKhaiBao}
              style={styles.button}
              className="ripple"
            >
              <FaPlusCircle style={{ marginRight: 8, fontSize: 18 }} /> Tạo khai báo mới
            </button>
          </div>
        </div>
        {/* Nội dung chính */}
        <div style={styles.mainContent}>
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeIcon}>🏥</div>
            <h3 style={styles.welcomeTitle}>Chào mừng đến với Hệ thống Khai báo Sức khỏe</h3>
            <p style={styles.welcomeText}>
              Hệ thống giúp bạn theo dõi và quản lý thông tin sức khỏe một cách an toàn và hiệu quả.
            </p>
          </div>

                      <div style={styles.optionsGrid}>
              <div style={styles.optionCard} className="optionCard" onClick={handleKhaiBao}>
                <div style={styles.optionIcon}>
                  <FaPlusCircle />
                </div>
                <h4 style={styles.optionTitle}>Tạo Khai Báo Mới</h4>
                <p style={styles.optionDescription}>
                  Khai báo thông tin sức khỏe chi tiết với form đầy đủ
                </p>
              </div>

              <div style={styles.optionCard} className="optionCard" onClick={handleViewList}>
                <div style={styles.optionIcon}>
                  <FaSearch />
                </div>
                <h4 style={styles.optionTitle}>Xem Danh Sách</h4>
                <p style={styles.optionDescription}>
                  Xem và quản lý tất cả khai báo sức khỏe đã tạo
                </p>
              </div>
            </div>

          {/* Thống kê nhanh */}
          <div style={styles.quickStats}>
            <h4 style={styles.statsTitle}>📊 Thống Kê Nhanh</h4>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{declarations.length}</div>
                <div style={styles.statLabel}>Tổng khai báo</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {declarations.filter(d => d.status === 'pending').length}
                </div>
                <div style={styles.statLabel}>Chờ duyệt</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {declarations.filter(d => d.status === 'approved').length}
                </div>
                <div style={styles.statLabel}>Đã duyệt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hiệu ứng gradient động, glassmorphism, ripple, fade-in, dark mode */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        .fade-in-row { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .ripple { position: relative; overflow: hidden; }
        .ripple:after {
          content: "";
          display: block;
          position: absolute;
          border-radius: 50%;
          width: 100px; height: 100px;
          top: 50%; left: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          background: rgba(54,209,196,0.18);
          opacity: 0.5;
          transition: transform 0.4s, opacity 0.6s;
        }
        .ripple:active:after {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
          transition: 0s;
        }
        .optionCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(91,134,229,0.15);
        }
        @media (max-width: 700px) {
          .fade-in-row td, .fade-in-row th { font-size: 13px !important; padding: 7px 4px !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(120deg, #e0f7fa 0%, #f8fdff 100%)",
    backgroundSize: "200% 200%",
    animation: "gradientMove 15s ease infinite",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'background 0.4s',
  },
  backgroundDark: {
    background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
  },
  container: {
    width: "100%",
    maxWidth: "950px",
    padding: "32px 18px 32px 18px",
    borderRadius: "28px",
    boxShadow: "0 8px 32px 0 rgba(91,134,229,0.10)",
    background: "rgba(255,255,255,0.95)",
    color: "#263238",
    position: "relative",
    zIndex: 2,
    margin: "32px 0",
    border: '1.5px solid #e3f2fd',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background 0.4s, color 0.4s',
  },
  containerDark: {
    background: "rgba(40,40,60,0.7)",
    color: "#f3f3f3",
    border: '1.5px solid #232526',
  },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
    flexWrap: 'wrap', gap: 12,
  },
  title: {
    textAlign: "left",
    marginBottom: 0,
    fontSize: "28px",
    color: "#3a7bd5",
    fontWeight: 700,
    letterSpacing: 0.5,
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  button: {
    padding: '10px 28px',
    background: 'linear-gradient(90deg, #a8edea 0%, #5b86e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(91,134,229,0.10)',
    transition: 'background 0.2s, transform 0.15s',
    display: 'flex', alignItems: 'center',
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  iconButton: {
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    fontSize: 20,
    boxShadow: '0 1px 4px rgba(91,134,229,0.06)',
    transition: 'background 0.2s',
    color: '#5b86e5',
  },
  iconButtonDark: {
    background: 'rgba(40,40,60,0.7)',
    color: '#5b86e5',
  },

  mainContent: {
    marginTop: '24px',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '24px',
    background: 'rgba(248,250,255,0.7)',
    borderRadius: '16px',
    border: '1px solid #e3f2fd',
  },
  welcomeIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  welcomeTitle: {
    fontSize: '24px',
    color: '#1565c0',
    margin: '0 0 12px 0',
    fontWeight: 600,
  },
  welcomeText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
    lineHeight: 1.5,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  optionCard: {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e3f2fd',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  optionIcon: {
    fontSize: '32px',
    color: '#5b86e5',
    marginBottom: '16px',
  },
  optionTitle: {
    fontSize: '18px',
    color: '#1565c0',
    margin: '0 0 12px 0',
    fontWeight: 600,
  },
  optionDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: 1.5,
  },
  quickStats: {
    background: 'rgba(248,250,255,0.7)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e3f2fd',
  },
  statsTitle: {
    fontSize: '18px',
    color: '#1565c0',
    margin: '0 0 16px 0',
    fontWeight: 600,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
  },
  statItem: {
    textAlign: 'center',
    padding: '16px',
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '12px',
    border: '1px solid #e3f2fd',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#3a7bd5',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: 500,
  },
  noData: {
    color: "#90a4ae",
    textAlign: "center",
    fontSize: 17,
    padding: '32px 0',
    fontStyle: 'italic',
  },

};

export default KhaiBaoSucKhoe;
