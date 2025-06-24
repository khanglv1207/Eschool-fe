import React from "react";
import logo from "../assets/logoeSchoolMed.jpg";
import loginIcon from "../assets/login.jpg";
import bannerImage from "../assets/banner.jpg";
import "./Banner.css"; // Nếu có hiệu ứng riêng

const MENU_ITEMS = [
  {
    title: "Trang chủ",
    link: "/",
  },
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
  {
    title: "Liên hệ & Hỗ trợ",
    link: "/contact",
  },
];

function Home({ onKhaiBaoClick, onIncidentClick, onDangKyThuocClick }) {
  return (
    <div>
      {/* Banner */}
      <div>
        <div className="banner-text">
          Chào mừng đến với hệ thống quản lý y tế trường học eSchoolMed
        </div>
        <img
          src={bannerImage}
          alt="eSchoolMed banner"
          style={{
            width: "100%",
            height: "550px",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

// Style chung
const navItemStyle = {
  textDecoration: "none",
  color: "#111",
  padding: "15px 20px",
  display: "inline-block",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "18px",
  borderRadius: "6px",
  letterSpacing: "0.5px",
  transition: "color 0.3s ease",
};

const submenuStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#222",
  textDecoration: "none",
  whiteSpace: "nowrap",
  borderRadius: "6px",
  fontWeight: 500,
  fontSize: "16px",
  transition: "background-color 0.3s ease, color 0.3s ease",
};

const mouseEnter = (e) => {
  e.currentTarget.style.backgroundColor = "#1E90FF";
  e.currentTarget.style.color = "white";
  e.currentTarget.style.fontWeight = "600";
};

const mouseLeave = (e) => {
  e.currentTarget.style.backgroundColor = "transparent";
  e.currentTarget.style.color = "#222";
  e.currentTarget.style.fontWeight = "500";
};

export default Home;
