import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài feedback mẫu)
const sampleFeedbacks = [
    // {
    //     id: 1,
    //     sender: "Nguyễn Văn A",
    //     content: "Dịch vụ rất tốt!",
    //     date: "2024-06-01",
    //     status: "Chờ xử lý",
    // },
];

function FeedBackManagement() {
    const [search, setSearch] = useState("");
    const [feedbacks] = useState(sampleFeedbacks);

    const filteredFeedbacks = feedbacks.filter(
        (f) =>
            f.sender?.toLowerCase().includes(search.toLowerCase()) ||
            f.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-comment-dots me-2"></i> Feedback Management
                </h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Tạo Feedback mới
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
                            placeholder="Tìm kiếm feedback..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Người gửi</th>
                                    <th>Nội dung</th>
                                    <th>Ngày gửi</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFeedbacks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            Không có feedback nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFeedbacks.map((fb) => (
                                        <tr key={fb.id}>
                                            <td className="fw-bold">{fb.sender}</td>
                                            <td>{fb.content}</td>
                                            <td>{fb.date}</td>
                                            <td>
                                                {fb.status === "Đã xử lý" ? (
                                                    <span className="badge bg-success">Đã xử lý</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">Chờ xử lý</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-info me-2" title="Xem chi tiết">
                                                    <i className="fas fa-eye"></i>
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
                            Showing 1 to {filteredFeedbacks.length} of {feedbacks.length} entries
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

export default FeedBackManagement;
