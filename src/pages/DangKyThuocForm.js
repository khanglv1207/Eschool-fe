import React, { useState } from "react";

function DangKyThuocForm({ onBack }) {
  const [medicines, setMedicines] = useState([
    { tenThuoc: "", lieuLuong: "" }
  ]);
  const [buoiUong, setBuoiUong] = useState([]);
  const [gioUong, setGioUong] = useState("");

  const handleMedicineChange = (idx, e) => {
    const { name, value } = e.target;
    setMedicines((prev) => prev.map((m, i) => i === idx ? { ...m, [name]: value } : m));
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { tenThuoc: "", lieuLuong: "" }]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBuoiUongChange = (e) => {
    const { value, checked } = e.target;
    setBuoiUong((prev) => checked ? [...prev, value] : prev.filter((b) => b !== value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicines.some(m => !m.tenThuoc || !m.lieuLuong)) {
      alert("Vui lòng nhập đầy đủ tên thuốc và liều lượng cho từng dòng!");
      return;
    }
    if (buoiUong.length === 0) {
      alert("Vui lòng chọn buổi uống!");
      return;
    }
    if (!gioUong) {
      alert("Vui lòng nhập giờ uống sau khi ăn!");
      return;
    }
    alert(
      "Đã gửi đơn thuốc thành công!\n" +
      medicines.map((m, i) => `Thuốc ${i + 1}: ${m.tenThuoc} - Liều lượng: ${m.lieuLuong}`).join("\n") +
      `\nBuổi uống: ${buoiUong.map(b => b === "sang" ? "Sáng" : "Chiều").join(", ")}` +
      `\nGiờ uống: ${gioUong}`
    );
    onBack();
  };

  return (
    <div
      style={{
        maxWidth: "440px",
        margin: "40px auto",
        padding: "32px 24px",
        borderRadius: "18px",
        boxShadow: "0 6px 32px rgba(30,144,255,0.10)",
        background: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
        border: "1.5px solid #e3eafc",
        position: "relative"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: 32, color: "#1E90FF", marginRight: 10 }}>💊</span>
        <h2 style={{ textAlign: "center", margin: 0, color: "#1E90FF", fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>Đăng ký gửi thuốc</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Danh sách thuốc */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 8, display: "block" }}>Danh sách thuốc</label>
          {medicines.map((m, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
              <input
                type="text"
                name="tenThuoc"
                value={m.tenThuoc}
                onChange={e => handleMedicineChange(idx, e)}
                placeholder="Tên thuốc"
                required
                style={{
                  flex: 2,
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e3eafc",
                  fontSize: "15px",
                  background: "#fafdff",
                  transition: "border 0.2s",
                  outline: "none"
                }}
                onFocus={e => e.target.style.border = '1.5px solid #1E90FF'}
                onBlur={e => e.target.style.border = '1.5px solid #e3eafc'}
              />
              <input
                type="text"
                name="lieuLuong"
                value={m.lieuLuong}
                onChange={e => handleMedicineChange(idx, e)}
                placeholder="Liều lượng"
                required
                style={{
                  flex: 2,
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e3eafc",
                  fontSize: "15px",
                  background: "#fafdff",
                  transition: "border 0.2s",
                  outline: "none"
                }}
                onFocus={e => e.target.style.border = '1.5px solid #1E90FF'}
                onBlur={e => e.target.style.border = '1.5px solid #e3eafc'}
              />
              {medicines.length > 1 && (
                <button type="button" onClick={() => handleRemoveMedicine(idx)} style={{ background: "none", border: "none", color: "#ff4d4f", fontSize: 20, cursor: "pointer", marginLeft: 2 }} title="Xóa dòng">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddMedicine} style={{ color: "#1E90FF", background: "none", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
            + Thêm thuốc
          </button>
        </div>
        {/* Buổi uống - Checkbox */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 4, display: "block" }}>Buổi uống</label>
          <div style={{ display: "flex", gap: 18 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, color: buoiUong.includes("sang") ? "#1E90FF" : "#555" }}>
              <input
                type="checkbox"
                name="buoiUong"
                value="sang"
                checked={buoiUong.includes("sang")}
                onChange={handleBuoiUongChange}
                style={{ accentColor: "#1E90FF" }}
              />
              Sáng
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, color: buoiUong.includes("chieu") ? "#1E90FF" : "#555" }}>
              <input
                type="checkbox"
                name="buoiUong"
                value="chieu"
                checked={buoiUong.includes("chieu")}
                onChange={handleBuoiUongChange}
                style={{ accentColor: "#1E90FF" }}
              />
              Chiều
            </label>
          </div>
        </div>
        {/* Giờ uống sau khi ăn */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 4, display: "block" }}>Giờ uống sau khi ăn</label>
          <input
            type="text"
            name="gioUong"
            value={gioUong}
            onChange={e => setGioUong(e.target.value)}
            placeholder="Ví dụ: sau ăn 30 phút, trước ăn, ..."
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1.5px solid #e3eafc",
              fontSize: "15px",
              marginTop: 2,
              background: "#fafdff",
              transition: "border 0.2s",
              outline: "none"
            }}
            onFocus={e => e.target.style.border = '1.5px solid #1E90FF'}
            onBlur={e => e.target.style.border = '1.5px solid #e3eafc'}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg,#1E90FF 60%,#6ec1e4 100%)",
              color: "white",
              border: "none",
              padding: "12px 0",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "17px",
              flex: 1,
              boxShadow: "0 2px 8px rgba(30,144,255,0.10)",
              transition: "background 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={e => { e.target.style.background = 'linear-gradient(90deg,#1877d2 60%,#4fa3d1 100%)'; e.target.style.boxShadow = '0 4px 16px rgba(30,144,255,0.18)'; }}
            onMouseOut={e => { e.target.style.background = 'linear-gradient(90deg,#1E90FF 60%,#6ec1e4 100%)'; e.target.style.boxShadow = '0 2px 8px rgba(30,144,255,0.10)'; }}
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>📤</span>Gửi đơn thuốc
          </button>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "#f3f4f8",
              color: "#1E90FF",
              border: "1.5px solid #e3eafc",
              padding: "12px 0",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "17px",
              flex: 1,
              boxShadow: "0 2px 8px rgba(30,144,255,0.04)",
              marginLeft: 0
            }}
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}

export default DangKyThuocForm;
