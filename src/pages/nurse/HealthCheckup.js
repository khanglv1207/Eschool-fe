import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";
import {
    getStudentsToVaccinate,
    createVaccinationRecord
} from "../../services/vaccinationApi";

function HealthCheckup() {
    const [studentsToVaccinate, setStudentsToVaccinate] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showVaccinationModal, setShowVaccinationModal] = useState(false);
    const [vaccinationData, setVaccinationData] = useState({
        studentId: "",
        vaccinationDate: "",
        batchNumber: "",
        administeredBy: "",
        notes: "",
        status: "IN_PROGRESS"
    });

    const loadStudentsToVaccinate = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getStudentsToVaccinate("");
            if (response && Array.isArray(response)) {
                setStudentsToVaccinate(response);
            } else {
                setError("Không thể tải danh sách học sinh cần tiêm vaccine");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudentsToVaccinate();
    }, []);

    const handleOpenVaccinationModal = (student) => {
        setSelectedStudent(student);
        setVaccinationData({
            studentId: student.studentId || student.id,
            vaccinationDate: new Date().toISOString().split('T')[0],
            batchNumber: "",
            administeredBy: "",
            notes: "",
            status: "IN_PROGRESS"
        });
        setShowVaccinationModal(true);
    };

    const handleCloseVaccinationModal = () => {
        setShowVaccinationModal(false);
        setSelectedStudent(null);
        setVaccinationData({
            studentId: "",
            vaccinationDate: "",
            batchNumber: "",
            administeredBy: "",
            notes: "",
            status: "IN_PROGRESS"
        });
    };

    const handleVaccinationChange = (e) => {
        const { name, value } = e.target;
        setVaccinationData({
            ...vaccinationData,
            [name]: value
        });
    };

    const handleSubmitVaccination = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createVaccinationRecord(vaccinationData);
            if (response) {
                handleCloseVaccinationModal();
                loadStudentsToVaccinate();
                alert("Ghi nhận tiêm vaccine thành công!");
            } else {
                setError("Không thể ghi nhận tiêm vaccine");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getVaccinationStatus = (student) => {
        if (student.vaccinationStatus === "COMPLETED") {
            return <span className="badge bg-success">Đã tiêm</span>;
        } else if (student.vaccinationStatus === "IN_PROGRESS") {
            return <span className="badge bg-primary">Đang kiểm tra</span>;
        } else if (student.vaccinationStatus === "PENDING") {
            return <span className="badge bg-warning">Chờ tiêm</span>;
        } else {
            return <span className="badge bg-secondary">Chưa tiêm</span>;
        }
    };

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-syringe me-2"></i> Quản lý Tiêm Vaccine
                </h2>
                <div className="text-muted">
                    <i className="fas fa-calendar me-2"></i>
                    Ngày: {new Date().toLocaleDateString('vi-VN')}
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-0">{studentsToVaccinate.length}</h4>
                                    <small>Tổng số học sinh</small>
                                </div>
                                <i className="fas fa-users fa-2x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-0">
                                        {studentsToVaccinate.filter(s => s.vaccinationStatus === "PENDING").length}
                                    </h4>
                                    <small>Chờ tiêm</small>
                                </div>
                                <i className="fas fa-clock fa-2x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-0">
                                        {studentsToVaccinate.filter(s => s.vaccinationStatus === "IN_PROGRESS").length}
                                    </h4>
                                    <small>Đang kiểm tra</small>
                                </div>
                                <i className="fas fa-spinner fa-2x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-0">
                                        {studentsToVaccinate.filter(s => s.vaccinationStatus === "COMPLETED").length}
                                    </h4>
                                    <small>Đã tiêm</small>
                                </div>
                                <i className="fas fa-check-circle fa-2x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow border-0">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="fas fa-list me-2"></i>
                        Danh sách học sinh cần tiêm vaccine
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
                                        <th>Ngày dự kiến</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsToVaccinate.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="fas fa-syringe fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không có học sinh nào cần tiêm vaccine.
                                            </td>
                                        </tr>
                                    ) : (
                                        studentsToVaccinate.map((student) => (
                                            <tr key={student.studentId || student.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-placeholder me-2" style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e3f2fd',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#1976d2',
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
                                                    <span className="badge bg-info">{student.className}</span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <small className="text-muted">
                                                            {student.scheduledDate ?
                                                                new Date(student.scheduledDate).toLocaleDateString('vi-VN') :
                                                                'Chưa lên lịch'
                                                            }
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    {getVaccinationStatus(student)}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Ghi nhận tiêm vaccine"
                                                        onClick={() => handleOpenVaccinationModal(student)}
                                                        disabled={student.vaccinationStatus === "COMPLETED" || student.vaccinationStatus === "IN_PROGRESS"}
                                                    >
                                                        <i className="fas fa-syringe"></i>
                                                        {student.vaccinationStatus === "COMPLETED" ? " Đã tiêm" : student.vaccinationStatus === "IN_PROGRESS" ? " Đang kiểm tra" : " Tiêm"}
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

            {/* Vaccination Modal */}
            {showVaccinationModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleSubmitVaccination}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Ghi nhận tiêm vaccine - {selectedStudent?.studentName}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseVaccinationModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Ngày tiêm *</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="vaccinationDate"
                                                    value={vaccinationData.vaccinationDate}
                                                    onChange={handleVaccinationChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Số lô vaccine</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="batchNumber"
                                                    value={vaccinationData.batchNumber}
                                                    onChange={handleVaccinationChange}
                                                    placeholder="VD: VN2024001"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Người tiêm</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="administeredBy"
                                                    value={vaccinationData.administeredBy}
                                                    onChange={handleVaccinationChange}
                                                    placeholder="Tên y tá thực hiện"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ghi chú</label>
                                        <textarea
                                            className="form-control"
                                            name="notes"
                                            value={vaccinationData.notes}
                                            onChange={handleVaccinationChange}
                                            rows={3}
                                            placeholder="Ghi chú về quá trình tiêm vaccine, phản ứng phụ..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseVaccinationModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang ghi nhận...' : 'Ghi nhận tiêm vaccine'}
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
