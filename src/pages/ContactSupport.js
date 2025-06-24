import React, { useState } from "react";

function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yêu cầu hỗ trợ:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liên hệ & Hỗ trợ</h2>

      <div style={styles.section}>
        <h3>Thông tin liên hệ</h3>
        <p>
          <strong>Phòng y tế trường học:</strong>
        </p>
        <p>📞 0123 456 789</p>
        <p>✉️ ytetruong@eschoolmed.vn</p>
        <p>🏫 Trường THPT ABC, Quận XYZ, TP.HCM</p>

        <p style={{ marginTop: 20 }}>
          <strong>Bộ phận kỹ thuật eSchoolMed:</strong>
        </p>
        <p>📞 1900 999 888</p>
        <p>✉️ hotro@eschoolmed.vn</p>
      </div>

      <div style={styles.section}>
        <h3>Gửi yêu cầu hỗ trợ</h3>
        {submitted ? (
          <p style={{ color: "green" }}>
            ✅ Cảm ơn bạn đã liên hệ. Bộ phận hỗ trợ sẽ phản hồi trong vòng 24h.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email liên hệ"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <textarea
              name="message"
              placeholder="Nội dung hỗ trợ"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              style={styles.textarea}
            />
            <button type="submit" style={styles.button}>
              Gửi yêu cầu
            </button>
          </form>
        )}
      </div>

      <div style={styles.section}>
        <h3>Câu hỏi thường gặp (FAQ)</h3>
        <ul>
          <li>Làm thế nào để khai báo sức khỏe cho học sinh?</li>
          <li>Tôi quên mật khẩu, phải làm sao?</li>
          <li>Cập nhật thông tin tiêm chủng thế nào?</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: 800,
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#007BFF",
  },
  section: {
    marginBottom: 40,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ContactSupport;
