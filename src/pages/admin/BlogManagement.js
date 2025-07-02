import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài blog mẫu)
const sampleBlogs = [
    // {
    //     id: 1,
    //     title: "Blog đầu tiên",
    //     author: "Admin",
    //     date: "2024-06-01",
    //     status: "Đã đăng",
    // },
];

function BlogManagement() {
    const [search, setSearch] = useState("");
    const [blogs] = useState(sampleBlogs);
    // Thêm state cho modal tạo blog
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBlog, setNewBlog] = useState({
        title: "",
        author: "",
        date: "",
        status: "Nháp",
        content: "",
        image: null,
        imagePreview: null
    });

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewBlog({ title: "", author: "", date: "", status: "Nháp", content: "", image: null, imagePreview: null });
    };
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
    const handleCreateBlog = (e) => {
        e.preventDefault();
        // Chưa xử lý lưu, chỉ đóng modal
        handleCloseCreateModal();
    };

    const filteredBlogs = blogs.filter(
        (b) =>
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-blog me-2"></i> Blog Management
                </h2>
                <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                    <i className="fas fa-plus me-2"></i> Tạo Blog mới
                </button>
            </div>
            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <select className="form-select d-inline-block w-auto me-2">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
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
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Tiêu đề</th>
                                    <th>Tác giả</th>
                                    <th>Ngày đăng</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            Không có blog nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBlogs.map((blog) => (
                                        <tr key={blog.id}>
                                            <td className="fw-bold">{blog.title}</td>
                                            <td>{blog.author}</td>
                                            <td>{blog.date}</td>
                                            <td>
                                                {blog.status === "Đã đăng" ? (
                                                    <span className="badge bg-success">Đã đăng</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Nháp</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2" title="Chỉnh sửa">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" title="Xóa">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            Showing 1 to {filteredBlogs.length} of {blogs.length} entries
                        </div>
                        {/* Phân trang demo */}
                        <nav>
                            <ul className="pagination mb-0">
                                <li className="page-item disabled">
                                    <span className="page-link">Previous</span>
                                </li>
                                <li className="page-item active">
                                    <span className="page-link">1</span>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">Next</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Modal tạo blog mới */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateBlog}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo Blog mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tiêu đề</label>
                                        <input type="text" className="form-control" name="title" value={newBlog.title} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tác giả</label>
                                        <input type="text" className="form-control" name="author" value={newBlog.author} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày đăng</label>
                                        <input type="date" className="form-control" name="date" value={newBlog.date} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={newBlog.status} onChange={handleChange} required>
                                            <option value="Nháp">Nháp</option>
                                            <option value="Đã đăng">Đã đăng</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung</label>
                                        <textarea className="form-control" name="content" value={newBlog.content} onChange={handleChange} rows={4} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
                                        {newBlog.imagePreview && (
                                            <img src={newBlog.imagePreview} alt="Preview" style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }} />
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default BlogManagement;
