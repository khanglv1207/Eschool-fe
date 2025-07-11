import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";
import { importStudent, importParentStudentExcel, getAllParentStudent, createStudentParent, deleteStudentParent, updateStudentParent } from "../../services/adminApi";

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
    const [isImporting, setIsImporting] = useState(false);
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

    // State cho modal sửa
    const [showEditModal, setShowEditModal] = useState(false);
    const [editStudent, setEditStudent] = useState(null);

    // Thêm useEffect để lấy danh sách học sinh/phụ huynh từ API khi load trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllParentStudent();
                // data là mảng các học sinh/phụ huynh từ BE
                // Nếu muốn giữ lại các chức năng import/thêm mới, có thể nối thêm vào students sau này
                setStudents(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchData();
    }, []);

    // Hàm xử lý import Excel
    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            // Gọi API theo Swagger documentation
            const response = await importParentStudentExcel(file);

            // Xử lý response theo format Swagger API
            if (response.success && response.data) {
                const importedStudents = response.data.students || [];
                setStudents(prev => [...prev, ...importedStudents]);

                // Hiển thị thông báo chi tiết
                let message = `Import thành công ${response.data.totalImported} học sinh!`;

                if (response.data.errors && response.data.errors.length > 0) {
                    message += `\nCó ${response.data.errors.length} lỗi xảy ra.`;
                }

                if (response.data.warnings && response.data.warnings.length > 0) {
                    message += `\nCó ${response.data.warnings.length} cảnh báo.`;
                }

                alert(message);

                // Log chi tiết nếu có lỗi hoặc cảnh báo
                if (response.data.errors && response.data.errors.length > 0) {
                    console.warn('Import errors:', response.data.errors);
                }

                if (response.data.warnings && response.data.warnings.length > 0) {
                    console.warn('Import warnings:', response.data.warnings);
                }
            } else {
                // Fallback: xử lý local nếu API chưa sẵn sàng
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
                            relationship: student.relationship || student["Quan hệ"] || student.ParentRelationship || "Bố"

                        };
                    });
                    setStudents((prev) => [...prev, ...studentsFromExcel]);
                    alert(`Import thành công ${studentsFromExcel.length} học sinh!`);
                };
                reader.readAsBinaryString(file);
            }
        } catch (error) {
            console.error("Lỗi import:", error);
            alert(`Lỗi import: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
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
    const handleCreateStudent = async (e) => {
        e.preventDefault();
        // Chuẩn bị dữ liệu đúng format cho API
        const payload = {
            studentName: newStudent.studentName,
            studentDob: newStudent.studentDob,
            gender: newStudent.gender,
            className: newStudent.classNmae,
            parentName: newStudent.parentName,
            parentEmail: newStudent.parentEmail,
            parentPhone: newStudent.parentPhone,
            parentDob: newStudent.parentDob,
            parentAddress: newStudent.parentAddress,
            relationship: newStudent.relationship
        };
        try {
            const created = await createStudentParent(payload);
            // Thêm vào danh sách hiện tại (nếu muốn hiển thị ngay)
            setStudents(prev => [...prev, { ...newStudent }]);
            alert("Tạo học sinh/phụ huynh thành công!");
        } catch (error) {
            alert(error.message || "Lỗi khi tạo học sinh/phụ huynh");
        }
        handleCloseCreateModal();
    };

    // Hàm xóa học sinh/phụ huynh
    const handleDeleteStudent = async (student, idx) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa học sinh/phụ huynh này?`)) return;
        // Ưu tiên lấy id từ student, nếu có
        const id = student.id || student._id;
        if (!id) {
            alert("Không tìm thấy id để xóa!");
            return;
        }
        try {
            await deleteStudentParent(id);
            setStudents(prev => prev.filter((_, i) => i !== idx));
            alert("Xóa thành công!");
        } catch (error) {
            alert(error.message || "Lỗi khi xóa học sinh/phụ huynh");
        }
    };

    // Mở modal sửa
    const handleOpenEditModal = (student) => {
        setEditStudent({ ...student });
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditStudent(null);
    };
    const handleEditChange = (e) => {
        setEditStudent({ ...editStudent, [e.target.name]: e.target.value });
    };
    // Lưu cập nhật
    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await updateStudentParent(editStudent);
            setStudents(prev => prev.map(s => (s.id === editStudent.id || s._id === editStudent._id) ? { ...editStudent } : s));
            alert("Cập nhật thành công!");
            handleCloseEditModal();
        } catch (error) {
            alert(error.message || "Lỗi khi cập nhật học sinh/phụ huynh");
        }
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
                    <button
                        className="btn btn-success me-2"
                        onClick={handleClickImport}
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2"></i> Đang import...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-file-import me-2"></i> Import từ Excel
                            </>
                        )}
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
                                                <button className="btn btn-sm btn-outline-primary me-2" title="Chỉnh sửa" onClick={() => handleOpenEditModal(student)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDeleteStudent(student, idx)}>
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
            {/* Modal sửa học sinh */}
            {showEditModal && editStudent && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateStudent}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa học sinh/phụ huynh</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Mã học sinh</label>
                                        <input type="text" className="form-control" name="studentCode" value={editStudent.studentCode || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên học sinh</label>
                                        <input type="text" className="form-control" name="studentName" value={editStudent.studentName || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Lớp</label>
                                        <input type="text" className="form-control" name="classNmae" value={editStudent.classNmae || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày sinh học sinh</label>
                                        <input type="date" className="form-control" name="studentDob" value={editStudent.studentDob || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giới tính</label>
                                        <select className="form-select" name="gender" value={editStudent.gender || "Nam"} onChange={handleEditChange} required>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <label className="form-label">Mã phụ huynh</label>
                                        <input type="text" className="form-control" name="parentCode" value={editStudent.parentCode || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên phụ huynh</label>
                                        <input type="text" className="form-control" name="parentName" value={editStudent.parentName || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email phụ huynh</label>
                                        <input type="email" className="form-control" name="parentEmail" value={editStudent.parentEmail || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">SĐT phụ huynh</label>
                                        <input type="text" className="form-control" name="parentPhone" value={editStudent.parentPhone || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày sinh phụ huynh</label>
                                        <input type="date" className="form-control" name="parentDob" value={editStudent.parentDob || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ phụ huynh</label>
                                        <input type="text" className="form-control" name="parentAddress" value={editStudent.parentAddress || ""} onChange={handleEditChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quan hệ</label>
                                        <select className="form-select" name="relationship" value={editStudent.relationship || "Bố"} onChange={handleEditChange} required>
                                            <option value="Bố">Bố</option>
                                            <option value="Mẹ">Mẹ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select className="form-select" name="status" value={editStudent.status || "Đang học"} onChange={handleEditChange} required>
                                            <option value="Đang học">Đang học</option>
                                            <option value="Nghỉ học">Nghỉ học</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Hủy</button>
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
