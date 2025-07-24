import React, { useState } from "react";

// Thêm import Roboto font cho toàn trang nếu chưa có
const robotoFont = document.getElementById('roboto-font');
if (!robotoFont) {
  const link = document.createElement('link');
  link.id = 'roboto-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
  document.head.appendChild(link);
}

const INCIDENT_TYPES = [
  "Tai nạn (té ngã, va chạm…)",
  "Vấn đề sức khỏe (đau bụng, sốt, ngất…)",
  "Dị ứng, phản ứng thuốc",
  "Khác",
];
const STATUS_OPTIONS = [
  "Ổn định",
  "Đang theo dõi",
  "Chuyển viện",
  "Khác",
];

export default function HealthIncidentForm() {
  const [incidentType, setIncidentType] = useState("");
  const [otherIncident, setOtherIncident] = useState("");
  const [status, setStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [file, setFile] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #eaf4ff 0%, #fafdff 60%, #d2e7fa 100%)',
      padding: '48px 0',
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}>
      <div style={{
        maxWidth: 720,
        margin: "40px auto",
        background: "rgba(255,255,255,0.98)",
        borderRadius: 32,
        boxShadow: "0 12px 48px 0 rgba(67,149,247,0.18)",
        border: '1.5px solid #e3eefd',
        padding: 48,
        backdropFilter: 'blur(2px)',
        position: 'relative',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}>
        <h1 style={{ color: "#2979e8", fontWeight: 700, fontSize: 36, marginBottom: 10, fontFamily: 'Roboto, Segoe UI, Arial, sans-serif' }}>Ghi nhận sự cố y tế</h1>
        <div style={{ color: "#444", fontSize: 18, marginBottom: 36, fontWeight: 500 }}>
          Vui lòng điền đầy đủ thông tin về sự cố sức khỏe của học sinh để được xử lý và theo dõi.
        </div>
        <form style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          {/* 1. Thông tin học sinh */}
          <SectionTitle>1. Thông tin học sinh</SectionTitle>
          <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap' }}>
            <InputGroup label="Họ và tên học sinh" required />
            <InputGroup label="Mã học sinh" />
          </div>
          <div style={{ maxWidth: 320, marginBottom: 32 }}>
            <InputGroup label="Lớp" />
          </div>

          {/* 2. Thông tin sự cố */}
          <SectionTitle>2. Thông tin sự cố</SectionTitle>
          <div style={{ marginBottom: 18 }}>
            <InputGroup label="Thời gian xảy ra sự cố" type="datetime-local" required />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="label-luxury">Loại sự cố</label>
            <select className="input-luxury" style={{ ...inputStyle, marginTop: 6 }} value={incidentType} onChange={e => setIncidentType(e.target.value)} required>
              <option value="">-- Chọn loại sự cố --</option>
              {INCIDENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {incidentType === "Khác" && (
              <input type="text" className="input-luxury" style={{ ...inputStyle, marginTop: 10 }} placeholder="Nhập loại sự cố khác" value={otherIncident} onChange={e => setOtherIncident(e.target.value)} />
            )}
          </div>
          <div style={{ marginBottom: 32 }}>
            <label className="label-luxury">Mô tả chi tiết sự cố</label>
            <textarea className="input-luxury" style={{ ...inputStyle, minHeight: 80, marginTop: 6 }} placeholder="Ghi rõ hoàn cảnh, mức độ tổn thương…" />
          </div>

          {/* 3. Xử lý ban đầu */}
          <SectionTitle>3. Xử lý ban đầu</SectionTitle>
          <div style={{ marginBottom: 18 }}>
            <label className="label-luxury">Biện pháp xử lý</label>
            <textarea className="input-luxury" style={{ ...inputStyle, minHeight: 60, marginTop: 6 }} placeholder="Ví dụ: rửa vết thương, đo nhiệt độ, sơ cứu…" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <InputGroup label="Người xử lý ban đầu" placeholder="Tên cán bộ y tế, giáo viên…" />
          </div>
          <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            <label style={checkboxLabel}><input type="checkbox" style={checkboxStyle} />Có gọi phụ huynh</label>
            <label style={checkboxLabel}><input type="checkbox" style={checkboxStyle} />Có chuyển viện</label>
            <label style={checkboxLabel}><input type="checkbox" style={checkboxStyle} />Có theo dõi tại trường</label>
          </div>

          {/* 4. Tình trạng hiện tại */}
          <SectionTitle>4. Tình trạng hiện tại</SectionTitle>
          <div style={{ marginBottom: 32 }}>
            <label className="label-luxury">Tình trạng</label>
            <select className="input-luxury" style={{ ...inputStyle, marginTop: 6 }} value={status} onChange={e => setStatus(e.target.value)} required>
              <option value="">-- Chọn tình trạng --</option>
              {STATUS_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {status === "Khác" && (
              <input type="text" className="input-luxury" style={{ ...inputStyle, marginTop: 10 }} placeholder="Nhập tình trạng khác" value={otherStatus} onChange={e => setOtherStatus(e.target.value)} />
            )}
          </div>

          {/* 5. Đính kèm hình ảnh */}
          <SectionTitle>5. Đính kèm hình ảnh (nếu có)</SectionTitle>
          <div style={{ marginBottom: 36 }}>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ marginTop: 8 }} />
            {file && <div style={{ marginTop: 10, color: '#2979e8', fontWeight: 600 }}>Đã chọn: {file.name}</div>}
          </div>

          <button type="submit" style={luxuryButtonStyle}>Gửi ghi nhận</button>
        </form>
      </div>
      <style>{luxuryFormStyle}</style>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 style={{ color: "#2979e8", fontWeight: 700, fontSize: 22, margin: '32px 0 18px 0', fontFamily: 'Roboto, Segoe UI, Arial, sans-serif' }}>{children}</h3>;
}

function InputGroup({ label, type = "text", required, placeholder }) {
  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <label className="label-luxury">
        {label} {required && <span style={{ color: '#e53935' }}>*</span>}
      </label>
      <input type={type} className="input-luxury" style={{ ...inputStyle, marginTop: 6 }} required={required} placeholder={placeholder} />
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '13px 18px',
  borderRadius: 12,
  border: '1.5px solid #c2d6f7',
  fontSize: 17,
  fontFamily: 'Arial, Helvetica, sans-serif',
  background: '#f8fbff',
  outline: 'none',
  boxSizing: 'border-box',
  boxShadow: '0 2px 8px rgba(67,149,247,0.04)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontWeight: 400,
};

const luxuryButtonStyle = {
  background: 'linear-gradient(90deg, #4395F7 0%, #2979e8 100%)',
  color: '#fff',
  border: 0,
  borderRadius: 16,
  padding: '18px 54px',
  fontSize: 20,
  fontWeight: 700,
  fontFamily: 'Arial, Helvetica, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(67,149,247,0.18)',
  transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
  outline: 'none',
  margin: '0 auto',
  display: 'block',
};

const luxuryFormStyle = `
.input-luxury, .input-luxury:focus, .input-luxury:active {
  font-family: Arial, Helvetica, sans-serif !important;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0;
}
.label-luxury {
  font-family: Arial, Helvetica, sans-serif !important;
  font-weight: 700;
  color: #1a355b;
  font-size: 16px;
  margin-bottom: 2px;
  letter-spacing: 0;
}
.input-luxury {
  background: #f8fbff;
  border-radius: 12px;
  border: 1.5px solid #c2d6f7;
  padding: 13px 18px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-luxury:disabled {
  background: #f2f6fa;
}
`;

const checkboxLabel = {
  fontWeight: 600,
  color: '#2979e8',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'Arial, Helvetica, sans-serif',
};
const checkboxStyle = {
  width: 18,
  height: 18,
  accentColor: '#4395F7',
  marginRight: 6,
};
