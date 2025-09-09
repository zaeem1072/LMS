import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { colors, gradients, commonStyles, borderRadius, typography } from "../../styles/constants";
import { useToastContext } from "../../contexts/ToastContext";
import FileUpload from "../common/FileUpload";

interface Course {
  id: number;
  title: string;
  description: string;
  syllabus: string;
}

const base_url = "http://localhost:3000/api/v1";


function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  
  const { showSuccess, showError } = useToastContext();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    syllabus: "",
  });
  const [courseFiles, setCourseFiles] = useState<File[]>([]);
  const [syllabusFile, setSyllabusFile] = useState<File[]>([]);

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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Courses fetch error:", response.status, errorText);
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(`Failed to load courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const createCourse = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("No auth token found", "Authentication Error");
      return;
    }

    setCreating(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('course[title]', newCourse.title);
      formData.append('course[description]', newCourse.description);
      formData.append('course[syllabus]', newCourse.syllabus);
      
      // Add course files
      courseFiles.forEach((file) => {
        formData.append('course[files][]', file);
      });
      
      // Add syllabus file
      if (syllabusFile.length > 0) {
        formData.append('course[syllabus_file]', syllabusFile[0]);
      }
      
      const response = await fetch(`${base_url}/courses`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create course: ${response.status}`);
      }

      const data: Course = await response.json();

      setCourses([...courses, data]);
      setNewCourse({ title: "", description: "", syllabus: "" });
      setCourseFiles([]);
      setSyllabusFile([]);
      showSuccess("Course created successfully!", "Success");
    } catch (err: any) {
      console.error("Create course error:", err);
      showError(`Failed to create course: ${err.message}`, "Creation Failed");
    } finally {
      setCreating(false);
    }
  };

  const updateCourse = async (courseId: number, updatedData: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No auth token found");
      return;
    }

    try {
      const response = await fetch(`${base_url}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const data: Course = await response.json();
      setCourses(courses.map(course => 
        course.id === courseId ? data : course
      ));
      
      alert("Course updated successfully!");
    } catch (err: any) {
      alert("Failed to update course: " + err.message);
    }
  };

  const deleteCourse = async (courseId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No auth token found");
      return;
    }

    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(`${base_url}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses(courses.filter(course => course.id !== courseId));
      alert("Course deleted successfully!");
    } catch (err: any) {
      alert("Failed to delete course: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading your courses...</div>;
  if (error) return (
    <div style={commonStyles.container}>
      <div style={{
        ...commonStyles.card,
        textAlign: 'center',
        color: colors.status.error,
        backgroundColor: colors.status.errorLight,
        border: `1px solid ${colors.status.error}`,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ marginBottom: '8px', color: colors.status.error }}>Error Loading Courses</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  const cardStyle: React.CSSProperties = {
    ...commonStyles.card,
    background: gradients.primary,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    color: colors.text.white,
    transition: "all 0.3s ease",
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    borderColor: "#381e4cff",
    transition: "all 0.3s ease",
  };

  const buttonStyle: React.CSSProperties = {
    ...commonStyles.button.primary,
    background: "linear-gradient(135deg, #1c2961ff 0%, #533077ff 100%)",
    marginTop: "16px",
    width: "100%",
  };



  const popupContentStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #c76befff 40%, #4b0c62ff 60%)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    color: "white",
    position: "relative",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
  };

  return (
    <>
      {/* CSS Animation for loading spinner and custom scrollbar */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Custom scrollbar for popup */
          .popup-content::-webkit-scrollbar {
            width: 8px;
          }
          
          .popup-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          
          .popup-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }
          
          .popup-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
      
    <div style={commonStyles.container}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        padding: "20px 0",
        // borderBottom: "2px solid #072348ff"
      }}>
        <h1 style={commonStyles.title.h1}>
          My Courses
        </h1>
        <Popup
        trigger={
          <button
            style={{
              ...buttonStyle,
              width: "auto",
              padding: "12px 30px",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #7c22ce 50%, #1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(124, 34, 206, 0.4)",
              transform: "scale(1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(124, 34, 206, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 34, 206, 0.4)";
            }}
          >
            Add New Course
          </button>
        }
        modal
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        contentStyle={{
          background: "none",
          border: "none",
          padding: "0",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(close: any) => (
          <div style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%)",
            padding: "0",
            minWidth: "600px",
            maxWidth: "900px",
            maxHeight: "95vh",
            borderRadius: "24px",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            overflowY: "auto",
            margin: "20px",
          }}>
            {/* Header */}
            <div style={{
              padding: "32px 40px",
              borderBottom: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              textAlign: "center",
            }}>
              <h2 style={{
                fontSize: typography.fontSize['4xl'],
                fontWeight: typography.fontWeight.bold,
                background: "linear-gradient(135deg, #7c22ce, #8b5cf6, #6d28d9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: "0 0 8px 0",
              }}>
                Create New Course
              </h2>
              <p style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.base,
                margin: "0",
              }}>
                Build something amazing for your students
              </p>
            </div>

            <button
              onClick={close}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0, 0, 0, 0.1)",
                border: "none",
                borderRadius: borderRadius.full,
                width: "40px",
                height: "40px",
                color: colors.text.secondary,
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.color = colors.text.secondary;
              }}
            >
              ✕
            </button>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await createCourse();
                close();
              }}
              style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "40px" }}
            >
              {/* Course Title Section */}
              <div style={{
                background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #c4b5fd",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}>
                <div style={{
                  marginBottom: "16px",
                }}>
                  <label style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: "#581c87",
                  }}>
                    Course Title
                  </label>
                </div>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    height: "56px",
                    padding: "16px",
                    fontSize: typography.fontSize.lg,
                    border: "2px solid #c4b5fd",
                    borderRadius: borderRadius.medium,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: colors.text.primary,
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  placeholder="Enter an engaging course title"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c4b5fd";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Course Description Section */}
              <div style={{
                background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #c4b5fd",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}>
                <div style={{
                  marginBottom: "16px",
                }}>
                  <label style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: "#581c87",
                  }}>
                    Course Description
                  </label>
                </div>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: typography.fontSize.base,
                    border: "2px solid #c4b5fd",
                    borderRadius: borderRadius.medium,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: colors.text.primary,
                    outline: "none",
                    resize: "none",
                    transition: "all 0.2s ease",
                  }}
                  placeholder="Describe what students will learn and achieve"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c4b5fd";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Course Syllabus Section */}
              <div style={{
                background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #c4b5fd",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}>
                <div style={{
                  marginBottom: "16px",
                }}>
                  <label style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: "#581c87",
                  }}>
                    Course Syllabus
                  </label>
                </div>
                <textarea
                  value={newCourse.syllabus}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, syllabus: e.target.value })
                  }
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: typography.fontSize.base,
                    border: "2px solid #c4b5fd",
                    borderRadius: borderRadius.medium,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: colors.text.primary,
                    outline: "none",
                    resize: "none",
                    transition: "all 0.2s ease",
                  }}
                  placeholder="Outline the course structure, topics, and learning objectives"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c4b5fd";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* File Uploads Section */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
              }}>
                {/* Syllabus File Upload */}
                <div>
                  <div style={{
                    marginBottom: "16px",
                  }}>
                    <label style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: "#581c87",
                    }}>
                      Syllabus File <span style={{ color: "#8b5cf6", fontWeight: "normal", fontSize: typography.fontSize.sm }}>(Optional)</span>
                    </label>
                  </div>
                  <FileUpload
                    onFilesChange={setSyllabusFile}
                    multiple={false}
                    accept=".pdf,.doc,.docx,.txt"
                    maxSize={5}
                    label=""
                    placeholder="Upload syllabus document"
                    theme="light"
                  />
                </div>

                {/* Course Materials Upload */}
                <div>
                  <div style={{
                    marginBottom: "16px",
                  }}>
                    <label style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: "#581c87",
                    }}>
                      Course Materials <span style={{ color: "#8b5cf6", fontWeight: "normal", fontSize: typography.fontSize.sm }}>(Optional)</span>
                    </label>
                  </div>
                  <FileUpload
                    onFilesChange={setCourseFiles}
                    multiple={true}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                    maxSize={10}
                    label=""
                    placeholder="Upload course materials"
                    theme="light"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                paddingTop: "32px",
                borderTop: "2px solid transparent",
                backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}>
                <button
                  type="button"
                  onClick={close}
                  style={{
                    padding: "16px 40px",
                    fontWeight: typography.fontWeight.semibold,
                    border: "2px solid #d1d5db",
                    borderRadius: borderRadius.large,
                    backgroundColor: colors.neutral.white,
                    color: colors.text.secondary,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: typography.fontSize.base,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #f9fafb, #f3f4f6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.neutral.white;
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: "16px 40px",
                    fontWeight: typography.fontWeight.semibold,
                    border: "none",
                    borderRadius: borderRadius.large,
                    background: creating ? colors.neutral.gray400 : "linear-gradient(135deg, #7c22ce 0%, #be185d 50%, #1d4ed8 100%)",
                    color: colors.text.white,
                    cursor: creating ? "not-allowed" : "pointer",
                    boxShadow: creating ? "none" : "0 10px 25px rgba(124, 34, 206, 0.4)",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                    fontSize: typography.fontSize.base,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 15px 35px rgba(124, 34, 206, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!creating) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 34, 206, 0.4)";
                    }
                  }}
                >
                  {creating && <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid transparent",
                    borderTop: "2px solid currentColor",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}></div>}
                  {creating ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        )}
      </Popup>
      </div>

      {courses.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📖</div>
          <h3 style={{ color: colors.text.secondary, marginBottom: "1rem" }}>No courses available</h3>
          <p style={{ color: colors.text.muted }}>Create your first course to get started!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "25px",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }}
        >
          {courses.map((course, index) => (
            <div
              key={course.id}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                position: "absolute",
                top: "0",
                right: "0",
                background: "rgba(255, 255, 255, 0.2)",
                padding: "8px 16px",
                borderRadius: "0 16px 0 16px",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                ID: {course.id}
              </div>

              <h3 style={{
                color: colors.text.white,
                fontSize: typography.fontSize['2xl'],
                marginBottom: "12px",
                fontWeight: typography.fontWeight.bold
              }}>
                {course.title}
              </h3>

              <p style={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: "1.6",
                marginBottom: "16px"
              }}>
                {course.description}
              </p>

              <div style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px"
              }}>
                <p style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  margin: "0"
                }}>
                  <strong>Syllabus:</strong> {course.syllabus.substring(0, 100)}...
                </p>
              </div>

              {/* Course Detail Popup */}
              <Popup
                trigger={<button style={buttonStyle}>View Course Outline</button>}
                modal
                closeOnDocumentClick
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                contentStyle={{
                  width: "95vw",
                  height: "95vh",
                  background: "none",
                  border: "none",
                  padding: "0"
                }}
              >
                {(close: any) => (
                  <div style={popupContentStyle}>
                    <button
                      onClick={close}
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ✕
                    </button>

                    <div style={{ marginBottom: "30px", textAlign: "center" }}>
                      <h1 style={{
                        fontSize: "3rem",
                        marginBottom: "10px",
                        // textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
                      }}>
                        {course.title}
                      </h1>
                      <p style={{
                        fontSize: "1.2rem",
                        opacity: "0.9",
                        maxWidth: "600px",
                        margin: "0 auto"
                      }}>
                        {course.description}
                      </p>
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "30px",
                      marginBottom: "30px"
                    }}>
                      <div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "10px" }}>
                          Course Overview
                        </h3>
                        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                          <h4>Learning Objectives</h4>
                          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Master fundamental concepts and principles</li>
                            <li>Apply theoretical knowledge to practical scenarios</li>
                            <li>Develop critical thinking and problem-solving skills</li>
                            <li>Collaborate effectively in team environments</li>
                          </ul>
                        </div>

                        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "12px" }}>
                          <h4>Assessment Methods</h4>
                          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Assignments: 40%</li>
                            <li>Midterm Exam: 25%</li>
                            <li>Final Project: 25%</li>
                            <li>Participation: 10%</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "10px" }}>
                          Course Schedule
                        </h3>
                        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                          <h4>Weekly Schedule</h4>
                          <div style={{ lineHeight: "2" }}>
                            <p><strong>Monday:</strong> 10:00 AM - 12:00 PM</p>
                            <p><strong>Wednesday:</strong> 2:00 PM - 4:00 PM</p>
                            <p><strong>Friday:</strong> 10:00 AM - 11:30 AM</p>
                          </div>
                        </div>

                        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "12px" }}>
                          <h4>Class Information</h4>
                          <div style={{ lineHeight: "2" }}>
                            <p><strong>Enrolled Students:</strong> 45</p>
                            <p><strong>Capacity:</strong> 50</p>
                            <p><strong>Credits:</strong> 3</p>
                            <p><strong>Duration:</strong> 16 weeks</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "25px", borderRadius: "12px" }}>
                      <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Detailed Syllabus</h3>
                      <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>{course.syllabus}</p>
                    </div>

                    <div style={{
                      display: "flex",
                      gap: "15px",
                      marginTop: "30px",
                      justifyContent: "center"
                    }}>
                      <button
                        onClick={() => {
                          const title = prompt("Edit title:", course.title);
                          const description = prompt("Edit description:", course.description);
                          const syllabus = prompt("Edit syllabus:", course.syllabus);
                          
                          if (title && description && syllabus) {
                            updateCourse(course.id, { title, description, syllabus });
                          }
                        }}
                        style={{
                          ...buttonStyle,
                          background: "rgba(179, 85, 207, 1)",
                          width: "auto",
                          padding: "12px 30px"
                        }}
                      >
                        Edit Course
                      </button>

                      <button
                        onClick={() => deleteCourse(course.id)}
                        style={{
                          ...buttonStyle,
                          background: "rgba(113, 32, 32, 1)",
                          width: "auto",
                          padding: "12px 30px"
                        }}
                      >
                        Delete Course
                      </button>

                      <button
                        style={{
                          ...buttonStyle,
                          background: "rgba(74, 9, 72, 0.93)",
                          width: "auto",
                          padding: "12px 30px"
                        }}
                        onClick={close}
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
    </>
  );
}

export default Courses;
