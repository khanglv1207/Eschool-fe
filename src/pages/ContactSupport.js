import React, { useState } from "react";
import emailjs from "emailjs-com"; // Thêm dòng này

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
    // Gửi email qua EmailJS
    emailjs
      .send(
        "YOUR_SERVICE_ID", // Thay bằng Service ID của bạn
        "YOUR_TEMPLATE_ID", // Thay bằng Template ID của bạn
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "YOUR_USER_ID_OR_PUBLIC_KEY" // Thay bằng User ID/Public Key của bạn
      )
      .then(
        (result) => {
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!");
        }
      );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liên hệ & Hỗ trợ</h2>

      <div style={styles.section}>
        <h3>Thông tin liên hệ</h3>
        <p>
          <strong>Phòng y tế trường học:</strong>
        </p>
        <p>📞 0816 386 382</p>
        <p>✉️ eschoolmed391@gmail.com</p>
        <p>🏫 Trường THPT ABC, Quận XYZ, TP.HCM</p>

        <p style={{ marginTop: 20 }}>
          <strong>Bộ phận kỹ thuật eSchoolMed:</strong>
        </p>
        <p>📞 0816 386 382</p>
        <p>✉️ eschoolmed391@gmail.com</p>
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
