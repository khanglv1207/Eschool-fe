import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";

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
    const [users, setUsers] = useState(sampleUsers);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        role: "MEMBER",
        password: ""
    });
    const fileInputRef = React.useRef();

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewUser({ username: "", fullName: "", email: "", phone: "", role: "MEMBER", password: "" });
    };
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };
    const handleCreateUser = (e) => {
        e.preventDefault();
        handleCloseCreateModal();
    };

    // Hàm xử lý import Excel
    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // data[0] là header, data.slice(1) là dữ liệu
            const header = data[0];
            const usersFromExcel = data.slice(1).map((row) => {
                const user = {};
                header.forEach((key, idx) => {
                    user[key] = row[idx] || "";
                });
                // Đảm bảo các trường cần thiết
                return {
                    username: user.username || user.Username || "",
                    fullName: user.fullName || user["Full Name"] || "",
                    email: user.email || user.Email || "",
                    phone: user.phone || user.Phone || "",
                    role: user.role || user.Role || "MEMBER",
                    password: user.password || user.Password || ""
                };
            });
            setUsers((prev) => [...prev, ...usersFromExcel]);
        };
        reader.readAsBinaryString(file);
    };
    const handleClickImport = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

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
                <div>
                    <button className="btn btn-success me-2" onClick={handleClickImport}>
                        <i className="fas fa-file-import me-2"></i> Import từ Excel
                    </button>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImportExcel}
                    />
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
                                    <th>Username</th>
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
                                        <tr key={user.username}>
                                            <td className="fw-bold">{user.username}</td>
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
                                    <h5 className="modal-title">Tạo người dùng mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    {/* <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control" name="username" value={newUser.username} onChange={handleChange} required />
                                    </div> */}
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name="fullName" value={newUser.fullName} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={newUser.email} onChange={handleChange} required />
                                    </div>
                                    {/* <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input type="text" className="form-control" name="phone" value={newUser.phone} onChange={handleChange} required />
                                    </div> */}
                                    {/* <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select className="form-select" name="role" value={newUser.role} onChange={handleChange} required>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="DOCTOR">SCHOOLNURSE</option>
                                            <option value="MEMBER">MEMBER</option>
                                        </select>
                                    </div> */}
                                    {/* <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" name="password" value={newUser.password} onChange={handleChange} required />
                                    </div> */}
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

export default UserManagement;
