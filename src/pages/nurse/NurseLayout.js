import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const nurseSidebarItems = [
    { icon: "fa-home", label: "Trang chủ", link: "/nurse/dashboard" },
    { icon: "fa-calendar-day", label: "Lịch trình hôm nay", link: "/nurse/schedules" },
    { icon: "fa-pills", label: "Yêu cầu thuốc", link: "/nurse/medication-requests" },
    { icon: "fa-user-check", label: "Học sinh đã xác nhận", link: "/nurse/confirmed-students" },
    { icon: "fa-stethoscope", label: "Kiểm tra sức khỏe", link: "/nurse/health-checkup" },
    { icon: "fa-clipboard-list", label: "Quản lý thuốc", link: "/nurse/medication-management" },
    { icon: "fa-user-nurse", label: "Quản lý y tá", link: "/nurse/nurse-management" },
];

function NurseLayout({ children }) {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            {/* Header */}
            <nav className="navbar navbar-dark bg-primary px-4" style={{ height: 56 }}>
                <span className="navbar-brand fw-bold">
                    <i className="fas fa-user-nurse me-2"></i>
                    EschoolMED - Nurse Portal
                </span>
                <div className="ms-auto text-white">
                    <span className="me-3">Y tá</span>
                    <i className="fas fa-user-circle"></i>
                </div>
            </nav>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block bg-primary sidebar py-4" style={{ minHeight: "calc(100vh - 56px)", color: "#fff" }}>
                        <div className="sidebar-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2 text-uppercase text-light small" style={{ letterSpacing: 1 }}>Chức năng chính</li>
                                {nurseSidebarItems.map((item) => (
                                    <li className="nav-item mb-2" key={item.label}>
                                        <a className="nav-link text-white" href={item.link}>
                                            <i className={`fas ${item.icon} me-2`}></i> {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="position-absolute bottom-0 start-0 w-100 p-3 small text-light" style={{ fontSize: 13 }}>
                                Đăng nhập với tư cách:<br />Y tá trường học
                            </div>
                        </div>
                    </nav>
                    <main className="col-md-10 ms-sm-auto px-md-4 py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default NurseLayout; 