import React from "react";
import bannerImage from "../assets/banner.jpg";
import "./Banner.css"; // Thêm hiệu ứng vào đây

function Banner() {
  return (
    <div className="fade-in">
      {/* Banner Image */}
      <img
        src={bannerImage}
        alt="eSchoolMed banner"
        style={{
          width: "100%",
          height: "500px",
          objectFit: "cover",
        }}
      />

      {/* Phần Giới thiệu */}
      <div className="fade-in" style={{ padding: "40px", textAlign: "center" }}>
        <h1
          style={{ fontSize: "36px", marginBottom: "20px", color: "#1E90FF" }}
        >
          Chào mừng đến với hệ thống y tế học đường <strong>eSchoolMed</strong>
        </h1>
        <p
          style={{
            fontSize: "18px",
            maxWidth: "900px",
            margin: "0 auto",
            color: "#444",
          }}
        >
          eSchoolMed là hệ thống hỗ trợ quản lý sức khỏe học sinh toàn diện bao
          gồm khai báo sức khỏe, tiêm chủng, sự kiện y tế, và quản lý thuốc.
        </p>
      </div>

      {/* Các chức năng chính */}
      <div
        className="fade-in"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          padding: "40px",
        }}
      >
        <FeatureCard
          title="Khai báo sức khỏe"
          description="Phụ huynh dễ dàng khai báo tình trạng sức khỏe hàng ngày của học sinh."
        />
        <FeatureCard
          title="Tiêm chủng"
          description="Theo dõi lịch sử tiêm và thông báo các mũi tiêm sắp tới."
        />
        <FeatureCard
          title="Sự kiện y tế"
          description="Ghi nhận và xử lý các sự cố y tế tại trường học một cách nhanh chóng."
        />
        <FeatureCard
          title="Gửi thuốc & Quản lý thuốc"
          description="Phụ huynh gửi thuốc cho con, nhà trường theo dõi và quản lý tồn kho thuốc dễ dàng."
        />
      </div>

      {/* Phần Giới thiệu thêm */}
      <div
        className="fade-in"
        style={{
          padding: "40px",
          backgroundColor: "#f2f7ff",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "28px", color: "#1E90FF", marginBottom: "16px" }}
        >
          Giới thiệu
        </h2>
        <p
          style={{
            fontSize: "17px",
            maxWidth: "800px",
            margin: "0 auto",
            color: "#333",
          }}
        >
          eSchoolMed là sản phẩm hợp tác giữa chuyên gia y tế học đường và công
          nghệ giáo dục, nhằm nâng cao hiệu quả theo dõi và chăm sóc sức khỏe
          học sinh tại trường học...
        </p>
      </div>

      {/* Phần Giờ làm việc */}
      <div
        className="fade-in"
        style={{
          padding: "30px",
          backgroundColor: "#e8f4ff",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "24px", color: "#1E90FF", marginBottom: "12px" }}
        >
          Giờ làm việc
        </h2>
        <p style={{ fontSize: "16px", color: "#333" }}>
          🕘 Thứ Hai - Thứ Sáu: 07:30 - 17:00 <br />
          🕘 Thứ Bảy: 07:30 - 11:30 <br />❌ Chủ nhật & Ngày lễ: Nghỉ
        </p>
      </div>
    </div>
  );
}

// FeatureCard có hiệu ứng hover nổi lên
function FeatureCard({ title, description }) {
  return (
    <div className="feature-card">
      <h3 style={{ fontSize: "20px", color: "#1E90FF", marginBottom: "12px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "16px", color: "#333" }}>{description}</p>
    </div>
  );
}

export default Banner;
