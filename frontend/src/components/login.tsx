import React, { useState } from 'react';
import { authService } from '../services/auth';
import { Link } from 'react-router-dom';
import { colors, gradients, shadows, borderRadius, typography } from "../styles/constants";
import { useToastContext } from '../contexts/ToastContext';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setRole(null);

    const result = await authService.login(email, password);
    
    if (result.success) {
      showSuccess('Login successful!', 'Welcome Back');
      setRole(result.role || 'student');
      onLogin(result.role || 'student');
    } else {
      showError(result.error || 'Login failed', 'Login Failed');
      setMessage(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const loginStyle = {
    container: {
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: colors.neutral.gray800,
      borderRadius: borderRadius.large,
      boxShadow: shadows.large,
      border: `1px solid ${colors.neutral.gray700}`
    },
    title: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      textAlign: 'center' as const,
      marginBottom: '2rem',
      color: colors.text.white,
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.gray300,
      marginBottom: '0.25rem'
    },
    input: {
      padding: '0.75rem',
      border: `2px solid ${colors.neutral.gray600}`,
      borderRadius: borderRadius.medium,
      fontSize: typography.fontSize.base,
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: colors.neutral.gray700,
      color: colors.text.white,
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: colors.primary.light,
      color: colors.text.white,
      border: 'none',
      borderRadius: borderRadius.medium,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '1rem',
    },
    link: {
      textAlign: 'center' as const,
      marginTop: '1.5rem',
      fontSize: typography.fontSize.sm,
      color: colors.text.muted
    },
    linkText: {
      color: colors.primary.light,
      textDecoration: 'none',
      fontWeight: typography.fontWeight.semibold,
    },
    message: {
      padding: '0.75rem',
      borderRadius: borderRadius.medium,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      marginTop: '1rem',
      textAlign: 'center' as const
    },
    successMessage: {
      backgroundColor: colors.status.successLight,
      color: colors.status.successDark,
      border: `1px solid ${colors.status.success}`
    },
    errorMessage: {
      backgroundColor: colors.status.errorLight,
      color: colors.status.error,
      border: `1px solid ${colors.status.error}`
    },
    roleDisplay: {
      padding: '0.75rem',
      backgroundColor: colors.neutral.gray700,
      borderRadius: borderRadius.medium,
      textAlign: 'center' as const,
      marginTop: '1rem',
      fontSize: typography.fontSize.sm,
      color: colors.neutral.gray300,
      border: `1px solid ${colors.neutral.gray600}`
    }
  };

  return (
    <div style={loginStyle.container}>
      <h1 style={loginStyle.title}>Login</h1>
      <form onSubmit={handleSubmit} style={loginStyle.form}>
        <div style={loginStyle.inputGroup}>
          <label style={loginStyle.label}>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={loginStyle.input}
            placeholder="Enter your email"
          />
        </div>
        <div style={loginStyle.inputGroup}>
          <label style={loginStyle.label}>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={loginStyle.input}
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...loginStyle.button,
            ...(loading ? { backgroundColor: colors.text.muted, cursor: 'not-allowed' } : {}),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={loginStyle.link}>
        Don't have an account? <Link to="/signup" style={loginStyle.linkText}>Sign up</Link>
      </div>

      {message && (
        <div style={{
          ...loginStyle.message,
          ...(message.includes('successful') ? loginStyle.successMessage : loginStyle.errorMessage)
        }}>
          {message}
        </div>
      )}

      {role && (
        <div style={loginStyle.roleDisplay}>
          Your role: <strong>{role}</strong>
        </div>
      )}
    </div>
  );
};

export default Login;
