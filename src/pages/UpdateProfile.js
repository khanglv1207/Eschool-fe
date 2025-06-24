import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    username: "",
    password: "",
  });

  // ✅ Di chuyển localStorage vào useEffect để tránh cảnh báo
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setFormData(storedUser);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(formData));
    alert("Cập nhật hồ sơ thành công!");
    navigate("/profile");
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cập nhật hồ sơ</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: "Họ và tên", name: "fullName" },
          { label: "Email", name: "email" },
          { label: "Số điện thoại", name: "phone" },
          { label: "Ngày sinh", name: "dob", type: "date" },
          { label: "Giới tính", name: "gender" },
          { label: "Tên đăng nhập", name: "username" },
          { label: "Mật khẩu", name: "password", type: "password" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} style={styles.field}>
            <label style={styles.label}>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        ))}

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: "#1E90FF" }}
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleBack}
            style={{
              ...styles.button,
              backgroundColor: "#fff",
              color: "#1E90FF",
              border: "2px solid #1E90FF",
            }}
          >
            Quay về
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(to bottom, #f0f8ff, #ffffff)",
    minHeight: "100vh",
    animation: "fadeIn 0.6s ease-in-out",
  },
  title: {
    fontSize: "30px",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
  },
  field: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default UpdateProfile;
