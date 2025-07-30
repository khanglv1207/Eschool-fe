import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { getAllUsers, createParent, updateUser, deleteUser } from "../../services/adminApi";

const roleBadge = (role) => {
    switch (role?.toLowerCase()) {
        case "admin":
            return <span className="badge bg-danger">ADMIN</span>;
        case "parent":
            return <span className="badge bg-success">PARENT</span>;
        case "schoolnurse":
            return <span className="badge bg-warning text-dark">SCHOOL NURSE</span>;
        default:
            return <span className="badge bg-secondary">{role?.toUpperCase() || "UNKNOWN"}</span>;
    }
};

function UserManagement() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
    });

    const [editUser, setEditUser] = useState({
        fullName: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("Failed to fetch users. Please try again later.");
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
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUser.fullName.trim() || !newUser.email.trim()) {
            alert("Please fill in all fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            alert("Invalid email format.");
            return;
        }
        try {
            await createParent({ email: newUser.email, fullName: newUser.fullName });
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
            alert("User created successfully!");
            handleCloseCreateModal();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user. Please try again.");
        }
    };

    const handleOpenEditModal = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setEditUser({ fullName: "", email: "", role: "" });
        setShowEditModal(false);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editUser);
            setUsers((prev) =>
                prev.map((u) => (u.id === editUser.id || u._id === editUser._id ? { ...editUser } : u))
            );
            alert("Cập nhật thành công!");
            handleCloseEditModal();
        } catch (error) {
            alert(error.message || "Lỗi khi cập nhật người dùng");
        }
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedUser(null);
        setShowDeleteModal(false);
    };

    const handleDeleteUser = async () => {
        if (selectedUser) {
            try {
                await deleteUser(selectedUser.id);
                const data = await getAllUsers();
                setUsers(Array.isArray(data) ? data : []);
                alert("User deleted successfully!");
                handleCloseDeleteModal();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
                (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
        );
    }, [users, search]);

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-users me-2"></i> User Management
                </h2>
                <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                    <i className="fas fa-plus me-2"></i> Create New User
                </button>
            </div>

            <div className="card shadow border-0 mb-4">
                <div className="card-body">
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
                                <th>ID</th>
                                <th>Role</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
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
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                title="Edit"
                                                onClick={() => handleOpenEditModal(user)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete"
                                                onClick={() => handleOpenDeleteModal(user)}
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
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Showing {filteredUsers.length} of {users.length} entries
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateUser}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Create New User</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
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
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create User
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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateUser}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit User</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={editUser.fullName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={editUser.email}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            name="role"
                                            value={editUser.role}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="parent">Parent</option>
                                            <option value="schoolnurse">School Nurse</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedUser && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete the user "{selectedUser.fullName}" with email "{selectedUser.email}"?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default UserManagement;
