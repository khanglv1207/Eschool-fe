import React, { useState } from "react";
import { firstChangePassword } from "../services/userApi";

function ChangePassword() {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.newPassword || !form.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      // Lấy userId từ localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser && (loggedInUser.id || loggedInUser.userId || loggedInUser.user_id);
      if (!userId) {
        setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }
      await firstChangePassword(userId, form.newPassword);
      setSuccess("Đổi mật khẩu thành công! Hãy đăng nhập lại với mật khẩu mới.");
      setForm({ newPassword: "", confirmPassword: "" });
      localStorage.setItem("justChangedPassword", "1");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đổi mật khẩu lần đầu</h2>
        <p style={styles.subtitle}>Vui lòng nhập mật khẩu mới để tiếp tục.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            name="newPassword"
            placeholder="Mật khẩu mới"
            value={form.newPassword}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
          />
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
      <style>{`
        body { background: linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%); }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 8px 32px rgba(30, 144, 255, 0.10), 0 1.5px 8px rgba(30, 144, 255, 0.08)",
    padding: "2.5rem 2rem 2rem 2rem",
    width: "100%",
    maxWidth: 370,
    textAlign: "center",
  },
  title: {
    fontFamily: 'Segoe UI',
    fontSize: 24,
    color: "#1677ff",
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 24,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 16,
    background: "#f9fafb",
    marginBottom: 12,
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
  },
  button: {
    padding: "12px 0",
    background: "#1677ff",
    color: "white",
    fontWeight: 700,
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 8,
    transition: "background 0.2s",
  },
  error: {
    color: "#e74c3c",
    marginBottom: 8,
    fontSize: 14,
  },
  success: {
    color: "#27ae60",
    marginBottom: 8,
    fontSize: 14,
  },
};

export default ChangePassword; 