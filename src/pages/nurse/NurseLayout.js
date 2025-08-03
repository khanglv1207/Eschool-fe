import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaPills, FaClipboardList, FaSignOutAlt, FaHome } from 'react-icons/fa';

function NurseLayout({ children }) {
    const location = useLocation();

    const menuItems = [
        { icon: "fa-home", label: "Dashboard", link: "/nurse/dashboard" },
        { icon: "fa-pills", label: "Quản lý đơn thuốc", link: "/nurse/medication-management" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                padding: '20px 0',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
            }}>
                {/* Logo */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        <FaUserMd style={{ marginRight: '10px' }} />
                        Y Tá
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        Quản lý sức khỏe học sinh
                    </div>
                </div>

                {/* Menu Items */}
                <nav>
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px 25px',
                                color: location.pathname === item.link ? '#fff' : 'rgba(255,255,255,0.8)',
                                textDecoration: 'none',
                                background: location.pathname === item.link ? 'rgba(255,255,255,0.1)' : 'transparent',
                                borderLeft: location.pathname === item.link ? '4px solid #fff' : '4px solid transparent',
                                transition: 'all 0.3s ease',
                                fontSize: '14px',
                                fontWeight: location.pathname === item.link ? '600' : '400'
                            }}
                            onMouseEnter={(e) => {
                                if (location.pathname !== item.link) {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== item.link) {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'rgba(255,255,255,0.8)';
                                }
                            }}
                        >
                            <i className={`fas ${item.icon}`} style={{ marginRight: '12px', width: '16px' }}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '0',
                    right: '0',
                    padding: '0 25px'
                }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <FaSignOutAlt />
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, background: '#f8f9fa' }}>
                {children}
            </div>
        </div>
    );
}

export default NurseLayout; 