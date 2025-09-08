// Centralized styling constants for consistent design across the app

export const colors = {
  // Primary Purple Palette
  primary: {
    light: '#667eea',        // Light purple
    main: '#764ba2',         // Main purple
    dark: '#581f89',         // Dark purple
    darker: '#3b1052',       // Darker purple
    darkest: '#2a0d3e',      // Darkest purple
    accent: '#33093e',       // Purple accent
  },
  
  // Secondary Colors that work well with purple
  secondary: {
    lightBlue: '#f0f9ff',    // Very light blue background
    blue: '#dbeafe',         // Light blue background
    teal: '#10b981',         // Success/completed color
    orange: '#f59e0b',       // Warning/pending color
    green: '#059669',        // Success variant
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    lightGray: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
  },
  
  // Text Colors
  text: {
    primary: '#2a0d3e',      // Dark purple for headings
    secondary: '#64748b',     // Gray for body text
    light: '#ecececff',      // Light text for dark backgrounds
    muted: '#9ca3af',        // Muted text
    white: '#ffffff',        // White text
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    successLight: '#d1fae5',
    successDark: '#065f46',
    warning: '#f59e0b',
    warningLight: '#fffbeb',
    warningDark: '#92400e',
    error: '#dc2626',
    errorLight: '#fee2e2',
    errorDark: '#dc2626',
    info: '#667eea',
    infoLight: '#f0f9ff',
    infoDark: '#2a0d3e',
  }
};

export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  primaryReverse: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
};

export const shadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
  large: '0 10px 25px rgba(0, 0, 0, 0.1)',
  purple: '0 10px 25px rgba(79, 18, 90, 0.3)',
  purpleButton: '0 4px 15px rgba(102, 126, 234, 0.4)',
  card: '0 10px 25px rgba(59, 130, 246, 0.1)',
};

export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  xl: '16px',
  full: '50%',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
};

// Common component styles
export const commonStyles = {
  // Container styles
  container: {
    padding: '30px',
    background: gradients.background,
    minHeight: '100%',
  },
  
  // Card styles
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '25px',
    boxShadow: shadows.card,
    border: `1px solid ${colors.primary.darkest}`,
  },
  
  // Button styles
  button: {
    primary: {
      background: gradients.primary,
      color: colors.text.white,
      border: 'none',
      borderRadius: borderRadius.large,
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      boxShadow: shadows.purpleButton,
      transition: 'all 0.3s ease',
    },
    secondary: {
      backgroundColor: colors.neutral.white,
      color: colors.text.primary,
      border: `2px solid ${colors.primary.light}`,
      borderRadius: borderRadius.large,
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      transition: 'all 0.3s ease',
    },
    danger: {
      backgroundColor: colors.status.error,
      color: colors.text.white,
      border: 'none',
      borderRadius: borderRadius.large,
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      transition: 'all 0.3s ease',
    }
  },
  
  // Input styles
  input: {
    padding: '12px 16px',
    border: `2px solid ${colors.neutral.gray300}`,
    borderRadius: borderRadius.medium,
    fontSize: typography.fontSize.base,
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: colors.neutral.white,
    color: colors.text.primary,
  },
  
  // Title styles
  title: {
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      margin: 0,
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      margin: 0,
    }
  },
  
  // Stat card styles
  statCard: {
    background: gradients.primary,
    borderRadius: borderRadius.xl,
    padding: '25px',
    color: colors.text.white,
    boxShadow: shadows.purple,
    transition: 'transform 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  
  // Sidebar styles
  sidebar: {
    container: {
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      fontFamily: 'Arial, sans-serif',
    },
    sidebar: {
      width: '240px',
      background: gradients.primary,
      padding: '1rem 0',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      margin: '4px 12px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.light,
      borderRadius: borderRadius.medium,
      transition: 'all 0.3s ease',
    },
    navItemActive: {
      background: gradients.primary,
      boxShadow: shadows.purple,
      borderRadius: borderRadius.large,
      fontWeight: typography.fontWeight.semibold,
    },
    navItemHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: borderRadius.medium,
    },
    main: {
      flex: 1,
      backgroundColor: colors.neutral.white,
      padding: '1.5rem',
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    topbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.neutral.gray200}`,
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
    }
  },
  
  // Grid layouts
  grid: {
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    }
  },
  
  // Activity/notification styles
  activity: {
    item: {
      padding: '15px',
      backgroundColor: colors.secondary.lightBlue,
      borderRadius: borderRadius.medium,
      borderLeft: `4px solid ${colors.primary.light}`,
      marginBottom: '10px',
    },
    success: {
      backgroundColor: colors.status.successLight,
      borderLeft: `4px solid ${colors.status.success}`,
    },
    warning: {
      backgroundColor: colors.status.warningLight,
      borderLeft: `4px solid ${colors.status.warning}`,
    },
    error: {
      backgroundColor: colors.status.errorLight,
      borderLeft: `4px solid ${colors.status.error}`,
    }
  },

  // Loading states
  loading: {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center' as const,
    },
    fullScreen: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
};

// Utility functions for dynamic styling
export const utils = {
  // Get hover styles for buttons
  getButtonHoverStyle: (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
    switch (variant) {
      case 'primary':
        return { transform: 'translateY(-2px)', boxShadow: shadows.large };
      case 'secondary':
        return { backgroundColor: colors.secondary.lightBlue, borderColor: colors.primary.main };
      case 'danger':
        return { backgroundColor: '#b91c1c', transform: 'translateY(-1px)' };
      default:
        return {};
    }
  },
  
  // Get focus styles for inputs
  getInputFocusStyle: () => ({
    borderColor: colors.primary.light,
    boxShadow: `0 0 0 3px rgba(102, 126, 234, 0.2)`,
  }),
  
  // Create responsive grid
  createResponsiveGrid: (minWidth: string = '250px') => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
    gap: spacing.lg,
  }),
};

export default {
  colors,
  gradients,
  shadows,
  borderRadius,
  spacing,
  typography,
  commonStyles,
  utils,
};
