import { FaTachometerAlt, FaBook, FaClipboardList,FaUser, FaSignOutAlt } from "react-icons/fa"
import { authService } from '../../services/auth';
import { useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { colors, commonStyles, borderRadius, typography } from "../../styles/constants";

import Courses from "../studetns/courses";
import Assignments from "../studetns/assignments";
import Profile from "../studetns/profile";
import Dashboard from "../studetns/dashboard";

interface NavbarProps {
  onLogout?: () => void;
}

const sidebarStyle = commonStyles.sidebar;

function StudentDashboard({ onLogout }: NavbarProps) {
  const [loading, setLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setLoading(true);
    await authService.logout();
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    // Call parent logout handler
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to login
    navigate('/login');
    setLoading(false);
  };

  const isActive = (path: string) => {
    if (path === '/student/dashboard' || path === '/student/') {
      return location.pathname === '/student/' || location.pathname === '/student/dashboard';
    }
    return location.pathname === path;
  };

  const getNavItemStyle = (path: string, itemKey: string) => {
    const isItemActive = isActive(path);
    const isHovered = hoveredItem === itemKey;
    
    return {
      ...sidebarStyle.navItem,
      fontWeight: isItemActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
      borderRadius: isItemActive ? borderRadius.large : borderRadius.medium,
      ...(isItemActive ? sidebarStyle.navItemActive : {}),
      ...(isHovered && !isItemActive ? sidebarStyle.navItemHover : {}),
    };
  };

  return (
    <div style={sidebarStyle.container}>
      <aside style={sidebarStyle.sidebar}>
        <div style={{ 
          fontSize: typography.fontSize.lg, 
          fontWeight: typography.fontWeight.bold, 
          padding: "0 1rem 1.5rem",
          color: colors.text.light 
        }}>
          Student Dashboard
        </div>
        <Link 
          to="/student/dashboard"
          style={getNavItemStyle('/student/dashboard', 'dashboard')}
          onMouseEnter={() => setHoveredItem('dashboard')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaTachometerAlt style={{ marginRight: "10px", fontSize: "18px" }} /> Dashboard
        </Link>
        
        <Link 
          to="/student/courses"
          style={getNavItemStyle('/student/courses', 'courses')}
          onMouseEnter={() => setHoveredItem('courses')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaBook style={{ marginRight: "10px", fontSize: "18px" }} /> My Courses
        </Link>
        
        <Link 
          to="/student/assignments"
          style={getNavItemStyle('/student/assignments', 'assignments')}
          onMouseEnter={() => setHoveredItem('assignments')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaClipboardList style={{ marginRight: "10px", fontSize: "18px" }} /> Assignments
        </Link>
        
        <Link 
          to="/student/profile"
          style={getNavItemStyle('/student/profile', 'profile')}
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUser style={{ marginRight: "10px", fontSize: "18px" }} /> Profile
        </Link>
      </aside>

      <main style={sidebarStyle.main}>
        <div style={sidebarStyle.topbar}>
          <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              alignItems: "flex-start",
              width: "100%"
            }}>
            <button 
              onClick={handleLogout}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: colors.primary.darker,
                color: colors.text.white,
                border: "none",
                borderRadius: borderRadius.medium,
                cursor: "pointer",
                fontSize: typography.fontSize.sm,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FaSignOutAlt />
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/courses" element={<Courses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default StudentDashboard;
