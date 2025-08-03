import React, { useEffect, useState } from "react";
import { getPendingVaccinations, sendNotification, confirmVaccination } from "../../services/adminApi"; // Adjust the import path as necessary
import AdminLayout from "./AdminLayout";

function VaccineManage() {
    const [pendingVaccinations, setPendingVaccinations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPendingVaccinations = async () => {
        setIsLoading(true);
        try {
            const result = await getPendingVaccinations();
            setPendingVaccinations(result.result || []);
        } catch (error) {
            console.error("Failed to fetch pending vaccinations:", error);
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
            await sendNotification(selectedUser.accountId);
            alert("Notification sent successfully.");
            handleCloseNotificationModal();
        } catch (error) {
            console.error("Failed to send notification:", error);
            alert("Failed to send notification.");
        }
    };

    const handleConfirmVaccination = async (confirmationId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xác nhận đã tiêm?")) return;

        try {
            await confirmVaccination(confirmationId);
            alert("Xác nhận tiêm thành công.");
            fetchPendingVaccinations();
        } catch (error) {
            console.error("Lỗi khi xác nhận tiêm:", error);
            alert("Xác nhận thất bại.");
        }
    };

    return (
        <AdminLayout>
            <div className="container mt-3">
                <h2 className="mb-4 text-center">Quản lý xác nhận tiêm chủng</h2>
                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
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
                                    <td colSpan="6">Không có bản ghi nào.</td>
                                </tr>
                            ) : (
                                pendingVaccinations.map((v, idx) => (
                                    <tr key={v.confirmationId}>
                                        <td>{idx + 1}</td>
                                        <td>{v.fullName}</td>
                                        <td>{v.vaccineName}</td>
                                        <td>{new Date(v.vaccinationDate).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handleOpenNotificationModal(v)}
                                            >
                                                Gửi thông báo
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleConfirmVaccination(v.confirmationId)}
                                            >
                                                Xác nhận
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {isModalOpen && selectedUser && (
                    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow-lg">
                                <div className="modal-header">
                                    <h5 className="modal-title">Gửi thông báo</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={handleCloseNotificationModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Bạn có chắc chắn muốn gửi thông báo cho học sinh:{" "}
                                        <strong>{selectedUser.fullName}</strong>?
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={handleCloseNotificationModal}>
                                        Hủy
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSendNotification}>
                                        Gửi
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