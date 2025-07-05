import React, { useState, useEffect } from "react";
import { FaUserCircle, FaMoon, FaSun, FaHeartbeat } from "react-icons/fa";

function NurseHealthDeclaration() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    hasFever: false,
  });
  const [success, setSuccess] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Lấy thông tin hồ sơ từ localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setForm((prev) => ({
        ...prev,
        name: loggedInUser.name || loggedInUser.fullName || "",
        age: loggedInUser.age || loggedInUser.tuoi || "",
        gender: loggedInUser.gender || loggedInUser.gioiTinh || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lưu vào localStorage
    const prev = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
    // Lấy userId hoặc email từ localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = loggedInUser && (loggedInUser.id || loggedInUser.userId || loggedInUser.user_id || loggedInUser.email);
    localStorage.setItem(
      "nurseHealthDeclarations",
      JSON.stringify([
        ...prev,
        { ...form, createdAt: new Date().toISOString(), userId },
      ])
    );
    setSuccess("Khai báo thành công!");
    setForm({ name: "", age: "", gender: "", symptoms: "", hasFever: false });
  };

  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}><FaHeartbeat style={{color:'#5b86e5',marginRight:8}}/>Khai Báo Sức Khỏe</h2>
          <button
            onClick={() => setDark(d => !d)}
            style={{...styles.iconButton, ...(dark ? styles.iconButtonDark : {})}}
            title={dark ? 'Chuyển sáng' : 'Chuyển tối'}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Họ tên:</label>
            <div style={styles.inputIconBox}>
              <FaUserCircle style={styles.inputIcon}/>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ tên..."
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tuổi:</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Nhập tuổi..."
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Giới tính:</label>
            <div className="custom-select-wrapper">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={styles.select}
                className="custom-select"
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <span className="custom-arrow" />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Triệu chứng:</label>
            <textarea
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              placeholder="Mô tả triệu chứng..."
              rows="4"
              style={styles.textarea}
              required
            />
          </div>
          <div style={{ ...styles.formGroup, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="hasFever"
              checked={form.hasFever}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <label style={{ fontSize: "15px", color: dark ? '#e3f2fd' : '#263238' }}>Có sốt hay không?</label>
          </div>
          {success && <div style={styles.successMsg}>{success}</div>}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button} className="ripple">
              Gửi khai báo
            </button>
          </div>
        </form>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
          body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          @keyframes gradientMove {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
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
            background: rgba(91,134,229,0.18);
            opacity: 0.5;
            transition: transform 0.4s, opacity 0.6s;
          }
          .ripple:active:after {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
            transition: 0s;
          }
          .custom-select-wrapper {
            position: relative;
            width: 100%;
          }
          .custom-select {
            width: 100%;
            padding: 10px 40px 10px 14px;
            border-radius: 10px;
            border: 1.5px solid #e3f2fd;
            background: #f4fafd;
            color: #263238;
            font-size: 15px;
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 1px 4px #e3f2fd;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            cursor: pointer;
            transition: border 0.2s, box-shadow 0.2s;
          }
          .custom-select:focus {
            border: 1.5px solid #5b86e5;
            box-shadow: 0 2px 8px #a8edea55;
            outline: none;
            background: #e3f2fd;
          }
          .custom-arrow {
            position: absolute;
            top: 50%;
            right: 16px;
            width: 0;
            height: 0;
            pointer-events: none;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 8px solid #5b86e5;
            transform: translateY(-50%);
          }
          .custom-select option {
            background: #f4fafd;
            color: #263238;
          }
          .custom-select option:checked, .custom-select option:hover {
            background: #e3f2fd;
            color: #1565c0;
          }
          @media (max-width: 700px) {
            input, textarea, select { font-size: 14px !important; }
            .ripple { font-size: 15px !important; }
          }
        `}</style>
      </div>
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
    maxWidth: "480px",
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
    fontSize: "25px",
    color: "#3a7bd5",
    fontWeight: 700,
    letterSpacing: 0.5,
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex', alignItems: 'center',
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
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    fontSize: "15px",
    color: '#1565c0',
  },
  inputIconBox: {
    display: 'flex', alignItems: 'center', background: '#f4fafd', borderRadius: 10, boxShadow: '0 1px 4px #e3f2fd', border: '1.5px solid #e3f2fd', padding: '0 10px',
  },
  inputIcon: {
    color: '#5b86e5', fontSize: 18, marginRight: 8,
  },
  input: {
    padding: "10px 0",
    border: "none",
    background: "transparent",
    fontSize: "15px",
    outline: 'none',
    width: '100%',
    color: '#263238',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e3f2fd",
    fontSize: "15px",
    outline: 'none',
    background: '#f4fafd',
    color: '#263238',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 1px 4px #e3f2fd',
    cursor: 'pointer',
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e3f2fd",
    fontSize: "15px",
    resize: "vertical",
    outline: 'none',
    background: '#f4fafd',
    color: '#263238',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 1px 4px #e3f2fd',
  },
  checkbox: {
    accentColor: '#5b86e5',
    width: 18, height: 18,
    marginRight: 8,
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    padding: "12px 32px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    background: 'linear-gradient(90deg, #a8edea 0%, #5b86e5 100%)',
    boxShadow: '0 2px 12px rgba(91,134,229,0.10)',
    transition: "background-color 0.3s ease",
    position: 'relative',
    overflow: 'hidden',
  },
  successMsg: {
    color: "#27ae60",
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 15,
  },
};

export default NurseHealthDeclaration; 