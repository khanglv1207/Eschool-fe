import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài học sinh mẫu)
const sampleStudents = [
    // {
    //     studentCode: "HS001",
    //     studentName: "Nguyễn Văn A",
    //     classNmae: "1A",
    //     studentDob: "2015-09-01",
    //     gender: "Nam",
    //     parentCode: "PH001",
    //     parentName: "Nguyễn Văn B",
    //     parentEmail: "parent@gmail.com",
    //     parentPhone: "0912345678",
    //     parentDob: "1980-01-01",
    //     parentAddress: "Hà Nội",
    //     relationship: "Bố",
    //     status: "Đang học"
    // },
];

function StudentManagement() {
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState(sampleStudents);
    // Thêm state cho modal tạo học sinh
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        studentCode: "",
        studentName: "",
        classNmae: "",
        studentDob: "",
        gender: "",
        parentCode: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        parentDob: "",
        parentAddress: "",
        relationship: "",
        status: "",

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
            const studentsFromExcel = data.slice(1).map((row) => {
                const student = {};
                header.forEach((key, idx) => {
                    student[key] = row[idx] || "";
                });
                // Đảm bảo các trường cần thiết
                return {
                    studentCode: student.studentCode || student["Mã học sinh"] || student.Code || "",
                    studentName: student.studentName || student["Tên học sinh"] || student.Name || "",
                    classNmae: student.classNmae || student["Lớp"] || student.Class || "",
                    studentDob: student.studentDob || student["Ngày sinh"] || student.DOB || "",
                    gender: student.gender || student["Giới tính"] || student.Gender || "Nam",
                    parentCode: student.parentCode || student["Mã phụ huynh"] || student.ParentCode || "",
                    parentName: student.parentName || student["Tên phụ huynh"] || student.ParentName || "",
                    parentEmail: student.parentEmail || student["Email phụ huynh"] || student.ParentEmail || "",
                    parentPhone: student.parentPhone || student["SĐT phụ huynh"] || student.ParentPhone || "",
                    parentDob: student.parentDob || student["Ngày sinh phụ huynh"] || student.ParentDOB || "",
                    parentAddress: student.parentAddress || student["Địa chỉ phụ huynh"] || student.ParentAddress || "",
                    relationship: student.relationship || student["Quan hệ"] || student.ParentRelationship || "Bố",
                    status: student.status || student["Trạng thái"] || student.Status || "Đang học"
                };
            });
            setStudents((prev) => [...prev, ...studentsFromExcel]);
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
        setNewStudent({
            studentCode: "",
            studentName: "",
            classNmae: "",
            studentDob: "",
            gender: "Nam",
            parentCode: "",
            parentName: "",
            parentEmail: "",
            parentPhone: "",
            parentDob: "",
            parentAddress: "",
            relationship: "Bố",
            status: "Đang học"
        });
    };
    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };
    const handleCreateStudent = (e) => {
        e.preventDefault();
        // Chưa xử lý lưu, chỉ đóng modal
        handleCloseCreateModal();
    };

    const filteredStudents = students.filter(
        (s) =>
            s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
            s.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
            s.classNmae?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-child me-2"></i> Student Management
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
                        <i className="fas fa-plus me-2"></i> Thêm học sinh mới
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
                            placeholder="Tìm kiếm học sinh..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Mã học sinh</th>
                                    <th>Tên học sinh</th>
                                    <th>Lớp</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Mã phụ huynh</th>
                                    <th>Tên phụ huynh</th>
                                    <th>Email phụ huynh</th>
                                    <th>SĐT phụ huynh</th>
                                    <th>Ngày sinh phụ huynh</th>
                                    <th>Địa chỉ phụ huynh</th>
                                    <th>Quan hệ</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="14" className="text-center text-muted">
                                            Không có học sinh nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, idx) => (
                                        <tr key={idx}>
                                            <td>{student.studentCode}</td>
                                            <td className="fw-bold">{student.studentName}</td>
                                            <td>{student.classNmae}</td>
                                            <td>{student.studentDob}</td>
                                            <td>{student.gender}</td>
                                            <td>{student.parentCode}</td>
                                            <td>{student.parentName}</td>
                                            <td>{student.parentEmail}</td>
                                            <td>{student.parentPhone}</td>
                                            <td>{student.parentDob}</td>
                                            <td>{student.parentAddress}</td>
                                            <td>{student.relationship}</td>
                                            <td>{student.status}</td>
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
                            Showing 1 to {filteredStudents.length} of {students.length} entries
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
            {/* Modal tạo học sinh mới */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateStudent}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm học sinh mới</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Mã học sinh</label>
                                        <input type="text" className="form-control" name="studentCode" value={newStudent.studentCode} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên học sinh</label>
                                        <input type="text" className="form-control" name="studentName" value={newStudent.studentName} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Lớp</label>
                                        <input type="text" className="form-control" name="classNmae" value={newStudent.classNmae} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày sinh học sinh</label>
                                        <input type="date" className="form-control" name="studentDob" value={newStudent.studentDob} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giới tính</label>
                                        <select className="form-select" name="gender" value={newStudent.gender} onChange={handleChange} required>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <label className="form-label">Mã phụ huynh</label>
                                        <input type="text" className="form-control" name="parentCode" value={newStudent.parentCode} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên phụ huynh</label>
                                        <input type="text" className="form-control" name="parentName" value={newStudent.parentName} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email phụ huynh</label>
                                        <input type="email" className="form-control" name="parentEmail" value={newStudent.parentEmail} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">SĐT phụ huynh</label>
                                        <input type="text" className="form-control" name="parentPhone" value={newStudent.parentPhone} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày sinh phụ huynh</label>
                                        <input type="date" className="form-control" name="parentDob" value={newStudent.parentDob} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ phụ huynh</label>
                                        <input type="text" className="form-control" name="parentAddress" value={newStudent.parentAddress} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quan hệ</label>
                                        <select className="form-select" name="relationship" value={newStudent.relationship} onChange={handleChange} required>
                                            <option value="Bố">Bố</option>
                                            <option value="Mẹ">Mẹ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={newStudent.status} onChange={handleChange} required>
                                            <option value="Đang học">Đang học</option>
                                            <option value="Nghỉ học">Nghỉ học</option>
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

export default StudentManagement;
