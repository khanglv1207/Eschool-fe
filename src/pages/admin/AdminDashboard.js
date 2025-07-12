import React from "react";
import AdminLayout from "./AdminLayout";

function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="fw-bold text-primary text-center mb-4" style={{ letterSpacing: 1 }}>
                            Bảng điều khiển quản trị
                        </h2>
                    </div>
                </div>              
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;