import React, { useEffect, useState } from "react";
import { FaBook, FaClipboardList, FaCheckCircle, FaClock, FaBell, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { colors, commonStyles, borderRadius, typography } from "../../styles/constants";

interface RecentActivity {
  enrollments: Array<{
    id: number;
    course_title: string;
    enrolled_at: string;
  }>;
  submissions: Array<{
    id: number;
    assignment_title: string;
    course_title: string;
    submitted_at: string;
  }>;
  upcoming_assignments: Array<{
    id: number;
    title: string;
    course_title: string;
    due_date: string;
  }>;
}

interface StudentStats {
  total_courses: number;
  total_assignments: number;
  completed_assignments: number;
  pending_assignments: number;
  recent_activity: RecentActivity;
}

const base_url = "http://localhost:3000/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudentStats>({
    total_courses: 0,
    total_assignments: 0,
    completed_assignments: 0,
    pending_assignments: 0,
    recent_activity: {
      enrollments: [],
      submissions: [],
      upcoming_assignments: []
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
        const response = await fetch(`${base_url}/dashboard/student_stats`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const dashboardStats = await response.json();
          setStats(dashboardStats);
        } else {
          const errorData = await response.json();
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
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading your dashboard...</div>;
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
        <h1 style={titleStyle}>Student Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <FaBook style={iconStyle} />
          <div style={statNumberStyle}>{stats.total_courses}</div>
          <div style={statLabelStyle}>Enrolled Courses</div>
        </div>

        <div style={statCardStyle}>
          <FaClipboardList style={iconStyle} />
          <div style={statNumberStyle}>{stats.total_assignments}</div>
          <div style={statLabelStyle}>Total Assignments</div>
        </div>

        <div style={statCardStyle}>
          <FaClock style={iconStyle} />
          <div style={statNumberStyle}>{stats.pending_assignments}</div>
          <div style={statLabelStyle}>Pending</div>
        </div>

        <div style={statCardStyle}>
          <FaCheckCircle style={iconStyle} />
          <div style={statNumberStyle}>{stats.completed_assignments}</div>
          <div style={statLabelStyle}>Completed</div>
        </div>

        {/* <div style={{
          ...statCardStyle,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
        }}>
          <FaCheckCircle style={iconStyle} />
          <div style={statNumberStyle}>{stats.completed_assignments}</div>
          <div style={statLabelStyle}>Completed</div>
        </div>

        <div style={{
          ...statCardStyle,
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
        }}>
          <FaClock style={iconStyle} />
          <div style={statNumberStyle}>{stats.pending_assignments}</div>
          <div style={statLabelStyle}>Pending</div>
        </div> */}
      </div>

      {/* Actions */}
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
            My Courses
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            View your enrolled courses and explore new ones to join.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/student/courses')}
          >
            View Courses
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
            Assignments
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            View and submit your assignments, track deadlines and progress.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/student/assignments')}
          >
            View Assignments
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
            <FaBell style={{ color: colors.primary.light }} />
            My Profile
          </h3>
          <p style={{ color: colors.text.secondary, marginBottom: "15px", lineHeight: "1.6" }}>
            Update your personal information and account settings.
          </p>
          <button 
            style={actionButtonStyle}
            onClick={() => navigate('/student/profile')}
          >
            Edit Profile
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
          Recent Activity & Upcoming Deadlines
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Recent Enrollments */}
          {stats.recent_activity.enrollments.map((enrollment) => (
            <div key={`enrollment-${enrollment.id}`} style={{
              ...commonStyles.activity.item,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: "5px" }}>
                Enrolled: {enrollment.course_title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Recent Submissions */}
          {stats.recent_activity.submissions.map((submission) => (
            <div key={`submission-${submission.id}`} style={{
              ...commonStyles.activity.item,
              ...commonStyles.activity.success,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.status.successDark, marginBottom: "5px" }}>
                Submitted: {submission.assignment_title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                Course: {submission.course_title} - {new Date(submission.submitted_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Upcoming Assignments */}
          {stats.recent_activity.upcoming_assignments.map((assignment) => (
            <div key={`upcoming-${assignment.id}`} style={{
              ...commonStyles.activity.item,
              ...commonStyles.activity.warning,
            }}>
              <div style={{ fontWeight: typography.fontWeight.semibold, color: colors.status.warningDark, marginBottom: "5px" }}>
                Due Soon: {assignment.title}
              </div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm }}>
                Course: {assignment.course_title} - Due: {new Date(assignment.due_date).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Show message if no recent activity */}
          {stats.recent_activity.enrollments.length === 0 && 
           stats.recent_activity.submissions.length === 0 && 
           stats.recent_activity.upcoming_assignments.length === 0 && (
            <div style={{
              padding: "30px",
              backgroundColor: colors.secondary.lightBlue,
              borderRadius: borderRadius.large,
              textAlign: "center",
              color: colors.text.secondary,
              border: `2px dashed ${colors.primary.main}`
            }}>
              <div style={{ fontSize: typography.fontSize['5xl'], marginBottom: "15px" }}>🎓</div>
              <h3 style={{ color: colors.text.primary, marginBottom: "10px" }}>Welcome to Your Student Dashboard!</h3>
              <p style={{ marginBottom: "20px" }}>
                {stats.total_courses === 0 
                  ? "Start your learning journey by enrolling in courses."
                  : "No recent activity to display. Keep up the great work!"}
              </p>
              {stats.total_courses === 0 && (
                <button
                  onClick={() => navigate('/student/courses')}
                  style={commonStyles.button.primary}
                >
                  Browse Courses
                </button>
              )}
            </div>
          )}
        </div>
      </div>
        </div>
    );
}

export default Dashboard;