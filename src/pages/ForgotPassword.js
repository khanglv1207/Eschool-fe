import React, { useState } from "react";
import { requestPasswordReset, verifyOtp, resetPassword } from "../services/userApi";
import "../App.css";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đổi mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (step === 1) {
        if (!email) {
          setMessage("Vui lòng nhập email.");
          return;
        }
        await requestPasswordReset(email);
        setMessage("Đã gửi mã OTP về email. Vui lòng kiểm tra hộp thư.");
        setStep(2);
      } else if (step === 2) {
        if (!otp) {
          setMessage("Vui lòng nhập mã OTP.");
          return;
        }
        await verifyOtp(email, otp);
        setMessage("Xác thực OTP thành công. Vui lòng nhập mật khẩu mới.");
        setStep(3);
      } else if (step === 3) {
        if (!newPassword || !confirmPassword) {
          setMessage("Vui lòng nhập đầy đủ mật khẩu mới.");
          return;
        }
        if (newPassword.length < 6) {
          setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
          return;
        }
        if (newPassword !== confirmPassword) {
          setMessage("Mật khẩu xác nhận không khớp.");
          return;
        }
        await resetPassword(email, newPassword);
        setMessage("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setMessage(err.message || "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <div className="login-page enhanced-login-bg">
      <div className="login-card enhanced-login-card">
        <h2 className="login-title enhanced-login-title">eSchoolMed</h2>
        <p className="login-subtitle enhanced-login-subtitle">
          {step === 1 && "Quên mật khẩu"}
          {step === 2 && "Xác thực OTP"}
          {step === 3 && "Đặt mật khẩu mới"}
        </p>

        <div style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(30,144,255,0.10)",
          padding: 32,
          maxWidth: 400,
          margin: "0 auto",
          fontFamily: "'Segoe UI', sans-serif"
        }}>
          {/* Progress indicator */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
            gap: 8
          }}>
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: step >= stepNumber ? "#1677ff" : "#e5e7eb",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <p style={{
                  color: "#6b7280",
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 1.5
                }}>
                  Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
                </p>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="enhanced-input"
                  style={{
                    marginBottom: 20,
                    fontSize: 17,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #d1d5db",
                    background: "#f9fafb",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="login-button enhanced-login-button" 
                  style={{
                    width: "100%",
                    fontSize: 17,
                    padding: "13px 0",
                    borderRadius: 10,
                    fontWeight: 600,
                    opacity: isLoading ? 0.7 : 1
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{
                  color: "#6b7280",
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 1.5
                }}>
                  Mã OTP đã được gửi đến <strong>{email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Nhập mã OTP 6 số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="enhanced-input"
                  style={{
                    marginBottom: 20,
                    fontSize: 17,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #d1d5db",
                    background: "#f9fafb",
                    width: "100%",
                    boxSizing: "border-box",
                    textAlign: "center",
                    letterSpacing: "2px"
                  }}
                  maxLength={6}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="login-button enhanced-login-button" 
                  style={{
                    width: "100%",
                    fontSize: 17,
                    padding: "13px 0",
                    borderRadius: 10,
                    fontWeight: 600,
                    opacity: isLoading ? 0.7 : 1
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <p style={{
                  color: "#6b7280",
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 1.5
                }}>
                  Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                </p>
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="enhanced-input"
                  style={{
                    marginBottom: 14,
                    fontSize: 17,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #d1d5db",
                    background: "#f9fafb",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="enhanced-input"
                  style={{
                    marginBottom: 20,
                    fontSize: 17,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #d1d5db",
                    background: "#f9fafb",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="login-button enhanced-login-button" 
                  style={{
                    width: "100%",
                    fontSize: 17,
                    padding: "13px 0",
                    borderRadius: 10,
                    fontWeight: 600,
                    opacity: isLoading ? 0.7 : 1
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                </button>
              </div>
            )}
          </form>

          {/* Message display */}
          {message && (
            <div style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: message.includes('thành công') ? '#d1fae5' : '#fef2f2',
              border: `1px solid ${message.includes('thành công') ? '#10b981' : '#f87171'}`,
              textAlign: "center"
            }}>
              <span style={{
                color: message.includes('thành công') ? '#065f46' : '#991b1b',
                fontWeight: 500,
                fontSize: 14
              }}>
                {message}
              </span>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            gap: 12
          }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: "none",
                  border: "1px solid #d1d5db",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  flex: 1
                }}
                disabled={isLoading}
              >
                Quay lại
              </button>
            )}
            <button
              onClick={resetForm}
              style={{
                background: "none",
                border: "none",
                color: "#1677ff",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 14,
                fontWeight: 500,
                flex: step > 1 ? 1 : 1
              }}
              disabled={isLoading}
            >
              Bắt đầu lại
            </button>
          </div>

          <div style={{
            textAlign: "center",
            marginTop: 20,
            paddingTop: 20,
            borderTop: "1px solid #e5e7eb"
          }}>
            <a
              href="/login"
              style={{
                color: "#1677ff",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ← Quay lại đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 