import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";
import {
    getPendingMedicationRequests,
    getConfirmedStudents,
    getTodaySchedules
} from "../../services/nurseApi";

function NurseDashboard() {
    const [stats, setStats] = useState({
        pendingMedications: 0,
        confirmedStudents: 0,
        todaySchedules: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadDashboardData = async () => {
        setLoading(true);
        setError("");
        try {
            // Load pending medication requests
            const medicationResponse = await getPendingMedicationRequests();
            const pendingMedications = medicationResponse.code === 0 ?
                (medicationResponse.result?.length || 0) : 0;

            // Load confirmed students
            const studentsResponse = await getConfirmedStudents();
            const confirmedStudents = studentsResponse.code === 0 ?
                (studentsResponse.result?.length || 0) : 0;

            // Load today schedules (sample data for now)
            const todaySchedules = 5; // Mock data

            setStats({
                pendingMedications,
                confirmedStudents,
                todaySchedules
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-nurse me-2"></i> Dashboard Y tá
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

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">Yêu cầu thuốc</h4>
                                    <h2 className="mb-0">{loading ? "..." : stats.pendingMedications}</h2>
                                    <small>Đang chờ xử lý</small>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-pills fa-3x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-primary-dark">
                            <a href="/nurse/medication-requests" className="text-white text-decoration-none">
                                <i className="fas fa-arrow-right me-2"></i>Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">Học sinh đã xác nhận</h4>
                                    <h2 className="mb-0">{loading ? "..." : stats.confirmedStudents}</h2>
                                    <small>Sẵn sàng kiểm tra</small>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-user-check fa-3x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-success-dark">
                            <a href="/nurse/confirmed-students" className="text-white text-decoration-none">
                                <i className="fas fa-arrow-right me-2"></i>Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title">Lịch trình hôm nay</h4>
                                    <h2 className="mb-0">{loading ? "..." : stats.todaySchedules}</h2>
                                    <small>Cần thực hiện</small>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-calendar-day fa-3x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-info-dark">
                            <a href="/nurse/schedules" className="text-white text-decoration-none">
                                <i className="fas fa-arrow-right me-2"></i>Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow border-0">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="fas fa-bolt me-2"></i>Thao tác nhanh
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <a href="/nurse/medication-requests" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-pills fa-2x mb-2"></i>
                                        <span>Xử lý yêu cầu thuốc</span>
                                    </a>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <a href="/nurse/health-checkup" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-stethoscope fa-2x mb-2"></i>
                                        <span>Kiểm tra sức khỏe</span>
                                    </a>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <a href="/nurse/schedules" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-calendar-day fa-2x mb-2"></i>
                                        <span>Xem lịch trình</span>
                                    </a>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <a href="/nurse/medication-management" className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-clipboard-list fa-2x mb-2"></i>
                                        <span>Quản lý thuốc</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 h-100">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="fas fa-clock me-2"></i>Hoạt động gần đây
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-marker bg-success"></div>
                                    <div className="timeline-content">
                                        <h6>Kiểm tra sức khỏe học sinh</h6>
                                        <small className="text-muted">2 giờ trước</small>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker bg-primary"></div>
                                    <div className="timeline-content">
                                        <h6>Xử lý yêu cầu thuốc</h6>
                                        <small className="text-muted">4 giờ trước</small>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker bg-info"></div>
                                    <div className="timeline-content">
                                        <h6>Cập nhật lịch trình</h6>
                                        <small className="text-muted">6 giờ trước</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 h-100">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="fas fa-chart-pie me-2"></i>Thống kê tuần
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6 mb-3">
                                    <div className="border-end">
                                        <h4 className="text-primary">25</h4>
                                        <small className="text-muted">Kiểm tra sức khỏe</small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <h4 className="text-success">18</h4>
                                    <small className="text-muted">Yêu cầu thuốc</small>
                                </div>
                                <div className="col-6">
                                    <h4 className="text-info">12</h4>
                                    <small className="text-muted">Lịch trình hoàn thành</small>
                                </div>
                                <div className="col-6">
                                    <h4 className="text-warning">8</h4>
                                    <small className="text-muted">Cần theo dõi</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for Timeline */}
            <style jsx>{`
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }
                .timeline-item {
                    position: relative;
                    margin-bottom: 20px;
                }
                .timeline-marker {
                    position: absolute;
                    left: -35px;
                    top: 5px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                .timeline-content {
                    padding-left: 15px;
                }
                .timeline-content h6 {
                    margin-bottom: 5px;
                    font-weight: 600;
                }
            `}</style>
        </NurseLayout>
    );
}

export default NurseDashboard; 