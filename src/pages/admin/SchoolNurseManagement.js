import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
    getAllSchoolNurses,
    createSchoolNurse,
    updateSchoolNurse,
    deleteSchoolNurse
} from "../../services/adminApi";

function SchoolNurseManagement() {
    const [search, setSearch] = useState("");
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState(null);
    const [newNurse, setNewNurse] = useState({
        fullName: "",
        email: "",
        phone: "",
        specialization: ""
    });

    // Load nurses
    const loadNurses = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAllSchoolNurses();
            if (response.code === 0) {
                setNurses(response.result || []);
                const total = response.result?.length || 0;
                setTotalItems(total);
                setTotalPages(Math.ceil(total / pageSize));
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
    }, [currentPage, pageSize]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadNurses();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Modal handlers
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
        setNewNurse({ fullName: "", email: "", phone: "", specialization: "" });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewNurse({ fullName: "", email: "", phone: "", specialization: "" });
    };

    const handleOpenEditModal = (nurse) => {
        setSelectedNurse(nurse);
        setNewNurse({
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
        setNewNurse({ fullName: "", email: "", phone: "", specialization: "" });
    };

    const handleOpenDeleteModal = (nurse) => {
        setSelectedNurse(nurse);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedNurse(null);
    };

    // Form handlers
    const handleChange = (e) => {
        setNewNurse({ ...newNurse, [e.target.name]: e.target.value });
    };

    // Create nurse
    const handleCreateNurse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createSchoolNurse(newNurse);
            if (response.code === 0) {
                handleCloseCreateModal();
                loadNurses();
            } else {
                setError(response.message || "Không thể tạo y tá mới");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update nurse
    const handleUpdateNurse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateSchoolNurse(newNurse);
            if (response.code === 0) {
                handleCloseEditModal();
                loadNurses();
            } else {
                setError(response.message || "Không thể cập nhật y tá");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete nurse
    const handleDeleteNurse = async () => {
        setLoading(true);
        try {
            const response = await deleteSchoolNurse(selectedNurse.nurseId);
            if (response.code === 0) {
                handleCloseDeleteModal();
                loadNurses();
            } else {
                setError(response.message || "Không thể xóa y tá");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // Filter nurses based on search
    const filteredNurses = nurses.filter(
        (nurse) =>
            nurse.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            nurse.email?.toLowerCase().includes(search.toLowerCase()) ||
            nurse.phone?.toLowerCase().includes(search.toLowerCase()) ||
            nurse.specialization?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-nurse me-2"></i> Quản lý Y tá Trường học
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleOpenCreateModal}>
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

            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <select
                                className="form-select d-inline-block w-auto me-2"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            entries per page
                        </div>
                        <input
                            type="text"
                            className="form-control w-auto"
                            placeholder="Tìm kiếm y tá..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>

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
                                        <th>Họ và tên</th>
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
                                                Không có y tá nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNurses.map((nurse) => (
                                            <tr key={nurse.nurseId}>
                                                <td className="fw-bold">
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
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
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
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                            </div>
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
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
                                            value={newNurse.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={newNurse.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={newNurse.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Chuyên môn *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="specialization"
                                            value={newNurse.specialization}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo y tá'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
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
                                            value={newNurse.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={newNurse.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={newNurse.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Chuyên môn *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="specialization"
                                            value={newNurse.specialization}
                                            onChange={handleChange}
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
            {showDeleteModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa y tá "<strong>{selectedNurse?.fullName}</strong>"?</p>
                                <p className="text-danger">Hành động này không thể hoàn tác.</p>
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
                                    {loading ? 'Đang xóa...' : 'Xóa'}
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