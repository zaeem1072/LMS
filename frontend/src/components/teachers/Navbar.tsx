import { FaTachometerAlt, FaBook, FaClipboardList, FaUserGraduate, FaUser, FaSignOutAlt } from "react-icons/fa"
import { authService } from '../../services/auth';
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from "react-router-dom"
import { colors, commonStyles, borderRadius, typography } from "../../styles/constants";

import Courses from "./courses";
import Assignments from "./assignments";
// import Students from "./students";
import Profile from "./profile";
import Dashboard from "./dashboard";

interface NavbarProps {
  onLogout?: () => void;
}

const sidebarStyle = commonStyles.sidebar;

function TeacherDashboard({ onLogout }: NavbarProps) {
  const [loading, setLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const handleLogout = async () => {
    setLoading(true);
    const result = await authService.logout();
    if (result.success && onLogout) {
      onLogout();
    }
    setLoading(false);
  };

  const isActive = (path: string) => {
    if (path === '/teacher/dashboard' || path === '/teacher/') {
      return location.pathname === '/teacher/' || location.pathname === '/teacher/dashboard';
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
          Teacher Dashboard
        </div>
        <Link 
          to="/teacher/dashboard"
          style={getNavItemStyle('/teacher/dashboard', 'dashboard')}
          onMouseEnter={() => setHoveredItem('dashboard')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaTachometerAlt style={{ marginRight: "10px", fontSize: "18px" }} /> Dashboard
        </Link>
        
        <Link 
          to="/teacher/courses"
          style={getNavItemStyle('/teacher/courses', 'courses')}
          onMouseEnter={() => setHoveredItem('courses')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaBook style={{ marginRight: "10px", fontSize: "18px" }} /> My Courses
        </Link>
        
        <Link 
          to="/teacher/assignments"
          style={getNavItemStyle('/teacher/assignments', 'assignments')}
          onMouseEnter={() => setHoveredItem('assignments')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaClipboardList style={{ marginRight: "10px", fontSize: "18px" }} /> Assignments
        </Link>
        
        {/* <Link 
          to="/teacher/students"
          style={getNavItemStyle('/teacher/students', 'students')}
          onMouseEnter={() => setHoveredItem('students')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUserGraduate style={{ marginRight: "10px", fontSize: "18px" }} /> Students
        </Link> */}
        
        <Link 
          to="/teacher/profile"
          style={getNavItemStyle('/teacher/profile', 'profile')}
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
          {/* <Route path="/students" element={<Students />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default TeacherDashboard
