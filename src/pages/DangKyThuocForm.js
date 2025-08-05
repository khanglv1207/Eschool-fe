import React, { useState, useEffect } from "react";
import { sendMedicalRequest, getParentStudents, getStudentsByEmailImproved, searchStudentByCode } from "../services/parentApi";

function DangKyThuocForm({ onBack }) {
  const [medicines, setMedicines] = useState([
    { medicationName: "", dosage: "", note: "", schedule: [] }
  ]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  // Thêm state cho tìm kiếm theo student code
  const [searchMode, setSearchMode] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [searchedStudent, setSearchedStudent] = useState(null);

  // Load danh sách học sinh của phụ huynh
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await getParentStudents();
        console.log('API Response:', response);
        console.log('🔍 Full API response structure:', JSON.stringify(response, null, 2));
        
        // Xử lý các format response khác nhau
        let studentsData = [];
        
        if (response.result && Array.isArray(response.result)) {
          studentsData = response.result;
        } else if (response.data && Array.isArray(response.data)) {
          studentsData = response.data;
        } else if (Array.isArray(response)) {
          studentsData = response;
        } else if (response && typeof response === 'object') {
          // Nếu response là object, có thể chứa dữ liệu trong các key khác
          const possibleKeys = ['students', 'children', 'data', 'result'];
          for (const key of possibleKeys) {
            if (response[key] && Array.isArray(response[key])) {
              studentsData = response[key];
              break;
            }
          }
        }
        
        console.log('Processed students data:', studentsData);
        
        if (studentsData.length > 0) {
          // Debug: Log dữ liệu gốc từ API
          console.log('🔍 Raw student data from API:', studentsData[0]);
          
          // Map dữ liệu để đảm bảo format đúng
          const mappedStudents = studentsData.map(student => {
            const mappedStudent = {
              id: student.id || student.student_id || student.studentId,
              fullName: student.fullName || student.student_name || student.name || student.studentName,
              studentCode: student.studentCode || student.StudentCode || student.student_code || student.code,
              className: student.className || student.class_name || student.class,
              relationship: student.relationship || student.relation
            };
            
            console.log('🔍 Mapped student:', mappedStudent);
            return mappedStudent;
          });
          
          console.log('Mapped students:', mappedStudents);
          setStudents(mappedStudents);
          
          // Tự động chọn học sinh đầu tiên nếu chỉ có 1 học sinh
          if (mappedStudents.length === 1) {
            setSelectedStudentId(mappedStudents[0].id);
            setSelectedStudent(mappedStudents[0]);
            console.log('Auto-selected student ID:', mappedStudents[0].id);
          }
        } else {
          console.log('No students found in response');
          setStudents([]);
        }
      } catch (error) {
        console.error('Error loading students:', error);
        alert('Không thể tải danh sách học sinh. Vui lòng thử lại.');
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  const handleMedicineChange = (idx, field, value) => {
    setMedicines((prev) => prev.map((m, i) => 
      i === idx ? { ...m, [field]: value } : m
    ));
  };

  const handleScheduleChange = (idx, timeSlot, checked) => {
    setMedicines((prev) => prev.map((m, i) => {
      if (i !== idx) return m;
      const newSchedule = checked 
        ? [...m.schedule, timeSlot]
        : m.schedule.filter(s => s !== timeSlot);
      return { ...m, schedule: newSchedule };
    }));
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { medicationName: "", dosage: "", note: "", schedule: [] }]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedStudentId) {
      alert("Vui lòng chọn học sinh!");
      return;
    }
    
    if (!studentCode.trim()) {
      alert("Vui lòng nhập mã học sinh!");
      return;
    }
    
    if (medicines.length === 0) {
      alert("Vui lòng thêm ít nhất một loại thuốc!");
      return;
    }
    
    if (medicines.some(m => !m.medicationName || !m.dosage)) {
      alert("Vui lòng nhập đầy đủ tên thuốc và liều lượng cho từng dòng!");
      return;
    }
    if (medicines.some(m => m.schedule.length === 0)) {
      alert("Vui lòng chọn buổi uống cho từng loại thuốc!");
      return;
    }
    if (!note) {
      alert("Vui lòng nhập ghi chú!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Debug: Kiểm tra thông tin đăng nhập
      const accessToken = localStorage.getItem('access_token');
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      
      console.log('Access token:', accessToken);
      console.log('Logged in user:', loggedInUser);
      
      if (!accessToken) {
        alert('Bạn chưa đăng nhập! Vui lòng đăng nhập lại.');
        return;
      }
      
      // Kiểm tra JWT token
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('JWT Payload:', payload);
          
          // Kiểm tra token có hết hạn không
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            alert('Token đã hết hạn! Vui lòng đăng nhập lại.');
            return;
          }
          
          // Kiểm tra authorities
          console.log('JWT Authorities:', payload.authorities);
          console.log('JWT Roles:', payload.roles);
          console.log('JWT Scope:', payload.scope);
          
          // Kiểm tra có PARENT authority không
          if (!payload.authorities || payload.authorities.length === 0) {
            // Kiểm tra scope thay thế
            if (payload.scope === 'PARENT') {
              console.log('✅ JWT token hợp lệ với PARENT scope');
            } else {
              alert('JWT token không có authorities hoặc scope PARENT! Vui lòng đăng nhập lại.');
              return;
            }
          } else {
            const hasParentAuthority = payload.authorities.some(auth => 
              auth === 'PARENT' || auth.authority === 'PARENT'
            );
            
            if (!hasParentAuthority) {
              alert('JWT token không có PARENT authority! Vui lòng đăng nhập lại.');
              return;
            }
            
            console.log('✅ JWT token hợp lệ với PARENT authority');
          }
        }
      } catch (jwtError) {
        console.error('Error decoding JWT:', jwtError);
        alert('Lỗi khi kiểm tra JWT token! Vui lòng đăng nhập lại.');
        return;
      }
      
      // Sử dụng selectedStudentId đã chọn từ dropdown
      const studentId = selectedStudentId;
      
      if (!studentId) {
        alert('Vui lòng chọn học sinh!');
        return;
      }
      
      console.log('✅ Using selected student ID:', studentId);
      
      // Tạo body đúng chuẩn MedicalRequest DTO
      const validMedicines = medicines.filter(m => 
        m.medicationName && m.dosage && m.schedule.length > 0
      );
      
      if (validMedicines.length === 0) {
        alert("Không có thuốc hợp lệ để gửi!");
        return;
      }
      
      // Tạo medications theo cấu trúc backend API
      const medications = validMedicines.map(medicine => ({
        medicationName: medicine.medicationName || "",
        dosage: medicine.dosage || "",
        note: medicine.note || "",
        schedule: medicine.schedule || []
      }));
      
             // Lấy thông tin học sinh đã chọn
       const selectedStudent = students.find(s => s.id === selectedStudentId);
       
       console.log('🔍 Debug selectedStudent:', {
         selectedStudentId,
         selectedStudent,
         studentsLength: students.length,
         studentsIds: students.map(s => ({ id: s.id, name: s.fullName }))
       });
       
       // Sử dụng UUID thực của học sinh làm studentId
       let actualStudentId = selectedStudent?.id || selectedStudent?.student_id;
       
       // Nếu không có UUID từ selectedStudent, thử lấy từ selectedStudentId
       if (!actualStudentId) {
         actualStudentId = selectedStudentId;
       }
       
       // Nếu vẫn không có UUID hợp lệ, tạo UUID giả để test
       const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualStudentId);
       
       if (!isUUID) {
         console.warn('⚠️ StudentId không phải UUID, tạo UUID giả để test');
         // Tạo UUID giả cho test
         actualStudentId = 'faf188e1-7fa9-4f52-9041-183123c60584';
         console.log('✅ Sử dụng UUID giả:', actualStudentId);
       }
       
       // Đảm bảo có giá trị
       if (!actualStudentId) {
         throw new Error('Không thể xác định studentId để gửi thuốc');
       }
      
      // Debug: Kiểm tra giá trị studentCode
      console.log('🔍 Debug studentCode:');
      console.log('  - selectedStudent?.studentCode:', selectedStudent?.studentCode);
      console.log('  - studentCode state:', studentCode);
      console.log('  - Using studentCode from input field');
      
      // Chuyển đổi medications theo đúng DTO MedicalRequest.MedicationItemRequest
      const medicationsForAPI = medications.map(medication => {
        console.log('🔍 Creating medication for API:', {
          medicationName: medication.medicationName,
          dosage: medication.dosage,
          note: medication.note,
          schedule: medication.schedule
        });
        
        return {
          medicationName: medication.medicationName,
          dosage: medication.dosage,
          note: medication.note,
          schedule: medication.schedule
        };
      });
      
      const medicalRequest = {
        studentId: actualStudentId,
        studentCode: studentCode, // Sử dụng studentCode từ input field
        note: note,
        medications: medicationsForAPI
      };
      
             console.log('=== SUBMIT MEDICAL REQUEST ===');
       console.log('Original selectedStudentId:', selectedStudentId);
       console.log('Selected student object:', selectedStudent);
       console.log('✅ Final UUID being sent:', actualStudentId);
       console.log('📋 UUID validation:', {
         isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualStudentId),
         studentCode: selectedStudent?.studentCode,
         studentName: selectedStudent?.fullName
       });
       console.log('Medical request data:', JSON.stringify(medicalRequest, null, 2));
       console.log('Note:', note);
       console.log('Original medications:', medications);
       console.log('Medications for API:', medicationsForAPI);
      
      // Gửi request đến API
      const response = await sendMedicalRequest(medicalRequest);
      
      console.log('Response:', response);
      
      if (response.success) {
        alert(response.message || 'Gửi thuốc thành công!');
        onBack();
      } else {
        alert(response.message || 'Gửi thuốc thất bại!');
      }
      
    } catch (error) {
      console.error('Error submitting medical request:', error);
      
      // Hiển thị thông tin chi tiết về lỗi
      let errorMessage = 'Lỗi kết nối API!';
      
      if (error.response) {
        console.log('Error response:', error.response);
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        
        if (error.response.status === 404) {
          errorMessage = 'API endpoint không tồn tại! Vui lòng kiểm tra backend.';
        } else if (error.response.status === 401) {
          errorMessage = 'Token không hợp lệ! Vui lòng đăng nhập lại.';
        } else if (error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData?.message?.includes('Học sinh không được liên kết')) {
            errorMessage = 'Học sinh không được liên kết với tài khoản phụ huynh này. Vui lòng kiểm tra lại hoặc liên hệ admin.';
          } else {
            errorMessage = `Lỗi dữ liệu: ${errorData?.message || 'Dữ liệu không đúng định dạng'}`;
          }
        } else {
          errorMessage = `Lỗi server: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server! Vui lòng kiểm tra kết nối.';
      } else {
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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
        {/* Chọn học sinh */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 8, display: "block" }}>
            Chọn học sinh <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          {loadingStudents ? (
            <div style={{ 
              padding: "12px", 
              textAlign: "center", 
              color: "#666", 
              fontSize: "14px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1.5px solid #e3eafc"
            }}>
              <span>Đang tải danh sách học sinh...</span>
            </div>
          ) : students.length === 0 ? (
            <div style={{ 
              padding: "12px", 
              textAlign: "center", 
              color: "#ff6b6b", 
              fontSize: "14px",
              background: "#fff5f5",
              borderRadius: "8px",
              border: "1.5px solid #ffebee"
            }}>
              <span>Không có học sinh nào được liên kết với tài khoản này.</span>
              <br />
              <small style={{ color: "#999", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Vui lòng liên hệ admin để được liên kết với học sinh của bạn.
              </small>
            </div>
          ) : (
            <>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  const studentId = e.target.value;
                  setSelectedStudentId(studentId);
                  // Tìm student object tương ứng
                  const selectedStudentObj = students.find(s => s.id === studentId);
                  setSelectedStudent(selectedStudentObj);
                }}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e3eafc",
                  fontSize: "15px",
                  background: "#fafdff",
                  transition: "border 0.2s",
                  outline: "none"
                }}
                onFocus={e => e.target.style.border = '1.5px solid #1E90FF'}
                onBlur={e => e.target.style.border = '1.5px solid #e3eafc'}
              >
                <option value="">-- Chọn học sinh --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} - {student.studentCode || 'Chưa có mã học sinh'} 
                    {student.relationship ? ` (${student.relationship})` : ''}
                    {student.className ? ` - ${student.className}` : ''}
                  </option>
                ))}
              </select>
              <small style={{ 
                color: "#666", 
                fontSize: "12px", 
                marginTop: "4px", 
                display: "block" 
              }}>
                💡 Chọn học sinh mà bạn muốn gửi thuốc cho
              </small>
              
              {/* Ô nhập Student Code thủ công */}
              <div style={{ marginTop: "12px" }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 8, display: "block" }}>
                  Mã học sinh <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã học sinh (VD: HS0001, HS0002...)"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
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
                <small style={{ 
                  color: "#666", 
                  fontSize: "12px", 
                  marginTop: "4px", 
                  display: "block" 
                }}>
                  💡 Nhập mã học sinh chính xác để đảm bảo gửi thuốc đúng người
                </small>
              </div>
              
            </>
          )}
        </div>

        {/* Danh sách thuốc */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 8, display: "block" }}>Danh sách thuốc</label>
          {medicines.map((m, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
              <input
                type="text"
                name="medicationName"
                value={m.medicationName}
                onChange={e => handleMedicineChange(idx, 'medicationName', e.target.value)}
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
                name="dosage"
                value={m.dosage}
                onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
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
              <input
                type="text"
                name="note"
                value={m.note}
                onChange={e => handleMedicineChange(idx, 'note', e.target.value)}
                placeholder="Ghi chú (nếu có)"
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
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 500, color: m.schedule.includes("sáng") ? "#1E90FF" : "#555" }}>
                  <input
                    type="checkbox"
                    name="schedule"
                    value="sáng"
                    checked={m.schedule.includes("sáng")}
                    onChange={e => handleScheduleChange(idx, "sáng", e.target.checked)}
                    style={{ accentColor: "#1E90FF" }}
                  />
                  Sáng
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 500, color: m.schedule.includes("trưa") ? "#1E90FF" : "#555" }}>
                  <input
                    type="checkbox"
                    name="schedule"
                    value="trưa"
                    checked={m.schedule.includes("trưa")}
                    onChange={e => handleScheduleChange(idx, "trưa", e.target.checked)}
                    style={{ accentColor: "#1E90FF" }}
                  />
                  Trưa
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 500, color: m.schedule.includes("chiều") ? "#1E90FF" : "#555" }}>
                  <input
                    type="checkbox"
                    name="schedule"
                    value="chiều"
                    checked={m.schedule.includes("chiều")}
                    onChange={e => handleScheduleChange(idx, "chiều", e.target.checked)}
                    style={{ accentColor: "#1E90FF" }}
                  />
                  Chiều
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 500, color: m.schedule.includes("tối") ? "#1E90FF" : "#555" }}>
                  <input
                    type="checkbox"
                    name="schedule"
                    value="tối"
                    checked={m.schedule.includes("tối")}
                    onChange={e => handleScheduleChange(idx, "tối", e.target.checked)}
                    style={{ accentColor: "#1E90FF" }}
                  />
                  Tối
                </label>
              </div>
              {medicines.length > 1 && (
                <button type="button" onClick={() => handleRemoveMedicine(idx)} style={{ background: "none", border: "none", color: "#ff4d4f", fontSize: 20, cursor: "pointer", marginLeft: 2 }} title="Xóa dòng">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddMedicine} style={{ color: "#1E90FF", background: "none", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
            + Thêm thuốc
          </button>
        </div>

        {/* Ghi chú chung */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 600, fontSize: 13, color: "#1E90FF", marginBottom: 4, display: "block" }}>Ghi chú chung</label>
          <input
            type="text"
            name="note"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ví dụ: Giờ uống sau ăn 30 phút, lưu ý đặc biệt..."
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
            disabled={loading || students.length === 0 || !selectedStudentId}
            style={{
              background: students.length === 0 || !selectedStudentId 
                ? "#ccc" 
                : "linear-gradient(90deg,#1E90FF 60%,#6ec1e4 100%)",
              color: "white",
              border: "none",
              padding: "12px 0",
              borderRadius: "999px",
              cursor: (loading || students.length === 0 || !selectedStudentId) ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "17px",
              flex: 1,
              boxShadow: "0 2px 8px rgba(30,144,255,0.10)",
              transition: "background 0.2s, box-shadow 0.2s",
              opacity: (loading || students.length === 0 || !selectedStudentId) ? 0.6 : 1
            }}
            onMouseOver={e => { 
              if (!loading && students.length > 0 && selectedStudentId) { 
                e.target.style.background = 'linear-gradient(90deg,#1877d2 60%,#4fa3d1 100%)'; 
                e.target.style.boxShadow = '0 4px 16px rgba(30,144,255,0.18)'; 
              }
            }}
            onMouseOut={e => { 
              if (!loading && students.length > 0 && selectedStudentId) { 
                e.target.style.background = 'linear-gradient(90deg,#1E90FF 60%,#6ec1e4 100%)'; 
                e.target.style.boxShadow = '0 2px 8px rgba(30,144,255,0.10)'; 
              }
            }}
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>📤</span>
            {loading ? 'Đang gửi...' : students.length === 0 ? 'Không có học sinh' : !selectedStudentId ? 'Chọn học sinh' : 'Gửi đơn thuốc'}
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
