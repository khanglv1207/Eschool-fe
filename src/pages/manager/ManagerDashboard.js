import React from "react";
import ManagerLayout from "./ManagerLayout";

function ManagerDashboard() {
    return (
        <ManagerLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="fw-bold text-primary text-center mb-4" style={{ letterSpacing: 1 }}>
                            Bảng điều khiển quản lý
                        </h2>
                    </div>
                </div>
                {/* Thẻ thống kê */}
                <div className="row g-4 mb-4 justify-content-center">
                    <div className="col-6 col-lg-3">
                        <div className="card stat-card border-0 shadow rounded-4 h-100">
                            <div className="card-body d-flex align-items-center">
                                <i className="fas fa-users fa-2x text-primary me-3"></i>
                                <div>
                                    <h5 className="card-title mb-1">Người dùng</h5>
                                    <h3 className="mb-0">123</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className="card stat-card border-0 shadow rounded-4 h-100">
                            <div className="card-body d-flex align-items-center">
                                <i className="fas fa-blog fa-2x text-success me-3"></i>
                                <div>
                                    <h5 className="card-title mb-1">Blogs</h5>
                                    <h3 className="mb-0">45</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className="card stat-card border-0 shadow rounded-4 h-100">
                            <div className="card-body d-flex align-items-center">
                                <i className="fas fa-comment-dots fa-2x text-warning me-3"></i>
                                <div>
                                    <h5 className="card-title mb-1">Feedbacks</h5>
                                    <h3 className="mb-0">12</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Khu vực biểu đồ hoặc bảng dữ liệu */}
                <div className="card mb-4 shadow border-0 rounded-4">
                    <div className="card-header bg-white fw-bold text-primary">Biểu đồ thống kê (Demo)</div>
                    <div className="card-body">
                        <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center text-muted">
                            (Chèn biểu đồ ở đây)
                        </div>
                    </div>
                </div>

                {/* Khu vực bảng dữ liệu */}
                <div className="card shadow border-0 rounded-4">
                    <div className="card-header bg-white fw-bold text-primary">Bảng dữ liệu gần đây (Demo)</div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên</th>
                                        <th>Loại</th>
                                        <th>Ngày</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>User</td>
                                        <td>2024-06-01</td>
                                        <td><span className="badge bg-success">Hoạt động</span></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Blog số 1</td>
                                        <td>Blog</td>
                                        <td>2024-05-28</td>
                                        <td><span className="badge bg-info">Đã đăng</span></td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Phản hồi 1</td>
                                        <td>Feedback</td>
                                        <td>2024-05-25</td>
                                        <td><span className="badge bg-warning text-dark">Chờ xử lý</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}

export default ManagerDashboard;
