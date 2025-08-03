import React, { useState, useEffect } from "react";
import NurseLayout from "./NurseLayout";

function MedicationManagement() {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Mock data cho danh sách thuốc
    const mockMedications = [
        {
            id: "med-1",
            name: "Paracetamol",
            category: "Thuốc giảm đau",
            dosage: "500mg",
            form: "Viên nén",
            quantity: 150,
            minQuantity: 20,
            expiryDate: "2025-12-31",
            status: "AVAILABLE"
        },
        {
            id: "med-2",
            name: "Ibuprofen",
            category: "Thuốc chống viêm",
            dosage: "400mg",
            form: "Viên nén",
            quantity: 8,
            minQuantity: 20,
            expiryDate: "2025-06-30",
            status: "LOW_STOCK"
        },
        {
            id: "med-3",
            name: "Vitamin C",
            category: "Vitamin",
            dosage: "1000mg",
            form: "Viên nén",
            quantity: 200,
            minQuantity: 50,
            expiryDate: "2026-03-15",
            status: "AVAILABLE"
        },
        {
            id: "med-4",
            name: "Amoxicillin",
            category: "Kháng sinh",
            dosage: "500mg",
            form: "Viên nén",
            quantity: 0,
            minQuantity: 30,
            expiryDate: "2025-08-20",
            status: "OUT_OF_STOCK"
        }
    ];

    useEffect(() => {
        setMedications(mockMedications);
    }, []);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'AVAILABLE': { class: 'bg-success', text: 'Có sẵn' },
            'LOW_STOCK': { class: 'bg-warning', text: 'Sắp hết' },
            'OUT_OF_STOCK': { class: 'bg-danger', text: 'Hết hàng' },
            'EXPIRED': { class: 'bg-secondary', text: 'Hết hạn' }
        };
        const config = statusConfig[status] || statusConfig['AVAILABLE'];
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const getQuantityBadge = (quantity, minQuantity) => {
        if (quantity === 0) {
            return <span className="badge bg-danger">0</span>;
        } else if (quantity <= minQuantity) {
            return <span className="badge bg-warning">{quantity}</span>;
        } else {
            return <span className="badge bg-success">{quantity}</span>;
        }
    };

    const getExpiryBadge = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return <span className="badge bg-danger">Hết hạn</span>;
        } else if (diffDays <= 30) {
            return <span className="badge bg-warning">{diffDays} ngày</span>;
        } else {
            return <span className="badge bg-success">{diffDays} ngày</span>;
        }
    };

    const filteredMedications = medications.filter(medication => {
        const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medication.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || medication.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: medications.length,
        available: medications.filter(m => m.status === 'AVAILABLE').length,
        lowStock: medications.filter(m => m.status === 'LOW_STOCK').length,
        outOfStock: medications.filter(m => m.status === 'OUT_OF_STOCK').length
    };

    return (
        <NurseLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-clipboard-list me-2"></i> Quản lý Thuốc
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
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <h4>{stats.total}</h4>
                            <small>Tổng số thuốc</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <h4>{stats.available}</h4>
                            <small>Có sẵn</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <h4>{stats.lowStock}</h4>
                            <small>Sắp hết</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body text-center">
                            <h4>{stats.outOfStock}</h4>
                            <small>Hết hàng</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Tìm kiếm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên thuốc hoặc danh mục..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Trạng thái</label>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="AVAILABLE">Có sẵn</option>
                                <option value="LOW_STOCK">Sắp hết</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medications List */}
            <div className="card shadow border-0">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="fas fa-list me-2"></i>
                        Danh sách thuốc
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
                                        <th>Tên thuốc</th>
                                        <th>Danh mục</th>
                                        <th>Liều lượng</th>
                                        <th>Dạng bào chế</th>
                                        <th>Số lượng</th>
                                        <th>Hạn sử dụng</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedications.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted py-4">
                                                <i className="fas fa-clipboard-list fa-2x mb-2 text-muted"></i>
                                                <br />
                                                Không tìm thấy thuốc nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMedications.map((medication) => (
                                            <tr key={medication.id}>
                                                <td>
                                                    <div className="fw-bold">{medication.name}</div>
                                                    <small className="text-muted">ID: {medication.id}</small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">{medication.category}</span>
                                                </td>
                                                <td>
                                                    <span className="fw-bold">{medication.dosage}</span>
                                                </td>
                                                <td>
                                                    <span className="text-muted">{medication.form}</span>
                                                </td>
                                                <td>
                                                    {getQuantityBadge(medication.quantity, medication.minQuantity)}
                                                    <br />
                                                    <small className="text-muted">Tối thiểu: {medication.minQuantity}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <small className="text-muted">
                                                            {new Date(medication.expiryDate).toLocaleDateString('vi-VN')}
                                                        </small>
                                                        <br />
                                                        {getExpiryBadge(medication.expiryDate)}
                                                    </div>
                                                </td>
                                                <td>
                                                    {getStatusBadge(medication.status)}
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            title="Xem chi tiết"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-warning me-1"
                                                            title="Cập nhật số lượng"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            title="Thêm vào kho"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
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

            {/* Quick Actions */}
            <div className="row mt-4">
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
                                    <button className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-plus fa-2x mb-2"></i>
                                        <span>Thêm thuốc mới</span>
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-download fa-2x mb-2"></i>
                                        <span>Nhập kho</span>
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
                                        <span>Báo cáo thiếu</span>
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                        <i className="fas fa-file-export fa-2x mb-2"></i>
                                        <span>Xuất báo cáo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NurseLayout>
    );
}

export default MedicationManagement; 