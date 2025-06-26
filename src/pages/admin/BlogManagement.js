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
                <button className="btn btn-primary">
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
        </AdminLayout>
    );
}

export default BlogManagement;
