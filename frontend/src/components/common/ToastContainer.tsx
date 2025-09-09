import React from 'react';
import Toast from './Toast';
import type { ToastMessage } from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onRemoveToast, 
  position = 'top-right' 
}) => {
  const getContainerPosition = () => {
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 9999,
      pointerEvents: 'none' as const,
    };

    switch (position) {
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px' };
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px' };
      case 'top-center':
        return { ...baseStyle, top: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center':
        return { ...baseStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
      default:
        return { ...baseStyle, top: '20px', right: '20px' };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div style={getContainerPosition()}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast toast={toast} onClose={onRemoveToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
