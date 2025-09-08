import { FaUser, FaEnvelope, FaUserTie, FaCalendarAlt, FaEye, FaSearch, FaUserPlus, FaUserTimes, FaUserShield, FaUserEdit } from 'react-icons/fa';
import { colors, gradients, commonStyles, borderRadius, typography } from '../../styles/constants';


function Profile() {
  const userRole = localStorage.getItem('userRole') || 'mini_admin';
  const userEmail = 'mini@admin.com';

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, margin: 0, marginBottom: '8px', color: colors.text.primary }}>
          Mini-Admin Profile
        </h1>
      </div>

      <div style={{
        ...commonStyles.card,
        overflow: 'hidden'
      }}>
        {/* Profile Header */}
        <div style={{
          background: gradients.primary,
          padding: '2rem',
          color: colors.text.white,
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
            <FaUserTie />
          </div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: typography.fontSize['4xl'] }}>
            Mini Administrator
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Limited admin access for user oversight
          </p>
        </div>

        {/* Profile Information */}
        <div style={{ padding: '2rem' }}>
                      <h3 style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: '1.5rem',
            color: colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaUser /> Profile Information
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
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
                backgroundColor: colors.primary.light,
                borderRadius: borderRadius.medium,
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
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.medium,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaUserTie />
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
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    LIMITED ADMIN
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
                backgroundColor: colors.status.success,
                borderRadius: borderRadius.medium,
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

        {/* Mini-Admin Privileges */}
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaEye /> Mini-Admin Permissions
          </h4>

          {/* List of mini-admin capabilities */}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaEye color="#1f2937" /> View teachers and students
            </div>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaSearch color="#1f2937" /> Search user database
            </div>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserPlus color="red" /> Cannot create users
            </div>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserTimes color="red" /> Cannot delete users
            </div>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserShield color="red" /> Cannot view admin accounts
            </div>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUserEdit color="red" /> Cannot modify user data
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '12px',
            backgroundColor: '#fef7cd',
            borderRadius: '6px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
              Your account was created by an administrator. Contact an admin for permission changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
