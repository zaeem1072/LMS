import React, { useState } from 'react';
import { authService } from '../services/auth';
import { Link } from 'react-router-dom';

interface SignupProps {
  onSignup: (role: string) => void;
}

const Signup = ({ onSignup }: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors([]);

    const result = await authService.register(email, password, role);

    if (result.success) {
      setMessage('Registration successful!');
      onSignup(role);
    } else {
      setErrors(result.errors || ['Registration failed']);
    }

    setLoading(false);
  };

  const signupStyle = {
    container: {
      maxWidth: '420px',
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
      marginBottom: '2rem',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#d1d5db',
      marginBottom: '0.25rem'
    },
    input: {
      padding: '0.75rem',
      border: '2px solid #4b5563',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#374151',
      color: '#ffffff'
    },
    select: {
      padding: '0.75rem',
      border: '2px solid #4b5563',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#374151',
      color: '#ffffff',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
      paddingRight: '2.5rem',
      appearance: 'none'
    },
    roleOption: {
      padding: '0.5rem',
      fontSize: '1rem',
      backgroundColor: '#374151',
      color: '#ffffff'
    },
    studentOption: {
      backgroundColor: '#1e3a8a',
      color: '#bfdbfe'
    },
    teacherOption: {
      backgroundColor: '#92400e',
      color: '#fef3c7'
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '1rem'
    },
    link: {
      textAlign: 'center' as const,
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: '#9ca3af'
    },
    linkText: {
      color: '#10b981',
      textDecoration: 'none',
      fontWeight: '600'
    },
    message: {
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '1rem',
      textAlign: 'center' as const,
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    errorContainer: {
      marginTop: '1rem'
    },
    error: {
      padding: '0.5rem 0.75rem',
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fca5a5',
      borderRadius: '6px',
      fontSize: '0.875rem',
      marginBottom: '0.5rem'
    },
    roleDisplay: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: '600',
      textAlign: 'center' as const,
      marginTop: '0.5rem',
      border: '1px solid'
    },
    studentDisplay: {
      backgroundColor: "#1e3a8a",   // deep blue
      color: "#bfdbfe",             // light blue text
      borderColor: "#3b82f6"        // bright blue border
    },
    teacherDisplay: {
      backgroundColor: "#92400e",   // dark orange/brown
      color: "#fef3c7",             // soft yellow text
      borderColor: "#f59e0b"        // bright orange border
    },
    miniAdminDisplay: {
      backgroundColor: "#4c1d95",   // deep purple
      color: "#e9d5ff",             // soft lavender text
      borderColor: "#8b5cf6"        // bright purple border
    },
    unknownDisplay: {
      backgroundColor: "#374151",   // neutral gray
      color: "#f3f4f6",             // light gray/white text
      borderColor: "#6b7280"        // medium gray border
    }

  };

  return (
    <div style={signupStyle.container}>
      <h1 style={signupStyle.title}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={signupStyle.form}>
        <div style={signupStyle.inputGroup}>
          <label style={signupStyle.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={signupStyle.input}
            placeholder="Enter your email"
          />
        </div>
        <div style={signupStyle.inputGroup}>
          <label style={signupStyle.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={signupStyle.input}
            placeholder="Enter your password (min 6 characters)"
          />
        </div>
        <div style={signupStyle.inputGroup}>
          <label style={signupStyle.label}>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              ...signupStyle.select,
              borderColor:
                role === "student"
                  ? "#3b82f6" // blue
                  : role === "teacher"
                    ? "#f59e0b" // orange
                    : role === "mini_admin"
                      ? "#8b5cf6" // purple
                      : "#6b7280", // gray fallback
              backgroundColor:
                role === "student"
                  ? "#1e3a8a" // dark blue
                  : role === "teacher"
                    ? "#92400e" // dark orange/brown
                    : role === "mini_admin"
                      ? "#4c1d95" // deep purple
                      : "#374151", // neutral gray
              color:
                role === "student"
                  ? "#bfdbfe" // light blue
                  : role === "teacher"
                    ? "#fef3c7" // light yellow
                    : role === "mini_admin"
                      ? "#e9d5ff" // light purple
                      : "#f3f4f6", // neutral light
            }}
          >
            <option value="student" style={{ backgroundColor: "#1e3a8a", color: "#bfdbfe" }}>
              Student
            </option>
            <option value="teacher" style={{ backgroundColor: "#92400e", color: "#fef3c7" }}>
              Teacher
            </option>
            <option value="mini_admin" style={{ backgroundColor: "#4c1d95", color: "#e9d5ff" }}>
              Mini Admin
            </option>
          </select>

          <div
            style={{
              ...signupStyle.roleDisplay,
              ...(role === "student"
                ? signupStyle.studentDisplay
                : role === "teacher"
                  ? signupStyle.teacherDisplay
                  : role === "mini_admin"
                    ? signupStyle.miniAdminDisplay
                    : signupStyle.unknownDisplay),
            }}
          >
            {role === "student"
              ? "Selected: Student"
              : role === "teacher"
                ? "Selected: Teacher"
                : role === "mini_admin"
                  ? "Selected: Mini Admin"
                  : "Unknown Role"}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...signupStyle.button,
            ...(loading ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {})
          }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div style={signupStyle.link}>
        Already have an account? <Link to="/login" style={signupStyle.linkText}>Login</Link>
      </div>

      {message && (
        <div style={signupStyle.message}>
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div style={signupStyle.errorContainer}>
          {errors.map((error, index) => (
            <div key={index} style={signupStyle.error}>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Signup;
