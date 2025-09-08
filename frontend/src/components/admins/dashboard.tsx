import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaUser,
  FaUserShield,
  FaChartBar,
} from "react-icons/fa";
import { userService } from "../../services/user";
import type { User } from "../../services/user";

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    miniAdmins: 0,
    teachers: 0,
    students: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await userService.getUsers();
    if (result.success && result.users) {
      setUsers(result.users);
      const newStats = {
        total: result.users.length,
        admins: result.users.filter((u) => u.role === "admin").length,
        miniAdmins: result.users.filter((u) => u.role === "mini_admin").length,
        teachers: result.users.filter((u) => u.role === "teacher").length,
        students: result.users.filter((u) => u.role === "student").length,
      };
      setStats(newStats);
    }
    setLoading(false);
  };

  const StatCard = ({
    title,
    count,
    icon,
    color,
    bgColor,
    borderColor,
  }: {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor?: string;
  }) => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: `2px solid ${borderColor || "#e5e7eb"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top-right decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60px",
          height: "60px",
          backgroundColor: bgColor,
          borderRadius: "0 12px 0 100%",
          opacity: 0.1,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
            {title}
          </div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#111827" }}>
            {count}
          </div>
        </div>
        <div style={{ fontSize: "24px", color }}>{icon}</div>
      </div>
    </div>
  );

  const getRecentUsers = () => {
    return users
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Users"
          count={stats.total}
          icon={<FaUsers />}
          color="#1e3c72"
          bgColor="#e0e7ff"
          borderColor="#1e3c72"
        />

        <StatCard
          title="Admins"
          count={stats.admins}
          icon={<FaUserShield />}
          color="#dc2626"
          bgColor="#fef2f2"
          borderColor="#dc2626"
        />

        <StatCard
          title="Mini-Admins"
          count={stats.miniAdmins}
          icon={<FaUserShield />}
          color="#2563eb"
          bgColor="#eff6ff"
          borderColor="#2563eb"
        />

        <StatCard
          title="Teachers"
          count={stats.teachers}
          icon={<FaUser />}
          color="#059669"
          bgColor="#f0fdf4"
          borderColor="#059669"
        />

        <StatCard
          title="Students"
          count={stats.students}
          icon={<FaUserGraduate />}
          color="#7c3aed"
          bgColor="#faf5ff"
          borderColor="#7c3aed"
        />
      </div>

      {/* Recent Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Recent Users */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaChartBar /> Recent Users
          </h3>

          <div>
            {getRecentUsers().map((user, index) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom:
                    index < getRecentUsers().length - 1
                      ? "1px solid #e5e7eb"
                      : "none",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.email}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>
                    {user.email}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor:
                        user.role === "admin"
                          ? "#fef2f2"
                          : user.role === "teacher"
                          ? "#f0fdf4"
                          : "#faf5ff",
                      color:
                        user.role === "admin"
                          ? "#dc2626"
                          : user.role === "teacher"
                          ? "#059669"
                          : "#7c3aed",
                    }}
                  >
                    {user.role}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "2px",
                    }}
                  >
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#374151",
            }}
          >
            Actions
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => (window.location.href = "/admin/create-user")}
              style={{
                padding: "12px 16px",
                backgroundColor: "#1e3c72",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              Create New User
            </button>

            <button
              onClick={() => (window.location.href = "/admin/users")}
              style={{
                padding: "12px 16px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              Manage Users
            </button>

            <button
              onClick={() => fetchUsers()}
              style={{
                padding: "12px 16px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
