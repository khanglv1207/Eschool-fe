import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaMoon, FaSun, FaArrowLeft, FaSave, FaCheck } from "react-icons/fa";
import healthProfileApi from "../services/healthProfileApi";

function HealthDeclarationForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    symptoms: "",
    hasFever: false,
    feverTemperature: "",
    hasCough: false,
    hasSoreThroat: false,
    hasFatigue: false,
    hasLossOfTaste: false,
    hasDifficultyBreathing: false,
    hasContactWithCovid: false,
    travelHistory: "",
    underlyingDiseases: "",
    medications: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    additionalNotes: ""
  });

  const [dark, setDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.location.href = "/";
      return;
    }

    // Lấy thông tin user hiện tại để điền sẵn
    const userObj = JSON.parse(loggedInUser);
    if (userObj) {
      setFormData(prev => ({
        ...prev,
        name: userObj.name || userObj.fullName || "",
        phone: userObj.phone || userObj.phoneNumber || "",
        email: userObj.email || ""
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation cơ bản
      if (!formData.name.trim()) {
        alert("❌ Vui lòng nhập họ và tên");
        setIsSubmitting(false);
        return;
      }

      if (!formData.age.trim()) {
        alert("❌ Vui lòng nhập tuổi");
        setIsSubmitting(false);
        return;
      }

      if (!formData.gender) {
        alert("❌ Vui lòng chọn giới tính");
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone.trim()) {
        alert("❌ Vui lòng nhập số điện thoại");
        setIsSubmitting(false);
        return;
      }

      // Chuyển đổi dữ liệu để gửi lên database theo HealthProfileRequest
      const healthProfileData = {
        allergies: formData.allergies || '',
        chronicDiseases: formData.underlyingDiseases || '',
        medicalHistory: formData.symptoms || '',
        eyesight: 'Tốt', // Mặc định
        hearing: 'Tốt', // Mặc định
        vaccinationRecord: formData.medications || ''
      };

      console.log('📤 Gửi khai báo sức khỏe lên database...');
      console.log('📋 Dữ liệu gửi lên:', healthProfileData);

      // Gửi lên database
      const response = await healthProfileApi.createOrUpdateHealthProfile(healthProfileData);
      
      if (response && response.result === "OK") {
        console.log('✅ Khai báo sức khỏe đã được lưu vào database thành công!');
        
        // Lấy thông tin user hiện tại
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const userId = loggedInUser && (loggedInUser.id || loggedInUser.userId || loggedInUser.user_id || loggedInUser.email);

        // Tạo object khai báo mới cho localStorage
        const newDeclaration = {
          ...formData,
          userId: userId,
          createdAt: new Date().toISOString(),
          status: "pending",
          id: Date.now().toString()
        };

        // Lấy danh sách khai báo hiện tại
        const existingDeclarations = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
        
        // Thêm khai báo mới
        const updatedDeclarations = [...existingDeclarations, newDeclaration];
        localStorage.setItem("nurseHealthDeclarations", JSON.stringify(updatedDeclarations));

        // Hiển thị thông báo thành công
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/health-declaration");
        }, 2000);

      } else {
        alert("❌ Có lỗi xảy ra khi gửi khai báo lên database");
      }

    } catch (error) {
      console.error("❌ Lỗi khi lưu khai báo:", error);
      alert("❌ Có lỗi xảy ra khi gửi khai báo lên database: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/khai-bao-suc-khoe");
  };

  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <button
              onClick={handleBack}
              style={styles.backButton}
              title="Quay lại"
            >
              <FaArrowLeft />
            </button>
            <h2 style={styles.title}>📋 Khai Báo Sức Khỏe</h2>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            style={{...styles.iconButton, ...(dark ? styles.iconButtonDark : {})}}
            title={dark ? 'Chuyển sáng' : 'Chuyển tối'}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Thông tin cá nhân */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Thông Tin Cá Nhân</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tuổi *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập tuổi"
                  min="1"
                  max="120"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Giới tính *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Địa chỉ</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Nhập địa chỉ chi tiết"
                rows="2"
              />
            </div>
          </div>

          {/* Triệu chứng */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏥 Triệu Chứng Sức Khỏe</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mô tả triệu chứng chính *</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                required
                style={styles.textarea}
                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải..."
                rows="3"
              />
            </div>

            <div style={styles.checkboxGrid}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasFever"
                  checked={formData.hasFever}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Có sốt</label>
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasCough"
                  checked={formData.hasCough}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Ho</label>
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasSoreThroat"
                  checked={formData.hasSoreThroat}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Đau họng</label>
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasFatigue"
                  checked={formData.hasFatigue}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Mệt mỏi</label>
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasLossOfTaste"
                  checked={formData.hasLossOfTaste}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Mất vị giác</label>
              </div>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="hasDifficultyBreathing"
                  checked={formData.hasDifficultyBreathing}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>Khó thở</label>
              </div>
            </div>

            {formData.hasFever && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Nhiệt độ sốt (°C)</label>
                <input
                  type="number"
                  name="feverTemperature"
                  value={formData.feverTemperature}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Ví dụ: 38.5"
                  step="0.1"
                  min="35"
                  max="45"
                />
              </div>
            )}
          </div>

          {/* Tiền sử và thông tin khác */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📋 Thông Tin Bổ Sung</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tiền sử bệnh nền</label>
              <textarea
                name="underlyingDiseases"
                value={formData.underlyingDiseases}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Nếu có bệnh nền, vui lòng liệt kê..."
                rows="2"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Thuốc đang sử dụng</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Liệt kê các thuốc đang sử dụng..."
                rows="2"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Dị ứng</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Nếu có dị ứng với thuốc hoặc thức ăn..."
                rows="2"
              />
            </div>
            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="hasContactWithCovid"
                checked={formData.hasContactWithCovid}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <label style={styles.checkboxLabel}>Đã tiếp xúc với người nghi nhiễm COVID-19</label>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Lịch sử đi lại</label>
              <textarea
                name="travelHistory"
                value={formData.travelHistory}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Nếu đã đi du lịch trong 14 ngày qua..."
                rows="2"
              />
            </div>
          </div>

          {/* Thông tin liên hệ khẩn cấp */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🚨 Thông Tin Liên Hệ Khẩn Cấp</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên người liên hệ</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Tên người liên hệ khẩn cấp"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại khẩn cấp</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Số điện thoại khẩn cấp"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú bổ sung */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📝 Ghi Chú Bổ Sung</h3>
            <div style={styles.formGroup}>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Thông tin bổ sung khác mà bạn muốn chia sẻ..."
                rows="3"
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleBack}
              style={styles.cancelButton}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <>
                  <div style={styles.spinner}></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <FaSave style={{ marginRight: 8 }} />
                  Gửi khai báo
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.successIcon}>
              <FaCheck />
            </div>
            <h3 style={styles.modalTitle}>Thành công!</h3>
            <p style={styles.modalText}>Khai báo sức khỏe đã được gửi thành công.</p>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #e0f7fa 0%, #f8fdff 100%)",
    backgroundSize: "200% 200%",
    animation: "gradientMove 15s ease infinite",
    padding: "20px 0",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  backgroundDark: {
    background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
  },
  container: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px 24px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px 0 rgba(91,134,229,0.10)",
    background: "rgba(255,255,255,0.95)",
    color: "#263238",
    border: '1.5px solid #e3f2fd',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  containerDark: {
    background: "rgba(40,40,60,0.7)",
    color: "#f3f3f3",
    border: '1.5px solid #232526',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#5b86e5',
    transition: 'background 0.2s',
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#3a7bd5",
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  iconButton: {
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#5b86e5',
    transition: 'background 0.2s',
  },
  iconButtonDark: {
    background: 'rgba(40,40,60,0.7)',
    color: '#5b86e5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    background: 'rgba(248,250,255,0.7)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e3f2fd',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#1565c0',
    fontWeight: 600,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#37474f',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    background: '#fff',
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.2s',
    background: '#fff',
    fontFamily: 'inherit',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '16px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  cancelButton: {
    padding: '12px 24px',
    background: 'rgba(158,158,158,0.1)',
    color: '#666',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  submitButton: {
    padding: '12px 28px',
    background: 'linear-gradient(90deg, #a8edea 0%, #5b86e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #fff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '400px',
    animation: 'fadeIn 0.3s ease',
  },
  successIcon: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#fff',
    fontSize: '24px',
  },
  modalTitle: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '20px',
  },
  modalText: {
    margin: 0,
    color: '#666',
    fontSize: '16px',
  },
};

export default HealthDeclarationForm; 