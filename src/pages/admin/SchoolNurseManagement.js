import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
    getAllNurses,
    createNurse,
    updateNurse,
    deleteNurse
} from "../../services/nurseApi";

function SchoolNurseManagement() {
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState(null);
    const [nurseData, setNurseData] = useState({
        fullName: "",
        email: "",
        phone: "",
        specialization: ""
    });

    const loadNurses = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAllNurses();
            if (response.code === 0) {
                setNurses(response.result || []);
            } else {
                setError(response.message || "Không thể tải danh sách y tá");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNurses();
    }, []);

    const handleOpenCreateModal = () => {
        setNurseData({
            fullName: "",
            email: "",
            phone: "",
            specialization: ""
        });
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNurseData({
            fullName: "",
            email: "",
            phone: "",
            specialization: ""
        });
    };

    const handleOpenEditModal = (nurse) => {
        setSelectedNurse(nurse);
        setNurseData({
            nurseId: nurse.nurseId,
            fullName: nurse.fullName || "",
            email: nurse.email || "",
            phone: nurse.phone || "",
            specialization: nurse.specialization || ""
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedNurse(null);
        setNurseData({
            fullName: "",
            email: "",
            phone: "",
            specialization: ""
        });
    };

    const handleOpenDeleteModal = (nurse) => {
        setSelectedNurse(nurse);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedNurse(null);
    };

    const handleNurseChange = (e) => {
        const { name, value } = e.target;
        setNurseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateNurse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createNurse(nurseData);
            if (response.code === 0) {
                handleCloseCreateModal();
                loadNurses();
                alert("Tạo y tá mới thành công!");
            } else {
                setError(response.message || "Không thể tạo y tá mới");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateNurse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateNurse(nurseData);
            if (response.code === 0) {
                handleCloseEditModal();
                loadNurses();
                alert("Cập nhật thông tin y tá thành công!");
            } else {
                setError(response.message || "Không thể cập nhật thông tin y tá");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNurse = async () => {
        if (!selectedNurse) return;
        setLoading(true);
        try {
            const response = await deleteNurse(selectedNurse.nurseId);
            if (response.code === 0) {
                handleCloseDeleteModal();
                loadNurses();
                alert("Xóa y tá thành công!");
            } else {
                setError(response.message || "Không thể xóa y tá");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredNurses = nurses.filter(nurse =>
        nurse.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.phone?.includes(searchTerm) ||
        nurse.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-nurse me-2"></i> Quản lý Y tá
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleOpenCreateModal}>
                        <i className="fas fa-plus me-2"></i> Thêm y tá mới
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

            {/* Search and Filter */}
            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <label className="form-label">Tìm kiếm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên, email, số điện thoại hoặc chuyên môn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <div className="text-muted">
                                Tìm thấy {filteredNurses.length} y tá
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nurses List */}
            <div className="card shadow border-0">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="fas fa-list me-2"></i>
                        Danh sách y tá
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
                                        <th>Y tá</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Chuyên môn</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNurses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="fas fa-user-nurse fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không tìm thấy y tá nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNurses.map((nurse) => (
                                            <tr key={nurse.nurseId}>
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
                                                            {nurse.fullName?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{nurse.fullName}</div>
                                                            <small className="text-muted">ID: {nurse.nurseId}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href={`mailto:${nurse.email}`} className="text-decoration-none">
                                                        {nurse.email}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href={`tel:${nurse.phone}`} className="text-decoration-none">
                                                        {nurse.phone}
                                                    </a>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">{nurse.specialization}</span>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            title="Chỉnh sửa"
                                                            onClick={() => handleOpenEditModal(nurse)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Xóa"
                                                            onClick={() => handleOpenDeleteModal(nurse)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
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

            {/* Create Nurse Modal */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateNurse}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm y tá mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Họ và tên *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={nurseData.fullName}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={nurseData.email}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={nurseData.phone}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Chuyên môn *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="specialization"
                                            value={nurseData.specialization}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo y tá'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Nurse Modal */}
            {showEditModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateNurse}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa thông tin y tá</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Họ và tên *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={nurseData.fullName}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={nurseData.email}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={nurseData.phone}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Chuyên môn *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="specialization"
                                            value={nurseData.specialization}
                                            onChange={handleNurseChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedNurse && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa y tá</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center">
                                    <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                    <h6>Bạn có chắc chắn muốn xóa y tá này?</h6>
                                    <p className="text-muted">
                                        <strong>{selectedNurse.fullName}</strong>
                                        <br />
                                        Email: {selectedNurse.email}
                                        <br />
                                        Số điện thoại: {selectedNurse.phone}
                                    </p>
                                    <div className="alert alert-warning">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Hành động này không thể hoàn tác!
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteNurse}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xóa...' : 'Xóa y tá'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default SchoolNurseManagement; 