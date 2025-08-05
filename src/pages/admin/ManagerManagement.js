import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài y tá mẫu)
const sampleManager = [
    // {
    //     id: 1,
    //     name: "Trần Thị B",
    //     managerCode: "YT001",
    //     phone: "0912345678",
    //     email: "yt1@school.edu.vn",
    //     status: "Đang làm việc",
    // },
];

function ManagerManagement() {
    const [search, setSearch] = useState("");
    const [manager] = useState(sampleManager);

    const filteredManager = manager.filter(
        (manager) =>
            manager.name?.toLowerCase().includes(search.toLowerCase()) ||
            manager.managerCode?.toLowerCase().includes(search.toLowerCase()) ||
            manager.phone?.toLowerCase().includes(search.toLowerCase()) ||
            manager.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-nurse me-2"></i> Manager Management
                </h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Thêm người quản lí mới
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
                            placeholder="Tìm kiếm người quản lí..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Tên manager</th>
                                    <th>Mã manager</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManager.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Không có manager nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredManager.map((manager) => (
                                        <tr key={manager.id}>
                                            <td className="fw-bold">{manager.name}</td>
                                            <td>{manager.managerCode}</td>
                                            <td>{manager.phone}</td>
                                            <td>{manager.email}</td>
                                            <td>
                                                {manager.status === "Đang làm việc" ? (
                                                    <span className="badge bg-success">Đang làm việc</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Nghỉ việc</span>
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
                            Showing 1 to {filteredManager.length} of {manager.length} entries
                        </div>
              
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

export default ManagerManagement; 