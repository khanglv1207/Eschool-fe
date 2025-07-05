import React, { useState } from "react";
import ManagerLayout from "./ManagerLayout";

// Dữ liệu mẫu (có thể để rỗng hoặc thêm vài học sinh mẫu)
const sampleStudents = [
    // {
    //     id: 1,
    //     name: "Nguyễn Văn A",
    //     studentCode: "HS001",
    //     class: "1A",
    //     dob: "2015-09-01",
    //     status: "Đang học",
    // },
];

function StudentManagement() {
    const [search, setSearch] = useState("");
    const [students] = useState(sampleStudents);

    const filteredStudents = students.filter(
        (s) =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
            s.class?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ManagerLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-child me-2"></i> Student Management
                </h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Thêm học sinh mới
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
                                    <th>Tên học sinh</th>
                                    <th>Mã học sinh</th>
                                    <th>Lớp</th>
                                    <th>Ngày sinh</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Không có học sinh nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td className="fw-bold">{student.name}</td>
                                            <td>{student.studentCode}</td>
                                            <td>{student.class}</td>
                                            <td>{student.dob}</td>
                                            <td>
                                                {student.status === "Đang học" ? (
                                                    <span className="badge bg-success">Đang học</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Nghỉ học</span>
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
        </ManagerLayout>
    );
}

export default StudentManagement;
