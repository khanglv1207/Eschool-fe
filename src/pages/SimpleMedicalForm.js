import React, { useState } from "react";
import { sendMedicalRequest } from "../services/parentApi";

function SimpleMedicalForm() {
  const [studentCode, setStudentCode] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [note, setNote] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleScheduleChange = (timeSlot, checked) => {
    if (checked) {
      setSchedule([...schedule, timeSlot]);
    } else {
      setSchedule(schedule.filter(s => s !== timeSlot));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const medicalRequest = {
        studentCode: studentCode,
        note: note,
        medications: [
          {
            medicationName: medicationName,
            dosage: dosage,
            note: "",
            schedule: schedule
          }
        ]
      };

      const response = await sendMedicalRequest(medicalRequest);
      
      if (response.success) {
        setMessage("✅ Gửi thuốc thành công!");
        // Reset form
        setStudentCode("");
        setMedicationName("");
        setDosage("");
        setNote("");
        setSchedule([]);
      } else {
        setMessage("❌ " + (response.message || "Gửi thuốc thất bại!"));
      }

    } catch (error) {
      setMessage("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ color: "#1E90FF", textAlign: "center", marginBottom: "30px" }}>
        💊 Gửi Thuốc Cho Học Sinh
      </h2>
      
      <form onSubmit={handleSubmit} style={{ background: "#f8f9fa", padding: "25px", borderRadius: "10px" }}>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
            Mã học sinh: *
          </label>
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "6px", 
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
            placeholder="Nhập mã học sinh..."
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
            Tên thuốc: *
          </label>
          <input
            type="text"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "6px", 
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
            placeholder="Ví dụ: Paracetamol"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
            Liều lượng: *
          </label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "6px", 
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
            placeholder="Ví dụ: 1 viên"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
            Lịch uống thuốc: *
          </label>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {["Sáng", "Trưa", "Chiều", "Tối"].map((time) => (
              <label key={time} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "16px" }}>
                <input
                  type="checkbox"
                  checked={schedule.includes(time)}
                  onChange={(e) => handleScheduleChange(time, e.target.checked)}
                  style={{ transform: "scale(1.2)" }}
                />
                {time}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
            Ghi chú:
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "6px", 
              border: "1px solid #ddd", 
              minHeight: "80px",
              fontSize: "16px",
              resize: "vertical"
            }}
            placeholder="Ghi chú về thuốc..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#ccc" : "#1E90FF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s"
          }}
        >
          {loading ? "🔄 Đang gửi..." : "📤 Gửi yêu cầu thuốc"}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: message.includes("❌") ? "#ffebee" : "#e8f5e8",
          borderRadius: "8px",
          border: message.includes("❌") ? "1px solid #f44336" : "1px solid #4caf50",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "bold"
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default SimpleMedicalForm; 