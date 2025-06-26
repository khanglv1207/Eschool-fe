import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

const sampleUsers = [
    // Đã xóa dữ liệu mẫu, mảng này hiện rỗng
];

const roleBadge = (role) => {
    switch (role) {
        case "ADMIN":
            return <span className="badge bg-danger">ADMIN</span>;
        case "DOCTOR":
            return <span className="badge bg-warning text-dark">DOCTOR</span>;
        case "MEMBER":
            return <span className="badge bg-success">MEMBER</span>;
        default:
            return <span className="badge bg-secondary">UNKNOWN</span>;
    }
};

function UserManagement() {
    const [search, setSearch] = useState("");
    const [users] = useState(sampleUsers);

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-users me-2"></i> User Management
                </h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Create New User
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
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Payment Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.username}>
                                            <td className="fw-bold">{user.username}</td>
                                            <td>{roleBadge(user.role)}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                {user.paymentStatus === "Paid" ? (
                                                    <span className="badge bg-success">Paid</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Unpaid</span>
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
                            Showing 1 to {filteredUsers.length} of {users.length} entries
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

export default UserManagement;
