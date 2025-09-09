import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaBook, FaClipboardList, FaCalendarAlt, FaSearch, FaFilter, FaEye } from "react-icons/fa";

interface Student {
  id: number;
  email: string;
  enrolled_at: string;
  submission_count: number;
}

interface CourseStudents {
  course_id: number;
  course_title: string;
  student_count: number;
  students: Student[];
}

interface StudentsData {
  total_students: number;
  courses: CourseStudents[];
}

const base_url = "http://localhost:3000/api/v1";

function Students() {
  const [studentsData, setStudentsData] = useState<StudentsData>({
    total_students: 0,
    courses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchStudentsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${base_url}/dashboard/teacher_students`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudentsData(data);
          // Expand the first course by default
          if (data.courses.length > 0) {
            setExpandedCourses(new Set([]));
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch students data');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  const toggleCourseExpansion = (courseId: number) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const filteredCourses = studentsData.courses.filter(course => {
    if (selectedCourse !== "all" && course.course_id.toString() !== selectedCourse) {
      return false;
    }
    if (searchTerm) {
      return course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             course.students.some(student => 
               student.email.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const filteredStudents = (students: Student[]) => {
    if (!searchTerm) return students;
    return students.filter(student =>
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>👥</div>
        <div>Loading students data...</div>
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

  const containerStyle: React.CSSProperties = {
    padding: "30px",
    background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
    minHeight: "100%",
  };

  const headerStyle: React.CSSProperties = {
    // marginBottom: "30px",
    padding: "20px 0",
    // borderBottom: "2px solid #072348ff",
  };

  const titleStyle: React.CSSProperties = {
    // fontSize: "2.5rem",
    // fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  };

  const statsCardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    padding: "20px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    display: "inline-block",
    minWidth: "200px",
  };

  // const filterSectionStyle: React.CSSProperties = {
  //   backgroundColor: "white",
  //   borderRadius: "12px",
  //   padding: "20px",
  //   marginBottom: "20px",
  //   boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  //   display: "flex",
  //   gap: "20px",
  //   alignItems: "center",
  //   flexWrap: "wrap",
  // };

  const searchInputStyle: React.CSSProperties = {
    padding: "10px 15px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    width: "300px",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    padding: "10px 15px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
  };

  const courseCardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    border: "1px solid #072348ff",
  };

  const courseHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 0",
  };

  const studentTableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  };

  const studentRowStyle: React.CSSProperties = {
    borderBottom: "1px solid #e2e8f0",
  };

  const studentCellStyle: React.CSSProperties = {
    padding: "12px 15px",
    textAlign: "left",
  };

  const badgeStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Students Management</h1>
        <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "1.1rem" }}>
        </p>
      </div>

      {/* Stats */}
      <div style={statsCardStyle}>
        <div style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "5px" }}>
          {studentsData.total_students}
        </div>
        <div style={{ fontSize: "1rem", opacity: "0.9" }}>
          Total Students Enrolled
        </div>
      </div>

      {/* Filters */}
      {/* <div style={filterSectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaSearch style={{ color: "#6b7280" }} />
          <input
            type="text"
            placeholder="Search by student email or course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaFilter style={{ color: "#6b7280" }} />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Courses</option>
            {studentsData.courses.map(course => (
              <option key={course.course_id} value={course.course_id.toString()}>
                {course.course_title}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Courses and Students */}
      {/* {filteredCourses.length === 0 ? (
        <div style={courseCardStyle}>
          <div style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>
            <FaUserGraduate style={{ fontSize: "3rem", marginBottom: "20px" }} />
            <h3>No students found</h3>
            <p>No students match your current search criteria.</p>
          </div>
        </div>
      ) : (
        filteredCourses.map(course => {
          const courseStudents = filteredStudents(course.students);
          const isExpanded = expandedCourses.has(course.course_id);
          
          return (
            <div key={course.course_id} style={courseCardStyle}>
              <div 
                style={courseHeaderStyle}
                onClick={() => toggleCourseExpansion(course.course_id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <FaBook style={{ color: "#667eea", fontSize: "1.2rem" }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#374151" }}>
                      {course.course_title}
                    </h3>
                    <p style={{ margin: "5px 0 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
                      {course.student_count} students enrolled
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={badgeStyle}>{course.student_count} students</span>
                  <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {isExpanded && courseStudents.length > 0 && (
                <table style={studentTableStyle}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th style={{ ...studentCellStyle, fontWeight: "600", color: "#374151" }}>
                        <FaUserGraduate style={{ marginRight: "8px" }} />
                        Student Email
                      </th>
                      <th style={{ ...studentCellStyle, fontWeight: "600", color: "#374151" }}>
                        <FaCalendarAlt style={{ marginRight: "8px" }} />
                        Enrolled Date
                      </th>
                      <th style={{ ...studentCellStyle, fontWeight: "600", color: "#374151" }}>
                        <FaClipboardList style={{ marginRight: "8px" }} />
                        Submissions
                      </th>
                      <th style={{ ...studentCellStyle, fontWeight: "600", color: "#374151" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseStudents.map(student => (
                      <tr key={`${course.course_id}-${student.id}`} style={studentRowStyle}>
                        <td style={studentCellStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "14px",
                              fontWeight: "600"
                            }}>
                              {student.email.charAt(0).toUpperCase()}
                            </div>
                            {student.email}
                          </div>
                        </td>
                        <td style={studentCellStyle}>
                          {new Date(student.enrolled_at).toLocaleDateString()}
                        </td>
                        <td style={studentCellStyle}>
                          <span style={{
                            ...badgeStyle,
                            background: student.submission_count > 0 ? "#10b981" : "#6b7280"
                          }}>
                            {student.submission_count} submissions
                          </span>
                        </td>
                        <td style={studentCellStyle}>
                          <button
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#667eea",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                            onClick={() => alert(`Not Available Yet`)}
                          >
                            <FaEye /> View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {isExpanded && courseStudents.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  color: "#6b7280", 
                  padding: "20px",
                  fontSize: "0.9rem"
                }}>
                  No students found in this course matching your search criteria.
                </div>
              )}
            </div>
          );
        })
      )} */}
        </div>
    );
}

export default Students;