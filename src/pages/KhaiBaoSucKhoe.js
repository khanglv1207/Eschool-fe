import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KhaiBaoSucKhoe() {
  const [declarations, setDeclarations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("nurseHealthDeclarations")) || [];
    setDeclarations(data);
  }, []);

  const handleKhaiBao = () => {
    navigate("/nurse/health-declaration");
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={styles.title}>🩺 Danh Sách Khai Báo Sức Khỏe (Y tá)</h2>
          <button onClick={handleKhaiBao} style={{padding: '10px 24px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>
            Khai báo sức khỏe
          </button>
        </div>
        {declarations.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>Chưa có khai báo nào.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tuổi</th>
                <th>Triệu chứng</th>
                <th>Có sốt?</th>
                <th>Thời gian khai báo</th>
              </tr>
            </thead>
            <tbody>
              {declarations.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.symptoms}</td>
                  <td>{item.hasFever ? "Có" : "Không"}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(270deg, #89f7fe, #66a6ff, #fbc2eb, #a6c1ee)",
    backgroundSize: "800% 800%",
    animation: "gradientMove 15s ease infinite",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    background: "white",
    color: "#333",
    position: "relative",
    zIndex: 2,
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "26px",
    color: "#007BFF",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    background: "#f0f4ff",
    color: "#007BFF",
    padding: "10px",
    border: "1px solid #e0e0e0",
    fontWeight: 600,
  },
  td: {
    padding: "10px",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
};

export default KhaiBaoSucKhoe;
