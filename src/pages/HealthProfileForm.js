import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaMoon, FaSun, FaHeartbeat, FaSave, FaArrowLeft } from "react-icons/fa";
import healthProfileApi from "../services/healthProfileApi";
import Notification from "../components/Notification";
import LatestDeclaration from "../components/LatestDeclaration";

function HealthProfileForm() {
  const [form, setForm] = useState({
    allergies: "",
    chronicDiseases: "",
    medicalHistory: "",
    eyesight: "",
    hearing: "",
    vaccinationRecord: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [latestDeclaration, setLatestDeclaration] = useState(null);
  const [showLatestDeclaration, setShowLatestDeclaration] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await healthProfileApi.createOrUpdateHealthProfile(form);
      
      if (response && response.result === "OK") {
        setSuccess("Khai báo sức khỏe thành công!");
        
        // Lấy thông tin mới khai báo để hiển thị
        try {
          const latestData = await healthProfileApi.getLatestHealthDeclaration();
          console.log('📋 Latest declaration:', latestData);
          setLatestDeclaration(latestData);
          setShowLatestDeclaration(true);
        } catch (declarationError) {
          console.log('⚠️ Không thể lấy thông tin mới khai báo:', declarationError.message);
        }
        
        // Reset form sau khi thành công
        setTimeout(() => {
          setForm({
            allergies: "",
            chronicDiseases: "",
            medicalHistory: "",
            eyesight: "",
            hearing: "",
            vaccinationRecord: ""
          });
        }, 2000);
      } else {
        setError("Có lỗi xảy ra khi gửi khai báo");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi gửi khai báo");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/health-declaration");
  };

  return (
    <div style={{...styles.background, ...(dark ? styles.backgroundDark : {})}}>
      <div style={{...styles.container, ...(dark ? styles.containerDark : {})}}>
        <div style={styles.headerRow}>
          <div style={styles.titleSection}>
            <button
              onClick={handleBack}
              style={styles.backButton}
              title="Quay lại"
            >
              <FaArrowLeft />
            </button>
            <h2 style={styles.title}>
              <FaHeartbeat style={{color:'#5b86e5',marginRight:8}}/>
              Khai Báo Sức Khỏe
            </h2>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            style={{...styles.iconButton, ...(dark ? styles.iconButtonDark : {})}}
            title={dark ? 'Chuyển sáng' : 'Chuyển tối'}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Thông báo hướng dẫn */}
          <div style={styles.infoBox}>
            <div style={styles.infoIcon}>ℹ️</div>
            <div style={styles.infoContent}>
              <strong>Lưu ý:</strong> Để khai báo sức khỏe thành công, tài khoản của bạn cần:
              <ul style={styles.infoList}>
                <li>Được thiết lập thông tin phụ huynh</li>
                <li>Có học sinh được liên kết</li>
              </ul>
              Nếu gặp lỗi, vui lòng liên hệ admin để được hỗ trợ.
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Dị ứng:</label>
            <textarea
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="Nhập các dị ứng (nếu có)..."
              style={styles.textarea}
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bệnh mãn tính:</label>
            <textarea
              name="chronicDiseases"
              value={form.chronicDiseases}
              onChange={handleChange}
              placeholder="Nhập các bệnh mãn tính (nếu có)..."
              style={styles.textarea}
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tiền sử bệnh:</label>
            <textarea
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
              placeholder="Nhập tiền sử bệnh..."
              style={styles.textarea}
              rows="4"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Thị lực:</label>
            <select
              name="eyesight"
              value={form.eyesight}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Chọn thị lực</option>
              <option value="Tốt">Tốt</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Kém">Kém</option>
              <option value="Cần đeo kính">Cần đeo kính</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Thính lực:</label>
            <select
              name="hearing"
              value={form.hearing}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Chọn thính lực</option>
              <option value="Tốt">Tốt</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Kém">Kém</option>
              <option value="Cần máy trợ thính">Cần máy trợ thính</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lịch sử tiêm chủng:</label>
            <textarea
              name="vaccinationRecord"
              value={form.vaccinationRecord}
              onChange={handleChange}
              placeholder="Nhập lịch sử tiêm chủng..."
              style={styles.textarea}
              rows="4"
            />
          </div>

          <Notification
            type="success"
            message={success}
            visible={!!success}
            onClose={() => setSuccess("")}
          />
          
          <Notification
            type="error"
            message={error}
            visible={!!error}
            onClose={() => setError("")}
          />

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              className="ripple"
            >
              {loading ? (
                <div style={styles.loadingSpinner}></div>
              ) : (
                <>
                  <FaSave style={{ marginRight: 8, fontSize: 18 }} />
                  Gửi khai báo sức khỏe
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Modal hiển thị thông tin mới khai báo */}
        <LatestDeclaration
          declaration={latestDeclaration}
          visible={showLatestDeclaration}
          onClose={() => setShowLatestDeclaration(false)}
        />
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  backgroundDark: {
    background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  },
  containerDark: {
    background: "rgba(44, 62, 80, 0.95)",
    color: "#ecf0f1"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e8f4fd"
  },
  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#5b86e5",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    margin: 0,
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center"
  },
  iconButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#5b86e5",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  iconButtonDark: {
    color: "#ecf0f1"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "5px"
  },
  textarea: {
    padding: "15px",
    border: "2px solid #e8f4fd",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)"
  },
  select: {
    padding: "15px",
    border: "2px solid #e8f4fd",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    background: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  submitButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px"
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #ffffff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  infoBox: {
    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
    border: "2px solid #2196f3",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px"
  },
  infoIcon: {
    fontSize: "24px",
    marginTop: "2px"
  },
  infoContent: {
    flex: 1,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#1976d2"
  },
  infoList: {
    margin: "10px 0",
    paddingLeft: "20px"
  }
};

export default HealthProfileForm; 