import React, { useState } from "react";
import { loginUser } from "../services/userApi";
//import authApi from "../services/authApi";
import "../App.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

      alert("Đăng nhập thành công!");
      window.location.href = "/";
    } catch (err) {
      const msg = err.message || "Đăng nhập thất bại!";
      alert(msg);
    }
  };

  return (
    <div className="login-page enhanced-login-bg">
      <div className="login-card enhanced-login-card">
        <h2 className="login-title enhanced-login-title">eSchoolMed</h2>
        <p className="login-subtitle enhanced-login-subtitle">
          Đăng nhập hệ thống
        </p>
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
            onClick={() => alert("Liên hệ quản trị viên để lấy lại mật khẩu.")}
            className="login-link enhanced-login-link"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
