import React, { useState, useEffect } from "react";
import { FaSyringe, FaListAlt, FaCheckCircle, FaEnvelopeOpenText, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import {
  createVaccinationRecord,
  getVaccinationsByStudent,
  deleteVaccinationRecord
} from "../services/vaccinationApi";

const steps = [
  {
    title: "Gửi thông báo xác nhận",
    icon: <FaEnvelopeOpenText style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Gửi thông báo về lịch tiêm chủng cho phụ huynh để họ xác nhận tham gia."
  },
  {
    title: "Chuẩn bị danh sách học sinh",
    icon: <FaListAlt style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Lập danh sách học sinh cần tiêm chủng, theo dõi trạng thái xác nhận."
  },
  {
    title: "Ghi nhận kết quả tiêm chủng",
    icon: <FaSyringe style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Nhập kết quả tiêm chủng cho từng học sinh."
  },
  {
    title: "Trả kết quả & Lập lịch nhắc lại",
    icon: <FaCheckCircle style={{ color: '#5b86e5', fontSize: 22, marginRight: 8 }} />,
    desc: "Gửi kết quả cho phụ huynh, lập lịch nhắc lại nếu cần tiêm bổ sung."
  },
];

function Vaccination() {
  const [step, setStep] = useState(0);
  const [students, setStudents] = useState([]); // [{id, name, class, confirmed, checked, needReminder}]
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [vaccinations, setVaccinations] = useState([]); // danh sách tiêm chủng của học sinh đã chọn
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ vaccineName: '', date: '', note: '' });
  const [showReminder, setShowReminder] = useState(false);
  const [reminderInfo, setReminderInfo] = useState({ date: '', time: '' });

  // Giả lập danh sách học sinh (có thể thay bằng API thực tế)
  useEffect(() => {
    setStudents([
      { id: "1", name: "Nguyễn Văn A", class: "1A", confirmed: true, checked: false, needReminder: false },
      { id: "2", name: "Trần Thị B", class: "1B", confirmed: false, checked: false, needReminder: false },
      { id: "3", name: "Lê Văn C", class: "2A", confirmed: true, checked: true, needReminder: true },
    ]);
  }, []);

  // Khi chọn học sinh, lấy danh sách tiêm chủng
  useEffect(() => {
    if (!selectedStudent) return;
    setLoading(true);
    getVaccinationsByStudent(selectedStudent.id)
      .then(setVaccinations)
      .catch(e => {
        setVaccinations([]);
        alert(e.message || 'Không lấy được dữ liệu tiêm chủng');
      })
      .finally(() => setLoading(false));
  }, [selectedStudent]);

  // Xử lý nhập form
  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Thêm bản ghi tiêm chủng
  const handleAddVaccination = async () => {
    if (!form.vaccineName || !form.date) {
      alert('Vui lòng nhập đầy đủ tên vắc xin và ngày tiêm!');
      return;
    }
    setLoading(true);
    try {
      const data = {
        studentId: selectedStudent.id,
        vaccinations: [
          {
            vaccineName: form.vaccineName,
            date: form.date,
            note: form.note
          }
        ]
      };
      await createVaccinationRecord(data);
      // Reload
      const updated = await getVaccinationsByStudent(selectedStudent.id);
      setVaccinations(updated);
      setShowPopup(false);
      setForm({ vaccineName: '', date: '', note: '' });
      alert('Đã thêm bản ghi tiêm chủng!');
      // Đánh dấu đã tiêm cho học sinh
      setStudents(students => students.map(s => s.id === selectedStudent.id ? { ...s, checked: true } : s));
    } catch (e) {
      alert(e.message || 'Thêm bản ghi thất bại');
    }
    setLoading(false);
  };

  // Xoá bản ghi tiêm chủng
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá bản ghi này?')) return;
    setLoading(true);
    try {
      await deleteVaccinationRecord(id);
      setVaccinations(vaccinations.filter(v => v.id !== id));
    } catch (e) {
      alert(e.message || 'Xoá thất bại');
    }
    setLoading(false);
  };

  // Gửi thông báo xác nhận
  const handleSendNotice = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Đã gửi thông báo xác nhận tiêm chủng cho phụ huynh!');
      setStep(1);
    }, 600);
  };

  // Xác nhận phụ huynh thủ công
  const handleConfirmParent = (id) => {
    setStudents(students => students.map(s => s.id === id ? { ...s, confirmed: true } : s));
    alert('Xác nhận thành công! Học sinh sẽ được đưa vào danh sách tiêm chủng.');
  };

  // Chuyển bước nhập kết quả
  const handleNextList = () => setStep(2);

  // Chọn học sinh để nhập kết quả
  const handleCheck = (student) => setSelectedStudent(student);

  // Trả kết quả & lập lịch nhắc lại
  const handleSendResult = () => {
    setStep(3);
    alert('Đã gửi kết quả tiêm chủng cho phụ huynh!');
  };

  // Lập lịch nhắc lại
  const handleReminder = () => setShowReminder(true);
  const handleCloseReminder = () => setShowReminder(false);
  const handleReminderInfo = (e) => setReminderInfo(info => ({ ...info, [e.target.name]: e.target.value }));
  const handleSaveReminder = () => {
    setShowReminder(false);
    setReminderInfo({ date: '', time: '' });
    alert('Đã lưu lịch nhắc lại!');
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Quản lý Tiêm chủng</h2>
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
              <p style={styles.desc}>Gửi thông báo về lịch tiêm chủng cho phụ huynh để họ xác nhận tham gia.</p>
              <button style={styles.button} onClick={handleSendNotice}>Gửi thông báo xác nhận</button>
            </div>
          )}
          {!loading && step === 1 && (
            <div>
              <p style={styles.desc}>Danh sách học sinh cần tiêm chủng:</p>
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
                          <button style={styles.smallBtn} onClick={() => handleConfirmParent(s.id)}>Phụ huynh xác nhận</button>
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
              <p style={styles.desc}>Nhập kết quả tiêm chủng cho từng học sinh:</p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Đã tiêm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.checked ? <span style={styles.confirmed}>Đã tiêm</span> : <span style={styles.notConfirmed}>Chưa tiêm</span>}</td>
                      <td>
                        <button style={styles.smallBtn} onClick={() => handleCheck(s)} disabled={s.checked}>Nhập kết quả</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedStudent && (
                <div style={styles.popupOverlay}>
                  <div style={styles.popupBox}>
                    <h3 style={{marginBottom:12}}>Nhập kết quả tiêm chủng cho {selectedStudent.name}</h3>
                    <div style={styles.formGroup}>
                      <label>Tên vắc xin:</label>
                      <input name="vaccineName" value={form.vaccineName} onChange={handleFormChange} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Ngày tiêm:</label>
                      <input type="date" name="date" value={form.date} onChange={handleFormChange} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Ghi chú:</label>
                      <textarea name="note" value={form.note} onChange={handleFormChange} style={styles.textarea}/>
                    </div>
                    <div style={{textAlign:'right',marginTop:10}}>
                      <button style={styles.button} onClick={handleAddVaccination}>Lưu kết quả</button>
                      <button style={styles.smallBtn} onClick={()=>setSelectedStudent(null)}>Hủy</button>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'right', marginTop: 18 }}>
                <button style={styles.button} onClick={handleSendResult}>Gửi kết quả cho phụ huynh</button>
              </div>
              {/* Bảng các mũi tiêm đã nhập */}
              {selectedStudent && vaccinations.length > 0 && (
                <div style={{marginTop:24}}>
                  <h4 style={{marginBottom:8}}>Các mũi tiêm đã nhập cho {selectedStudent.name}:</h4>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Tên vắc xin</th>
                        <th>Ngày tiêm</th>
                        <th>Ghi chú</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaccinations.map(v => (
                        <tr key={v.id}>
                          <td>{v.vaccineName}</td>
                          <td>{v.date}</td>
                          <td>{v.note}</td>
                          <td>
                            <button style={styles.smallBtn} onClick={() => handleDelete(v.id)}><FaTrashAlt style={{ marginRight: 4 }} />Xoá</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {!loading && step === 3 && (
            <div>
              <p style={styles.desc}>Kết quả đã gửi cho phụ huynh. Nếu có học sinh cần tiêm bổ sung, lập lịch nhắc lại riêng:</p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Kết quả</th>
                    <th>Nhắc lại</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s.needReminder ? <span style={styles.notConfirmed}>Cần nhắc lại</span> : <span style={styles.confirmed}>Đủ mũi</span>}</td>
                      <td>
                        {s.needReminder && <button style={styles.smallBtn} onClick={handleReminder}><FaCalendarAlt style={{marginRight:4}}/>Nhắc lại</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showReminder && (
                <div style={styles.popupOverlay}>
                  <div style={styles.popupBox}>
                    <h3 style={{marginBottom:12}}>Lập lịch nhắc lại tiêm chủng</h3>
                    <div style={styles.formGroup}>
                      <label>Chọn ngày:</label>
                      <input type="date" name="date" value={reminderInfo.date} onChange={handleReminderInfo} style={styles.input}/>
                    </div>
                    <div style={styles.formGroup}>
                      <label>Chọn giờ:</label>
                      <input type="time" name="time" value={reminderInfo.time} onChange={handleReminderInfo} style={styles.input}/>
                    </div>
                    <div style={{textAlign:'right',marginTop:10}}>
                      <button style={styles.button} onClick={handleSaveReminder}>Lưu lịch</button>
                      <button style={styles.smallBtn} onClick={handleCloseReminder}>Hủy</button>
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

export default Vaccination;

