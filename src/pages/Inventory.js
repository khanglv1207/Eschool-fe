import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPills, FaSearch } from "react-icons/fa";

// Hàm tạo tên thuốc ngẫu nhiên
function randomDrugName() {
  const names = [
    "Paracetamol", "Ibuprofen", "Amoxicillin", "Cefixime", "Azithromycin", "Vitamin C", "Loperamide", "Metronidazole", "Omeprazole", "Aspirin",
    "Diclofenac", "Ciprofloxacin", "Dexamethasone", "Loratadine", "Cetirizine", "Clarithromycin", "Prednisolone", "Ranitidine", "Simvastatin", "Atorvastatin",
    "Metformin", "Glibenclamide", "Insulin", "Salbutamol", "Bromhexine", "Acetylcysteine", "Chlorpheniramine", "Codeine", "Morphine", "Diazepam",
    "Furosemide", "Spironolactone", "Hydrochlorothiazide", "Amlodipine", "Enalapril", "Losartan", "Captopril", "Nitroglycerin", "Digoxin", "Warfarin",
    "Heparin", "Clopidogrel", "Atenolol", "Propranolol", "Bisoprolol", "Carvedilol", "Lisinopril", "Ramipril", "Valsartan", "Telmisartan"
  ];
  return names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 1000);
}

function randomDate() {
  const start = new Date();
  const end = new Date(2027, 0, 1);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().slice(0, 10);
}

function randomUnit() {
  const units = ["viên", "ống", "chai", "gói", "vỉ", "hộp", "ml", "mg", "tuýp", "lọ"];
  return units[Math.floor(Math.random() * units.length)];
}

function randomDesc() {
  const descs = [
    "Thuốc giảm đau, hạ sốt.", "Kháng sinh phổ rộng.", "Điều trị viêm nhiễm.", "Bổ sung vitamin.", "Chống dị ứng.", "Điều trị tiêu chảy.", "Giảm ho, long đờm.", "Điều trị tăng huyết áp.", "Hỗ trợ tiêu hóa.", "Điều trị tiểu đường."
  ];
  return descs[Math.floor(Math.random() * descs.length)];
}

const drugs = Array.from({ length: 200 }, (_, i) => ({
  code: `THUOC${(i + 1).toString().padStart(4, "0")}`,
  name: randomDrugName(),
  expiry: randomDate(),
  quantity: Math.floor(Math.random() * 500) + 1,
  unit: randomUnit(),
  desc: randomDesc(),
}));

function Inventory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(drugs);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || (loggedInUser.role !== "admin" && loggedInUser.role !== "nurse")) {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) setFiltered(drugs);
    else setFiltered(drugs.filter(d => d.name.toLowerCase().includes(kw) || d.code.toLowerCase().includes(kw)));
  }, [search]);

  return (
    <div style={{ padding: "24px 0", minHeight: "100vh", background: "linear-gradient(120deg, #e0f7fa 0%, #f8fdff 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px #b3c6f7", padding: 32, border: '1.5px solid #e3f2fd' }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <FaPills style={{ color: "#3a7bd5", fontSize: 32, marginRight: 12 }} />
          <h2 style={{ color: "#3a7bd5", fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: 0.5 }}>Danh sách thuốc</h2>
        </div>
        <p style={{ color: "#607d8b", fontSize: 16, marginBottom: 18 }}>Trang hiển thị và quản lý danh sách thuốc hiện có tại phòng y tế.</p>
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', maxWidth: 400 }}>
          <FaSearch style={{ color: '#b3c6f7', fontSize: 18, marginRight: 8 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mã thuốc..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1.5px solid #e3f2fd',
              fontSize: 15,
              outline: 'none',
              background: '#f4fafd',
              color: '#263238',
              fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              boxShadow: '0 1px 4px #e3f2fd',
              transition: 'border 0.2s',
            }}
          />
        </div>
        <div style={{ maxHeight: 500, overflow: "auto", border: "1px solid #e3f2fd", borderRadius: 12, boxShadow: '0 2px 16px rgba(91,134,229,0.06)', background: '#f8fdff' }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <tr style={{ background: "#e3f2fd" }}>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Mã thuốc</th>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Tên thuốc</th>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Hạn dùng</th>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Số lượng</th>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Đơn vị</th>
                <th style={{ padding: 12, borderBottom: "2px solid #b3c6f7", color: "#1565c0", fontWeight: 700, fontSize: 16, textAlign: 'left', position: 'sticky', top: 0, background: '#e3f2fd', zIndex: 2 }}>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr key={d.code} style={{ background: idx % 2 === 0 ? "#fff" : "#f4fafd", transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e3f2fd'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f4fafd"}>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.code}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.name}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.expiry}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.quantity}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.unit}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid #e3f2fd", fontSize: 15 }}>{d.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        ::-webkit-scrollbar { width: 8px; background: #e3f2fd; border-radius: 8px; }
        ::-webkit-scrollbar-thumb { background: #b3c6f7; border-radius: 8px; }
      `}</style>
    </div>
  );
}

export default Inventory;
export { drugs };
