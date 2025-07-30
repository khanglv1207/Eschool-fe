import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";
import {
    getPendingMedicationRequests,
    updateMedicationStatus
} from "../../services/nurseApi";

function MedicationRequests() {
    const [medicationRequests, setMedicationRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusData, setStatusData] = useState({
        requestId: "",
        status: "APPROVED",
        notes: ""
    });

    const loadMedicationRequests = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPendingMedicationRequests();
            if (response.code === 0) {
                setMedicationRequests(response.result || []);
            } else {
                setError(response.message || "Không thể tải danh sách yêu cầu thuốc");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicationRequests();
    }, []);

    const handleOpenStatusModal = (request) => {
        setSelectedRequest(request);
        setStatusData({
            requestId: request.requestId || request.id,
            status: "APPROVED",
            notes: ""
        });
        setShowStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setShowStatusModal(false);
        setSelectedRequest(null);
        setStatusData({
            requestId: "",
            status: "APPROVED",
            notes: ""
        });
    };

    const handleStatusChange = (e) => {
        setStatusData({
            ...statusData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateMedicationStatus(statusData);
            if (response.code === 0) {
                handleCloseStatusModal();
                loadMedicationRequests();
                alert("Cập nhật trạng thái thành công!");
            } else {
                setError(response.message || "Không thể cập nhật trạng thái");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { class: 'bg-warning', text: 'Chờ xử lý' },
            'APPROVED': { class: 'bg-success', text: 'Đã duyệt' },
            'REJECTED': { class: 'bg-danger', text: 'Từ chối' },
            'COMPLETED': { class: 'bg-info', text: 'Hoàn thành' }
        };
        const config = statusConfig[status] || statusConfig['PENDING'];
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-pills me-2"></i> Quản lý Yêu cầu Thuốc
                </h2>
                <div className="text-muted">
                    <i className="fas fa-clock me-2"></i>
                    Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
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
                        <i className="fas fa-list me-2"></i>
                        Danh sách yêu cầu thuốc đang chờ xử lý
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
                                        <th>Loại thuốc</th>
                                        <th>Liều lượng</th>
                                        <th>Thời gian</th>
                                        <th>Lý do</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicationRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">
                                                <i className="fas fa-pills fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không có yêu cầu thuốc nào đang chờ xử lý.
                                            </td>
                                        </tr>
                                    ) : (
                                        medicationRequests.map((request) => (
                                            <tr key={request.requestId || request.id}>
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
                                                            {request.studentName?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{request.studentName}</div>
                                                            <small className="text-muted">{request.className}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{request.medicationName}</span>
                                                </td>
                                                <td>
                                                    <span className="fw-bold">{request.dosage}</span>
                                                    <br />
                                                    <small className="text-muted">{request.frequency}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <small className="text-muted">Từ: {request.startDate}</small>
                                                        <br />
                                                        <small className="text-muted">Đến: {request.endDate}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: 200 }}>
                                                        {request.reason}
                                                    </div>
                                                </td>
                                                <td>
                                                    {getStatusBadge(request.status)}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Cập nhật trạng thái"
                                                        onClick={() => handleOpenStatusModal(request)}
                                                    >
                                                        <i className="fas fa-edit"></i>
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

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateStatus}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Cập nhật trạng thái yêu cầu thuốc</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseStatusModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Học sinh</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedRequest?.studentName || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Loại thuốc</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedRequest?.medicationName || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái *</label>
                                        <select
                                            className="form-select"
                                            name="status"
                                            value={statusData.status}
                                            onChange={handleStatusChange}
                                            required
                                        >
                                            <option value="APPROVED">Duyệt</option>
                                            <option value="REJECTED">Từ chối</option>
                                            <option value="COMPLETED">Hoàn thành</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ghi chú</label>
                                        <textarea
                                            className="form-control"
                                            name="notes"
                                            value={statusData.notes}
                                            onChange={handleStatusChange}
                                            rows={3}
                                            placeholder="Nhập ghi chú (tùy chọn)"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseStatusModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
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

export default MedicationRequests; 