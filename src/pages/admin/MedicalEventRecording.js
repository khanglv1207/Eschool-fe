import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import * as XLSX from "xlsx";
import {
    importMedicalExcel,
    getAllMedicalRecords,
    createMedicalRecord,
    deleteMedicalRecord,
    updateMedicalRecord
} from "../../services/adminApi";
// import MedicalEvents from "../MedicalEvents";

const sampleRecords = [];

function MedicalEventRecording() {
    const [search, setSearch] = useState("");
    const [records, setRecords] = useState(sampleRecords);
    const [isImporting, setIsImporting] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRecord, setNewRecord] = useState({
        studentCode: "",
        studentName: "",
        classId: "",
        date: "",
        symptom: "",
        diagnosis: "",
        treatment: "",
        note: "",
    });
    const fileInputRef = useRef();

    const [showEditModal, setShowEditModal] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllMedicalRecords();
                setRecords(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchData();
    }, []);

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const response = await importMedicalExcel(file);

            if (response.success && response.data) {
                const importedRecords = response.data.records || [];
                setRecords((prev) => [...prev, ...importedRecords]);
                alert(`Import thành công ${response.data.totalImported} bản ghi y tế!`);
            } else {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: "binary" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    const header = data[0];
                    const recordsFromExcel = data.slice(1).map((row) => {
                        const record = {};
                        header.forEach((key, idx) => {
                            record[key] = row[idx] || "";
                        });
                        return {
                            studentCode: record.studentCode || record["Mã học sinh"] || "",
                            studentName: record.studentName || record["Tên học sinh"] || "",
                            classId: record.classId || record["Lớp"] || "",
                            date: record.date || record["Ngày"] || "",
                            symptom: record.symptom || record["Triệu chứng"] || "",
                            diagnosis: record.diagnosis || record["Chẩn đoán"] || "",
                            treatment: record.treatment || record["Điều trị"] || "",
                            note: record.note || record["Ghi chú"] || "",
                        };
                    });
                    setRecords((prev) => [...prev, ...recordsFromExcel]);
                    alert(`Import thành công ${recordsFromExcel.length} bản ghi y tế!`);
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
        setNewRecord({
            studentCode: "",
            studentName: "",
            classId: "",
            date: "",
            symptom: "",
            diagnosis: "",
            treatment: "",
            note: "",
        });
    };

    const handleChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleCreateRecord = async (e) => {
        e.preventDefault();
        try {
            await createMedicalRecord(newRecord);
            setRecords((prev) => [...prev, newRecord]);
            alert("Tạo bản ghi y tế thành công!");
            handleCloseCreateModal();
        } catch (error) {
            alert(error.message || "Lỗi khi tạo bản ghi y tế");
        }
    };

    const handleDeleteRecord = async (record, idx) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;
        const id = record.id || record._id;
        if (!id) return alert("Không tìm thấy id để xóa!");
        try {
            await deleteMedicalRecord(id);
            setRecords((prev) => prev.filter((_, i) => i !== idx));
            alert("Xóa thành công!");
        } catch (error) {
            alert(error.message || "Lỗi khi xóa bản ghi y tế");
        }
    };

    const handleOpenEditModal = (record) => {
        setEditRecord({ ...record });
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditRecord(null);
    };
    const handleEditChange = (e) => {
        setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
    };
    const handleUpdateRecord = async (e) => {
        e.preventDefault();
        try {
            await updateMedicalRecord(editRecord);
            setRecords((prev) =>
                prev.map((r) => (r.id === editRecord.id || r._id === editRecord._id ? editRecord : r))
            );
            alert("Cập nhật thành công!");
            handleCloseEditModal();
        } catch (error) {
            alert(error.message || "Lỗi khi cập nhật bản ghi y tế");
        }
    };

    const filteredRecords = records.filter(
        (r) =>
            r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
            r.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
            r.classId?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-notes-medical me-2"></i> Medical Event Recording
                </h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={handleOpenCreateModal}>
                        <i className="fas fa-plus me-2"></i> Add New Record
                    </button>
                    <button className="btn btn-secondary" onClick={handleClickImport}>
                        <i className="fas fa-file-import me-2"></i> Import Records
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImportExcel}
                    />
                </div>
            </div>
            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control w-auto"
                        placeholder="Search records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ minWidth: 200 }}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Student Code</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Date</th>
                                <th>Symptom</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record, idx) => (
                                    <tr key={record.id || idx}>
                                        <td>{record.studentCode}</td>
                                        <td>{record.studentName}</td>
                                        <td>{record.classId}</td>
                                        <td>{record.date}</td>
                                        <td>{record.symptom}</td>
                                        <td>{record.diagnosis}</td>
                                        <td>{record.treatment}</td>
                                        <td>{record.note}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleOpenEditModal(record)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteRecord(record, idx)}
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
            </div>
            {/* Modal for creating and editing records */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleCreateRecord}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Medical Record</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Student Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="studentCode"
                                            value={newRecord.studentCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Student Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="studentName"
                                            value={newRecord.studentName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Class</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="classId"
                                            value={newRecord.classId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={newRecord.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Symptom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="symptom"
                                            value={newRecord.symptom}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Diagnosis</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="diagnosis"
                                            value={newRecord.diagnosis}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Treatment</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="treatment"
                                            value={newRecord.treatment}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={newRecord.note}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateRecord}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Medical Record</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Student Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="studentCode"
                                            value={editRecord.studentCode}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Student Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="studentName"
                                            value={editRecord.studentName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Class</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="classId"
                                            value={editRecord.classId}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={editRecord.date}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Symptom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="symptom"
                                            value={editRecord.symptom}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Diagnosis</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="diagnosis"
                                            value={editRecord.diagnosis}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Treatment</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="treatment"
                                            value={editRecord.treatment}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={editRecord.note}
                                            onChange={handleEditChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Update Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default MedicalEventRecording;
