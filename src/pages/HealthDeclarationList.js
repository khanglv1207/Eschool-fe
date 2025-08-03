import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaUserCircle, FaMoon, FaSun, FaEye, FaTrash } from "react-icons/fa";
import healthProfileApi from "../services/healthProfileApi";

function HealthDeclarationList() {
  const [declarations, setDeclarations] = useState([]);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu chưa đăng nhập thì chuyển về trang chủ
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.location.href = "/";
      return;
    }
    loadDeclarations();
  }, []);

  const loadDeclarations = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('📋 Đang tải danh sách khai báo sức khỏe từ database...');
      const data = await healthProfileApi.getHealthDeclarations();
      console.log('✅ Danh sách khai báo từ database:', data);
      setDeclarations(data);
    } catch (error) {
      console.error('❌ Lỗi tải danh sách khai báo:', error);
      setError(error.message);
      // Fallback: sử dụng localStorage nếu API lỗi
      const localData = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser && (loggedInUser.id || loggedInUser.userId || loggedInUser.user_id || loggedInUser.email);
      setDeclarations(localData.filter(item => item.userId === userId));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate("/health-declaration-form");
  };

  const handleViewDetail = (declaration) => {
    setSelectedDeclaration(declaration);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khai báo này?")) {
      const updatedDeclarations = declarations.filter(item => item.id !== id);
      setDeclarations(updatedDeclarations);
      
      // Cập nhật localStorage
      const allDeclarations = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
      const filteredAll = allDeclarations.filter(item => item.id !== id);
      localStorage.setItem("nurseHealthDeclarations", JSON.stringify(filteredAll));
    }
  };

  // Lọc danh sách theo từ khóa
  const filteredDeclarations = declarations.filter(item => {
    const keyword = search.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(keyword) ||
      item.allergies?.toLowerCase().includes(keyword) ||
      item.chronicDiseases?.toLowerCase().includes(keyword) ||
      item.medicalHistory?.toLowerCase().includes(keyword) ||
      item.eyesight?.toLowerCase().includes(keyword) ||
      item.hearing?.toLowerCase().includes(keyword) ||
      item.vaccinationRecord?.toLowerCase().includes(keyword)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Tốt': return '#4caf50';
      case 'Trung bình': return '#ff9800';
      case 'Kém': return '#f44336';
      case 'Cần đeo kính': return '#9c27b0';
      case 'Cần máy trợ thính': return '#607d8b';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>📋 Danh Sách Khai Báo Sức Khỏe</h2>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button
              onClick={() => setDark(d => !d)}
              style={{...styles.iconButton, ...(dark ? styles.iconButtonDark : {})}}
              title={dark ? 'Chuyển sáng' : 'Chuyển tối'}
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={handleCreateNew}
              style={styles.button}
              className="ripple"
            >
              <FaPlusCircle style={{ marginRight: 8, fontSize: 18 }} /> Tạo khai báo mới
            </button>
          </div>
        </div>

        {/* Ô tìm kiếm từ khóa */}
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, dị ứng, bệnh mãn tính, thị lực..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Đang tải danh sách khai báo từ database...</p>
            <small style={{color: '#666', marginTop: '8px'}}>
              ⚠️ Đang sử dụng endpoint tạm thời (latest)
            </small>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>❌ {error}</p>
            <p style={{color: '#e67e22', fontSize: '14px', marginBottom: '16px'}}>
              💡 Cần tạo endpoint mới: <code>/api/parents/health-declaration/list</code>
            </p>
            <button 
              onClick={loadDeclarations}
              style={styles.retryButton}
            >
              🔄 Thử lại
            </button>
          </div>
        )}

        {/* Thống kê */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{declarations.length}</div>
            <div style={styles.statLabel}>Tổng số khai báo</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {declarations.filter(d => d.status === 'pending').length}
            </div>
            <div style={styles.statLabel}>Chờ duyệt</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {declarations.filter(d => d.status === 'approved').length}
            </div>
            <div style={styles.statLabel}>Đã duyệt</div>
          </div>
        </div>

        {filteredDeclarations.length === 0 ? (
          <div style={styles.noData}>
            {declarations.length === 0 ? 
              "Chưa có khai báo nào. Hãy tạo khai báo đầu tiên!" : 
              "Không tìm thấy khai báo nào phù hợp với từ khóa tìm kiếm."
            }
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Học sinh</th>
                  <th style={styles.th}>Dị ứng</th>
                  <th style={styles.th}>Bệnh mãn tính</th>
                  <th style={styles.th}>Tiền sử bệnh</th>
                  <th style={styles.th}>Thị lực</th>
                  <th style={styles.th}>Thính lực</th>
                  <th style={styles.th}>Tiêm chủng</th>
                  <th style={styles.th}>Cập nhật</th>
                  <th style={styles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeclarations.map((item, idx) => (
                  <tr key={idx} style={styles.tr} className="fade-in-row">
                    <td style={styles.avatarTd}>
                      <div style={styles.avatarGlass}>
                        <FaUserCircle style={{fontSize:28,color:'#36d1c4'}} />
                      </div>
                    </td>
                    <td style={styles.td}>
                      <strong>{item.studentName || 'Chưa có tên'}</strong>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.healthCell}>
                        {item.allergies || 'Không có'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.healthCell}>
                        {item.chronicDiseases || 'Không có'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.healthCell}>
                        {item.medicalHistory || 'Chưa khai báo'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.healthBadge,
                        backgroundColor: getHealthStatusColor(item.eyesight)
                      }}>
                        {item.eyesight || 'Chưa khai báo'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.healthBadge,
                        backgroundColor: getHealthStatusColor(item.hearing)
                      }}>
                        {item.hearing || 'Chưa khai báo'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.healthCell}>
                        {item.vaccinationRecord || 'Chưa khai báo'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {item.updatedAt ? 
                        new Date(item.updatedAt).toLocaleDateString('vi-VN') : 
                        'Chưa có'
                      }
                    </td>
                    <td style={styles.actionTd}>
                      <button
                        onClick={() => handleViewDetail(item)}
                        style={styles.actionButton}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {showDetailModal && selectedDeclaration && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Chi Tiết Khai Báo Sức Khỏe</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalContent}>
              {/* Debug info */}
              <div style={styles.debugInfo}>
                <small style={{color: '#666', fontStyle: 'italic'}}>
                  📊 Dữ liệu từ: Database
                </small>
              </div>

              <div style={styles.detailSection}>
                <h4 style={styles.detailTitle}>👤 Thông Tin Học Sinh</h4>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <strong>Học sinh:</strong> {selectedDeclaration.studentName || 'Chưa có thông tin'}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Cập nhật:</strong> {
                      selectedDeclaration.updatedAt ? 
                      new Date(selectedDeclaration.updatedAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) : 
                      'Vừa khai báo'
                    }
                  </div>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h4 style={styles.detailTitle}>🏥 Thông Tin Sức Khỏe</h4>
                <div style={styles.detailItem}>
                  <strong>Dị ứng:</strong> {selectedDeclaration.allergies || 'Không có dị ứng'}
                </div>
                <div style={styles.detailItem}>
                  <strong>Bệnh mãn tính:</strong> {selectedDeclaration.chronicDiseases || 'Không có bệnh mãn tính'}
                </div>
                <div style={styles.detailItem}>
                  <strong>Tiền sử bệnh:</strong> {selectedDeclaration.medicalHistory || 'Chưa khai báo tiền sử bệnh'}
                </div>
                <div style={styles.detailItem}>
                  <strong>Thị lực:</strong> 
                  <span style={{
                    ...styles.healthBadge,
                    backgroundColor: getHealthStatusColor(selectedDeclaration.eyesight)
                  }}>
                    {selectedDeclaration.eyesight || 'Chưa khai báo'}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <strong>Thính lực:</strong> 
                  <span style={{
                    ...styles.healthBadge,
                    backgroundColor: getHealthStatusColor(selectedDeclaration.hearing)
                  }}>
                    {selectedDeclaration.hearing || 'Chưa khai báo'}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <strong>Lịch sử tiêm chủng:</strong> {selectedDeclaration.vaccinationRecord || 'Chưa khai báo lịch sử tiêm chủng'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiệu ứng gradient động, glassmorphism, ripple, fade-in, dark mode */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
    maxWidth: "1200px",
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
  searchBox: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(232,245,255,0.7)',
    borderRadius: 12,
    padding: '8px 16px',
    marginBottom: 18,
    boxShadow: '0 1px 8px rgba(91,134,229,0.04)',
    border: '1.5px solid #e3f2fd',
    maxWidth: 420,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  searchIcon: {
    color: '#5b86e5', fontSize: 18, marginRight: 8,
  },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 16,
    width: '100%',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#263238',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'rgba(248,250,255,0.8)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
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
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    marginTop: "10px",
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(91,134,229,0.06)",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  },
  thead: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    background: 'rgba(232,245,255,0.95)',
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)',
  },
  th: {
    background: "#e3f2fd",
    color: "#1565c0",
    padding: "13px 10px",
    borderBottom: "2px solid #e3f2fd",
    fontWeight: 700,
    fontSize: 16,
    textAlign: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #e3f2fd",
    textAlign: "center",
    fontSize: 15,
    background: '#fff',
    color: '#263238',
    transition: 'background 0.2s',
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)',
  },
  tr: {
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  avatarTd: {
    padding: '8px 0',
    textAlign: 'center',
    background: 'transparent',
    border: 'none',
  },
  avatarGlass: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a8edea 0%, #5b86e5 100%)',
    boxShadow: '0 2px 8px rgba(91,134,229,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto',
    border: '2.5px solid #fff',
    position: 'relative',
    top: 0,
  },
  symptomsCell: {
    maxWidth: '200px',
    textAlign: 'left',
    padding: '0 8px',
  },
  healthCell: {
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  healthBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-block',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
  },
  actionTd: {
    padding: '8px 0',
    textAlign: 'center',
    background: 'transparent',
    border: 'none',
  },
  actionButton: {
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '6px',
    margin: '0 2px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#5b86e5',
    transition: 'all 0.2s',
  },
  deleteButton: {
    color: '#f44336',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    animation: 'fadeIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e0e0e0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
    fontWeight: 600,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  modalContent: {
    padding: '24px',
  },
  debugInfo: {
    marginBottom: '15px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    textAlign: 'center'
  },
  detailSection: {
    marginBottom: '24px',
  },
  detailTitle: {
    fontSize: '18px',
    color: '#1565c0',
    margin: '0 0 16px 0',
    fontWeight: 600,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  detailItem: {
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  symptomsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  symptomTag: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    margin: '20px 0',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #5b86e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#666',
    fontSize: '16px',
    textAlign: 'center',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid #f44336',
    borderRadius: '12px',
    margin: '20px 0',
  },
  errorText: {
    color: '#f44336',
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  retryButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

// Animation cho loading spinner
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default HealthDeclarationList; 