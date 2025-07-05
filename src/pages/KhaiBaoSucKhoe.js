import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";

function KhaiBaoSucKhoe() {
  const [declarations, setDeclarations] = useState([]);
  const [search, setSearch] = useState("");
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
    navigate("/nurse/health-declaration");
  };

  // Lọc danh sách theo từ khóa
  const filteredDeclarations = declarations.filter(item => {
    const keyword = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.symptoms?.toLowerCase().includes(keyword) ||
      String(item.age).includes(keyword)
    );
  });

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
              onClick={handleKhaiBao}
              style={styles.button}
              className="ripple"
            >
              <FaPlusCircle style={{ marginRight: 8, fontSize: 18 }} /> Gửi khai báo sức khỏe
            </button>
          </div>
        </div>
        {/* Ô tìm kiếm từ khóa */}
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, triệu chứng hoặc tuổi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>
        {filteredDeclarations.length === 0 ? (
          <div style={styles.noData}>Chưa có khai báo nào.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Họ tên</th>
                  <th style={styles.th}>Tuổi</th>
                  <th style={styles.th}>Triệu chứng</th>
                  <th style={styles.th}>Có sốt?</th>
                  <th style={styles.th}>Thời gian khai báo</th>
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
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.age}</td>
                    <td style={styles.td}>{item.symptoms}</td>
                    <td style={styles.td}>{item.hasFever ? "Có" : "Không"}</td>
                    <td style={styles.td}>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
};

export default KhaiBaoSucKhoe;
