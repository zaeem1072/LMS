import { useState } from 'react';
import { authService } from '../services/auth';

interface SignOutProps {
  onLogout: () => void;
}

const SignOut = ({ onLogout }: SignOutProps) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    setMessage('');

    const result = await authService.logout();
    
    if (result.success) {
      setMessage('Signed out successfully!');
      onLogout();
    } else {
      setMessage('Sign out failed');
    }
    
    setLoading(false);
  };

  const signoutStyle = {
    container: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      border: '1px solid #374151'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      textAlign: 'center' as const,
      marginBottom: '1rem',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      textAlign: 'center' as const,
      color: '#9ca3af',
      fontSize: '1rem',
      marginBottom: '2rem'
    },
    logoutSection: {
      backgroundColor: '#374151',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #4b5563',
      textAlign: 'center' as const
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#f3f4f6',
      marginBottom: '1rem'
    },
    button: {
      padding: '0.75rem 2rem',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '1rem'
    },
    message: {
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '1rem',
      textAlign: 'center' as const
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fca5a5'
    }
  };

  return (
    <div style={signoutStyle.container}>
      <h1 style={signoutStyle.title}>Dashboard</h1>
      <p style={signoutStyle.subtitle}>You are currently logged in!</p>
      
      <div style={signoutStyle.logoutSection}>
        <h2 style={signoutStyle.sectionTitle}>Account Management</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Ready to sign out? Click the button below to securely log out of your account.
        </p>
        <button 
          onClick={handleSignOut} 
          disabled={loading}
          style={{
            ...signoutStyle.button,
            ...(loading ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {})
          }}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
        
        {message && (
          <div style={{
            ...signoutStyle.message,
            ...(message.includes('successfully') ? signoutStyle.successMessage : signoutStyle.errorMessage)
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignOut;
