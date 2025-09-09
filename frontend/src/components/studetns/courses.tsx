import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { colors, gradients, commonStyles, borderRadius, typography } from "../../styles/constants";
// import "reactjs-popup/dist/index.css";

interface Course {
  id: number;
  title: string;
  description: string;
  syllabus: string;
}

const base_url = "http://localhost:3000/api/v1";

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "enrolled">("all");

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${base_url}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);

        const enrolledRes = await fetch(`${base_url}/enrollments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!enrolledRes.ok) throw new Error("Failed to fetch enrollments");
        const enrolledData = await enrolledRes.json();
        setEnrolledIds(enrolledData.map((enrollment: any) => enrollment.course_id));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (enrolledIds.includes(courseId)) {
      alert("You are already enrolled in this course!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No auth token found");
      return;
    }

    try {
      const res = await fetch(`${base_url}/courses/${courseId}/enrollments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Enrolled successfully!");
        setEnrolledIds((prev) => [...prev, courseId]);
      } else {
        throw new Error(data.error || "Failed to enroll in course");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading courses...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  const displayedCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => enrolledIds.includes(course.id));

  const cardStyle: React.CSSProperties = {
    ...commonStyles.card,
    background: gradients.primary,
    color: colors.text.white,
    transition: "all 0.3s ease",
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  };

  const buttonStyle: React.CSSProperties = {
    ...commonStyles.button.primary,
    background: "linear-gradient(135deg, #1c2961ff 30%, #533077ff 100%)",
    borderRadius: "22px",
    width: "100%",
  };

  const popupContentStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(68, 34, 78, 1) 10%, #6328bcff 70%)",
    borderRadius: borderRadius.xl,
    padding: "40px",
    color: colors.text.white,
  };

  return (
    <div style={commonStyles.container}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            ...buttonStyle,
            width: "auto",
            padding: "10px 20px",
            background: activeTab === "all" ? colors.primary.darkest : colors.primary.main,
          }}
        >
          All Courses
        </button>
        <button
          onClick={() => setActiveTab("enrolled")}
          style={{
            ...buttonStyle,
            width: "auto",
            padding: "10px 20px",
            background: activeTab === "enrolled" ? colors.primary.main : colors.neutral.gray600,
          }}
        >
          Enrolled Courses
        </button>
      </div>

      {displayedCourses.length === 0 ? (
        <div
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📖</div>
          <h3 style={{ color: colors.text.secondary, marginBottom: "1rem" }}>
            {activeTab === "all"
              ? "No courses available"
              : "You have not enrolled in any courses yet"}
          </h3>
          <p style={{ color: colors.text.muted }}>
            {activeTab === "all"
              ? "Check back later for new courses!"
              : "Enroll in courses to see them here!"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "25px",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }}
        >
          {displayedCourses.map((course, index) => (
            <div
              key={course.id}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3
                style={{
                  color: colors.text.white,
                  fontSize: typography.fontSize['2xl'],
                  marginBottom: "12px",
                  fontWeight: typography.fontWeight.bold,
                }}
              >
                {course.title}
              </h3>

              <p
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: "1.6",
                  marginBottom: "16px",
                }}
              >
                {course.description}
              </p>

              <Popup
                trigger={<button style={buttonStyle}>View Course Detail</button>}
                modal
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                contentStyle={{
                  background: "none",
                  border: "none",
                  padding: "0",
                }}
              >
                {(close: any) => (
                  <div style={{
                    background: "linear-gradient(135deg, rgba(68, 34, 78, 1) 10%, #6328bcff 70%)",
                    borderRadius: borderRadius.xl,
                    padding: "40px",
                    color: colors.text.white,
                    position: "relative",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)",
                  }}>
                    <button
                      onClick={close}
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "none",
                        borderRadius: borderRadius.full,
                        width: "35px",
                        height: "35px",
                        color: colors.text.white,
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                    >
                        ✕
                    </button>

                    <h1 style={{
                      fontSize: typography.fontSize['4xl'],
                      fontWeight: typography.fontWeight.bold,
                      marginBottom: "20px",
                      textAlign: "center",
                      color: colors.text.white,
                    }}>
                      {course.title}
                    </h1>
                    <p style={{
                      fontSize: typography.fontSize.lg,
                      marginBottom: "20px",
                      textAlign: "center",
                      opacity: "0.9",
                      lineHeight: "1.6",
                    }}>
                        {course.description}
                    </p>
                    <p>{course.syllabus}</p>

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                    //     marginTop: "30px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleEnroll(course.id)}
                        style={{
                          ...buttonStyle,
                          background: enrolledIds.includes(course.id)
                            ? "rgba(68, 25, 82, 0.8)"
                            : "rgba(113, 12, 118, 0.8)",
                          width: "auto",
                          padding: "12px 30px",
                        }}
                        disabled={enrolledIds.includes(course.id)}
                      >
                        {enrolledIds.includes(course.id)
                          ? "Already Enrolled"
                          : "Enroll in Course"}
                      </button>
                      <button
                        onClick={close}
                        style={{
                          ...buttonStyle,
                          background: "rgba(221, 19, 19, 0.8)",
                          width: "auto",
                        //   padding: "12px 30px",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
