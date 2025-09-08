import { useState, useEffect } from 'react';
import {FaTrash,FaSearch, FaUser, FaUserGraduate, FaUserTie, FaUserShield } from 'react-icons/fa';
import { userService } from '../../services/user';
import type { User } from '../../services/user';
import { colors,commonStyles, typography } from '../../styles/constants';

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
    setError('');
    
    try {
      console.log('🔍 FETCHING_USERS: Requesting user list...');
      const result = await userService.getUsers();
      
      if (result.success && result.users) {
        setUsers(result.users);
        console.log(`✅ USERS_LOADED: ${result.users.length} users found`);
      } else {
        const errorMessage = result.error || 'Failed to fetch users';
        setError(errorMessage);
        console.error('❌ USER_FETCH_FAILED:', errorMessage);
      }
    } catch (err: any) {
      const errorMessage = `Unexpected error: ${err.message}`;
      setError(errorMessage);
      console.error('💥 USER_FETCH_EXCEPTION:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setError(result.error || 'Failed to delete user');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FaUserShield style={{ color: '#dc2626' }} />;
      case 'mini_admin':
        return <FaUserTie style={{ color: '#2563eb' }} />;
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
      case 'admin':
        return { ...baseStyle, backgroundColor: '#fef2f2', color: '#dc2626' };
      case 'mini_admin':
        return { ...baseStyle, backgroundColor: '#eff6ff', color: '#2563eb' };
      case 'teacher':
        return { ...baseStyle, backgroundColor: '#f0fdf4', color: '#059669' };
      case 'student':
        return { ...baseStyle, backgroundColor: '#faf5ff', color: '#7c3aed' };
      default:
        return { ...baseStyle, backgroundColor: '#f9fafb', color: '#6b7280' };
    }
  };

  const filteredUsers = users.filter(user => {
    console.log("User:", user.role, "Selected:", selectedRole);
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase().replace('-', '_') === selectedRole.toLowerCase().replace('-', '_');
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
        <h1 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, margin: 0, color: colors.text.primary }}>
          User Management
        </h1>
        <button
          onClick={() => window.location.href = '/admin/create-user'}
          style={{
            ...commonStyles.button.primary,
            backgroundColor: colors.primary.darker,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: typography.fontSize.sm,
          }}
        >
          Create User
        </button>
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
          <option value="admin">Admin</option>
          <option value="mini_admin">Mini-Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        // overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#374151'
        }}>
          <div>User Details</div>
          <div>Role</div>
          <div>Created</div>
          <div>Delete</div>
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
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                alignItems: 'center'
              }}
            >
              {/* <div style={{ fontWeight: '500', color: '#374151' }}>
                #{user.id}
              </div> */}
              
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
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* <button
                  onClick={() => console.log('Edit user:', user.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px'
                  }}
                  title="Edit user"
                >
                  <FaEdit />
                </button> */}
                
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#dc2626'
                    }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                )}
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
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}

export default UserList;
