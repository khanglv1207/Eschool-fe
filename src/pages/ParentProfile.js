import React, { useState, useEffect } from "react";
import { updateParentProfile, getParentProfile } from "../services/parentApi";
import { updateStudentProfile, linkParentStudent } from "../services/userApi";

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
      { studentId: "", fullName: "", className: "", dateOfBirth: "", relationship: "" }
    ]
  });
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load parent profile khi component mount
  useEffect(() => {
    const loadParentProfile = async () => {
      try {
        setInitialLoading(true);
        console.log('🔄 Đang tải thông tin parent profile...');
        
        const profileData = await getParentProfile();
        console.log('✅ Parent profile data:', profileData);
        console.log('🔍 All fields from API:', Object.keys(profileData));
        console.log('👤 Parent name:', profileData.parentName);
        console.log('📧 Email:', profileData.parentEmail);
        console.log('📞 Phone:', profileData.parentPhone);
        console.log('🏠 Address:', profileData.parentAddress);
        console.log('📅 DOB:', profileData.parentDob);
        console.log('🏠 Address:', profileData.address);
        console.log('👶 Children:', profileData.children);
        if (profileData.children && profileData.children.length > 0) {
          console.log('👶 First child:', profileData.children[0]);
          console.log('👶 Child structure:', {
            studentCode: profileData.children[0].studentCode,
            studentName: profileData.children[0].studentName,
            className: profileData.children[0].className,
            studentDob: profileData.children[0].studentDob,
            gender: profileData.children[0].gender,
            relationship: profileData.children[0].relationship
          });
        }
        
        // Lưu profileData để sử dụng trong render
        setProfileData(profileData);
        
        // Kiểm tra nếu có dữ liệu từ API
        if (profileData) {
          // Map dữ liệu từ API vào form
          setForm({
            fullName: profileData.parentName || "",
            email: profileData.parentEmail || "",
            phoneNumber: profileData.parentPhone || "",
            address: profileData.parentAddress || "",
            dateOfBirth: profileData.parentDob ? profileData.parentDob.split('T')[0] : "",
            students: (profileData.children || []).map(child => ({
              studentId: child.studentCode || "",
              fullName: child.studentName || "",
              className: child.className || "",
              dateOfBirth: child.studentDob ? child.studentDob.split('T')[0] : "",
              relationship: child.relationship || ""
            })) || [
              { studentId: "", fullName: "", className: "", dateOfBirth: "", relationship: "" }
            ]
          });
          console.log('✅ Đã map dữ liệu từ API thành công');
        } else {
          console.log('⚠️ Không có dữ liệu từ API, sử dụng form trống');
          setMessage('⚠️ Không có dữ liệu từ database. Vui lòng điền thông tin mới.');
        }
        
        console.log('✅ Đã load parent profile thành công');
      } catch (error) {
        console.error('❌ Lỗi load parent profile:', error);
        setMessage('❌ Không thể tải thông tin profile: ' + error.message);
      } finally {
        setInitialLoading(false);
      }
    };

    loadParentProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (idx, e) => {
    const newStudents = [...form.students];
    newStudents[idx][e.target.name] = e.target.value;
    setForm({ ...form, students: newStudents });
  };

  const addStudent = () => {
    setForm({ ...form, students: [...form.students, { studentId: "", fullName: "", className: "", dateOfBirth: "", relationship: "" }] });
  };

  const removeStudent = (idx) => {
    const newStudents = form.students.filter((_, i) => i !== idx);
    setForm({ ...form, students: newStudents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Gửi đúng body chuẩn tài liệu API
      await updateParentProfile({
        userid: parentId,
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        dateOfBirth: form.dateOfBirth
      }, token);
      
      // Gọi API liên kết phụ huynh-học sinh cho từng học sinh
      for (const s of form.students) {
        if (parentId && s.studentId && s.relationship) {
          await linkParentStudent(parentId, s.studentId, s.relationship);
        }
      }
      
      setMessage("✅ Cập nhật thông tin thành công!");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1200);
    } catch (err) {
      console.error('❌ Lỗi cập nhật parent profile:', err);
      setMessage('❌ ' + (err.message || "Có lỗi xảy ra."));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ color: '#667eea', fontSize: '18px', fontWeight: '600' }}>
            Đang tải thông tin profile...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            👤 Cập nhật thông tin phụ huynh
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Quản lý thông tin cá nhân và danh sách học sinh
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding: '40px' }}>
      <form onSubmit={handleSubmit}>
            {/* Parent Information Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '20px', marginRight: '10px' }}>👨‍👩‍👧‍👦</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#495057' }}>Thông tin phụ huynh</div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>Cập nhật thông tin cá nhân</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                    Họ tên phụ huynh
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                                 <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                     Email
                   </label>
                   <input
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     placeholder="Nhập email"
                     type="email"
                     style={{
                       width: '100%',
                       padding: '12px 16px',
                       border: '2px solid #e9ecef',
                       borderRadius: '8px',
                       fontSize: '16px',
                       transition: 'border-color 0.3s ease'
                     }}
                     onFocus={(e) => e.target.style.borderColor = '#667eea'}
                     onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                   />
                   {form.email && (
                     <div style={{
                       marginTop: '4px',
                       fontSize: '12px',
                       color: '#6c757d',
                       fontStyle: 'italic'
                     }}>
                       Email hiện tại: {form.email}
                     </div>
                   )}
                 </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                    Số điện thoại
                  </label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                    Ngày sinh
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                  Địa chỉ
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                />
              </div>
            </div>

                         {/* Email Information Section */}
             <div style={{ marginBottom: '40px' }}>
               <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 marginBottom: '20px',
                 padding: '15px',
                 background: '#e8f4fd',
                 borderRadius: '12px',
                 border: '2px solid #bee5eb'
               }}>
                 <div style={{ fontSize: '20px', marginRight: '10px' }}>📧</div>
                 <div>
                   <div style={{ fontWeight: 'bold', color: '#0c5460' }}>Thông tin Email</div>
                   <div style={{ fontSize: '14px', color: '#6c757d' }}>Email được sử dụng cho thông báo tiêm chủng</div>
                 </div>
               </div>

               <div style={{
                 padding: '20px',
                 background: '#f8f9fa',
                 borderRadius: '12px',
                 border: '2px solid #e9ecef'
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontWeight: 'bold', color: '#495057', marginBottom: '4px' }}>
                       Email phụ huynh
                     </div>
                     <div style={{ fontSize: '14px', color: '#6c757d' }}>
                       {form.email || 'Chưa có email'}
                     </div>
                   </div>
                   <div style={{
                     padding: '8px 16px',
                     background: form.email ? '#28a745' : '#6c757d',
                     color: '#fff',
                     borderRadius: '20px',
                     fontSize: '12px',
                     fontWeight: '600'
                   }}>
                     {form.email ? '✅ Đã cập nhật' : '⚠️ Chưa có'}
                   </div>
                 </div>
                 
                                   {form.email && (
                    <div style={{
                      marginTop: '15px',
                      padding: '12px',
                      background: '#d1ecf1',
                      borderRadius: '8px',
                      border: '1px solid #bee5eb'
                    }}>
                      <div style={{ fontSize: '12px', color: '#0c5460', fontWeight: '600', marginBottom: '4px' }}>
                        📋 Thông tin từ hệ thống:
                      </div>
                      <div style={{ fontSize: '14px', color: '#0c5460' }}>
                        Email này sẽ được sử dụng để gửi thông báo về lịch tiêm chủng và các thông tin sức khỏe khác cho học sinh.
                      </div>
                    </div>
                  )}
                  
                  {/* Email từ StudentNeedVaccinationResponse */}
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ fontSize: '12px', color: '#856404', fontWeight: '600', marginBottom: '8px' }}>
                      📧 Email từ hệ thống tiêm chủng:
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '13px', color: '#856404' }}>Parent Email:</span>
                         <span style={{ fontSize: '13px', fontWeight: '600', color: '#856404' }}>
                           {profileData?.parentEmail || form.email || 'N/A'}
                         </span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '13px', color: '#856404' }}>Contact Email:</span>
                         <span style={{ fontSize: '13px', fontWeight: '600', color: '#856404' }}>
                           {profileData?.parentEmail || form.email || 'N/A'}
                         </span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '13px', color: '#856404' }}>Email PH:</span>
                         <span style={{ fontSize: '13px', fontWeight: '600', color: '#856404' }}>
                           {profileData?.parentEmail || form.email || 'N/A'}
                         </span>
                       </div>
                    </div>
                  </div>
               </div>
             </div>

             {/* Students Section */}
             <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '20px', marginRight: '10px' }}>🎓</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#495057' }}>Danh sách học sinh</div>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>Quản lý thông tin học sinh</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addStudent}
                  style={{
                    background: '#667eea',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#5a6fd8'}
                  onMouseOut={(e) => e.target.style.background = '#667eea'}
                >
                  + Thêm học sinh
                </button>
              </div>

        {form.students.map((student, idx) => (
                <div key={idx} style={{
                  marginBottom: '20px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#fff',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      type="button"
                      onClick={() => removeStudent(idx)}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#c82333'}
                      onMouseOut={(e) => e.target.style.background = '#dc3545'}
                    >
                      🗑️ Xóa
                    </button>
                  </div>

                  <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#495057' }}>
                    Học sinh {idx + 1}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                        Họ tên học sinh
                      </label>
                      <input
                        name="fullName"
                        value={student.fullName}
                        onChange={e => handleStudentChange(idx, e)}
                        placeholder="Nhập họ tên học sinh"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                        Lớp
                      </label>
                      <input
                        name="className"
                        value={student.className}
                        onChange={e => handleStudentChange(idx, e)}
                        placeholder="Nhập lớp"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                        Ngày sinh
                      </label>
                      <input
                        name="dateOfBirth"
                        type="date"
                        value={student.dateOfBirth}
                        onChange={e => handleStudentChange(idx, e)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                        Mối quan hệ
                      </label>
                      <input
                        name="relationship"
                        value={student.relationship}
                        onChange={e => handleStudentChange(idx, e)}
                        placeholder="Bố/Mẹ/..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>
                  </div>
          </div>
        ))}
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }}
              >
                {loading ? '🔄 Đang cập nhật...' : '💾 Cập nhật thông tin'}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600',
                color: message.includes("✅") ? '#155724' : '#721c24',
                background: message.includes("✅") ? '#d4edda' : '#f8d7da',
                border: `1px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {message}
              </div>
            )}
      </form>
        </div>
      </div>
    </div>
  );
}

export default ParentProfile; 