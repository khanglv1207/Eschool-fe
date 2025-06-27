import React, { useState, useEffect } from "react";

function NurseHealthDeclaration() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: "",
    hasFever: false,
  });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Bỏ kiểm tra phân quyền, ai cũng có thể khai báo
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
    setForm({ name: "", age: "", symptoms: "", hasFever: false });
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>🩺 Y Tá Khai Báo Sức Khỏe</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tuổi:</label>
            <input
              type="number"
              name="age"
              value={form.age}
              min="1"
              onChange={handleChange}
              required
              placeholder="Nhập tuổi"
              style={styles.input}
            />
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
            />
          </div>
          <div style={{ ...styles.formGroup, flexDirection: "row", alignItems: "center" }}>
            <input
              type="checkbox"
              name="hasFever"
              checked={form.hasFever}
              onChange={handleChange}
              style={{ marginRight: "8px" }}
            />
            <label style={{ fontSize: "15px" }}>Có sốt hay không?</label>
          </div>
          {success && <div style={{ color: "#27ae60", marginBottom: 10 }}>{success}</div>}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>
              Gửi khai báo
            </button>
          </div>
        </form>
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
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    padding: "12px 32px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    transition: "background-color 0.3s ease",
  },
};

export default NurseHealthDeclaration; 