import { FaTachometerAlt,FaUser, FaSignOutAlt, FaEye } from "react-icons/fa"
import { authService } from '../../services/auth';
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from "react-router-dom"

import Dashboard from "./dashboard";
import UserList from "./userList";
import Profile from "./profile";

interface NavbarProps {
  onLogout?: () => void;
}

const sidebarStyle = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%", 
    margin: 0,
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
    background: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column" as const,
  },
  main: {
    flex: 1, 
    backgroundColor: "#fff",
    padding: "1.5rem",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "0.5rem",
    marginBottom: "1.5rem",
  },
  icon: {
    marginRight: "10px",
    fontSize: "18px",
  },
}

function MiniAdminDashboard({ onLogout }: NavbarProps) {
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
    if (path === '/mini-admin/dashboard' || path === '/mini-admin/') {
      return location.pathname === '/mini-admin/' || location.pathname === '/mini-admin/dashboard';
    }
    return location.pathname === path;
  };

  const getNavItemStyle = (path: string, itemKey: string) => {
    const isItemActive = isActive(path);
    const isHovered = hoveredItem === itemKey;
    
    return {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      margin: "4px 12px",
      cursor: "pointer",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: isItemActive ? "600" : "500",
      color: "#ecececff",
      borderRadius: isItemActive ? "12px" : "8px",
      ...(isItemActive ? {
        background: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
        boxShadow: "0 4px 12px rgba(75, 108, 183, 0.4)",
        transform: "none"
      } : {}),
      ...(isHovered && !isItemActive ? {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px"
      } : {}),
      transition: "all 0.3s ease"
    };
  };

  return (
    <div style={sidebarStyle.container}>
      <aside style={sidebarStyle.sidebar}>
        <div style={{ fontSize: "18px", fontWeight: "bold", padding: "0 1rem 1.5rem", color: "#ecececff" }}>
          Mini-Admin Panel
        </div>
        
        <Link 
          to="/mini-admin/dashboard"
          style={getNavItemStyle('/mini-admin/dashboard', 'dashboard')}
          onMouseEnter={() => setHoveredItem('dashboard')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaTachometerAlt style={sidebarStyle.icon} /> Dashboard
        </Link>
        
        <Link 
          to="/mini-admin/users"
          style={getNavItemStyle('/mini-admin/users', 'users')}
          onMouseEnter={() => setHoveredItem('users')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaEye style={sidebarStyle.icon} /> View Users
        </Link>
        
        <Link 
          to="/mini-admin/profile"
          style={getNavItemStyle('/mini-admin/profile', 'profile')}
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaUser style={sidebarStyle.icon} /> Profile
        </Link>
      </aside>

      <main style={sidebarStyle.main}>
        <div style={sidebarStyle.topbar}>
          {/* <h2>Mini-Admin Dashboard</h2> */}
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
                backgroundColor: "#4b6cb7",
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default MiniAdminDashboard
