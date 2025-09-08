import { useState, useEffect } from 'react';
import { FaUsers, FaUserGraduate, FaUser, FaChartBar, FaEye } from 'react-icons/fa';
import { userService } from '../../services/user';
import type { User } from '../../services/user';

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    teachers: 0,
    students: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await userService.getUsers();
    if (result.success && result.users) {
      const filteredUsers = result.users.filter(user => 
        user.role === 'teacher' || user.role === 'student'
      );
      setUsers(filteredUsers);
      
      const newStats = {
        total: filteredUsers.length,
        teachers: filteredUsers.filter(u => u.role === 'teacher').length,
        students: filteredUsers.filter(u => u.role === 'student').length
      };
      setStats(newStats);
    }
    setLoading(false);
  };

  const StatCard = ({
    title,
    count,
    icon,
    color,
    bgColor,
    borderColor,
  }: {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor?: string;
  }) => (
    <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: `2px solid ${borderColor || "#e5e7eb"}`,
        position: "relative",
        overflow: "hidden",
      }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        backgroundColor: bgColor,
        borderRadius: '0 12px 0 100%',
        opacity: 0.1
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
            {count}
          </div>
        </div>
        <div style={{ fontSize: '24px', color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getRecentUsers = () => {
    return users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
          Mini-Admin Dashboard
        </h1>
        {/* <p style={{ color: '#6b7280', margin: 0 }}>
          Overview of teachers and students in the system
        </p> */}
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        color: '#1e40af',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #bfdbfe'
      }}>
        <strong>Mini-Admin Access:</strong> You can view teachers and students.
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Visible Users"
          count={stats.total}
          icon={<FaUsers />}
          color="#4b6cb7"
          bgColor="#e0e7ff"
          borderColor="#a270b7ff"
        />
        
        <StatCard
          title="Teachers"
          count={stats.teachers}
          icon={<FaUser />}
          color="#059669"
          bgColor="#f0fdf4"
          borderColor="#591376ff"
        />
        
        <StatCard
          title="Students"
          count={stats.students}
          icon={<FaUserGraduate />}
          color="#7c3aed"
          bgColor="#faf5ff"
          borderColor="#1e3c72"
        />
      </div>

      {/* Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Recent Users */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaChartBar /> Recent Users
          </h3>
          
          <div>
            {getRecentUsers().length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#6b7280'
              }}>
                No users found
              </div>
            ) : (
              getRecentUsers().map((user, index) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: index < getRecentUsers().length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {user.email}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.role === 'teacher' ? '#f0fdf4' : '#faf5ff',
                      color: user.role === 'teacher' ? '#059669' : '#7c3aed'
                    }}>
                      {user.role}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#374151'
          }}>
            <FaEye /> View & Actions
          </h3> */}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => window.location.href = '/mini-admin/users'}
              style={{
                padding: '12px 16px',
                backgroundColor: '#4b6cb7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaEye /> View All Users
            </button>
            
            <button
              onClick={() => fetchUsers()}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}
            >
              Refresh Data
            </button>
          </div>
          
          <div style={{
            marginTop: '1rem',
            padding: '12px',
            backgroundColor: '#fef7cd',
            borderRadius: '6px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
              Note: As a mini-admin, you have read-only access to view teachers and students.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
