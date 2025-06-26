import React from "react";

function AdminDashboard() {
    return (
        <div className="admin-dashboard bg-light" style={{ minHeight: "100vh" }}>
            {/* Header */}
            <nav className="navbar navbar-expand navbar-dark bg-gradient px-4 shadow-sm" style={{ background: "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)" }}>
                <a className="navbar-brand fw-bold" href="/dashboard">eSchoolMed Admin</a>
                <div className="ms-auto d-flex align-items-center">
                    <span className="text-white me-3">Xin chào, Admin</span>
                    <a href="/logout" className="btn btn-outline-light btn-sm">Đăng xuất</a>
                </div>
            </nav>

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block sidebar-custom py-4 border-end">
                        <div className="position-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a className="nav-link active" href="/dashboard">
                                        <i className="fas fa-home me-2"></i> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageUsers">
                                        <i className="fas fa-users me-2"></i> Quản lý Users
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageChildren">
                                        <i className="fas fa-child me-2"></i> Quản lý Children
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageBlogs">
                                        <i className="fas fa-blog me-2"></i> Quản lý Blogs
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageConsultationsAdmin">
                                        <i className="fas fa-comments me-2"></i> Quản lý Consultations
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageFeedbacks">
                                        <i className="fas fa-comment-dots me-2"></i> Quản lý Feedbacks
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link" href="/manageTransactions">
                                        <i className="fas fa-money-check-alt me-2"></i> Quản lý Transactions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Main content */}
                    <main className="col-md-10 ms-sm-auto px-md-4 py-4">
                        <h2 className="mb-4 fw-bold text-primary">Bảng điều khiển quản trị</h2>
                        {/* Thẻ thống kê */}
                        <div className="row g-4 mb-4">
                            <div className="col-6 col-lg-3">
                                <div className="card stat-card border-0 shadow h-100">
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
                                <div className="card stat-card border-0 shadow h-100">
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
                                <div className="card stat-card border-0 shadow h-100">
                                    <div className="card-body d-flex align-items-center">
                                        <i className="fas fa-comment-dots fa-2x text-warning me-3"></i>
                                        <div>
                                            <h5 className="card-title mb-1">Feedbacks</h5>
                                            <h3 className="mb-0">12</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="card stat-card border-0 shadow h-100">
                                    <div className="card-body d-flex align-items-center">
                                        <i className="fas fa-money-check-alt fa-2x text-danger me-3"></i>
                                        <div>
                                            <h5 className="card-title mb-1">Transactions</h5>
                                            <h3 className="mb-0">8</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Khu vực biểu đồ hoặc bảng dữ liệu */}
                        <div className="card mb-4 shadow border-0 rounded-4">
                            <div className="card-header bg-white fw-bold">Biểu đồ thống kê (Demo)</div>
                            <div className="card-body">
                                <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center text-muted">
                                    (Chèn biểu đồ ở đây)
                                </div>
                            </div>
                        </div>

                        {/* Khu vực bảng dữ liệu */}
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-header bg-white fw-bold">Bảng dữ liệu gần đây (Demo)</div>
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
                    </main>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;