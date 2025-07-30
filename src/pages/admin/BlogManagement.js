import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    changeBlogStatus
} from "../../services/blogApi";

function BlogManagement() {
    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState([]);
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
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [newBlog, setNewBlog] = useState({
        title: "",
        content: "",
        image: null,
        imagePreview: null
    });

    // Load blogs
    const loadBlogs = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAllBlogs(currentPage, pageSize, search);
            if (response.code === 0) {
                setBlogs(response.result || []);
                // Tính toán pagination dựa trên số lượng items
                const total = response.result?.length || 0;
                setTotalItems(total);
                setTotalPages(Math.ceil(total / pageSize));
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

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadBlogs();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Modal handlers
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
        setNewBlog({ title: "", content: "", image: null, imagePreview: null });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewBlog({ title: "", content: "", image: null, imagePreview: null });
    };

    const handleOpenEditModal = (blog) => {
        setSelectedBlog(blog);
        setNewBlog({
            title: blog.title || "",
            content: blog.content || "",
            image: null,
            imagePreview: null
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBlog(null);
        setNewBlog({ title: "", content: "", image: null, imagePreview: null });
    };

    const handleOpenDeleteModal = (blog) => {
        setSelectedBlog(blog);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedBlog(null);
    };

    // Form handlers
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setNewBlog((prev) => ({
                ...prev,
                image: file,
                imagePreview: file ? URL.createObjectURL(file) : null
            }));
        } else {
            setNewBlog((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Create blog
    const handleCreateBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('content', newBlog.content);
            if (newBlog.image) {
                formData.append('image', newBlog.image);
            }

            const response = await createBlog(formData);
            if (response.code === 0) {
                handleCloseCreateModal();
                loadBlogs();
            } else {
                setError(response.message || "Không thể tạo blog");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update blog
    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('content', newBlog.content);
            if (newBlog.image) {
                formData.append('image', newBlog.image);
            }

            const response = await updateBlog(selectedBlog.documentId, formData);
            if (response.code === 0) {
                handleCloseEditModal();
                loadBlogs();
            } else {
                setError(response.message || "Không thể cập nhật blog");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete blog
    const handleDeleteBlog = async () => {
        setLoading(true);
        try {
            const response = await deleteBlog(selectedBlog.documentId);
            if (response.code === 0) {
                handleCloseDeleteModal();
                loadBlogs();
            } else {
                setError(response.message || "Không thể xóa blog");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle blog status
    const handleToggleStatus = async (blogId, currentStatus) => {
        try {
            const newStatus = currentStatus === "published" ? "draft" : "published";
            const response = await changeBlogStatus(blogId, newStatus);
            if (response.code === 0) {
                loadBlogs();
            } else {
                setError(response.message || "Không thể thay đổi trạng thái blog");
            }
        } catch (err) {
            setError(err.message);
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

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-blog me-2"></i> Quản lý Blog
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                        <i className="fas fa-plus me-2"></i> Tạo Blog mới
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
                                        <th>Nội dung</th>
                                        <th>Ngày tạo</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="fas fa-inbox fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không có blog nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        blogs.map((blog) => (
                                            <tr key={blog.documentId}>
                                                <td className="fw-bold">
                                                    <div className="d-flex align-items-center">
                                                        {blog.image && (
                                                            <img
                                                                src={blog.image}
                                                                alt={blog.title}
                                                                className="me-2"
                                                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="fw-bold">{blog.title}</div>
                                                            <small className="text-muted">ID: {blog.documentId}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: 200 }}>
                                                        {blog.content}
                                                    </div>
                                                </td>
                                                <td>
                                                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success">Đã đăng</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
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
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleCreateBlog}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo Blog mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tiêu đề *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={newBlog.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung *</label>
                                        <textarea
                                            className="form-control"
                                            name="content"
                                            value={newBlog.content}
                                            onChange={handleChange}
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {newBlog.imagePreview && (
                                            <img
                                                src={newBlog.imagePreview}
                                                alt="Preview"
                                                style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo Blog'}
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
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateBlog}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa Blog</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tiêu đề *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={newBlog.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung *</label>
                                        <textarea
                                            className="form-control"
                                            name="content"
                                            value={newBlog.content}
                                            onChange={handleChange}
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh mới (tùy chọn)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {newBlog.imagePreview && (
                                            <img
                                                src={newBlog.imagePreview}
                                                alt="Preview"
                                                style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }}
                                            />
                                        )}
                                        {selectedBlog?.image && !newBlog.imagePreview && (
                                            <div className="mt-2">
                                                <small className="text-muted">Ảnh hiện tại:</small>
                                                <img
                                                    src={selectedBlog.image}
                                                    alt="Current"
                                                    style={{ maxWidth: 200, marginTop: 5, borderRadius: 8 }}
                                                />
                                            </div>
                                        )}
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
                                <p>Bạn có chắc chắn muốn xóa blog "<strong>{selectedBlog?.title}</strong>"?</p>
                                <p className="text-danger">Hành động này không thể hoàn tác.</p>
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

export default BlogManagement;
