import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaPills, FaClock, FaClipboardList, FaUsers, FaChartLine } from 'react-icons/fa';
import { getPendingMedicationRequests, getTodaySchedules } from '../../services/medicineApi';

function NurseDashboard() {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    todaySchedules: 0,
    totalStudents: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load pending medication requests
      const requests = await getPendingMedicationRequests();

      // Load today schedules
      const schedules = await getTodaySchedules('all');

      // Calculate completed schedules
      const completedSchedules = schedules.filter(schedule => schedule.isTaken);

      setStats({
        pendingRequests: requests.length,
        todaySchedules: schedules.length,
        totalStudents: schedules.length > 0 ? new Set(schedules.map(s => s.studentId)).size : 0,
        completedToday: completedSchedules.length
      });

    } catch (error) {
      console.error('❌ Lỗi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, link }) => (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: `2px solid ${color}20`,
      transition: 'all 0.3s ease',
      cursor: link ? 'pointer' : 'default'
    }}
      onMouseEnter={(e) => {
        if (link) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (link) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#495057' }}>
            {loading ? '...' : value}
          </div>
        </div>
      </div>
      {link && (
        <Link to={link} style={{
          color: color,
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Xem chi tiết →
        </Link>
      )}
    </div>
  );

  const QuickAction = ({ icon, title, description, link, color }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: `2px solid ${color}20`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          {icon}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
          {title}
        </div>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          {description}
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#495057', marginBottom: '8px' }}>
            <FaUserMd style={{ marginRight: '12px', color: '#667eea' }} />
            Dashboard Y Tá
          </div>
          <div style={{ fontSize: '16px', color: '#6c757d' }}>
            Quản lý sức khỏe học sinh và theo dõi đơn thuốc
          </div>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            icon={<FaPills style={{ color: '#fff', fontSize: '20px' }} />}
            title="Đơn thuốc chờ duyệt"
            value={stats.pendingRequests}
            color="#ffc107"
            link="/nurse/medication-management"
          />
          <StatCard
            icon={<FaClock style={{ color: '#fff', fontSize: '20px' }} />}
            title="Lịch uống hôm nay"
            value={stats.todaySchedules}
            color="#28a745"
            link="/nurse/medication-management"
          />
          <StatCard
            icon={<FaUsers style={{ color: '#fff', fontSize: '20px' }} />}
            title="Học sinh cần uống thuốc"
            value={stats.totalStudents}
            color="#17a2b8"
          />
          <StatCard
            icon={<FaChartLine style={{ color: '#fff', fontSize: '20px' }} />}
            title="Đã hoàn thành hôm nay"
            value={stats.completedToday}
            color="#6f42c1"
          />
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
            Thao tác nhanh
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <QuickAction
              icon={<FaPills style={{ color: '#fff', fontSize: '20px' }} />}
              title="Quản lý đơn thuốc"
              description="Duyệt đơn thuốc và theo dõi lịch uống thuốc của học sinh"
              link="/nurse/medication-management"
              color="#667eea"
            />
            <QuickAction
              icon={<FaClipboardList style={{ color: '#fff', fontSize: '20px' }} />}
              title="Khai báo sức khỏe"
              description="Xem và quản lý khai báo sức khỏe của học sinh"
              link="/nurse/health-declaration"
              color="#28a745"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          marginTop: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
            Hoạt động gần đây
          </h3>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px',
            border: '2px solid #e9ecef'
          }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h4 style={{ color: '#495057', marginBottom: '8px' }}>
                Chưa có hoạt động gần đây
              </h4>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Các hoạt động quản lý đơn thuốc và lịch uống sẽ được hiển thị ở đây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NurseDashboard; 