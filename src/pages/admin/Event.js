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
import MedicalEvents from "../MedicalEvents";

const sampleRecords = [];

function MedivalEvent() {
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
            {/* Giao diện tương tự StudentManagement, chỉ thay đổi cột và modal */}
            {/* Bạn có thể copy phần giao diện từ StudentManagement và thay đổi các label thành dữ liệu y tế */}
        </AdminLayout>
    );
}

export default MedicalEvents;
