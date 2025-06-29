import React, { useState } from "react";
import { updateParentProfile } from "../services/parentApi";

function ParentProfile() {
  // Lấy parentId từ localStorage nếu có (nếu cập nhật)
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const parentId = loggedInUser?.parentId || ""; // hoặc lấy từ API profile nếu đã có

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    students: [
      { studentId: "", fullName: "", className: "", dateOfBirth: "" }
    ]
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (idx, e) => {
    const newStudents = [...form.students];
    newStudents[idx][e.target.name] = e.target.value;
    setForm({ ...form, students: newStudents });
  };

  const addStudent = () => {
    setForm({ ...form, students: [...form.students, { studentId: "", fullName: "", className: "", dateOfBirth: "" }] });
  };

  const removeStudent = (idx) => {
    const newStudents = form.students.filter((_, i) => i !== idx);
    setForm({ ...form, students: newStudents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateParentProfile({
        parentId: parentId || undefined,
        ...form,
        students: form.students.map(s => ({
          studentId: s.studentId || undefined,
          fullName: s.fullName,
          className: s.className,
          dateOfBirth: s.dateOfBirth
        }))
      });
      setMessage("Cập nhật thông tin thành công!");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1200);
    } catch (err) {
      setMessage(err.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px #e3f2fd", padding: 32 }}>
      <h2 style={{ color: "#1677ff", textAlign: "center", marginBottom: 24 }}>Cập nhật thông tin phụ huynh</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Họ tên" className="enhanced-input" style={{ marginBottom: 12 }} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="enhanced-input" style={{ marginBottom: 12 }} />
        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" className="enhanced-input" style={{ marginBottom: 12 }} />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" className="enhanced-input" style={{ marginBottom: 12 }} />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} placeholder="Ngày sinh" className="enhanced-input" style={{ marginBottom: 18 }} />
        <h4>Danh sách học sinh</h4>
        {form.students.map((student, idx) => (
          <div key={idx} style={{ marginBottom: 16, border: "1px solid #e3f2fd", borderRadius: 8, padding: 12 }}>
            <input name="fullName" value={student.fullName} onChange={e => handleStudentChange(idx, e)} placeholder="Họ tên học sinh" className="enhanced-input" style={{ marginBottom: 8 }} />
            <input name="className" value={student.className} onChange={e => handleStudentChange(idx, e)} placeholder="Lớp" className="enhanced-input" style={{ marginBottom: 8 }} />
            <input name="dateOfBirth" type="date" value={student.dateOfBirth} onChange={e => handleStudentChange(idx, e)} placeholder="Ngày sinh" className="enhanced-input" style={{ marginBottom: 8 }} />
            <button type="button" onClick={() => removeStudent(idx)} style={{ color: "#e74c3c", border: "none", background: "none", cursor: "pointer" }}>Xóa</button>
          </div>
        ))}
        <button type="button" onClick={addStudent} style={{ marginBottom: 18, color: "#1677ff", border: "none", background: "none", cursor: "pointer" }}>+ Thêm học sinh</button>
        <button type="submit" className="login-button enhanced-login-button" style={{ width: "100%", marginBottom: 12 }}>Cập nhật</button>
        {message && <div style={{ color: message.includes("thành công") ? "#27ae60" : "#e74c3c", textAlign: "center", marginTop: 10 }}>{message}</div>}
      </form>
    </div>
  );
}

export default ParentProfile; 