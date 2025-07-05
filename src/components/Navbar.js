import React from "react";
import logo from "../assets/logoeSchoolMed.jpg";
import loginIcon from "../assets/login.jpg";

// Danh sách menu
const MENU_ITEMS = [
  { title: "Trang chủ", link: "/" },
  {
    title: "Hồ sơ & Tiêm chủng",
    submenu: [
      { title: "Khai báo sức khỏe", link: "/health-declaration" },
      { title: "Tiêm chủng", link: "/vaccination" },
      { title: "Kiểm tra y tế định kỳ", link: "/medical-checkup" },
    ],
  },
  {
    title: "Sự kiện y tế",
    submenu: [
      { title: "Ghi nhận sự kiện", link: "/medical-events" },
      { title: "Gửi thuốc cho trường", link: "/send-medicine" },
    ],
  },
  {
    title: "Quản lí thuốc",
    submenu: [
      { title: "Danh sách thuốc", link: "/inventory" },
      { title: "Kiểm kê thuốc", link: "/inventory-check" },
      { title: "Gửi thuốc cho con", link: "/medicine-registration" },
      { title: "Báo cáo thuốc", link: "/medicine-report" },
    ],
  },
  { title: "Liên hệ & Hỗ trợ", link: "/contact" },
];

function Navbar() {
  let fullName = null;
  let isLoggedIn = false;
  try {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      fullName = parsed?.fullName || null;
      isLoggedIn = true;
    }
  } catch (e) {
    console.warn("Lỗi đọc loggedInUser:", e);
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        padding: "0 40px",
        height: "130px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e0e0e0",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="eSchoolMed Logo" style={{ height: "250px" }} />
      </div>

      {/* Menu chính */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {MENU_ITEMS.map((item) => (
          <div
            key={item.title}
            className="menu-item"
            style={{ position: "relative" }}
          >
            {!item.submenu ? (
              <a href={item.link} style={menuStyle}>
                {item.title}
              </a>
            ) : (
              <>
                <span style={menuStyle}>{item.title}</span>
                <div className="submenu">
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.title}
                      href={sub.link}
                      className="submenu-link"
                      style={submenuStyle}
                    >
                      {sub.title}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Người dùng */}
      <div
        className="login-container"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        {isLoggedIn ? (
          <>
            <img
              src={loginIcon}
              alt="Đăng nhập"
              style={{
                height: "42px",
                width: "42px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            {fullName && (
              <span style={{ fontWeight: 600, fontSize: "16px", color: "#333" }}>
                {fullName}
              </span>
            )}
            <div className="login-submenu">
              <a
                href="/update-profile"
                className="submenu-link"
                style={submenuStyle}
              >
                Thông tin hồ sơ
              </a>
              <span
                onClick={handleLogout}
                className="submenu-link"
                style={{ ...submenuStyle, cursor: "pointer" }}
              >
                Đăng xuất
              </span>
            </div>
          </>
        ) : (
          <a href="/login" style={{ ...menuStyle, fontSize: 18 }}>Đăng nhập</a>
        )}
      </div>

      {/* CSS nội tuyến */}
      <style>{`
        .submenu, .login-submenu {
          position: absolute;
          top: 100%;
          background-color: #fff;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          min-width: 240px;
          display: none;
          z-index: 1000;
          border-radius: 10px;
          padding: 12px 0;
          transition: all 0.2s ease;
        }
        .submenu { left: 0; }
        .login-submenu { right: 0; }

        .menu-item:hover > .submenu,
        .login-container:hover > .login-submenu {
          display: block;
        }

        .submenu-link:hover {
          background-color: #1E90FF;
          color: white;
          padding-left: 26px;
          transition: all 0.2s ease;
        }
      `}</style>
    </nav>
  );
}

// ✅ Style cho menu chính (hiện con trỏ bàn tay khi hover)
const menuStyle = {
  textDecoration: "none",
  color: "#222",
  padding: "18px 24px",
  fontWeight: 700,
  fontSize: "20px",
  borderRadius: "8px",
  cursor: "pointer",
};

// Style cho submenu
const submenuStyle = {
  display: "block",
  padding: "12px 24px",
  color: "#333",
  textDecoration: "none",
  whiteSpace: "nowrap",
  borderRadius: "8px",
  fontWeight: 500,
  fontSize: "16px",
  transition: "all 0.2s ease",
};

export default Navbar;
