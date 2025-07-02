import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const sidebarItems = [
    { icon: "fa-home", label: "Main Page", link: "/manager/dashboard" },
    { icon: "fa-users", label: "Users", link: "/manager/usermanage" },
    { icon: "fa-child", label: "Student", link: "/manager/manageChildren" },
    { icon: "fa-user-nurse", label: "School Nurse", link: "/manager/manageSchoolNurse" },
    { icon: "fa-blog", label: "Blogs", link: "/manager/manageBlogs" },
    { icon: "fa-comment-dots", label: "Feedbacks", link: "/manager/manageFeedbacks" },
    // Các tính năng riêng cho manager sẽ bổ sung sau
];

function ManagerLayout({ children }) {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            {/* Header */}
            <nav className="navbar navbar-dark bg-dark px-4" style={{ height: 56 }}>
                <span className="navbar-brand fw-bold">MANAGER</span>
                <div className="ms-auto text-white">
                    <span className="me-3">manager</span>
                    <i className="fas fa-user-circle"></i>
                </div>
            </nav>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block bg-dark sidebar py-4" style={{ minHeight: "calc(100vh - 56px)", color: "#fff" }}>
                        <div className="sidebar-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2 text-uppercase text-secondary small" style={{ letterSpacing: 1 }}>Interface</li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link text-white" href="/manager/dashboard">
                                        <i className="fas fa-home me-2"></i> Main Page
                                    </a>
                                </li>
                                <li className="nav-item mb-2 text-uppercase text-secondary small mt-3" style={{ letterSpacing: 1 }}>Manage</li>
                                {sidebarItems.slice(1).map((item) => (
                                    <li className="nav-item mb-2" key={item.label}>
                                        <a className="nav-link text-white" href={item.link}>
                                            <i className={`fas ${item.icon} me-2`}></i> {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="position-absolute bottom-0 start-0 w-100 p-3 small text-secondary" style={{ fontSize: 13 }}>
                                Logged in as:<br />Manager
                            </div>
                        </div>
                    </nav>
                    {/* Main content */}
                    <main className="col-md-10 ms-sm-auto px-md-4 py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout; 