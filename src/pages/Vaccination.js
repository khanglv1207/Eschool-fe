import React from "react";

function Vaccination() {
  return (
    <div style={{ background: "#eaf6ff", minHeight: "100vh", padding: "0 0 60px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <span style={{ fontSize: 38, color: "#1E90FF" }}>💉</span>
          <h1 style={{ color: "#1E90FF", fontWeight: 800, fontSize: 32, margin: 0, letterSpacing: 1 }}>
            Quản lý Tiêm chủng
          </h1>
        </div>
        <div style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginBottom: 32
        }}>
          {/* Card 1 */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Gửi thông báo tiêm chủng</div>
            <div style={cardDescStyle}>Gửi thông báo về lịch tiêm chủng cho phụ huynh để họ xác nhận tham gia.</div>
          </div>
          {/* Card 2 */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Lập danh sách học sinh cần tiêm</div>
            <div style={cardDescStyle}>Lập danh sách học sinh cần tiêm chủng, theo dõi trạng thái xác nhận.</div>
          </div>
          {/* Card 3 */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Ghi nhận kết quả tiêm chủng</div>
            <div style={cardDescStyle}>Nhập kết quả tiêm chủng cho từng học sinh.</div>
          </div>
          {/* Card 4 */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Trả kết quả & Lập lịch nhắc lại</div>
            <div style={cardDescStyle}>Gửi kết quả cho phụ huynh, lập lịch nhắc lại nếu cần tiêm bổ sung.</div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#1E90FF", fontWeight: 600, fontSize: 18, marginTop: 40 }}>
          Đang xử lý...
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 4px 24px rgba(30,144,255,0.10)",
  border: "1.5px solid #e3eafc",
  padding: "28px 22px 22px 22px",
  minWidth: 260,
  maxWidth: 320,
  flex: 1,
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 12
};

const cardTitleStyle = {
  fontWeight: 700,
  color: "#1E90FF",
  fontSize: 18,
  marginBottom: 6
};

const cardDescStyle = {
  color: "#444",
  fontSize: 15,
  fontWeight: 500
};

export default Vaccination;
