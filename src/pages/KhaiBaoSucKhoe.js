import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaMoon, FaSun } from "react-icons/fa";
import { getUserHealthDeclarations, getHealthDeclarationStats } from "../services/healthDeclarationApi";

function KhaiBaoSucKhoe() {
  const [declarations, setDeclarations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra role của user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  
  const isAdmin = user.role === 'ADMIN' || loggedInUser.role === 'ADMIN';
  const isNurse = user.role === 'NURSE' || loggedInUser.role === 'NURSE';
  const isParent = user.role === 'PARENT' || loggedInUser.role === 'PARENT';
  
  // Đảm bảo parent không thấy các options nhạy cảm
  const showAdminOptions = !isParent && (isAdmin || isNurse);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra đăng nhập
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInUser) {
        window.location.href = "/";
        return;
      }

      // Lấy danh sách khai báo của user
      const userDeclarations = await getUserHealthDeclarations();
      setDeclarations(userDeclarations);

      // Lấy thống kê
      const statsData = await getHealthDeclarationStats();
      setStats(statsData);
      
      console.log('📊 Data loaded:', { userDeclarations, statsData });
    } catch (error) {
      console.error('❌ Lỗi tải dữ liệu:', error);
      // Fallback to localStorage data if API fails
      const data = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
      const userObj = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const userId = userObj && (userObj.id || userObj.userId || userObj.user_id || userObj.email);
      setDeclarations(data.filter(item => item.userId === userId));
    } finally {
      setLoading(false);
    }
  };

  const handleKhaiBao = () => {
    // Chuyển đến trang form khai báo sức khỏe mới
    navigate("/health-declaration-form");
  };

  const handleViewList = () => {
    // Chuyển đến trang danh sách khai báo sức khỏe
    navigate("/health-declaration-list");
  };



  if (loading) {
    return (
      <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
            Đang tải dữ liệu...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>
            🩺 Khai Báo Sức Khỏe
            {isAdmin && <span style={{ fontSize: '16px', opacity: 0.8, marginLeft: '10px', color: '#d32f2f' }}>(Quản trị viên)</span>}
            {isNurse && <span style={{ fontSize: '16px', opacity: 0.8, marginLeft: '10px', color: '#1976d2' }}>(Y Tá)</span>}
            {isParent && <span style={{ fontSize: '16px', opacity: 0.8, marginLeft: '10px', color: '#2e7d32' }}>(Phụ Huynh)</span>}
          </h2>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
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
              onClick={loadData}
              style={{...styles.button, background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'}}
              className="ripple"
              disabled={loading}
            >
              <FaSearch style={{ marginRight: 8, fontSize: 18 }} /> 
              {loading ? 'Đang tải...' : 'Làm mới'}
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
              {isParent 
                ? 'Hệ thống giúp bạn khai báo và theo dõi thông tin sức khỏe của con em một cách an toàn và hiệu quả.'
                : isAdmin 
                  ? 'Hệ thống quản lý toàn diện cho việc theo dõi sức khỏe học sinh, tiêm chủng và khám sức khỏe định kỳ.'
                  : 'Hệ thống hỗ trợ y tá quản lý thông tin sức khỏe học sinh, tiêm chủng và khám sức khỏe định kỳ.'
              }
            </p>
          </div>

          <div style={{
            ...styles.optionsGrid,
            gridTemplateColumns: (isAdmin || isNurse) 
              ? 'repeat(auto-fit, minmax(280px, 1fr))' 
              : 'repeat(auto-fit, minmax(320px, 1fr))'
          }}>
            {/* Options cho tất cả roles */}
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

            {/* Options chỉ cho Admin và Nurse */}
            {(isAdmin || isNurse) && (
              <>
                <div 
                  style={styles.optionCard}
                  className="optionCard"
                  onClick={() => navigate('/vaccination-management')}
                >
                  <div style={styles.optionIcon}>
                    💉
                  </div>
                  <h4 style={styles.optionTitle}>Tiêm Chủng</h4>
                  <p style={styles.optionDescription}>
                    Quản lý lịch tiêm chủng và gửi thông báo cho phụ huynh
                  </p>
                </div>

                <div 
                  style={styles.optionCard}
                  className="optionCard"
                  onClick={() => navigate('/medical-checkup')}
                >
                  <div style={styles.optionIcon}>
                    🏥
                  </div>
                  <h4 style={styles.optionTitle}>Kiểm Tra Y Tế Định Kỳ</h4>
                  <p style={styles.optionDescription}>
                    Quản lý lịch khám sức khỏe định kỳ cho học sinh
                  </p>
                </div>
              </>
            )}
          </div>



          {/* Thông báo cho phụ huynh */}
          {isParent && (
            <div style={{
              background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
              borderRadius: '20px',
              padding: '25px',
              marginBottom: '35px',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(76, 175, 80, 0.1)'
            }}>
              <div style={{ fontSize: '16px', color: '#2e7d32', lineHeight: 1.6 }}>
                ✅ <strong>Chào mừng Phụ huynh!</strong> Bạn có thể khai báo sức khỏe cho con em và xem danh sách khai báo đã tạo.
                Các tính năng quản lý tiêm chủng và khám sức khỏe được thực hiện bởi Admin và Y tá.
              </div>
            </div>
          )}

          {/* Thông báo cho Admin và Nurse */}
          {(isAdmin || isNurse) && (
            <div style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              borderRadius: '20px',
              padding: '25px',
              marginBottom: '35px',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.1)'
            }}>
              <div style={{ fontSize: '16px', color: '#1976d2', lineHeight: 1.6 }}>
                🔧 <strong>Quản lý hệ thống:</strong> Bạn có quyền truy cập đầy đủ các tính năng quản lý tiêm chủng, 
                khám sức khỏe định kỳ và khai báo sức khỏe của học sinh.
              </div>
            </div>
          )}

          {/* Thống kê nhanh */}
          <div style={styles.quickStats}>
            <h4 style={styles.statsTitle}>📊 Thống Kê Nhanh</h4>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {loading ? '...' : stats.total}
                </div>
                <div style={styles.statLabel}>Tổng khai báo</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {loading ? '...' : stats.pending}
                </div>
                <div style={styles.statLabel}>Chờ duyệt</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {loading ? '...' : stats.approved}
                </div>
                <div style={styles.statLabel}>Đã duyệt</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>
                  {loading ? '...' : stats.rejected}
                </div>
                <div style={styles.statLabel}>Đã từ chối</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hiệu ứng gradient động, glassmorphism, ripple, fade-in, dark mode */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(30px);} 
          to { opacity: 1; transform: none; } 
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .fade-in-row { animation: fadeIn 0.8s ease; }
        
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
          background: rgba(102, 126, 234, 0.3);
          opacity: 0.6;
          transition: transform 0.4s, opacity 0.6s;
        }
        .ripple:active:after {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
          transition: 0s;
        }
        
        .optionCard:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25);
        }
        
        /* Ẩn hoàn toàn các options nhạy cảm cho parent */
        .parent-hidden {
          display: none !important;
        }
        
        .statItem:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
        }
        
        .welcomeIcon {
          animation: float 3s ease-in-out infinite;
        }
        
        .optionIcon {
          transition: all 0.3s ease;
        }
        
        .optionCard:hover .optionIcon {
          transform: scale(1.1);
          filter: drop-shadow(0 8px 16px rgba(102, 126, 234, 0.3));
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 20s ease infinite",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'background 0.4s',
    position: 'relative',
  },
  backgroundDark: {
    background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    padding: "50px 40px",
    borderRadius: "32px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
    background: "rgba(255,255,255,0.98)",
    color: "#263238",
    position: "relative",
    zIndex: 2,
    margin: "20px",
    border: '2px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    transition: 'all 0.4s ease',
  },
  containerDark: {
    background: "rgba(40,40,60,0.9)",
    color: "#f3f3f3",
    border: '2px solid rgba(255,255,255,0.1)',
  },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32,
    flexWrap: 'wrap', gap: 16,
  },
  title: {
    textAlign: "left",
    marginBottom: 0,
    fontSize: "36px",
    color: "#667eea",
    fontWeight: 900,
    letterSpacing: 0.8,
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  button: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 15,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex', alignItems: 'center',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  iconButton: {
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: 12,
    padding: 12,
    cursor: 'pointer',
    fontSize: 20,
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
    transition: 'all 0.3s ease',
    color: '#667eea',
  },
  iconButtonDark: {
    background: 'rgba(40,40,60,0.9)',
    color: '#667eea',
  },

  mainContent: {
    marginTop: '32px',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '50px',
    padding: '50px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.9) 100%)',
    borderRadius: '28px',
    border: '2px solid rgba(255,255,255,0.4)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
  },
  welcomeIcon: {
    fontSize: '80px',
    marginBottom: '25px',
    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
  },
  welcomeTitle: {
    fontSize: '32px',
    color: '#667eea',
    margin: '0 0 20px 0',
    fontWeight: 800,
  },
  welcomeText: {
    fontSize: '20px',
    color: '#555',
    margin: 0,
    lineHeight: 1.7,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    marginBottom: '40px',
  },
  optionCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.9) 100%)',
    borderRadius: '24px',
    padding: '35px',
    border: '2px solid rgba(255,255,255,0.4)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
  },
  optionIcon: {
    fontSize: '56px',
    color: '#667eea',
    marginBottom: '25px',
    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
  },
  optionTitle: {
    fontSize: '24px',
    color: '#667eea',
    margin: '0 0 18px 0',
    fontWeight: 800,
  },
  optionDescription: {
    fontSize: '18px',
    color: '#555',
    margin: 0,
    lineHeight: 1.7,
  },
  quickStats: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.8) 100%)',
    borderRadius: '25px',
    padding: '30px',
    border: '2px solid rgba(255,255,255,0.3)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  },
  statsTitle: {
    fontSize: '24px',
    color: '#667eea',
    margin: '0 0 20px 0',
    fontWeight: 700,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statItem: {
    textAlign: 'center',
    padding: '25px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.8) 100%)',
    borderRadius: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#667eea',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
    fontWeight: 600,
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
