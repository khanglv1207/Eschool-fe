import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
    getPendingVaccinations,
    getVaccinationResults,
    sendVaccinationNotices,
    confirmVaccination,
    createVaccineType,
    sendVaccinationResult
} from "../../services/adminApi";

function VaccineManage() {
    const [activeTab, setActiveTab] = useState("pending");
    const [pendingVaccinations, setPendingVaccinations] = useState([]);
    const [vaccinationResults, setVaccinationResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal states
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showVaccineTypeModal, setShowVaccineTypeModal] = useState(false);
    const [selectedVaccination, setSelectedVaccination] = useState(null);
    const [noticeData, setNoticeData] = useState({
        vaccineName: "",
        scheduledDate: "",
        location: "",
        note: "",
        studentIds: []
    });
    const [resultData, setResultData] = useState({
        confirmationId: "",
        vaccinationDate: "",
        notes: "",
        hasReaction: false,
        followUpNeeded: false,
        needsBooster: false
    });
    const [vaccineTypeData, setVaccineTypeData] = useState({
        name: "",
        description: "",
        dosesRequired: 1,
        intervalDays: 0
    });

    // Load data based on active tab
    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            if (activeTab === "pending") {
                const response = await getPendingVaccinations();
                if (response.code === 0) {
                    setPendingVaccinations(response.result || []);
                } else {
                    setError(response.message || "Không thể tải danh sách tiêm chủng đang chờ");
                }
            } else if (activeTab === "results") {
                const response = await getVaccinationResults();
                if (response.code === 0) {
                    setVaccinationResults(response.result || []);
                } else {
                    setError(response.message || "Không thể tải kết quả tiêm chủng");
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    // Modal handlers
    const handleOpenNoticeModal = (vaccination) => {
        setSelectedVaccination(vaccination);
        setNoticeData({
            vaccineName: vaccination.vaccineName || "",
            scheduledDate: "",
            location: "",
            note: "",
            studentIds: [vaccination.studentId]
        });
        setShowNoticeModal(true);
    };

    const handleCloseNoticeModal = () => {
        setShowNoticeModal(false);
        setSelectedVaccination(null);
        setNoticeData({
            vaccineName: "",
            scheduledDate: "",
            location: "",
            note: "",
            studentIds: []
        });
    };

    const handleOpenResultModal = (vaccination) => {
        setSelectedVaccination(vaccination);
        setResultData({
            confirmationId: vaccination.confirmationId,
            vaccinationDate: new Date().toISOString().split('T')[0],
            notes: "",
            hasReaction: false,
            followUpNeeded: false,
            needsBooster: false
        });
        setShowResultModal(true);
    };

    const handleCloseResultModal = () => {
        setShowResultModal(false);
        setSelectedVaccination(null);
        setResultData({
            confirmationId: "",
            vaccinationDate: "",
            notes: "",
            hasReaction: false,
            followUpNeeded: false,
            needsBooster: false
        });
    };

    const handleOpenVaccineTypeModal = () => {
        setShowVaccineTypeModal(true);
        setVaccineTypeData({
            name: "",
            description: "",
            dosesRequired: 1,
            intervalDays: 0
        });
    };

    const handleCloseVaccineTypeModal = () => {
        setShowVaccineTypeModal(false);
        setVaccineTypeData({
            name: "",
            description: "",
            dosesRequired: 1,
            intervalDays: 0
        });
    };

    // Form handlers
    const handleNoticeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNoticeData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleResultChange = (e) => {
        const { name, value, type, checked } = e.target;
        setResultData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVaccineTypeChange = (e) => {
        const { name, value } = e.target;
        setVaccineTypeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Action handlers
    const handleSendNotice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await sendVaccinationNotices(noticeData);
            if (response.code === 0) {
                handleCloseNoticeModal();
                alert("Thông báo đã được gửi thành công!");
            } else {
                setError(response.message || "Không thể gửi thông báo");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendResult = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await sendVaccinationResult(resultData);
            if (response.code === 0) {
                handleCloseResultModal();
                loadData();
                alert("Kết quả tiêm chủng đã được gửi thành công!");
            } else {
                setError(response.message || "Không thể gửi kết quả tiêm chủng");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVaccineType = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createVaccineType(vaccineTypeData);
            if (response.code === 0) {
                handleCloseVaccineTypeModal();
                alert("Loại vaccine đã được tạo thành công!");
            } else {
                setError(response.message || "Không thể tạo loại vaccine");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmVaccination = async (confirmationId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xác nhận đã tiêm?")) return;

        setLoading(true);
        try {
            const response = await confirmVaccination({
                confirmationId,
                status: "ACCEPTED",
                parentNote: "Đã xác nhận bởi admin"
            });
            if (response.code === 0) {
                alert("Xác nhận tiêm thành công!");
                loadData();
            } else {
                setError(response.message || "Không thể xác nhận tiêm chủng");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-syringe me-2"></i> Quản lý Tiêm chủng
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleOpenVaccineTypeModal}>
                        <i className="fas fa-plus me-2"></i> Tạo loại vaccine
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                        onClick={() => setActiveTab("pending")}
                    >
                        <i className="fas fa-clock me-2"></i>
                        Đang chờ xử lý ({pendingVaccinations.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "results" ? "active" : ""}`}
                        onClick={() => setActiveTab("results")}
                    >
                        <i className="fas fa-clipboard-check me-2"></i>
                        Kết quả tiêm chủng ({vaccinationResults.length})
                    </button>
                </li>
            </ul>

            {/* Content */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="card shadow border-0">
                    <div className="card-body">
                        {activeTab === "pending" ? (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th>Học sinh</th>
                                            <th>Lớp</th>
                                            <th>Loại vaccine</th>
                                            <th>Ngày tiêm dự kiến</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVaccinations.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted py-4">
                                                    <i className="fas fa-syringe fa-2x mb-2 text-muted"></i>
                                                    <br />
                                                    Không có tiêm chủng nào đang chờ xử lý.
                                                </td>
                                            </tr>
                                        ) : (
                                            pendingVaccinations.map((vaccination) => (
                                                <tr key={vaccination.confirmationId}>
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
                                                                {vaccination.fullName?.charAt(0)?.toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold">{vaccination.fullName}</div>
                                                                <small className="text-muted">ID: {vaccination.studentId}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">{vaccination.className}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">{vaccination.vaccineName}</span>
                                                    </td>
                                                    <td>
                                                        {vaccination.vaccinationDate ?
                                                            new Date(vaccination.vaccinationDate).toLocaleDateString('vi-VN') :
                                                            'Chưa lên lịch'
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                title="Gửi thông báo"
                                                                onClick={() => handleOpenNoticeModal(vaccination)}
                                                            >
                                                                <i className="fas fa-bell"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-success me-2"
                                                                title="Gửi kết quả"
                                                                onClick={() => handleOpenResultModal(vaccination)}
                                                            >
                                                                <i className="fas fa-clipboard-check"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                title="Xác nhận tiêm"
                                                                onClick={() => handleConfirmVaccination(vaccination.confirmationId)}
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th>Học sinh</th>
                                            <th>Lớp</th>
                                            <th>Loại vaccine</th>
                                            <th>Ngày tiêm</th>
                                            <th>Phản ứng</th>
                                            <th>Cần tăng cường</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vaccinationResults.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-4">
                                                    <i className="fas fa-clipboard-check fa-2x mb-2 text-muted"></i>
                                                    <br />
                                                    Không có kết quả tiêm chủng nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            vaccinationResults.map((result) => (
                                                <tr key={result.confirmationId}>
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
                                                                {result.studentName?.charAt(0)?.toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold">{result.studentName}</div>
                                                                <small className="text-muted">ID: {result.confirmationId}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">{result.className}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">{result.vaccineName}</span>
                                                    </td>
                                                    <td>
                                                        {new Date(result.vaccinationDate).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td>
                                                        {result.hasReaction ? (
                                                            <span className="badge bg-warning">
                                                                <i className="fas fa-exclamation-triangle me-1"></i>
                                                                Có phản ứng
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-success">Bình thường</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {result.needsBooster ? (
                                                            <span className="badge bg-info">Cần tăng cường</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Đủ liều</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {result.finalized ? (
                                                            <span className="badge bg-success">Hoàn thành</span>
                                                        ) : (
                                                            <span className="badge bg-warning">Đang xử lý</span>
                                                        )}
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
            )}

            {/* Send Notice Modal */}
            {showNoticeModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSendNotice}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Gửi thông báo tiêm chủng</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseNoticeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Loại vaccine *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vaccineName"
                                            value={noticeData.vaccineName}
                                            onChange={handleNoticeChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày tiêm dự kiến *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="scheduledDate"
                                            value={noticeData.scheduledDate}
                                            onChange={handleNoticeChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa điểm *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="location"
                                            value={noticeData.location}
                                            onChange={handleNoticeChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ghi chú</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={noticeData.note}
                                            onChange={handleNoticeChange}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseNoticeModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang gửi...' : 'Gửi thông báo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Result Modal */}
            {showResultModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSendResult}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Gửi kết quả tiêm chủng</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseResultModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Ngày tiêm *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="vaccinationDate"
                                            value={resultData.vaccinationDate}
                                            onChange={handleResultChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ghi chú</label>
                                        <textarea
                                            className="form-control"
                                            name="notes"
                                            value={resultData.notes}
                                            onChange={handleResultChange}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="hasReaction"
                                                checked={resultData.hasReaction}
                                                onChange={handleResultChange}
                                            />
                                            <label className="form-check-label">Có phản ứng</label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="followUpNeeded"
                                                checked={resultData.followUpNeeded}
                                                onChange={handleResultChange}
                                            />
                                            <label className="form-check-label">Cần theo dõi</label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="needsBooster"
                                                checked={resultData.needsBooster}
                                                onChange={handleResultChange}
                                            />
                                            <label className="form-check-label">Cần tăng cường</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseResultModal}>
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

            {/* Create Vaccine Type Modal */}
            {showVaccineTypeModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateVaccineType}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo loại vaccine mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseVaccineTypeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tên vaccine *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={vaccineTypeData.name}
                                            onChange={handleVaccineTypeChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={vaccineTypeData.description}
                                            onChange={handleVaccineTypeChange}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số liều cần thiết *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="dosesRequired"
                                            value={vaccineTypeData.dosesRequired}
                                            onChange={handleVaccineTypeChange}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Khoảng cách giữa các liều (ngày)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="intervalDays"
                                            value={vaccineTypeData.intervalDays}
                                            onChange={handleVaccineTypeChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseVaccineTypeModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo vaccine'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default VaccineManage;