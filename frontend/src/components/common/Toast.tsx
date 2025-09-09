import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { colors, borderRadius, typography, shadows } from '../../styles/constants';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      borderRadius: borderRadius.large,
      boxShadow: shadows.large,
      minWidth: '300px',
      maxWidth: '500px',
      margin: '8px',
      position: 'relative' as const,
      cursor: 'pointer',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isExiting ? 0 : (isVisible ? 1 : 0),
      transition: 'all 0.3s ease-in-out',
      border: '1px solid',
    };

    switch (toast.type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: colors.status.successLight,
          borderColor: colors.status.success,
          color: colors.status.successDark,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: colors.status.errorLight,
          borderColor: colors.status.error,
          color: colors.status.error,
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: colors.status.warningLight,
          borderColor: colors.status.warning,
          color: colors.status.warningDark,
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: colors.status.infoLight,
          borderColor: colors.primary.light,
          color: colors.text.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    const iconStyle = { fontSize: '20px', marginTop: '2px' };
    
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle style={{ ...iconStyle, color: colors.status.success }} />;
      case 'error':
        return <FaTimesCircle style={{ ...iconStyle, color: colors.status.error }} />;
      case 'warning':
        return <FaExclamationTriangle style={{ ...iconStyle, color: colors.status.warning }} />;
      case 'info':
        return <FaInfoCircle style={{ ...iconStyle, color: colors.primary.light }} />;
      default:
        return <FaInfoCircle style={iconStyle} />;
    }
  };

  return (
    <div style={getToastStyles()} onClick={handleClose}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.base,
            marginBottom: '4px',
          }}>
            {toast.title}
          </div>
        )}
        <div style={{
          fontSize: typography.fontSize.sm,
          lineHeight: '1.4',
        }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: borderRadius.small,
          color: 'inherit',
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
