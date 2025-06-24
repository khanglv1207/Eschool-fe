import React, { useState, useEffect } from "react";

function KhaiBaoSucKhoe({ onBack }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [hasFever, setHasFever] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Khai báo thành công!\nTên: ${name}\nTuổi: ${age}\nTriệu chứng: ${symptoms}\nSốt: ${
        hasFever ? "Có" : "Không"
      }`
    );
    onBack();
  };

  // Đảm bảo animation keyframe chỉ thêm 1 lần
  useEffect(() => {
    const styleTagId = "gradient-animation-keyframes";
    if (!document.getElementById(styleTagId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleTagId;
      styleTag.innerHTML = `
      @keyframes gradientMove {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
      @keyframes waveMove {
        0% { transform: translateX(0) }m
        100% { transform: translateX(-50%) }
      }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>🩺 Khai Báo Sức Khỏe</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Họ tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nhập họ tên"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tuổi:</label>
            <input
              type="number"
              value={age}
              min="1"
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="Nhập tuổi"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Triệu chứng:</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Mô tả triệu chứng..."
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div
            style={{
              ...styles.formGroup,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={hasFever}
              onChange={(e) => setHasFever(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <label style={{ fontSize: "15px" }}>Có sốt hay không?</label>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2C6AD8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4395F7")
              }
            >
              Gửi khai báo
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{ ...styles.button, backgroundColor: "#4395F7" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2C6AD8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4395F7")
              }
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>

      {/* Sóng uốn lượn dưới nền */}
      <div style={styles.waveWrapper}>
        <svg
          style={styles.waveSvg}
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gradient)"
            fillOpacity="0.6"
            d="M0,100 C150,200 350,0 600,100 C850,200 1050,0 1200,100 L1200,200 L0,200 Z"
          />
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#89f7fe" />
              <stop offset="100%" stopColor="#66a6ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nhân đôi sóng để animation liên tục */}
        <svg
          style={{ ...styles.waveSvg, ...styles.waveSvgDuplicate }}
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gradient)"
            fillOpacity="0.6"
            d="M0,100 C150,200 350,0 600,100 C850,200 1050,0 1200,100 L1200,200 L0,200 Z"
          />
        </svg>
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(270deg, #89f7fe, #66a6ff, #fbc2eb, #a6c1ee)",
    backgroundSize: "800% 800%",
    animation: "gradientMove 15s ease infinite",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "550px",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    background: "white",
    color: "#333",
    position: "relative",
    zIndex: 2,
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "26px",
    color: "#007BFF",
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
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outlineColor: "#007BFF",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    resize: "vertical",
    outlineColor: "#007BFF",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "20px",
  },
  button: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#28a745",
    boxShadow: "0 4px 8px rgba(40, 167, 69, 0.4)",
    transition: "background-color 0.3s ease",
  },
  waveWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "200%",
    height: "200px",
    overflow: "hidden",
    display: "flex",
    animation: "waveMove 10s linear infinite",
    zIndex: 1,
  },
  waveSvg: {
    width: "50%",
    height: "100%",
    flexShrink: 0,
  },
  waveSvgDuplicate: {
    marginLeft: "-1px",
  },
};

export default KhaiBaoSucKhoe;
