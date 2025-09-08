import React, { useEffect, useState } from "react";
import { FaBook, FaClipboardList, FaUserGraduate, FaBell, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { colors, commonStyles, borderRadius, typography } from "../../styles/constants";

interface RecentActivity {
  courses: Array<{
    id: number;
    title: string;
    created_at: string;
  }>;
  submissions: Array<{
    id: number;
    student_name: string;
    assignment_title: string;
    course_title: string;
    created_at: string;
  }>;
  enrollments: Array<{
    id: number;
    student_name: string;
    course_title: string;
    created_at: string;
  }>;
}

interface DashboardStats {
  total_courses: number;
  total_assignments: number;
  total_students: number;
  pending_submissions: number;
  recent_activity: RecentActivity;
}

const base_url = "http://localhost:3000/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total_courses: 0,
    total_assignments: 0,
    total_students: 0,
    pending_submissions: 0,
    recent_activity: {
      courses: [],
      submissions: [],
      enrollments: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch dashboard stats from the new endpoint
        const statsRes = await fetch(`${base_url}/dashboard/teacher_stats`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (statsRes.ok) {
          const dashboardStats = await statsRes.json();
          setStats(dashboardStats);
        } else {
          const errorData = await statsRes.json();
          setError(errorData.error || 'Failed to fetch dashboard stats');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px", color: "red", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  const containerStyle: React.CSSProperties = commonStyles.container;

  const headerStyle: React.CSSProperties = {
    padding: "20px 0",
  };

  const titleStyle: React.CSSProperties = commonStyles.title.h1;

  const statsGridStyle: React.CSSProperties = commonStyles.grid.stats;

  const statCardStyle: React.CSSProperties = commonStyles.statCard;

  const statNumberStyle: React.CSSProperties = {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: "10px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    opacity: "0.9",
    fontWeight: typography.fontWeight.semibold,
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "2.5rem",
    opacity: "0.3",
  };

  const quickActionsStyle: React.CSSProperties = commonStyles.grid.actions;

  const actionCardStyle: React.CSSProperties = commonStyles.card;

  const actionButtonStyle: React.CSSProperties = {
    ...commonStyles.button.primary,
    width: "100%",
    marginTop: "15px",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Teacher Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <FaBook style={iconStyle} />
          <div style={statNumberStyle}>{stats.total_courses}</div>
          <div style={statLabelStyle}>Active Courses</div>
        </div>

        <div style={statCardStyle}>
          <FaClipboardList style={iconStyle} />
          <div style={statNumberStyle}>{stats.total_assignments}</div>
          <div style={statLabelStyle}>Total Assignments</div>
        </div>

        <div style={statCardStyle}>
          <FaUserGraduate style={iconStyle} />
          <div style={statNumberStyle}>{stats.total_students}</div>
          <div style={statLabelStyle}>Enrolled Students</div>
        </div>

        <div style={statCardStyle}>
          <FaBell style={iconStyle} />
          <div style={statNumberStyle}>{stats.pending_submissions}</div>
          <div style={statLabelStyle}>Pending Reviews</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={quickActionsStyle}>
        <div style={actionCardStyle}>
          <h3 style={{ 
            fontSize: typography.fontSize['2xl'], 
            marginBottom: "15px", 
            color: colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaBook style={{ color: colors.primary.light }} />
            Course Management
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            Create new courses, manage existing ones, and organize your curriculum effectively.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/teacher/courses')}
          >
            Manage Courses
          </button>
        </div>

        <div style={actionCardStyle}>
          <h3 style={{ 
            fontSize: typography.fontSize['2xl'], 
            marginBottom: "15px", 
            color: colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaClipboardList style={{ color: colors.primary.light }} />
            Assignment Center
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            Create assignments, review submissions, and provide feedback to students.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/teacher/assignments')}
          >
            Manage Assignments
          </button>
        </div>

        <div style={actionCardStyle}>
          <h3 style={{ 
            fontSize: typography.fontSize['2xl'], 
            marginBottom: "15px", 
            color: colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaUserGraduate style={{ color: colors.primary.light }} />
            Student Progress
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            Track student performance, view grades, and monitor class engagement.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/teacher/students')}
          >
            View Students
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={actionCardStyle}>
        <h3 style={{ 
          fontSize: typography.fontSize['2xl'], 
          marginBottom: "20px", 
          color: colors.text.primary,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <FaCalendarAlt style={{ color: colors.primary.light }} />
          Recent Activity
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Recent Courses */}
          {stats.recent_activity.courses.map((course) => (
            <div key={`course-${course.id}`} style={{
              ...commonStyles.activity.item,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: "5px" }}>
                Course: {course.title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                Created {new Date(course.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Recent Submissions */}
          {stats.recent_activity.submissions.slice(0, 3).map((submission) => (
            <div key={`submission-${submission.id}`} style={{
              ...commonStyles.activity.item,
              ...commonStyles.activity.success,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.status.successDark, marginBottom: "5px" }}>
                New submission: {submission.assignment_title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                By {submission.student_name} in {submission.course_title} - {new Date(submission.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Recent Enrollments */}
          {stats.recent_activity.enrollments.slice(0, 2).map((enrollment) => (
            <div key={`enrollment-${enrollment.id}`} style={{
              ...commonStyles.activity.item,
              ...commonStyles.activity.warning,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.status.warningDark, marginBottom: "5px" }}>
                New enrollment: {enrollment.course_title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                {enrollment.student_name} enrolled - {new Date(enrollment.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Show message if no recent activity */}
          {stats.recent_activity.courses.length === 0 && 
           stats.recent_activity.submissions.length === 0 && 
           stats.recent_activity.enrollments.length === 0 && (
            <div style={{
              padding: "20px",
              backgroundColor: colors.neutral.lightGray,
              borderRadius: borderRadius.medium,
              textAlign: "center",
              color: colors.text.secondary
            }}>
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;