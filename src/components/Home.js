import React from "react";
import bannerImage from "../assets/banner.jpg";
import loginIcon from "../assets/gioithieueschool.jpg";
//import logo from "../assets/logoeSchoolMed.jpg";
import "./Banner.css";

const statistics = [
  { label: "Dự án triển khai", value: "60+", icon: "📈" },
  { label: "Phụ huynh hài lòng", value: "99%", icon: "😊" },
  { label: "Giường y tế", value: "700+", icon: "🛏️" },
  { label: "Chuyên gia y tế", value: "70+", icon: "🧑‍⚕️" },
];

const services = [
  { title: "Khai báo sức khỏe", desc: "Khai báo sức khỏe hàng ngày cho học sinh.", icon: "📝" },
  { title: "Tiêm chủng", desc: "Theo dõi lịch sử tiêm và nhắc lịch.", icon: "💉" },
  { title: "Sự kiện y tế", desc: "Ghi nhận, xử lý sự cố y tế.", icon: "🚑" },
];

function Home({ onKhaiBaoClick, onIncidentClick, onDangKyThuocClick }) {
  // Lấy thông tin user từ localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userRole = loggedInUser.role || "";
  const isParent = userRole === 'PARENT' || userRole === 'parent';
  
  return (
    <div style={{ background: "#f4f8fc" }}>
      {/* Banner Section */}
      <section style={{ background: "#fff", padding: "40px 0 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap" }}>
          {/* Bên trái: Tiêu đề, mô tả, nút */}
          <div style={{ flex: 1, minWidth: 320, padding: 24 }}>
            <div style={{ color: '#4395F7', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>eSchoolMed - Xây dựng một cộng đồng học đường khỏe mạnh hơn</div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: '#222', marginBottom: 20, lineHeight: 1.15 }}>
              Hệ Thống Quản Lý <br />
              <span style={{ color: '#4395F7' }}>Tiêm Chủng & Khám Sức Khỏe Định Kỳ</span><br />
              Cho Học Sinh
            </h1>
            <p style={{ color: '#444', fontSize: 18, marginBottom: 32, maxWidth: 480 }}>
              Nền tảng hỗ trợ quản lý tiêm chủng, khám sức khỏe định kỳ, khai báo y tế, sự kiện y tế và phối hợp giữa nhà trường, phụ huynh, y tế một cách hiệu quả, hiện đại.
            </p>
            <div style={{ display: 'flex', gap: 22 }}>
              <button className="btn-primary-home" style={{
                background: '#4395F7',
                color: '#fff',
                border: 0,
                borderRadius: 16,
                padding: '16px 40px',
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'Arial, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(67,149,247,0.13)',
                transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                outline: 'none',
              }} onClick={() => {
                const el = document.getElementById('gioi-thieu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>Tìm hiểu thêm</button>
              <button className="btn-outline-home" style={{
                background: '#fff',
                color: '#4395F7',
                border: '2px solid #4395F7',
                borderRadius: 16,
                padding: '16px 40px',
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'Arial, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(67,149,247,0.07)',
                transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                outline: 'none',
              }} onClick={() => {
                const el = document.getElementById('dich-vu-noi-bat');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>Dịch vụ</button>
              <style>{`
                .btn-primary-home:hover {
                  background: #2979e8 !important;
                  color: #fff !important;
                  box-shadow: 0 8px 32px rgba(67,149,247,0.18) !important;
                }
                .btn-outline-home:hover {
                  background: #4395F7 !important;
                  color: #fff !important;
                  border-color: #2979e8 !important;
                  box-shadow: 0 8px 32px rgba(67,149,247,0.13) !important;
                }
              `}</style>
            </div>
          </div>
          {/* Bên phải: Hình ảnh + 2 card nổi */}
          <div style={{ flex: 1, minWidth: 320, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <img src={bannerImage} alt="banner" style={{ width: '100%', maxWidth: 540, borderRadius: 24, boxShadow: '0 8px 32px rgba(67,149,247,0.12)' }} />
          </div>
        </div>
      </section>

      {/* Statistic Section */}
      <section style={{ background: "#4395F7", color: "#fff", padding: "32px 0 0 0" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 6 }}>🏫</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>120+</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Trường học sử dụng</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 6 }}>👨‍👩‍👧‍👦</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>30.000+</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Học sinh & phụ huynh</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 6 }}>💉</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>50.000+</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Lượt tiêm chủng</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 6 }}>🩺</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>10.000+</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Lượt khám sức khỏe</div>
          </div>
        </div>
        {/* Service Card Section (Dentistry, Orthopedic, Cosmetic) */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { icon: "💉", title: "Quản lý tiêm chủng", desc: "Theo dõi, nhắc lịch, quản lý hồ sơ tiêm chủng học sinh.", link: "/vaccination" },
            { icon: "🩺", title: "Khám sức khỏe định kỳ", desc: "Quản lý, nhắc lịch, lưu trữ kết quả khám sức khỏe.", link: "/medical-checkup" },
            // Chỉ hiển thị "Khai báo y tế" cho role parent
            ...(isParent ? [{ icon: "📋", title: "Khai báo y tế", desc: "Khai báo sức khỏe, sự kiện y tế, phối hợp xử lý nhanh chóng." }] : []),
          ].map((s, idx) => (
            s.link ? (
              <div key={idx} className="service-card-home" onClick={() => window.location.href = s.link} style={{ background: '#fff', borderRadius: 24, boxShadow: '0 6px 24px rgba(67,149,247,0.10)', padding: 40, minWidth: 320, textAlign: 'center', flex: 1, margin: '0 12px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 48, color: '#4395F7', marginBottom: 18 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: '#222', marginBottom: 12 }}>{s.title}</div>
                <div style={{ color: '#444', fontSize: 17, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ) : (
              <div key={idx} className="service-card-home" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 6px 24px rgba(67,149,247,0.10)', padding: 40, minWidth: 320, textAlign: 'center', flex: 1, margin: '0 12px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 48, color: '#4395F7', marginBottom: 18 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: '#222', marginBottom: 12 }}>{s.title}</div>
                <div style={{ color: '#444', fontSize: 17, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            )
          ))}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: 18,
          overflow: 'hidden',
          borderRadius: 18,
          background: 'rgba(67,149,247,0.18)',
          boxShadow: '0 2px 12px rgba(67,149,247,0.10)',
          padding: '10px 0',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <span style={{
            display: 'inline-block',
            color: '#fff',
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: 0.2,
            fontFamily: 'Roboto, Arial, sans-serif',
            textShadow: '0 2px 8px rgba(30,144,255,0.10)',
            whiteSpace: 'nowrap',
            animation: 'marquee-slogan 18s linear infinite',
          }}>
            eSchoolMed – Vì một thế hệ học sinh khỏe mạnh, tự tin vươn xa
          </span>
          <style>{`
            @keyframes marquee-slogan {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>
      </section>

      {/* About/Doctor/Health Package Section */}
      <section id="gioi-thieu" style={{ background: "#fff", padding: "40px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <img src={loginIcon} alt="doctor" style={{ width: "100%", maxWidth: 340, borderRadius: 16, boxShadow: "0 4px 24px rgba(67,149,247,0.10)" }} />
          </div>
          <div style={{ flex: 2, minWidth: 320 }}>
            <div style={{ color: '#4395F7', fontWeight: 700, fontSize: 20, marginBottom: 10, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
              <span style={{ borderLeft: '4px solid #4395F7', paddingLeft: 10 }}>Giới thiệu hệ thống</span>
            </div>
            <h2 style={{
              fontSize: 44,
              color: '#4395F7',
              fontWeight: 700,
              marginBottom: 20,
              fontFamily: 'Arial, sans-serif',
              lineHeight: 1.15
            }}>
              Đồng hành cùng sức khỏe học đường
            </h2>
            <p style={{ color: '#333', fontSize: 20, marginBottom: 26, lineHeight: 1.7, maxWidth: 700, fontWeight: 500, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
              <span style={{ fontWeight: 700, color: '#4395F7', fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>eSchoolMed</span> là nền tảng y tế học đường hiện đại, thông minh, kết nối <b>nhà trường</b>, <b>phụ huynh</b> và <b>cán bộ y tế</b>.<br/>
              Hệ thống hỗ trợ quản lý toàn diện sức khỏe học sinh: <b>tiêm chủng</b>, <b>khám sức khỏe định kỳ</b>, <b>khai báo y tế</b>, <b>sự kiện y tế</b>, nhắc lịch tự động, lưu trữ kết quả minh bạch.
            </p>
            <ul style={{ fontSize: 18, color: '#222', marginBottom: 28, lineHeight: 2, paddingLeft: 0, listStyle: 'none', fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}><span style={{ fontSize: 22, color: '#4395F7' }}>✔️</span> Quản lý hồ sơ tiêm chủng, khám sức khỏe định kỳ</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}><span style={{ fontSize: 22, color: '#4395F7' }}>⏰</span> Nhắc lịch tiêm, lịch khám tự động</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}><span style={{ fontSize: 22, color: '#4395F7' }}>📝</span> Khai báo y tế, sự kiện y tế nhanh chóng</li>
            </ul>
            <div style={{ fontSize: 17, color: '#174ea6', marginBottom: 12, fontStyle: 'italic', fontWeight: 700, letterSpacing: '0.5px', background: 'rgba(67,149,247,0.07)', padding: '10px 18px', borderRadius: 10, display: 'inline-block', fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
              “eSchoolMed – Nền tảng y tế học đường hiện đại!”
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="dich-vu-noi-bat" style={{ background: "#f4f8fc", padding: "60px 0 80px 0", fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: 38,
            fontWeight: 700,
            marginBottom: 44,
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            background: 'linear-gradient(90deg, #4395F7 30%, #174ea6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Dịch vụ nổi bật</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[
              { icon: "💉", title: "Quản lý tiêm chủng", desc: "Theo dõi, nhắc lịch, quản lý hồ sơ tiêm chủng học sinh." },
              { icon: "🩺", title: "Khám sức khỏe định kỳ", desc: "Quản lý, nhắc lịch, lưu trữ kết quả khám sức khỏe." },
              { icon: "📋", title: "Khai báo y tế", desc: "Khai báo sức khỏe, sự kiện y tế, phối hợp xử lý nhanh chóng." },
              { icon: "🧑‍⚕️", title: "Tư vấn y tế học đường", desc: "Tư vấn sức khỏe, dinh dưỡng, tâm lý cho học sinh và phụ huynh." },
            ].map((s, idx) => (
              <div key={idx} onClick={() => s.link && (window.location.href = s.link)} style={{
                background: "#fff",
                borderRadius: 28,
                boxShadow: "0 8px 32px rgba(67,149,247,0.10)",
                padding: 44,
                minWidth: 340,
                textAlign: "center",
                margin: '0 8px 32px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
                fontFamily: 'Inter, Roboto, Arial, sans-serif',
              }}>
                <div style={{ fontSize: 54, color: '#4395F7', marginBottom: 22 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 24, color: '#222', marginBottom: 14, fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>{s.title}</div>
                <div style={{ color: '#444', fontSize: 18, lineHeight: 1.7, fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 500 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Card nổi trên banner
function BannerCard({ icon, title, desc }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(67,149,247,0.10)', padding: '18px 24px', minWidth: 160, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: '#4395F7', fontSize: 17 }}>{title}</div>
      <div style={{ color: '#444', fontSize: 15 }}>{desc}</div>
    </div>
  );
}

export default Home;

// Hiệu ứng hover cho card dịch vụ
const style = document.createElement('style');
style.innerHTML = `
  .service-card-home:hover {
    box-shadow: 0 8px 32px rgba(67,149,247,0.18) !important;
    transform: translateY(-6px) scale(1.03) !important;
    z-index: 2;
  }
`;
document.head.appendChild(style);
