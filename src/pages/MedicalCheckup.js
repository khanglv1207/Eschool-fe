import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaListAlt, FaStethoscope, FaEnvelopeOpenText, FaCalendarAlt } from "react-icons/fa";
import { confirmParentCheckup, getConfirmedStudents, updateCheckupResult } from "../services/userApi";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Gửi thông báo xác nhận",
    icon: <FaEnvelopeOpenText style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Gửi thông báo về nội dung kiểm tra cho phụ huynh để họ xác nhận tham gia."
  },
  {
    title: "Chuẩn bị danh sách học sinh",
    icon: <FaListAlt style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Lập danh sách học sinh cần kiểm tra, theo dõi trạng thái xác nhận."
  },
  {
    title: "Thực hiện khám & ghi nhận kết quả",
    icon: <FaStethoscope style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Nhập kết quả khám sức khỏe cho từng học sinh."
  },
  {
    title: "Trả kết quả & Lập lịch tư vấn",
    icon: <FaCheckCircle style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Gửi kết quả cho phụ huynh, lập lịch tư vấn nếu phát hiện bất thường."
  },
];

function MedicalCheckup() {
  const [step, setStep] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ height: '', weight: '', note: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConsult, setShowConsult] = useState(false);
  const [consultInfo, setConsultInfo] = useState({ date: '', time: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "nurse") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/");
    }
  }, [navigate]);

  // Fetch danh sách học sinh đã xác nhận từ API khi vào trang
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // TODO: Thay checkupId bằng id thực tế khi có
        const checkupId = "00000000-0000-0000-0000-000000000000"; // demo UUID, thay bằng id thực tế
        const data = await getConfirmedStudents(checkupId);
        setStudents(data.map(s => ({
          ...s,
          id: s.notificationId || s.id, // Đảm bảo có id để thao tác
          name: s.fullName || s.name,
          class: s.className || s.class,
          confirmed: true, // Đã xác nhận
          checked: s.checked || false, // Có thể sửa lại nếu BE trả về
          abnormal: s.abnormal || false // Có thể sửa lại nếu BE trả về
        })));
      } catch (err) {
        alert(err.message);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  // Step 1: Gửi thông báo (API call)
  const handleSendNotice = async () => {
    setLoading(true);
    // TODO: Gọi API gửi thông báo cho phụ huynh
    // await fetch('/api/medical-checkup/notify-parents', { method: 'POST' });
    setTimeout(() => {
      setLoading(false);
      alert('Đã gửi thông báo xác nhận cho phụ huynh!');
      setStep(1);
    }, 600);
  };

  // Step 2: Chuyển bước
  const handleNextList = () => setStep(2);

  // Step 3: Nhập kết quả khám
  const handleCheck = (student) => setSelectedStudent(student);
  const handleResultChange = (e) => setResult(r => ({ ...r, [e.target.name]: e.target.value }));
  const handleSaveResult = async () => {
    setLoading(true);
    try {
      // Gọi API lưu kết quả khám cho học sinh
      const resultData = {
        resultSummary: `Chiều cao: ${result.height}cm, Cân nặng: ${result.weight}kg, Ghi chú: ${result.note}`,
        isAbnormal: result.note.toLowerCase().includes('bất thường'),
        suggestion: result.note
      };
      await updateCheckupResult(selectedStudent.id, resultData); // id là notificationId
      setStudents(students.map(s =>
        s.id === selectedStudent.id ? { ...s, checked: true, abnormal: resultData.isAbnormal } : s
      ));
      setSelectedStudent(null);
      setResult({ height: '', weight: '', note: '' });
      alert('Đã lưu kết quả khám thành công.');
    } catch (err) {
      alert(err.message || 'Lưu kết quả khám thất bại');
    }
    setLoading(false);
  };

  // Step 4: Trả kết quả & tư vấn
  const handleSendResult = async () => {
    setLoading(true);
    // TODO: Gọi API gửi kết quả cho phụ huynh
    // await fetch('/api/medical-checkup/send-result', { method: 'POST' });
    setTimeout(() => {
      setLoading(false);
      alert('Đã gửi kết quả cho phụ huynh!');
      setStep(3);
    }, 600);
  };
  const handleConsult = () => setShowConsult(true);
  const handleCloseConsult = () => setShowConsult(false);
  const handleConsultInfo = (e) => setConsultInfo(info => ({ ...info, [e.target.name]: e.target.value }));
  const handleSaveConsult = async () => {
    setLoading(true);
    // TODO: Gọi API lưu lịch tư vấn
    // await fetch('/api/medical-checkup/consult', { method: 'POST', body: JSON.stringify(consultInfo) });
    setTimeout(() => {
      setShowConsult(false);
      setConsultInfo({ date: '', time: '' });
      setLoading(false);
      alert('Đã lưu lịch tư vấn!');
    }, 600);
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Quản lý Kiểm tra Y tế định kỳ</h2>
        <div style={styles.stepsRow}>
          {steps.map((s, idx) => (
            <div key={idx} style={{ ...styles.step, ...(step === idx ? styles.activeStep : {}) }}>
              {s.icon}
              <div>
                <div style={styles.stepTitle}>{s.title}</div>
                <div style={styles.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.contentBox}>
          {loading && <div style={{textAlign:'center',color:'#5b86e5',fontWeight:600}}>Đang xử lý...</div>}
          {!loading && step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={styles.desc}>Gửi thông báo về nội dung kiểm tra cho phụ huynh để họ xác nhận tham gia.</p>
              <button style={styles.button} onClick={handleSendNotice}>Gửi thông báo xác nhận</button>
            </div>
          )}
          {!loading && step === 1 && (
            <div>
              <p style={styles.desc}>Danh sách học sinh cần kiểm tra:</p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Phụ huynh xác nhận</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.confirmed ? <span style={styles.confirmed}>Đã xác nhận</span> : <span style={styles.notConfirmed}>Chưa xác nhận</span>}</td>
                      <td>
                        {!s.confirmed && (
                          <button style={styles.smallBtn} onClick={async () => {
                            setLoading(true);
                            try {
                              await confirmParentCheckup(s.id); // s.id as mock notificationId
                              setStudents(students.map(stu => stu.id === s.id ? { ...stu, confirmed: true } : stu));
                              alert("Xác nhận thành công! Học sinh sẽ được đưa vào danh sách kiểm tra.");
                            } catch (err) {
                              alert(err.message || "Xác nhận thất bại. Vui lòng thử lại hoặc liên hệ nhà trường.");
                            }
                            setLoading(false);
                          }}>Phụ huynh xác nhận</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: 18 }}>
                <button style={styles.button} onClick={handleNextList}>Tiếp tục</button>
              </div>
            </div>
          )}
          {!loading && step === 2 && (
            <div>
              <p style={styles.desc}>Nhập kết quả khám cho từng học sinh:</p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Đã khám</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.checked ? <span style={styles.confirmed}>Đã khám</span> : <span style={styles.notConfirmed}>Chưa khám</span>}</td>
                      <td>
                        <button style={styles.smallBtn} onClick={() => handleCheck(s)} disabled={s.checked}>Khám</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedStudent && (
                <div style={styles.popupOverlay}>
                  <div style={styles.popupBox}>
                    <h3 style={{marginBottom:12}}>Nhập kết quả cho {selectedStudent.name}</h3>
                    <div style={styles.formGroup}>
                      <label>Chiều cao (cm):</label>
                      <input name="height" value={result.height} onChange={handleResultChange} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Cân nặng (kg):</label>
                      <input name="weight" value={result.weight} onChange={handleResultChange} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Ghi chú (nếu có bất thường ghi rõ):</label>
                      <textarea name="note" value={result.note} onChange={handleResultChange} style={styles.textarea}/>
                    </div>
                    <div style={{textAlign:'right',marginTop:10}}>
                      <button style={styles.button} onClick={handleSaveResult}>Lưu kết quả</button>
                      <button style={styles.smallBtn} onClick={()=>setSelectedStudent(null)}>Hủy</button>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'right', marginTop: 18 }}>
                <button style={styles.button} onClick={handleSendResult}>Gửi kết quả cho phụ huynh</button>
              </div>
            </div>
          )}
          {!loading && step === 3 && (
            <div>
              <p style={styles.desc}>Kết quả đã gửi cho phụ huynh. Nếu có học sinh bất thường, lập lịch tư vấn riêng:</p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Kết quả</th>
                    <th>Tư vấn</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.abnormal ? <span style={styles.notConfirmed}>Bất thường</span> : <span style={styles.confirmed}>Bình thường</span>}</td>
                      <td>
                        {s.abnormal && <button style={styles.smallBtn} onClick={handleConsult}><FaCalendarAlt style={{marginRight:4}}/>Tư vấn</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showConsult && (
                <div style={styles.popupOverlay}>
                  <div style={styles.popupBox}>
                    <h3 style={{marginBottom:12}}>Lập lịch tư vấn riêng</h3>
                    <div style={styles.formGroup}>
                      <label>Chọn ngày:</label>
                      <input type="date" name="date" value={consultInfo.date} onChange={handleConsultInfo} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Chọn giờ:</label>
                      <input type="time" name="time" value={consultInfo.time} onChange={handleConsultInfo} style={styles.input}/>
                    </div>
                    <div style={{textAlign:'right',marginTop:10}}>
                      <button style={styles.button} onClick={handleSaveConsult}>Lưu lịch</button>
                      <button style={styles.smallBtn} onClick={handleCloseConsult}>Hủy</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @keyframes gradientMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(120deg, #e0f7fa 0%, #f8fdff 100%)",
    backgroundSize: "200% 200%",
    animation: "gradientMove 15s ease infinite",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    padding: "32px 18px 32px 18px",
    borderRadius: "28px",
    boxShadow: "0 8px 32px 0 rgba(91,134,229,0.10)",
    background: "rgba(255,255,255,0.95)",
    color: "#263238",
    position: "relative",
    zIndex: 2,
    margin: "32px 0",
    border: '1.5px solid #e3f2fd',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background 0.4s, color 0.4s',
  },
  title: {
    textAlign: "left",
    marginBottom: 18,
    fontSize: "28px",
    color: "#3a7bd5",
    fontWeight: 700,
    letterSpacing: 0.5,
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  stepsRow: {
    display: 'flex', gap: 18, marginBottom: 24, flexWrap: 'wrap',
  },
  step: {
    display: 'flex', alignItems: 'flex-start', background: '#f4fafd', borderRadius: 14, padding: '14px 18px', minWidth: 220, boxShadow: '0 1px 4px #e3f2fd', border: '1.5px solid #e3f2fd', flex: 1, marginRight: 0, marginBottom: 0, transition: 'box-shadow 0.2s',
  },
  activeStep: {
    boxShadow: '0 4px 16px #b3c6f7', border: '1.5px solid #5b86e5', background: '#e3f2fd',
  },
  stepTitle: {
    fontWeight: 600, fontSize: 17, color: '#1565c0', marginBottom: 2,
  },
  stepDesc: {
    fontSize: 14, color: '#607d8b',
  },
  contentBox: {
    background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(91,134,229,0.06)', padding: 24, marginTop: 8,
  },
  desc: {
    color: '#607d8b', fontSize: 16, marginBottom: 18,
  },
  button: {
    padding: '10px 28px',
    background: 'linear-gradient(90deg, #a8edea 0%, #5b86e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(91,134,229,0.10)',
    transition: 'background 0.2s, transform 0.15s',
    marginRight: 10,
  },
  smallBtn: {
    padding: '6px 16px', fontSize: 14, borderRadius: 8, border: 'none', background: '#e3f2fd', color: '#3a7bd5', fontWeight: 600, cursor: 'pointer', marginRight: 8,
  },
  table: {
    width: '100%', borderCollapse: 'collapse', marginTop: 10, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #e3f2fd',
  },
  confirmed: {
    color: '#27ae60', fontWeight: 600,
  },
  notConfirmed: {
    color: '#e67e22', fontWeight: 600,
  },
  popupOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  popupBox: {
    background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #b3c6f7', padding: 28, minWidth: 320, maxWidth: 400,
  },
  formGroup: {
    display: 'flex', flexDirection: 'column', marginBottom: 14,
  },
  input: {
    padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e3f2fd', fontSize: 15, outline: 'none', background: '#f4fafd', color: '#263238', fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", boxShadow: '0 1px 4px #e3f2fd',
  },
  textarea: {
    padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e3f2fd', fontSize: 15, outline: 'none', background: '#f4fafd', color: '#263238', fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", boxShadow: '0 1px 4px #e3f2fd', resize: 'vertical',
  },
};

export default MedicalCheckup;
