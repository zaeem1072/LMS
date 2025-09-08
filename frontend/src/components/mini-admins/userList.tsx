import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaUserGraduate, FaUserTie, FaEye } from 'react-icons/fa';
import { userService } from '../../services/user';
import type { User } from '../../services/user';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await userService.getUsers();
    if (result.success && result.users) {
      // Filter out admin and mini-admin users for mini-admin view
      const filteredUsers = result.users.filter(user => 
        user.role === 'teacher' || user.role === 'student'
      );
      setUsers(filteredUsers);
    } else {
      setError(result.error || 'Failed to fetch users');
    }
    setLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher':
        return <FaUser style={{ color: '#059669' }} />;
      case 'student':
        return <FaUserGraduate style={{ color: '#7c3aed' }} />;
      default:
        return <FaUser style={{ color: '#6b7280' }} />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    };

    switch (role) {
      case 'teacher':
        return { ...baseStyle, backgroundColor: '#f0fdf4', color: '#059669' };
      case 'student':
        return { ...baseStyle, backgroundColor: '#faf5ff', color: '#7c3aed' };
      default:
        return { ...baseStyle, backgroundColor: '#f9fafb', color: '#6b7280' };
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#fef2f2', 
        color: '#dc2626', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Users Overview
        </h1>
        {/* <div style={{
          backgroundColor: '#4b6cb7',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <FaEye /> View Only
        </div> */}
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        color: '#1e40af',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #bfdbfe'
      }}>
        <strong>Mini-Admin View:</strong> You can view teachers and students.
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <FaSearch style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }} />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          <option value="all">All Roles</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr 1fr 1fr',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#374151'
        }}>
          {/* <div>ID</div> */}
          <div style={{
                marginLeft: '1rem',
                marginRight: '1rem',
          }}>User Details</div>
          <div style={{
                marginLeft: '1rem',
                marginRight: '1rem',
          }}>Role</div>
          <div>Created</div>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#6b7280'
          }}>
            No users found matching your criteria.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                marginLeft: '1rem',
                marginRight: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                alignItems: 'center'
              }}
            >
              {/* <div style={{ fontWeight: '500', color: '#374151' }}>
                #{user.id}
              </div>
               */}
              <div>
                <div style={{ fontWeight: '500', color: '#111827' }}>
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : 'No name provided'
                  }
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {user.email}
                </div>
              </div>
              
              <div>
                <span style={getRoleBadgeStyle(user.role)}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>
              </div>
              
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div style={{ 
        marginTop: '1rem', 
        fontSize: '14px', 
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Showing {filteredUsers.length} users (Teachers and Students only)
      </div>
    </div>
  );
}

export default UserList;
