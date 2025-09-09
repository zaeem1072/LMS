import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaArrowLeft, FaSave } from 'react-icons/fa';
import { userService } from '../../services/user';
import { colors,commonStyles,typography } from '../../styles/constants';

function UserForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    role: 'student',
    first_name: '',
    last_name: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(false);

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      setErrors(['Password and confirmation do not match']);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrors(['Password must be at least 6 characters long']);
      setLoading(false);
      return;
    }

    const result = await userService.createUser(formData);
    
    if (result.success) {
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        first_name: '',
        last_name: ''
      });
    } else {
      setErrors(result.errors || [result.error || 'Failed to create user']);
    }
    
    setLoading(false);
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access - can manage all users and settings';
      case 'mini_admin':
        return 'Limited admin access - can view teachers and students';
      case 'teacher':
        return 'Can create courses, assignments, and manage students';
      case 'student':
        return 'Can enroll in courses and submit assignments';
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        <button
          onClick={() => window.location.href = '/admin/users'}
          style={{
            padding: '8px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FaArrowLeft />
        </button>
        <h1 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, margin: 0, color: colors.text.primary }}>
          Create New User
        </h1>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#166534',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #bbf7d0'
        }}>
        User created successfully!
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #fecaca'
        }}>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form */}
      <div style={{
        ...commonStyles.card,
        padding: '2rem',
        maxWidth: '600px'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaUser /> Personal Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                <FaEnvelope style={{ marginRight: '6px' }} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Account Security */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaLock /> Account Security
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaUserTag /> Role Assignment
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                User Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="mini_admin">Mini Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {/* Role Description */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                <strong>Role Description:</strong> {getRoleDescription(formData.role)}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#1e3c72',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: 'auto'
              }}
            >
              <FaSave />
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
