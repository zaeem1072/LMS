import { FaUser, FaEnvelope, FaUserShield, FaCalendarAlt } from 'react-icons/fa';

function Profile() {
  const userRole = localStorage.getItem('userRole') || 'admin';
  const userEmail = 'admin@example.com'; 

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
          Admin Profile
        </h1>
        {/* <p style={{ color: '#6b7280', margin: 0 }}>
          Manage your admin account settings and information
        </p> */}
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          padding: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '32px'
          }}>
            <FaUserShield />
          </div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '24px' }}>
            System Administrator
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Full system access and management
          </p>
        </div>

        {/* Profile Information */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaUser /> Profile Information
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Email */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1e3c72',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaEnvelope />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                  Email Address
                </div>
                <div style={{ fontWeight: '500', color: '#111827' }}>
                  {userEmail}
                </div>
              </div>
            </div>

            {/* Role */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dc2626',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaUserShield />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                  Role
                </div>
                <div style={{ 
                  fontWeight: '500', 
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {userRole}
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    SUPER USER
                  </span>
                </div>
              </div>
            </div>

            {/* Account Created */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#059669',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaCalendarAlt />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                  Account Created
                </div>
                <div style={{ fontWeight: '500', color: '#111827' }}>
                  {new Date().toLocaleDateString()} 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Privileges */}
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#dc2626'
          }}>
            Administrator Privileges
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              Create and manage all users
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              Create mini-admin accounts
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              Full system access
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              Delete user accounts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
