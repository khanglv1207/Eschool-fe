import React, { useState, useEffect } from "react";
import { getAllParentStudent, createHealthIncident } from "../services/adminApi";
import api from "../services/api";

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

// Function để lưu health incident vào database
const saveHealthIncidentToDatabase = async (incidentData) => {
  try {
    // Sử dụng endpoint blogs để lưu dữ liệu sự cố y tế
    const response = await api.post("/api/admin/blogs", {
      title: `Sự cố y tế - ${incidentData.studentName}`,
      content: `
        <h3>Thông tin học sinh:</h3>
        <p><strong>Họ và tên:</strong> ${incidentData.studentName}</p>
        <p><strong>Mã học sinh:</strong> ${incidentData.studentCode}</p>
        <p><strong>Lớp:</strong> ${incidentData.classId}</p>
        
        <h3>Thông tin sự cố:</h3>
        <p><strong>Thời gian:</strong> ${new Date(incidentData.date).toLocaleString('vi-VN')}</p>
        <p><strong>Loại sự cố:</strong> ${incidentData.symptom}</p>
        <p><strong>Mô tả:</strong> ${incidentData.diagnosis}</p>
        <p><strong>Biện pháp xử lý:</strong> ${incidentData.treatment}</p>
        <p><strong>Ghi chú:</strong> ${incidentData.note}</p>
      `,
      category: "health-incident",
      status: "published",
      tags: ["sự cố y tế", incidentData.symptom],
      metadata: {
        type: "health_incident",
        studentId: incidentData.studentCode,
        studentName: incidentData.studentName,
        className: incidentData.classId,
        incidentTime: incidentData.date,
        incidentType: incidentData.symptom,
        description: incidentData.diagnosis,
        treatment: incidentData.treatment,
        notes: incidentData.note,
        createdAt: incidentData.createdAt
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể lưu sự cố y tế vào database");
  }
};

export default function HealthIncidentForm() {
  const [incidentType, setIncidentType] = useState("");
  const [otherIncident, setOtherIncident] = useState("");
  const [status, setStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [file, setFile] = useState(null);

  // Thêm state cho form data
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    studentCode: "",
    className: "",
    incidentTime: "",
    incidentDescription: "",
    initialTreatment: "",
    treatedBy: "",
    calledParent: false,
    transferredToHospital: false,
    monitoredAtSchool: false,
    currentStatus: "",
    otherStatus: "",
    images: null
  });

  // State cho danh sách học sinh
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State cho nurse và parent-student info
  const [nurseInfo, setNurseInfo] = useState(null);
  const [parentStudentInfo, setParentStudentInfo] = useState(null);

  // Lấy danh sách học sinh từ database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await getAllParentStudent();
        setStudents(studentsData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        setError("Không thể tải danh sách học sinh");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Lấy thông tin nurse từ database
  useEffect(() => {
    const fetchNurseInfo = async () => {
      try {
        // Lấy thông tin nurse hiện tại từ API
        const nurseData = await api.getCurrentNurse();
        console.log('👩‍⚕️ Nurse info from API:', nurseData);

        // Kiểm tra cấu trúc response từ backend theo GetAllNurseResponse
        if (nurseData && nurseData.nurseId) {
          setNurseInfo({
            id: nurseData.nurseId,
            name: nurseData.fullName,
            code: nurseData.specialization || 'N/A', // Sử dụng specialization làm code
            email: nurseData.email,
            phone: nurseData.phone
          });
        } else {
          throw new Error('Dữ liệu nurse không hợp lệ');
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nurse:", error);
        // Không set nurse info nếu không lấy được từ database
        setError("Không thể lấy thông tin nurse từ database. Vui lòng thử lại.");
      }
    };

    fetchNurseInfo();
  }, []);

  // Xử lý khi chọn học sinh
  const handleStudentChange = async (e) => {
    const selectedStudentId = e.target.value;
    const selectedStudent = students.find(student => student.id === selectedStudentId);

    if (selectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId: selectedStudent.id,
        studentName: selectedStudent.studentName || selectedStudent.fullName || "",
        studentCode: selectedStudent.studentCode || "",
        className: selectedStudent.className || selectedStudent.class || ""
      }));

      // Lưu thông tin parent-student
      setParentStudentInfo(selectedStudent);

      // Lấy thông tin nurse từ API (nếu chưa có)
      if (!nurseInfo?.id) {
        try {
          const nurseData = await api.getCurrentNurse();
          if (nurseData && nurseData.nurseId) {
            setNurseInfo({
              id: nurseData.nurseId,
              name: nurseData.fullName,
              code: nurseData.specialization || 'N/A', // Sử dụng specialization làm code
              email: nurseData.email,
              phone: nurseData.phone
            });
          } else {
            throw new Error('Dữ liệu nurse không hợp lệ');
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin nurse:", error);
          setError("Không thể lấy thông tin nurse từ database.");
        }
      }
    }
  };

  // Xử lý thay đổi form data
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // Chuẩn bị dữ liệu để gửi lên database theo CreateMedicalIncidentRequest
      const incidentData = {
        studentCode: formData.studentCode,
        className: formData.className,
        occurredAt: formData.incidentTime, // LocalDateTime
        incidentType: incidentType === "Khác" ? otherIncident : incidentType,
        incidentDescription: formData.incidentDescription,
        initialTreatment: formData.initialTreatment,
        initialResponder: formData.treatedBy || '',
        handledByParent: formData.calledParent,
        handledByStaff: formData.transferredToHospital,
        monitoredBySchool: formData.monitoredAtSchool,
        currentStatus: status === "Khác" ? otherStatus : status,
        imageUrl: file ? file.name : null,
        nurseId: nurseInfo?.id, // UUID của nurse từ database
        parentStudentId: parentStudentInfo?.id || formData.studentId // UUID của parent/student
      };

      // Validate required fields
      if (!incidentData.studentCode || !incidentData.occurredAt || !incidentData.incidentType) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Validate nurse info
      if (!incidentData.nurseId) {
        throw new Error("Không thể lấy thông tin nurse từ database. Vui lòng thử lại.");
      }

      // Validate parent-student info
      if (!incidentData.parentStudentId) {
        throw new Error("Thiếu thông tin parent-student");
      }

      console.log("Data being sent:", incidentData); // Debug log
      console.log("nurseId:", incidentData.nurseId);
      console.log("parentStudentId:", incidentData.parentStudentId);
      console.log("Full data object:", JSON.stringify(incidentData, null, 2));

      // Lưu vào database qua API thực sự
      await createHealthIncident(incidentData);
      setSuccess("Ghi nhận sự cố y tế thành công và đã lưu vào database!");

      // Reset form
      setFormData({
        studentId: "",
        studentName: "",
        studentCode: "",
        className: "",
        incidentTime: "",
        incidentDescription: "",
        initialTreatment: "",
        treatedBy: "",
        calledParent: false,
        transferredToHospital: false,
        monitoredAtSchool: false,
        currentStatus: "",
        otherStatus: "",
        images: null
      });
      setIncidentType("");
      setOtherIncident("");
      setStatus("");
      setOtherStatus("");
      setFile(null);

    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      setError(error.message || "Có lỗi xảy ra khi gửi ghi nhận");
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Hiển thị thông tin nurse */}
        {nurseInfo && (
          <div style={{
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>👩‍⚕️ Nurse:</strong> {nurseInfo.name} ({nurseInfo.code})
          </div>
        )}



        {/* Hiển thị thông báo lỗi/thành công */}
        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c8e6c9',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          {/* 1. Thông tin học sinh */}
          <SectionTitle>1. Thông tin học sinh</SectionTitle>
          <div style={{ marginBottom: 18 }}>
            <label className="label-luxury">Chọn học sinh <span style={{ color: '#e53935' }}>*</span></label>
            <select
              className="input-luxury"
              style={{ ...inputStyle, marginTop: 6 }}
              value={formData.studentId}
              onChange={handleStudentChange}
              required
              disabled={loading}
            >
              <option value="">-- Chọn học sinh --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.studentName || student.fullName || student.email} - {student.studentCode || 'Chưa có mã'} - {student.className || student.class || 'Chưa phân lớp'}
                </option>
              ))}
            </select>
            {loading && <div style={{ marginTop: 8, color: '#2979e8', fontSize: '14px' }}>Đang tải danh sách học sinh...</div>}
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap' }}>
            <InputGroup
              label="Họ và tên học sinh"
              value={formData.studentName}
              onChange={handleInputChange}
              name="studentName"
              readOnly
            />
            <InputGroup
              label="Mã học sinh"
              value={formData.studentCode}
              onChange={handleInputChange}
              name="studentCode"
              readOnly
            />
          </div>
          <div style={{ maxWidth: 320, marginBottom: 32 }}>
            <InputGroup
              label="Lớp"
              value={formData.className}
              onChange={handleInputChange}
              name="className"
              readOnly
            />
          </div>

          {/* 2. Thông tin sự cố */}
          <SectionTitle>2. Thông tin sự cố</SectionTitle>
          <div style={{ marginBottom: 18 }}>
            <InputGroup
              label="Thời gian xảy ra sự cố"
              type="datetime-local"
              value={formData.incidentTime}
              onChange={handleInputChange}
              name="incidentTime"
              required
            />
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
            <textarea
              className="input-luxury"
              style={{ ...inputStyle, minHeight: 80, marginTop: 6 }}
              placeholder="Ghi rõ hoàn cảnh, mức độ tổn thương…"
              value={formData.incidentDescription}
              onChange={handleInputChange}
              name="incidentDescription"
            />
          </div>

          {/* 3. Xử lý ban đầu */}
          <SectionTitle>3. Xử lý ban đầu</SectionTitle>
          <div style={{ marginBottom: 18 }}>
            <label className="label-luxury">Biện pháp xử lý</label>
            <textarea
              className="input-luxury"
              style={{ ...inputStyle, minHeight: 60, marginTop: 6 }}
              placeholder="Ví dụ: rửa vết thương, đo nhiệt độ, sơ cứu…"
              value={formData.initialTreatment}
              onChange={handleInputChange}
              name="initialTreatment"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <InputGroup
              label="Người xử lý ban đầu"
              placeholder="Tên cán bộ y tế, giáo viên…"
              value={formData.treatedBy}
              onChange={handleInputChange}
              name="treatedBy"
            />
          </div>
          <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            <label style={checkboxLabel}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.calledParent}
                onChange={handleInputChange}
                name="calledParent"
              />
              Có gọi phụ huynh
            </label>
            <label style={checkboxLabel}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.transferredToHospital}
                onChange={handleInputChange}
                name="transferredToHospital"
              />
              Có chuyển viện
            </label>
            <label style={checkboxLabel}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={formData.monitoredAtSchool}
                onChange={handleInputChange}
                name="monitoredAtSchool"
              />
              Có theo dõi tại trường
            </label>
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
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              style={{ marginTop: 8 }}
            />
            {file && <div style={{ marginTop: 10, color: '#2979e8', fontWeight: 600 }}>Đã chọn: {file.name}</div>}
          </div>

          <button
            type="submit"
            style={{
              ...luxuryButtonStyle,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
            disabled={submitting}
          >
            {submitting ? 'Đang gửi...' : 'Gửi ghi nhận'}
          </button>
        </form>
      </div>
      <style>{luxuryFormStyle}</style>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 style={{ color: "#2979e8", fontWeight: 700, fontSize: 22, margin: '32px 0 18px 0', fontFamily: 'Roboto, Segoe UI, Arial, sans-serif' }}>{children}</h3>;
}

function InputGroup({ label, type = "text", required, placeholder, value, onChange, name, readOnly }) {
  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <label className="label-luxury">
        {label} {required && <span style={{ color: '#e53935' }}>*</span>}
      </label>
      <input
        type={type}
        className="input-luxury"
        style={{
          ...inputStyle,
          marginTop: 6,
          backgroundColor: readOnly ? '#f5f5f5' : '#f8fbff'
        }}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        readOnly={readOnly}
      />
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
