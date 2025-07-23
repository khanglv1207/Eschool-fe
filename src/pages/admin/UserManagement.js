import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";
import { getAllUsers, createParent } from "../../services/adminApi";

const sampleUsers = [
    // Đã xóa dữ liệu mẫu, mảng này hiện rỗng
];

const roleBadge = (role) => {
    switch (role?.toLowerCase()) {
        case "admin":
            return <span className="badge bg-danger">ADMIN</span>;
        case "parent":
            return <span className="badge bg-success">PARENT</span>;
        // case "doctor":
        case "schoolnurse":
            return <span className="badge bg-warning text-dark">SCHOOL NURSE</span>;
        default:
            return <span className="badge bg-secondary">{role?.toUpperCase() || "UNKNOWN"}</span>;
    }
};

function UserManagement() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(sampleUsers);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: "",
        email: ""
    });
    const fileInputRef = React.useRef();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(); // data là mảng user
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                alert(error.message || "Lỗi khi lấy danh sách user");
            }
        };
        fetchUsers();
    }, []);

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewUser({ fullName: "", email: "" });
    };
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createParent({ email: newUser.email, fullName: newUser.fullName });
            // Refresh danh sách user sau khi tạo thành công
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
            alert("Tạo user thành công!");
            handleCloseCreateModal();
        } catch (error) {
            alert(error.message || "Lỗi khi tạo user");
        }
    };

    // Hàm xử lý import Excel
    // Xóa hàm handleImportExcel và handleClickImport

    const filteredUsers = users.filter(
        (u) =>
            (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
            (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-users me-2"></i> User Management
                </h2>
                <div>
                    {/* Đã xóa nút Import từ Excel */}
                    <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                        <i className="fas fa-plus me-2"></i> Create New User
                    </button>
                </div>
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
                                    <th>id</th>
                                    <th>Role</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    {/* <th>Payment Status</th> */}
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
                                        <tr key={user.id}>
                                            <td className="fw-bold">{user.id}</td>
                                            <td>{roleBadge(user.role)}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            {/* <td>
                                                {user.paymentStatus === "Paid" ? (
                                                    <span className="badge bg-success">Paid</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Unpaid</span>
                                                )}
                                            </td> */}
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
            {/* Modal tạo user mới */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateUser}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo user mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Họ tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={newUser.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={newUser.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">Tạo user</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default UserManagement;
