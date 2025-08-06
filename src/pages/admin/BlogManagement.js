import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "../../services/blogApi";

function BlogManagement() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    // Thêm state cho modal tạo blog
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBlog, setNewBlog] = useState({
        title: "",
        content: "",
        author: "",
        status: "draft"
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editBlog, setEditBlog] = useState({
        title: "",
        content: "",
        author: "",
        status: "draft"
    });

    // Load blogs từ API
    const loadBlogs = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAllBlogs(currentPage, pageSize, search);
            if (response.code === 0) {
                setBlogs(response.result || []);
                setTotalItems(response.totalItems || 0);
                setTotalPages(response.totalPages || 0);
            } else {
                setError(response.message || "Không thể tải danh sách blogs");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlogs();
    }, [currentPage, pageSize, search]);

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewBlog({ title: "", content: "", author: "", status: "draft" });
    };

    const handleOpenEditModal = (blog) => {
        setSelectedBlog(blog);
        setEditBlog({
            title: blog.title || "",
            content: blog.content || "",
            author: blog.author || "",
            status: blog.status || "draft"
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBlog(null);
        setEditBlog({ title: "", content: "", author: "", status: "draft" });
    };

    const handleOpenDeleteModal = (blog) => {
        setSelectedBlog(blog);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedBlog(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createBlog(newBlog);
            if (response.code === 0) {
                handleCloseCreateModal();
                loadBlogs();
                alert("Tạo blog mới thành công!");
            } else {
                setError(response.message || "Không thể tạo blog mới");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateBlog(selectedBlog.documentId, editBlog);
            if (response.code === 0) {
                handleCloseEditModal();
                loadBlogs();
                alert("Cập nhật blog thành công!");
            } else {
                setError(response.message || "Không thể cập nhật blog");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async () => {
        if (!selectedBlog) return;
        setLoading(true);
        try {
            const response = await deleteBlog(selectedBlog.documentId);
            if (response.code === 0) {
                handleCloseDeleteModal();
                loadBlogs();
                alert("Xóa blog thành công!");
            } else {
                setError(response.message || "Không thể xóa blog");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs;

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-blog me-2"></i> Quản lý Blog
                </h2>
                <div className="d-flex gap-2">
                    <a href="/admin/uploadBlog" className="btn btn-success">
                        <i className="fas fa-upload me-2"></i> Upload Blog
                    </a>
                    {/* <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                        <i className="fas fa-plus me-2"></i> Tạo Blog mới
                    </button> */}
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
                                onChange={(e) => setPageSize(Number(e.target.value))}
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
                            placeholder="Tìm kiếm blog..."
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
                                        <th>Tiêu đề</th>
                                        <th>Tác giả</th>
                                        <th>Ngày tạo</th>
                                        <th>Trạng thái</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="fas fa-blog fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không có blog nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBlogs.map((blog) => (
                                            <tr key={blog.documentId}>
                                                <td className="fw-bold">{blog.title}</td>
                                                <td>{blog.author || 'N/A'}</td>
                                                <td>
                                                    {blog.createdAt ?
                                                        new Date(blog.createdAt).toLocaleDateString('vi-VN') :
                                                        'N/A'
                                                    }
                                                </td>
                                                <td>
                                                    {blog.status === "published" ? (
                                                        <span className="badge bg-success">Đã đăng</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">Nháp</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            title="Chỉnh sửa"
                                                            onClick={() => handleOpenEditModal(blog)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Xóa"
                                                            onClick={() => handleOpenDeleteModal(blog)}
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
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                        </div>
                        {/* Pagination */}
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    );
                                })}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Modal tạo blog mới */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleCreateBlog}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo Blog mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label className="form-label">Tiêu đề *</label>
                                                <input type="text" className="form-control" name="title" value={newBlog.title} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Tác giả *</label>
                                                <input type="text" className="form-control" name="author" value={newBlog.author} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung *</label>
                                        <textarea className="form-control" name="content" value={newBlog.content} onChange={handleChange} rows={8} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={newBlog.status} onChange={handleChange}>
                                            <option value="draft">Nháp</option>
                                            <option value="published">Đăng ngay</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa blog */}
            {showEditModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateBlog}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa Blog</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label className="form-label">Tiêu đề *</label>
                                                <input type="text" className="form-control" name="title" value={editBlog.title} onChange={handleEditChange} required />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Tác giả *</label>
                                                <input type="text" className="form-control" name="author" value={editBlog.author} onChange={handleEditChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung *</label>
                                        <textarea className="form-control" name="content" value={editBlog.content} onChange={handleEditChange} rows={8} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={editBlog.status} onChange={handleEditChange}>
                                            <option value="draft">Nháp</option>
                                            <option value="published">Đăng ngay</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xóa blog */}
            {showDeleteModal && selectedBlog && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa blog</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center">
                                    <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                    <h6>Bạn có chắc chắn muốn xóa blog này?</h6>
                                    <p className="text-muted">
                                        <strong>{selectedBlog.title}</strong>
                                        <br />
                                        Tác giả: {selectedBlog.author}
                                        <br />
                                        Ngày tạo: {selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
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
                                    onClick={handleDeleteBlog}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xóa...' : 'Xóa blog'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default BlogManagement;
