import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateParentProfile } from "../services/parentApi";
import { updateStudentProfile } from "../services/userApi";

function UpdateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    username: "",
    password: "",
  });

  const [students, setStudents] = useState([
    { studentId: "", fullName: "", classId: "", dob: "", gender: "" }
  ]);

  // ✅ Di chuyển localStorage vào useEffect để tránh cảnh báo
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setFormData(storedUser);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentChange = (idx, e) => {
    const newStudents = [...students];
    newStudents[idx][e.target.name] = e.target.value;
    setStudents(newStudents);
  };

  const addStudent = () => {
    setStudents([...students, { studentId: "", fullName: "", classId: "", dob: "", gender: "" }]);
  };

  const removeStudent = (idx) => {
    setStudents(students.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser && (loggedInUser.id || loggedInUser.userId || loggedInUser.user_id);
      let token = localStorage.getItem("access_token");
      if (!token) token = loggedInUser?.token;
      
      // Update parent profile
      await updateParentProfile({
        userid: userId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dob
      }, token);

      // Update each student's profile
      for (const s of students) {
        if (s.fullName && s.classId && s.dob && s.gender) {
          // Validate student ID is numeric
          if (!/^\d+$/.test(s.studentId)) {
            throw new Error(`Mã học sinh ${s.studentId} phải là số`);
          }
          
          // Validate class ID is numeric
          if (!/^\d+$/.test(s.classId)) {
            throw new Error(`Mã lớp ${s.classId} phải là số`);
          }

          // Prepare complete student data
          const studentData = {
            id: s.studentId,           // ID học sinh
            studentId: s.studentId,    // Mã học sinh
            fullName: s.fullName,      // Họ tên
            class_id: s.classId,       // Mã lớp
            classId: s.classId,        // Đảm bảo có cả 2 format
            date_of_birth: s.dob,      // Ngày sinh
            dateOfBirth: s.dob,        // Đảm bảo có cả 2 format
            gender: s.gender,          // Giới tính
            status: "ACTIVE"           // Trạng thái mặc định
          };

          await updateStudentProfile(s.studentId, studentData, token);
        }
      }
      alert("Cập nhật hồ sơ thành công!");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Cập nhật hồ sơ thất bại!");
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Thông tin hồ sơsơ</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Thông tin phụ huynh */}
        {[{ label: "Họ và tên", name: "fullName" },
          { label: "Email", name: "email" },
          { label: "Số điện thoại", name: "phone" },
          { label: "Địa chỉ", name: "address" },
          { label: "Ngày sinh", name: "dob", type: "date" },
          { label: "Giới tính", name: "gender" },
          { label: "Tên đăng nhập", name: "username" },
          { label: "Mật khẩu", name: "password", type: "password" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} style={styles.field}>
            <label style={styles.label}>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              required={name !== "username" && name !== "password"}
              style={styles.input}
            />
          </div>
        ))}

        {/* Danh sách học sinh */}
        <h4 style={{ marginTop: 24, color: '#1677ff' }}>Danh sách học sinh</h4>
        {students.map((student, idx) => (
          <div key={idx} style={{ border: "1px solid #e3f2fd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <input
              name="studentId"
              value={student.studentId}
              onChange={e => handleStudentChange(idx, e)}
              placeholder="Mã học sinh"
              className="enhanced-input"
              style={{ marginBottom: 8, width: '100%' }}
              required
            />
            <input
              name="fullName"
              value={student.fullName}
              onChange={e => handleStudentChange(idx, e)}
              placeholder="Họ tên học sinh"
              className="enhanced-input"
              style={{ marginBottom: 8, width: '100%' }}
              required
            />
            <input
              name="classId"
              value={student.classId}
              onChange={e => handleStudentChange(idx, e)}
              placeholder="Mã lớp"
              className="enhanced-input"
              style={{ marginBottom: 8, width: '100%' }}
              required
            />
            <input
              name="dob"
              type="date"
              value={student.dob}
              onChange={e => handleStudentChange(idx, e)}
              placeholder="Ngày sinh"
              className="enhanced-input"
              style={{ marginBottom: 8, width: '100%' }}
              required
            />
            <input
              name="gender"
              value={student.gender}
              onChange={e => handleStudentChange(idx, e)}
              placeholder="Giới tính"
              className="enhanced-input"
              style={{ marginBottom: 8, width: '100%' }}
              required
            />
            <button type="button" onClick={() => removeStudent(idx)} style={{ color: "#e74c3c", border: "none", background: "none", cursor: "pointer", marginTop: 4 }}>Xóa</button>
          </div>
        ))}
        <button type="button" onClick={addStudent} style={{ marginBottom: 18, color: "#1677ff", border: "none", background: "none", cursor: "pointer" }}>+ Thêm học sinh</button>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: "#1E90FF" }}
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleBack}
            style={{
              ...styles.button,
              backgroundColor: "#fff",
              color: "#1E90FF",
              border: "2px solid #1E90FF",
            }}
          >
            Quay về
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(to bottom, #f0f8ff, #ffffff)",
    minHeight: "100vh",
    animation: "fadeIn 0.6s ease-in-out",
  },
  title: {
    fontSize: "30px",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
  },
  field: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default UpdateProfile;
