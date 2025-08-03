import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";
import {
    getTodaySchedules,
    markScheduleAsTaken
} from "../../services/nurseApi";

function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [studentSchedules, setStudentSchedules] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Mock data cho danh sách học sinh (trong thực tế sẽ lấy từ API)
    const mockStudents = [
        { studentId: "student-1", studentName: "Nguyễn Văn A", className: "10A1" },
        { studentId: "student-2", studentName: "Trần Thị B", className: "10A2" },
        { studentId: "student-3", studentName: "Lê Văn C", className: "11A1" },
    ];

    const loadSchedules = async (studentId) => {
        if (!studentId) return;

        setLoading(true);
        setError("");
        try {
            const response = await getTodaySchedules(studentId);
            if (response.code === 0) {
                setStudentSchedules(response.result || []);
            } else {
                setError(response.message || "Không thể tải lịch trình");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        setSelectedStudentId(studentId);
        if (studentId) {
            loadSchedules(studentId);
        } else {
            setStudentSchedules([]);
        }
    };

    const handleMarkAsTaken = async (scheduleId) => {
        if (!window.confirm("Bạn có chắc chắn muốn đánh dấu lịch trình này đã thực hiện?")) return;

        setLoading(true);
        try {
            const response = await markScheduleAsTaken(scheduleId);
            if (response.code === 0) {
                alert("Đã đánh dấu lịch trình thành công!");
                loadSchedules(selectedStudentId); // Reload schedules
            } else {
                setError(response.message || "Không thể đánh dấu lịch trình");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { class: 'bg-warning', text: 'Chờ thực hiện' },
            'TAKEN': { class: 'bg-success', text: 'Đã thực hiện' },
            'MISSED': { class: 'bg-danger', text: 'Đã bỏ lỡ' },
            'SKIPPED': { class: 'bg-secondary', text: 'Đã bỏ qua' }
        };
        const config = statusConfig[status] || statusConfig['PENDING'];
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const getTimeBadge = (time) => {
        const now = new Date();
        const scheduleTime = new Date(time);
        const diffHours = (scheduleTime - now) / (1000 * 60 * 60);

        if (diffHours < 0) {
            return <span className="badge bg-danger">Quá hạn</span>;
        } else if (diffHours < 1) {
            return <span className="badge bg-warning">Sắp đến</span>;
        } else {
            return <span className="badge bg-info">Còn thời gian</span>;
        }
    };

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-calendar-day me-2"></i> Lịch Uống Thuốc
                </h2>
                <div className="text-muted">
                    <i className="fas fa-calendar me-2"></i>
                    {new Date().toLocaleDateString('vi-VN')}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            {/* Student Selection */}
            <div className="card shadow border-0 mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="fas fa-user me-2"></i>
                        Chọn học sinh để xem lịch trình
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Học sinh *</label>
                            <select
                                className="form-select"
                                value={selectedStudentId}
                                onChange={handleStudentChange}
                            >
                                <option value="">-- Chọn học sinh --</option>
                                {mockStudents.map((student) => (
                                    <option key={student.studentId} value={student.studentId}>
                                        {student.studentName} - {student.className}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 d-flex align-items-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => loadSchedules(selectedStudentId)}
                                disabled={!selectedStudentId || loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-search me-2"></i>
                                        Xem lịch trình
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedules List */}
            {selectedStudentId && (
                <div className="card shadow border-0">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fas fa-list me-2"></i>
                            Lịch trình hôm nay
                        </h5>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th>Thời gian</th>
                                            <th>Loại thuốc</th>
                                            <th>Liều lượng</th>
                                            <th>Ghi chú</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentSchedules.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    <i className="fas fa-calendar-day fa-2x mb-2 text-muted"></i>
                                                    <br />
                                                    Không có lịch trình nào cho hôm nay.
                                                </td>
                                            </tr>
                                        ) : (
                                            studentSchedules.map((schedule) => (
                                                <tr key={schedule.scheduleId}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fas fa-clock me-2 text-primary"></i>
                                                            <div>
                                                                <div className="fw-bold">
                                                                    {new Date(schedule.scheduledTime).toLocaleTimeString('vi-VN', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                                {getTimeBadge(schedule.scheduledTime)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">{schedule.medicationName}</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-bold">{schedule.dosage}</span>
                                                        <br />
                                                        <small className="text-muted">{schedule.frequency}</small>
                                                    </td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: 200 }}>
                                                            {schedule.notes || 'Không có ghi chú'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {getStatusBadge(schedule.status)}
                                                    </td>
                                                    <td>
                                                        {schedule.status === 'PENDING' && (
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                title="Đánh dấu đã thực hiện"
                                                                onClick={() => handleMarkAsTaken(schedule.scheduleId)}
                                                                disabled={loading}
                                                            >
                                                                <i className="fas fa-check me-1"></i>
                                                                Đã thực hiện
                                                            </button>
                                                        )}
                                                        {schedule.status === 'TAKEN' && (
                                                            <span className="text-success">
                                                                <i className="fas fa-check-circle me-1"></i>
                                                                Hoàn thành
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Summary Card */}
            {selectedStudentId && studentSchedules.length > 0 && (
                <div className="row mt-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body text-center">
                                <h4>{studentSchedules.filter(s => s.status === 'PENDING').length}</h4>
                                <small>Chờ thực hiện</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body text-center">
                                <h4>{studentSchedules.filter(s => s.status === 'TAKEN').length}</h4>
                                <small>Đã thực hiện</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-danger text-white">
                            <div className="card-body text-center">
                                <h4>{studentSchedules.filter(s => s.status === 'MISSED').length}</h4>
                                <small>Đã bỏ lỡ</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-secondary text-white">
                            <div className="card-body text-center">
                                <h4>{studentSchedules.filter(s => s.status === 'SKIPPED').length}</h4>
                                <small>Đã bỏ qua</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NurseLayout>
    );
}

export default Schedules; 