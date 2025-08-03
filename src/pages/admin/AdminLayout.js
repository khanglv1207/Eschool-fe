import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const sidebarItems = [
    { icon: "fa-home", label: "Home Page", link: "/" },
    { icon: "fa-users", label: "Users", link: "/admin/usermanage" },
    { icon: "fa-child", label: "Student", link: "/admin/manageChildren" },
    { icon: "fa-user-nurse", label: "School Nurse", link: "/admin/manageSchoolNurse" },
    { icon: "fa-blog", label: "Blogs", link: "/admin/manageBlogs" },
    // { icon: "fa-comments", label: "Consultations", link: "/admin/ConsultationManagement" },
    // { icon: "fa-comment-dots", label: "Feedbacks", link: "/admin/manageFeedbacks" },
    // { icon: "fa-medical", label: "Medicals", link: "/admin/MedicalManagement" },
    { icon: "fa-calendar-check", label: "Medical Event Recording", link: "/admin/medicaleventrecording" },
    { icon: "fa--vaccine", label: "Vaccine", link: "/admin/Vaccinemanage"}
    // { icon: "fa-money-check-alt", label: "Transactions", link: "/admin/manageTransactions" },
];

function AdminLayout({ children }) {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            {/* Header */}
            <nav className="navbar navbar-dark bg-dark px-4" style={{ height: 56 }}>
                <span className="navbar-brand fw-bold">EschoolMED</span>
                <div className="ms-auto text-white">
                    <span className="me-3">EschoolMED</span>
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
                                    <a className="nav-link text-white" href="/">
                                        <i className="fas fa-home me-2"></i> Home Page
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
                                Logged in as:<br />Start Bootstrap
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

export default AdminLayout; 