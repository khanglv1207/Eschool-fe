import React, { useState, useEffect } from "react";

function HealthIncidentForm({ onBack }) {
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [reporter, setReporter] = useState("");
  const [resolved, setResolved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Báo cáo sự cố thành công!\n` +
        `Tên học sinh: ${studentName}\n` +
        `Lớp: ${className}\n` +
        `Ngày sự cố: ${incidentDate}\n` +
        `Mô tả: ${description}\n` +
        `Người báo cáo: ${reporter}\n` +
        `Đã xử lý: ${resolved ? "Có" : "Chưa"}`
    );
    onBack();
  };

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
        0% { transform: translateX(0) }
        100% { transform: translateX(-50%) }
      }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>🚑 Báo Cáo Sự Cố Y Tế</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên học sinh:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="Nhập tên học sinh"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lớp:</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              placeholder="Nhập lớp"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ngày xảy ra sự cố:</label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mô tả sự cố:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết sự cố..."
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Người báo cáo:</label>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              required
              placeholder="Nhập tên người báo cáo"
              style={styles.input}
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
              checked={resolved}
              onChange={(e) => setResolved(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <label style={{ fontSize: "15px" }}>Đã xử lý?</label>
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
              Gửi báo cáo
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
    backgroundColor: "#4395F7",
    boxShadow: "0 4px 8px rgba(67, 149, 247, 0.4)",
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

export default HealthIncidentForm;
