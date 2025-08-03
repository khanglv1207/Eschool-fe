import React, { useState, useEffect } from 'react';
import { FaPills, FaClock, FaCheck, FaTimes, FaSync, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import {
    getPendingMedicationRequests,
    updateMedicationStatus,
    getTodaySchedules,
    markScheduleAsTaken
} from '../../services/medicineApi';

function MedicationManagement() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'schedules'
    const [message, setMessage] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load pending medication requests
            const requests = await getPendingMedicationRequests();
            setPendingRequests(requests);

            // Load today schedules for all students
            const schedules = await getTodaySchedules('all'); // Assuming 'all' gets all students
            setTodaySchedules(schedules);

            console.log('📋 Data loaded:', { requests, schedules });
        } catch (error) {
            console.error('❌ Lỗi tải dữ liệu:', error);
            setMessage('❌ Lỗi tải dữ liệu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            setLoading(true);
            await updateMedicationStatus({
                requestId: requestId,
                status: status
            });
            setMessage(`✅ Đã cập nhật trạng thái thành ${status === 'APPROVED' ? 'duyệt' : 'từ chối'}`);
            loadData(); // Reload data
        } catch (error) {
            console.error('❌ Lỗi cập nhật trạng thái:', error);
            setMessage('❌ Lỗi cập nhật trạng thái: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsTaken = async (scheduleId) => {
        try {
            setLoading(true);
            await markScheduleAsTaken(scheduleId);
            setMessage('✅ Đã đánh dấu uống thuốc thành công');
            loadData(); // Reload data
        } catch (error) {
            console.error('❌ Lỗi đánh dấu uống thuốc:', error);
            setMessage('❌ Lỗi đánh dấu uống thuốc: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#ffc107';
            case 'APPROVED': return '#28a745';
            case 'REJECTED': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'APPROVED': return 'Đã duyệt';
            case 'REJECTED': return 'Đã từ chối';
            default: return 'Không xác định';
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <div style={{ color: '#667eea', fontSize: '18px', fontWeight: '600' }}>
                        Đang tải dữ liệu...
                    </div>
                    <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        <FaUserMd style={{ marginRight: '10px' }} />
                        Quản lý đơn thuốc và lịch uống
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Duyệt đơn thuốc và theo dõi lịch uống thuốc của học sinh
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    {message && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: message.includes("✅") ? '#155724' : '#721c24',
                            background: message.includes("✅") ? '#d4edda' : '#f8d7da',
                            border: `1px solid ${message.includes("✅") ? '#c3e6cb' : '#f5c6cb'}`
                        }}>
                            {message}
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '30px',
                        borderBottom: '2px solid #e9ecef'
                    }}>
                        <button
                            onClick={() => setActiveTab('requests')}
                            style={{
                                background: activeTab === 'requests' ? '#667eea' : 'transparent',
                                color: activeTab === 'requests' ? '#fff' : '#495057',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px 8px 0 0',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FaPills />
                            Đơn thuốc chờ duyệt ({pendingRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('schedules')}
                            style={{
                                background: activeTab === 'schedules' ? '#667eea' : 'transparent',
                                color: activeTab === 'schedules' ? '#fff' : '#495057',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px 8px 0 0',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FaClock />
                            Lịch uống hôm nay ({todaySchedules.length})
                        </button>
                    </div>

                    {/* Refresh Button */}
                    <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <button
                            onClick={loadData}
                            disabled={loading}
                            style={{
                                background: '#667eea',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            <FaSync />
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>

                    {/* Pending Requests Tab */}
                    {activeTab === 'requests' && (
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '20px' }}>
                                Đơn thuốc chờ duyệt
                            </h3>

                            {pendingRequests.length > 0 ? (
                                <div style={{
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        {pendingRequests.map((request, index) => (
                                            <div key={index} style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                border: '1px solid #dee2e6',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                                        <FaPills style={{ marginRight: '8px', color: '#667eea' }} />
                                                        {request.medicineName}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                                                        Học sinh: {request.studentName} - Lớp: {request.className}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                                                        Phụ huynh: {request.parentName} - SĐT: {request.parentPhone}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        Liều lượng: {request.dosage} - Tần suất: {request.frequency}
                                                    </div>
                                                    {request.note && (
                                                        <div style={{ fontSize: '12px', color: '#856404', fontStyle: 'italic', marginTop: '4px' }}>
                                                            Ghi chú: {request.note}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                                        disabled={loading}
                                                        style={{
                                                            background: '#28a745',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <FaCheck />
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                                        disabled={loading}
                                                        style={{
                                                            background: '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <FaTimes />
                                                        Từ chối
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                                    <h3 style={{ color: '#495057', marginBottom: '10px' }}>
                                        Không có đơn thuốc chờ duyệt
                                    </h3>
                                    <p style={{ color: '#6c757d', fontSize: '14px' }}>
                                        Tất cả đơn thuốc đã được xử lý hoặc chưa có đơn thuốc nào được gửi.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Today Schedules Tab */}
                    {activeTab === 'schedules' && (
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '20px' }}>
                                Lịch uống thuốc hôm nay
                            </h3>

                            {todaySchedules.length > 0 ? (
                                <div style={{
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        {todaySchedules.map((schedule, index) => (
                                            <div key={index} style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                border: '1px solid #dee2e6',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                                        <FaClock style={{ marginRight: '8px', color: '#667eea' }} />
                                                        {schedule.medicineName}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                                                        Học sinh: {schedule.studentName} - Lớp: {schedule.className}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                                                        Thời gian: {schedule.scheduledTime} - Liều lượng: {schedule.dosage}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        Ghi chú: {schedule.notes || 'Không có'}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {schedule.isTaken ? (
                                                        <span style={{
                                                            background: '#28a745',
                                                            color: '#fff',
                                                            padding: '6px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            fontWeight: '600'
                                                        }}>
                                                            ✅ Đã uống
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleMarkAsTaken(schedule.id)}
                                                            disabled={loading}
                                                            style={{
                                                                background: '#ffc107',
                                                                color: '#000',
                                                                border: 'none',
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            <FaCheck />
                                                            Đã uống
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    border: '2px solid #e9ecef'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
                                    <h3 style={{ color: '#495057', marginBottom: '10px' }}>
                                        Không có lịch uống thuốc hôm nay
                                    </h3>
                                    <p style={{ color: '#6c757d', fontSize: '14px' }}>
                                        Hôm nay không có học sinh nào cần uống thuốc theo lịch.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MedicationManagement; 