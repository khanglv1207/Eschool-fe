import React, { useState, useEffect, useRef, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { getAllMedicalRecords, createMedicalRecord, deleteMedicalRecord, updateMedicalRecord } from "../../services/adminApi";

function MedicalManagement() {
    const [search, setSearch] = useState("");
    const [records, setRecords] = useState([]);
    // const [isImporting, setIsImporting] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRecord, setNewRecord] = useState({
        MedCode: "",
        MedName: "",
        MedIngredients: "",
        content: "",
        Packaging: "",
        unit: ""
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
                console.error("Error fetching medical records:", error);
                alert("Failed to fetch medical records. Please try again later.");
            }
        };
        fetchData();
    }, []);

    const handleClickImport = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Logic to handle file import
        console.log("File selected:", file);
    };

    const handleOpenCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewRecord({
            MedCode: "",
            MedName: "",
            MedIngredients: "",
            content: "",
            Packaging: "",
            unit: ""
        });
    };

    const handleChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleCreateRecord = async (e) => {
        e.preventDefault();
        if (!newRecord.MedCode || !newRecord.MedName) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const createdRecord = await createMedicalRecord(newRecord);
            setRecords((prev) => [...prev, createdRecord]);
            alert("Medical record created successfully!");
            handleCloseCreateModal();
        } catch (error) {
            console.error("Error creating medical record:", error);
            alert("Failed to create medical record. Please try again.");
        }
    };

    const handleDeleteRecord = async (record, idx) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const id = record.id || record._id;
        if (!id) return alert("Record ID not found!");
        try {
            await deleteMedicalRecord(id);
            setRecords((prev) => prev.filter((_, i) => i !== idx));
            alert("Record deleted successfully!");
        } catch (error) {
            console.error("Error deleting medical record:", error);
            alert("Failed to delete medical record. Please try again.");
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
        if (!editRecord.MedCode || !editRecord.MedName) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const updatedRecord = await updateMedicalRecord(editRecord);
            setRecords((prev) =>
                prev.map((r) => (r.id === updatedRecord.id || r._id === updatedRecord._id ? updatedRecord : r))
            );
            alert("Medical record updated successfully!");
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating medical record:", error);
            alert("Failed to update medical record. Please try again.");
        }
    };

    const filteredRecords = useMemo(() => {
        return records.filter(
            (r) =>
                r.MedName?.toLowerCase().includes(search.toLowerCase()) ||
                r.MedCode?.toLowerCase().includes(search.toLowerCase())
        );
    }, [records, search]);

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-notes-medical me-2"></i> Medical Management
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
                        onChange={handleFileChange}
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
                                <th>Code</th>
                                <th>Name</th>
                                <th>Ingredients</th>
                                <th>Content</th>
                                <th>Packaging</th>
                                <th>Unit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record, idx) => (
                                    <tr key={record.id || idx}>
                                        <td>{record.MedCode}</td>
                                        <td>{record.MedName}</td>
                                        <td>{record.MedIngredients}</td>
                                        <td>{record.content}</td>
                                        <td>{record.Packaging}</td>
                                        <td>{record.unit}</td>
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
                                        <label className="form-label">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedCode"
                                            value={newRecord.MedCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedName"
                                            value={newRecord.MedName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ingredients</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedIngredients"
                                            value={newRecord.MedIngredients}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Content</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="content"
                                            value={newRecord.content}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Packaging</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="Packaging"
                                            value={newRecord.Packaging}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Unit</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="unit"
                                            value={newRecord.unit}
                                            onChange={handleChange}
                                        />
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
                                        <label className="form-label">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedCode"
                                            value={editRecord.MedCode}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedName"
                                            value={editRecord.MedName}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ingredients</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MedIngredients"
                                            value={editRecord.MedIngredients}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Content</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="content"
                                            value={editRecord.content}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Packaging</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="Packaging"
                                            value={editRecord.Packaging}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Unit</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="unit"
                                            value={editRecord.unit}
                                            onChange={handleEditChange}
                                        />
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

export default MedicalManagement;