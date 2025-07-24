import React from "react";
import bannerImage from "../assets/banner.jpg";
import "./Banner.css";

function Banner() {
  return (
    <div className="fade-in" style={{ background: '#f8fbff', padding: '0 0 40px 0' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        flexWrap: 'wrap',
        padding: '40px 0 0 0',
      }}>
        {/* Bên trái: Tiêu đề, mô tả, nút */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ color: '#1E90FF', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
            We Take Care Of Your Health
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#222', marginBottom: 20, lineHeight: 1.15 }}>
            We Are Providing <br />
            <span style={{ color: '#1E90FF' }}>Best & Affordable</span><br />
            Health Care
          </h1>
          <p style={{ color: '#444', fontSize: 18, marginBottom: 32, maxWidth: 480 }}>
            Dịch vụ y tế học đường hiện đại, hỗ trợ quản lý sức khỏe, tiêm chủng, sự kiện y tế và nhiều tiện ích khác cho học sinh, phụ huynh và nhà trường.
          </p>
          <div style={{ display: 'flex', gap: 18 }}>
            <button style={{ background: '#1E90FF', color: '#fff', border: 0, borderRadius: 8, padding: '14px 32px', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>Find Out More</button>
            <button style={{ background: '#fff', color: '#1E90FF', border: '2px solid #1E90FF', borderRadius: 8, padding: '14px 32px', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>Our Services</button>
          </div>
        </div>
        {/* Bên phải: Hình ảnh + 2 thẻ nổi bật */}
        <div style={{ flex: 1, minWidth: 320, textAlign: 'center' }}>
          <img src={bannerImage} alt="banner" style={{ width: '95%', maxWidth: 420, borderRadius: 24, boxShadow: '0 8px 32px rgba(30,144,255,0.12)' }} />
        </div>
      </div>
    </div>
  );
}

export default Banner;
