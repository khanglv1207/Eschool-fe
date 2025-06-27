import React, { useState } from "react";
import { loginUser, requestPasswordReset, verifyOtp, resetPassword } from "../services/userApi";
//import authApi from "../services/authApi";
import "../App.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đổi mật khẩu
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      const userObj = res.result;
      const token = userObj.token;

      localStorage.setItem("access_token", token);
      localStorage.setItem("loggedInUser", JSON.stringify(userObj));

      // Nếu vừa đổi mật khẩu lần đầu xong, chuyển sang cập nhật hồ sơ
      if (localStorage.getItem("justChangedPassword")) {
        localStorage.removeItem("justChangedPassword");
        alert("Đăng nhập thành công! Vui lòng cập nhật thông tin hồ sơ.");
        window.location.href = "/update-profile";
        return;
      }

      if (userObj.role === "nurse") {
        alert("Đăng nhập thành công!");
        window.location.href = "/nurse/health-declaration";
      } else if (userObj.firstLogin) {
        alert("Đây là lần đăng nhập đầu tiên. Vui lòng đổi mật khẩu.");
        window.location.href = "/change-password";
      } else if (userObj.role === "admin") {
        alert("Đăng nhập thành công!");
        window.location.href = "/admin";
      } else {
        alert("Đăng nhập thành công!");
        window.location.href = "/";
      }
    } catch (err) {
      const msg = err.message || "Đăng nhập thất bại!";
      alert(msg);
    }
  };

  // Xử lý quên mật khẩu (giả lập, chưa gọi API thật)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    if (forgotStep === 1) {
      if (!forgotEmail) {
        setForgotMsg("Vui lòng nhập email.");
        return;
      }
      try {
        await requestPasswordReset(forgotEmail);
        setForgotMsg("Đã gửi mã OTP về email. Vui lòng kiểm tra hộp thư.");
        setForgotStep(2);
      } catch (err) {
        setForgotMsg(err.message || "Không gửi được OTP.");
      }
    } else if (forgotStep === 2) {
      if (!otp) {
        setForgotMsg("Vui lòng nhập mã OTP.");
        return;
      }
      try {
        await verifyOtp(forgotEmail, otp);
        setForgotMsg("Xác thực OTP thành công. Vui lòng nhập mật khẩu mới.");
        setForgotStep(3);
      } catch (err) {
        setForgotMsg(err.message || "OTP không hợp lệ.");
      }
    } else if (forgotStep === 3) {
      if (!newPassword || !confirmPassword) {
        setForgotMsg("Vui lòng nhập đầy đủ mật khẩu mới.");
        return;
      }
      if (newPassword.length < 6) {
        setForgotMsg("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setForgotMsg("Mật khẩu xác nhận không khớp.");
        return;
      }
      try {
        await resetPassword(forgotEmail, newPassword);
        setForgotMsg("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
        setTimeout(() => {
          setShowForgot(false);
          setForgotStep(1);
          setForgotEmail("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setForgotMsg("");
        }, 1800);
      } catch (err) {
        setForgotMsg(err.message || "Đổi mật khẩu thất bại.");
      }
    }
  };

  return (
    <div className="login-page enhanced-login-bg">
      <div className="login-card enhanced-login-card">
        <h2 className="login-title enhanced-login-title">eSchoolMed</h2>
        <p className="login-subtitle enhanced-login-subtitle">
          Đăng nhập hệ thống
        </p>
        {!showForgot ? (
          <>
            <form onSubmit={handleLogin} className="login-form enhanced-login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="enhanced-input"
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="enhanced-input"
              />
              <button type="submit" className="login-button enhanced-login-button">
                Đăng nhập
              </button>
            </form>
            <div className="login-links enhanced-login-links">
              <button
                onClick={() => setShowForgot(true)}
                className="login-link enhanced-login-link"
              >
                Quên mật khẩu?
              </button>
            </div>
          </>
        ) : (
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(30,144,255,0.10)",
            padding: 32,
            maxWidth: 400,
            margin: "0 auto",
            fontFamily: "'Segoe UI', sans-serif"
          }}>
            <h3 style={{
              color: "#1677ff",
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 22,
              textAlign: "center",
              letterSpacing: 0.5
            }}>
              {forgotStep === 1 && "Nhập email"}
              {forgotStep === 2 && "Nhập mã OTP"}
              {forgotStep === 3 && "Đổi mật khẩu mới"}
            </h3>
            <form onSubmit={handleForgotSubmit}>
              {forgotStep === 1 && (
                <>
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="enhanced-input"
                    style={{
                      marginBottom: 20,
                      fontSize: 17,
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1.5px solid #d1d5db",
                      background: "#f9fafb"
                    }}
                  />
                  <button type="submit" className="login-button enhanced-login-button" style={{
                    marginBottom: 10,
                    padding: "10px 24px"
                  }}>
                    Gửi OTP
                  </button>
                </>
              )}
              {forgotStep === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="enhanced-input"
                    style={{
                      marginBottom: 20,
                      fontSize: 17,
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1.5px solid #d1d5db",
                      background: "#f9fafb"
                    }}
                  />
                  <button type="submit" className="login-button enhanced-login-button" style={{
                    marginBottom: 10,
                    fontSize: 17,
                    padding: "13px 0",
                    borderRadius: 10,
                    fontWeight: 600
                  }}>
                    Xác thực OTP
                  </button>
                </>
              )}
              {forgotStep === 3 && (
                <>
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="enhanced-input"
                    style={{
                      marginBottom: 14,
                      fontSize: 17,
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1.5px solid #d1d5db",
                      background: "#f9fafb"
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="enhanced-input"
                    style={{
                      marginBottom: 20,
                      fontSize: 17,
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1.5px solid #d1d5db",
                      background: "#f9fafb"
                    }}
                  />
                  <button type="submit" className="login-button enhanced-login-button" style={{
                    marginBottom: 10,
                    fontSize: 17,
                    padding: "13px 0",
                    borderRadius: 10,
                    fontWeight: 600
                  }}>
                    Đổi mật khẩu
                  </button>
                </>
              )}
            </form>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10
            }}>
              <span style={{
                color: forgotStep === 3 && forgotMsg.includes('thành công') ? '#27ae60' : '#e74c3c',
                fontWeight: 500,
                fontSize: 16
              }}>{forgotMsg}</span>
            </div>
            <button
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setForgotMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#1677ff",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 16,
                display: "block",
                margin: "0 auto",
                fontWeight: 500
              }}
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
