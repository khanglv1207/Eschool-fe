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
    title: "Sự cố y tế",
    submenu: [
      { title: "Ghi nhận sự kiện", link: "/medical-events" },
    ],
  },
  {
    title: "Quản lí thuốc",
    submenu: [
      { title: "Gửi thuốc cho con", link: "/medicine-registration" },
    ],
  },
  { title: "Blog", link: "/blogs" },
  { title: "Liên hệ & Hỗ trợ", link: "/contact" },
];

const menuStyle = {
  textDecoration: "none",
  color: "#222",
  padding: "18px 24px",
  fontWeight: 700,
  fontSize: "20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontFamily: "Segoe UI, sans-serif",
};

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
  fontFamily: "Segoe UI, sans-serif",
};

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
    <>
      {/* Header trên cùng */}
      <div style={{ background: "#4395F7", color: "#fff", fontSize: 15, height: 36, padding: 0, fontFamily: "Segoe UI, sans-serif", margin: 0, border: 0, width: '100vw', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', display: "flex", alignItems: "center", justifyContent: "space-between", padding: '0 32px', height: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div className="marquee-header" style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: 420 }}>
              <span style={{ display: 'inline-block', animation: 'marquee-header 12s linear infinite' }}>
                📞 0816.386.382 &nbsp;&nbsp; 🕑 7:30-17:00 | Thứ 2-6 &nbsp;&nbsp; 🏥 TP.Hồ Chí Minh
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ marginRight: 16 }}>Buổi sáng / Buổi chiều</span>
            <span style={{ cursor: "pointer" }}>🌐 Chỉnh Anh Việt</span>
            <span style={{ fontSize: 18, marginLeft: 8, cursor: "pointer" }}>● ● ●</span>
          </div>
        </div>
      </div>
      {/* Navbar chính */}
      <nav
        style={{
          backgroundColor: "#fff",
          padding: "0",
          height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "none",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="eSchoolMed Logo" style={{ height: "90px", marginRight: 12, marginLeft: 32 }} />
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
          <span style={{ marginLeft: 32, fontWeight: 600, fontSize: 18, color: '#4395F7' }}>Buổi sáng / Buổi chiều</span>
        </div>

        {/* Nút Book Appointment */}
        {/* Đã xóa nút Book Appointment theo yêu cầu */}

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
          .menu-item:hover > .submenu {
            display: block !important;
          }
          .menu-item > a:hover, .menu-item > span:hover {
            background: #e3f2fd;
            color: #1E90FF;
            transition: background 0.2s, color 0.2s;
          }
          .submenu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
            min-width: 220px;
            border-radius: 10px;
            z-index: 1000;
            padding: 8px 0;
          }
          .submenu-link:hover {
            background: #1E90FF;
            color: #fff;
            transition: background 0.2s, color 0.2s;
          }
          .login-container {
            position: relative;
            z-index: 2000;
          }
          .login-container:hover > .login-submenu,
          .login-submenu:hover {
            display: block !important;
          }
          .login-submenu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: #fff;
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
            min-width: 180px;
            border-radius: 10px;
            z-index: 2001;
            padding: 8px 0;
            pointer-events: auto;
          }
          .login-submenu .submenu-link:hover {
            background: #1E90FF;
            color: #fff;
            transition: background 0.2s, color 0.2s;
          }
          .book-appointment-btn:hover {
            background: #42a5f5 !important;
            box-shadow: 0 4px 16px rgba(33,150,243,0.18) !important;
            color: #fff !important;
          }
          @keyframes marquee-header {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </nav>
    </>
  );
}

export default Navbar;
