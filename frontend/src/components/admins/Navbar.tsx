import { FaTachometerAlt, FaUsers, FaUserPlus, FaUser, FaSignOutAlt } from "react-icons/fa"
import { authService } from '../../services/auth';
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from "react-router-dom"
import { colors, commonStyles, borderRadius, typography } from "../../styles/constants";

import Dashboard from "./dashboard";
import UserList from "./userList";
import UserForm from "./userForm";
import Profile from "./profile";

interface NavbarProps {
  onLogout?: () => void;
}

const sidebarStyle = commonStyles.sidebar;

function AdminDashboard({ onLogout }: NavbarProps) {
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
    if (path === '/admin/dashboard' || path === '/admin/') {
      return location.pathname === '/admin/' || location.pathname === '/admin/dashboard';
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
          Admin Panel
        </div>
        
        <Link 
          to="/admin/dashboard"
          style={getNavItemStyle('/admin/dashboard', 'dashboard')}
          onMouseEnter={() => setHoveredItem('dashboard')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaTachometerAlt style={{ marginRight: "10px", fontSize: "18px" }} /> Dashboard
        </Link>
        
        <Link 
          to="/admin/users"
          style={getNavItemStyle('/admin/users', 'users')}
          onMouseEnter={() => setHoveredItem('users')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUsers style={{ marginRight: "10px", fontSize: "18px" }} /> Manage Users
        </Link>
        
        <Link 
          to="/admin/create-user"
          style={getNavItemStyle('/admin/create-user', 'create-user')}
          onMouseEnter={() => setHoveredItem('create-user')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUserPlus style={{ marginRight: "10px", fontSize: "18px" }} /> Create User
        </Link>
        
        <Link 
          to="/admin/profile"
          style={getNavItemStyle('/admin/profile', 'profile')}
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUser style={{ marginRight: "10px", fontSize: "18px" }} /> Profile
        </Link>
      </aside>

      <main style={sidebarStyle.main}>
        <div style={sidebarStyle.topbar}>
          {/* <h2>Admin Dashboard</h2> */}
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
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
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
          <Route path="/users" element={<UserList />} />
          <Route path="/create-user" element={<UserForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminDashboard
