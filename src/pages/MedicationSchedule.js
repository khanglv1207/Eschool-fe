import React, { useState, useEffect } from "react";
import { getSchedulesForParent } from "../services/parentApi";

function MedicationSchedule({ onBack }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const data = await getSchedulesForParent();
        console.log('Schedules data:', data);
        setSchedules(data.result || data || []);
      } catch (error) {
        console.error('Error loading schedules:', error);
        alert('Không thể tải lịch uống thuốc!');
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(time).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'taken':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'missed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'taken':
        return 'Đã uống';
      case 'pending':
        return 'Chờ uống';
      case 'missed':
        return 'Đã bỏ lỡ';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
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
        <span style={{ fontSize: 32, color: "#1E90FF", marginRight: 10 }}>📅</span>
        <h2 style={{ textAlign: "center", margin: 0, color: "#1E90FF", fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>Lịch uống thuốc</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#666", fontSize: "16px" }}>Đang tải lịch uống thuốc...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#666", fontSize: "16px" }}>Chưa có lịch uống thuốc nào.</p>
        </div>
      ) : (
        <div>
          {schedules.map((schedule, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e3eafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                background: "#fafdff"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, color: "#1E90FF", fontSize: "18px" }}>
                  {schedule.medicationName || schedule.medication?.medicationName}
                </h3>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white",
                    background: getStatusColor(schedule.status)
                  }}
                >
                  {getStatusText(schedule.status)}
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <strong style={{ color: "#666", fontSize: "14px" }}>Liều lượng:</strong>
                  <p style={{ margin: "4px 0", fontSize: "16px" }}>
                    {schedule.dosage || schedule.medication?.dosage}
                  </p>
                </div>
                <div>
                  <strong style={{ color: "#666", fontSize: "14px" }}>Thời gian:</strong>
                  <p style={{ margin: "4px 0", fontSize: "16px" }}>
                    {formatTime(schedule.scheduledTime)}
                  </p>
                </div>
              </div>
              
              {schedule.note && (
                <div>
                  <strong style={{ color: "#666", fontSize: "14px" }}>Ghi chú:</strong>
                  <p style={{ margin: "4px 0", fontSize: "16px" }}>{schedule.note}</p>
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e3eafc" }}>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Học sinh: {schedule.studentName || schedule.student?.fullName}
                </span>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  {schedule.date && new Date(schedule.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "#f3f4f8",
            color: "#1E90FF",
            border: "1.5px solid #e3eafc",
            padding: "12px 24px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "17px",
            boxShadow: "0 2px 8px rgba(30,144,255,0.04)"
          }}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

export default MedicationSchedule; 