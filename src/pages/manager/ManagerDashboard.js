import React from "react";
import ManagerLayout from "./ManagerLayout";

function ManagerDashboard() {
    return (
        <ManagerLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="fw-bold text-primary text-center mb-4" style={{ letterSpacing: 1 }}>
                            Bảng điều khiển quản lý
                        </h2>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}

export default ManagerDashboard;
