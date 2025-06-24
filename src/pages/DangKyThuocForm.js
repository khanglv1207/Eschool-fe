import React from "react";

function DangKyThuocForm({ onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã gửi đơn thuốc thành công!");
    onBack();
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h2
        style={{ textAlign: "center", marginBottom: "25px", color: "#2c3e50" }}
      >
        Đăng ký gửi thuốc
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Các input */}
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Tên thuốc:
          <input
            type="text"
            placeholder="Nhập tên thuốc"
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </label>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Số lượng:
          <input
            type="number"
            min="1"
            required
            placeholder="Nhập số lượng"
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </label>
        <label
          style={{
            display: "block",
            marginBottom: "20px",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Ghi chú:
          <textarea
            placeholder="Ghi chú thêm"
            rows="3"
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              backgroundColor: "#1E90FF",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              flex: 1,
            }}
          >
            Gửi đơn thuốc
          </button>
          <button
            type="button"
            onClick={onBack}
            style={{
              backgroundColor: "#aaa",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              flex: 1,
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
