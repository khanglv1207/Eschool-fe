import React, { useEffect, useState } from "react";
import { getPendingVaccinations, sendNotification, confirmVaccination } from "../../services/adminApi";
import AdminLayout from "./AdminLayout";

function VaccineManage() {
    const [pendingVaccinations, setPendingVaccinations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPendingVaccinations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getPendingVaccinations();
            console.log('✅ Vaccination data received:', result);

            // Xử lý response data
            const vaccinations = result.result || result.data || result || [];
            setPendingVaccinations(Array.isArray(vaccinations) ? vaccinations : []);

            if (vaccinations.length === 0) {
                console.log('📭 No pending vaccinations found');
            }
        } catch (error) {
            console.error("Failed to fetch pending vaccinations:", error);
            setError(error.message || "Không thể tải danh sách tiêm chủng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVaccinations();
    }, []);

    const handleOpenNotificationModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseNotificationModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleSendNotification = async () => {
        if (!selectedUser) return;

        try {
            setIsLoading(true);
            await sendNotification(selectedUser.accountId || selectedUser.id);
            alert("Notification sent successfully.");
            handleCloseNotificationModal();
            // Refresh data after sending notification
            await fetchPendingVaccinations();
        } catch (error) {
            console.error("Failed to send notification:", error);
            alert("Failed to send notification: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmVaccination = async (confirmationId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xác nhận đã tiêm?")) return;

        try {
            setIsLoading(true);
            await confirmVaccination(confirmationId);
            alert("Xác nhận tiêm thành công.");
            // Refresh data after confirmation
            await fetchPendingVaccinations();
        } catch (error) {
            console.error("Lỗi khi xác nhận tiêm:", error);
            alert("Xác nhận thất bại: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        } catch (e) {
            return dateString;
        }
    };

    return (
        <AdminLayout>
            <div className="container mt-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Quản lý xác nhận tiêm chủng</h2>
                    <button
                        className="btn btn-primary"
                        onClick={fetchPendingVaccinations}
                        disabled={isLoading}
                    >
                        <i className="fas fa-sync-alt me-2"></i>
                        {isLoading ? 'Đang tải...' : 'Làm mới'}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên học sinh</th>
                                            <th>Tên vắc xin</th>
                                            <th>Ngày tiêm</th>
                                            <th>Gửi thông báo</th>
                                            <th>Xác nhận tiêm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVaccinations.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    <i className="fas fa-inbox fa-2x mb-3"></i>
                                                    <br />
                                                    Không có bản ghi nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            pendingVaccinations.map((v, idx) => (
                                                <tr key={v.confirmationId || v.id || idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{v.fullName || v.studentName || v.name || 'N/A'}</td>
                                                    <td>{v.vaccineName || v.vaccine || 'N/A'}</td>
                                                    <td>{formatDate(v.vaccinationDate || v.date || v.scheduledDate)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => handleOpenNotificationModal(v)}
                                                            disabled={isLoading}
                                                        >
                                                            <i className="fas fa-bell me-1"></i>
                                                            Gửi thông báo
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleConfirmVaccination(v.confirmationId || v.id)}
                                                            disabled={isLoading}
                                                        >
                                                            <i className="fas fa-check me-1"></i>
                                                            Xác nhận
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification Modal */}
                {isModalOpen && selectedUser && (
                    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Gửi thông báo tiêm chủng</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseNotificationModal}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn muốn gửi thông báo tiêm chủng cho:</p>
                                    <ul>
                                        <li><strong>Học sinh:</strong> {selectedUser.fullName || selectedUser.studentName}</li>
                                        <li><strong>Vắc xin:</strong> {selectedUser.vaccineName || selectedUser.vaccine}</li>
                                        <li><strong>Ngày tiêm:</strong> {formatDate(selectedUser.vaccinationDate || selectedUser.date)}</li>
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseNotificationModal}>
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSendNotification}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Gửi thông báo
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default VaccineManage;