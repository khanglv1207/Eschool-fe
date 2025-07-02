import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài y tá mẫu)
const sampleNurses = [
    // {
    //     id: 1,
    //     name: "Trần Thị B",
    //     nurseCode: "YT001",
    //     phone: "0912345678",
    //     email: "yt1@school.edu.vn",
    //     status: "Đang làm việc",
    // },
];

function SchoolNurseManagement() {
    const [search, setSearch] = useState("");
    const [nurses, setNurses] = useState(sampleNurses);
    // Thêm state cho modal tạo y tá
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNurse, setNewNurse] = useState({
        name: "",
        nurseCode: "",
        phone: "",
        email: "",
        status: "Đang làm việc"
    });
    const fileInputRef = React.useRef();

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
            const nursesFromExcel = data.slice(1).map((row) => {
                const nurse = {};
                header.forEach((key, idx) => {
                    nurse[key] = row[idx] || "";
                });
                // Đảm bảo các trường cần thiết
                return {
                    name: nurse.name || nurse["Tên y tá"] || nurse.Name || "",
                    nurseCode: nurse.nurseCode || nurse["Mã y tá"] || nurse.Code || "",
                    phone: nurse.phone || nurse["Số điện thoại"] || nurse.Phone || "",
                    email: nurse.email || nurse["Email"] || nurse.Email || "",
                    status: nurse.status || nurse["Trạng thái"] || nurse.Status || "Đang làm việc"
                };
            });
            setNurses((prev) => [...prev, ...nursesFromExcel]);
        };
        reader.readAsBinaryString(file);
    };
    const handleClickImport = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewNurse({ name: "", nurseCode: "", phone: "", email: "", status: "Đang làm việc" });
    };
    const handleChange = (e) => {
        setNewNurse({ ...newNurse, [e.target.name]: e.target.value });
    };
    const handleCreateNurse = (e) => {
        e.preventDefault();
        // Chưa xử lý lưu, chỉ đóng modal
        handleCloseCreateModal();
    };

    const filteredNurses = nurses.filter(
        (n) =>
            n.name?.toLowerCase().includes(search.toLowerCase()) ||
            n.nurseCode?.toLowerCase().includes(search.toLowerCase()) ||
            n.phone?.toLowerCase().includes(search.toLowerCase()) ||
            n.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-nurse me-2"></i> School Nurse Management
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
                        <i className="fas fa-plus me-2"></i> Thêm y tá mới
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
                            placeholder="Tìm kiếm y tá..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Tên y tá</th>
                                    <th>Mã y tá</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNurses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Không có y tá nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNurses.map((nurse) => (
                                        <tr key={nurse.id}>
                                            <td className="fw-bold">{nurse.name}</td>
                                            <td>{nurse.nurseCode}</td>
                                            <td>{nurse.phone}</td>
                                            <td>{nurse.email}</td>
                                            <td>
                                                {nurse.status === "Đang làm việc" ? (
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
                            Showing 1 to {filteredNurses.length} of {nurses.length} entries
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
            {/* Modal tạo y tá mới */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateNurse}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm y tá mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tên y tá</label>
                                        <input type="text" className="form-control" name="name" value={newNurse.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mã y tá</label>
                                        <input type="text" className="form-control" name="nurseCode" value={newNurse.nurseCode} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại</label>
                                        <input type="text" className="form-control" name="phone" value={newNurse.phone} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={newNurse.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={newNurse.status} onChange={handleChange} required>
                                            <option value="Đang làm việc">Đang làm việc</option>
                                            <option value="Nghỉ việc">Nghỉ việc</option>
                                        </select>
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

export default SchoolNurseManagement; 