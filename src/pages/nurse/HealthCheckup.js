import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";
import {
    getConfirmedStudents,
    submitHealthCheckup
} from "../../services/nurseApi";

function HealthCheckup() {
    const [confirmedStudents, setConfirmedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCheckupModal, setShowCheckupModal] = useState(false);
    const [checkupData, setCheckupData] = useState({
        studentId: "",
        checkupDate: "",
        temperature: "",
        bloodPressure: "",
        heartRate: "",
        weight: "",
        height: "",
        symptoms: "",
        diagnosis: "",
        recommendations: "",
        followUpNeeded: false,
        followUpDate: ""
    });

    const loadConfirmedStudents = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getConfirmedStudents();
            if (response.code === 0) {
                setConfirmedStudents(response.result || []);
            } else {
                setError(response.message || "Không thể tải danh sách học sinh đã xác nhận");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConfirmedStudents();
    }, []);

    const handleOpenCheckupModal = (student) => {
        setSelectedStudent(student);
        setCheckupData({
            studentId: student.studentId || student.id,
            checkupDate: new Date().toISOString().split('T')[0],
            temperature: "",
            bloodPressure: "",
            heartRate: "",
            weight: "",
            height: "",
            symptoms: "",
            diagnosis: "",
            recommendations: "",
            followUpNeeded: false,
            followUpDate: ""
        });
        setShowCheckupModal(true);
    };

    const handleCloseCheckupModal = () => {
        setShowCheckupModal(false);
        setSelectedStudent(null);
        setCheckupData({
            studentId: "",
            checkupDate: "",
            temperature: "",
            bloodPressure: "",
            heartRate: "",
            weight: "",
            height: "",
            symptoms: "",
            diagnosis: "",
            recommendations: "",
            followUpNeeded: false,
            followUpDate: ""
        });
    };

    const handleCheckupChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCheckupData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmitCheckup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await submitHealthCheckup(checkupData);
            if (response.code === 0) {
                handleCloseCheckupModal();
                loadConfirmedStudents();
                alert("Kết quả kiểm tra sức khỏe đã được gửi thành công!");
            } else {
                setError(response.message || "Không thể gửi kết quả kiểm tra sức khỏe");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-stethoscope me-2"></i> Kiểm tra Sức khỏe
                </h2>
                <div className="text-muted">
                    <i className="fas fa-calendar me-2"></i>
                    {new Date().toLocaleDateString('vi-VN')}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            <div className="card shadow border-0">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="fas fa-user-check me-2"></i>
                        Danh sách học sinh đã xác nhận - Sẵn sàng kiểm tra
                    </h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>Học sinh</th>
                                        <th>Lớp</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Lý do kiểm tra</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {confirmedStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                <i className="fas fa-user-check fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không có học sinh nào đã xác nhận.
                                            </td>
                                        </tr>
                                    ) : (
                                        confirmedStudents.map((student) => (
                                            <tr key={student.studentId || student.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-placeholder me-2" style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e8f5e8',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#28a745',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {student.studentName?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{student.studentName}</div>
                                                            <small className="text-muted">ID: {student.studentId}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{student.className}</span>
                                                </td>
                                                <td>
                                                    {student.registrationDate ?
                                                        new Date(student.registrationDate).toLocaleDateString('vi-VN') :
                                                        'N/A'
                                                    }
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: 200 }}>
                                                        {student.checkupReason || 'Kiểm tra định kỳ'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-success">Đã xác nhận</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        title="Bắt đầu kiểm tra"
                                                        onClick={() => handleOpenCheckupModal(student)}
                                                    >
                                                        <i className="fas fa-stethoscope me-1"></i>
                                                        Kiểm tra
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Health Checkup Modal */}
            {showCheckupModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleSubmitCheckup}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Kiểm tra sức khỏe - {selectedStudent?.studentName}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCheckupModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Ngày kiểm tra *</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="checkupDate"
                                                    value={checkupData.checkupDate}
                                                    onChange={handleCheckupChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Nhiệt độ (°C)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="form-control"
                                                    name="temperature"
                                                    value={checkupData.temperature}
                                                    onChange={handleCheckupChange}
                                                    placeholder="37.0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Huyết áp (mmHg)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="bloodPressure"
                                                    value={checkupData.bloodPressure}
                                                    onChange={handleCheckupChange}
                                                    placeholder="120/80"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Nhịp tim (bpm)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="heartRate"
                                                    value={checkupData.heartRate}
                                                    onChange={handleCheckupChange}
                                                    placeholder="72"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Cân nặng (kg)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="form-control"
                                                    name="weight"
                                                    value={checkupData.weight}
                                                    onChange={handleCheckupChange}
                                                    placeholder="50.0"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Chiều cao (cm)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="form-control"
                                                    name="height"
                                                    value={checkupData.height}
                                                    onChange={handleCheckupChange}
                                                    placeholder="160.0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Triệu chứng</label>
                                        <textarea
                                            className="form-control"
                                            name="symptoms"
                                            value={checkupData.symptoms}
                                            onChange={handleCheckupChange}
                                            rows="2"
                                            placeholder="Mô tả các triệu chứng (nếu có)"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Chẩn đoán</label>
                                        <textarea
                                            className="form-control"
                                            name="diagnosis"
                                            value={checkupData.diagnosis}
                                            onChange={handleCheckupChange}
                                            rows="2"
                                            placeholder="Chẩn đoán sơ bộ"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Khuyến nghị</label>
                                        <textarea
                                            className="form-control"
                                            name="recommendations"
                                            value={checkupData.recommendations}
                                            onChange={handleCheckupChange}
                                            rows="2"
                                            placeholder="Khuyến nghị điều trị"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="followUpNeeded"
                                                        checked={checkupData.followUpNeeded}
                                                        onChange={handleCheckupChange}
                                                    />
                                                    <label className="form-check-label">Cần theo dõi</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {checkupData.followUpNeeded && (
                                                <div className="mb-3">
                                                    <label className="form-label">Ngày tái khám</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="followUpDate"
                                                        value={checkupData.followUpDate}
                                                        onChange={handleCheckupChange}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCheckupModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? 'Đang gửi...' : 'Gửi kết quả'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </NurseLayout>
    );
}

export default HealthCheckup; 