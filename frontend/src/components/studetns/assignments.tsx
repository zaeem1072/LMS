import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { colors, gradients, commonStyles, borderRadius, typography } from "../../styles/constants";
import { useToastContext } from "../../contexts/ToastContext";
import FileUpload from "../common/FileUpload";

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: number;
}

interface Submission {
  id: number;
  assignment_id: number;
  content: string;
  created_at: string;
}

const base_url = "http://localhost:3000/api/v1";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionFiles, setSubmissionFiles] = useState<{[key: number]: File[]}>({});
  const [submittingIds, setSubmittingIds] = useState<Set<number>>(new Set());
  // const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const { showSuccess, showError, showWarning } = useToastContext();

  useEffect(() => {
    const fetchAssignments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching student assignments...");
        
        const assignmentsRes = await fetch(`${base_url}/assignments/my_assignments`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!assignmentsRes.ok) {
          const errorText = await assignmentsRes.text();
          console.error("Assignments fetch failed:", assignmentsRes.status, errorText);
          throw new Error(`Failed to fetch assignments: ${assignmentsRes.status}`);
        }

        const assignments = await assignmentsRes.json();
        // console.log("Assignments fetched:", assignments);
        // console.log("Total assignments found:", assignments.length);
        
        setAssignments(assignments);
        await fetchSubmissionsFromDB();
      } catch (err: any) {
        // console.error("Error in fetchAssignments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const fetchSubmissionsFromDB = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log("Fetching submissions from database...");
      
      const response = await fetch(`${base_url}/submissions/my_submissions`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Submissions fetch response status:", response.status);

      if (response.ok) {
        const submissionsData = await response.json();
        // console.log("Submissions from database:", submissionsData);
        // console.log("Number of submissions:", submissionsData.length);
        setSubmissions(submissionsData);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch submissions:", response.status, errorText);
        // console.log("Trying alternative approach to fetch submissions...");
        await fetchSubmissionsAlternative();
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      await fetchSubmissionsAlternative();
    }
  };

  const fetchSubmissionsAlternative = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // console.log("Using alternative submission fetch method (deprecated - should use my_submissions endpoint)");

      // const allSubmissions: Submission[] = [];
      
      // Create a more efficient approach by batching requests
      const submissionPromises = assignments.map(async (assignment) => {
        try {
          const submissionRes = await fetch(
            `${base_url}/courses/${assignment.course_id}/assignments/${assignment.id}/submissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (submissionRes.ok) {
            const assignmentSubmissions = await submissionRes.json();
            const userSubmissions = assignmentSubmissions.filter((s: any) => s.user_id === Number(localStorage.getItem("userId")));
            return userSubmissions;
          }
          return [];
        } catch (err) {
          console.warn(`Failed to fetch submissions for assignment ${assignment.id}`);
          return [];
        }
      });

      const submissionResults = await Promise.all(submissionPromises);
      const flattenedSubmissions = submissionResults.flat();

      // console.log("Alternative fetch found submissions:", flattenedSubmissions);
      setSubmissions(flattenedSubmissions);
    } catch (err) {
      console.error("Alternative submission fetch failed:", err);
    }
  };

  const submitWork = async (assignmentId: number) => {
    // console.log("=== SUBMIT WORK CALLED ===");
    // console.log("Assignment ID:", assignmentId);
    
    const token = localStorage.getItem("token");
    if (!token) {
      showError("No auth token found", "Authentication Error");
      return;
    }

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      showError("Assignment not found", "Error");
      return;
    }

    const alreadySubmitted = submissions.some(s => s.assignment_id === assignmentId);
    if (alreadySubmitted) {
      showWarning("You have already submitted this assignment!", "Duplicate Submission");
      return;
    }

    const submissionFileList = submissionFiles[assignmentId] || [];
    // console.log("Submission files:", submissionFileList);
    
    if (submissionFileList.length === 0) {
      showWarning("Please upload at least one file before submitting", "No Files Selected");
      return;
    }

    setSubmittingIds(prev => new Set(prev).add(assignmentId));

    try {
      // console.log(`Submitting work for assignment ${assignmentId} in course ${assignment.course_id}`);

      const formData = new FormData();
      submissionFileList.forEach((file) => {
        formData.append('submission[files][]', file);
      });
      
      const response = await fetch(
        `${base_url}/courses/${assignment.course_id}/assignments/${assignmentId}/submissions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Submission failed:", response.status, errorText);
        // console.error("Request URL:", `${base_url}/courses/${assignment.course_id}/assignments/${assignmentId}/submissions`);
        // console.error("Request body:", JSON.stringify({ submission: { content: submissionText } }));
        throw new Error(`Failed to submit work: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      // console.log("Submission created:", responseData);
      
      showSuccess("Work submitted successfully!", "Assignment Submitted");
      
      setSubmissionFiles(prev => ({
        ...prev,
        [assignmentId]: []
      }));
      
      const newSubmission: Submission = {
        id: responseData.id || Date.now(),
        assignment_id: assignmentId,
        content: `${submissionFileList.length} file(s) uploaded`,
        created_at: responseData.created_at || new Date().toISOString()
      };
      setSubmissions([...submissions, newSubmission]);
      
      await fetchSubmissionsFromDB();
    } catch (err: any) {
      console.error("Submission error:", err);
      showError(`Failed to submit work: ${err.message}`, "Submission Failed");
    } finally {
      setSubmittingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading your assignments...</div>;
  if (error) return (
    <div style={commonStyles.container}>
      <div style={{
        ...commonStyles.card,
        textAlign: 'center',
        color: colors.status.error,
        backgroundColor: colors.status.errorLight,
        border: `1px solid ${colors.status.error}`,
      }}>
        {/* <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div> */}
        <h3 style={{ marginBottom: '8px', color: colors.status.error }}>Error Loading Assignments</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  const today = new Date();
  const submittedIds = submissions.map((s) => s.assignment_id);
  
  const upcomingAssignments = assignments.filter(
    (a) => !submittedIds.includes(a.id) && new Date(a.due_date) >= today
  );
  const completedAssignments = assignments.filter((a) => submittedIds.includes(a.id));

  const cardStyle: React.CSSProperties = {
    ...commonStyles.card,
    background: gradients.primary,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    color: colors.text.white,
    transition: "all 0.3s ease",
  };

  return (
    <>

      
    <div style={commonStyles.container}>
      {/* Header */}
      <div style={{
        padding: "20px 0",
      }}>
        <h1 style={commonStyles.title.h1}>
          My Assignments
        </h1>
      </div>

      {/* Upcoming Assignments */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", color: colors.text.primary, fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold }}>Upcoming Assignments</h2>
        {upcomingAssignments.length === 0 ? (
          <div style={{ textAlign: "center", color: colors.text.secondary, padding: "20px" }}>
            No upcoming assignments
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "25px",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            }}
          >
            {upcomingAssignments.map((assignment) => (
              <Popup
                key={assignment.id}
                trigger={
                  <div style={{
                    ...cardStyle,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(79, 18, 90, 0.3)";
                  }}>
                    <h3
                      style={{
                        color: colors.text.white,
                        fontSize: typography.fontSize['2xl'],
                        marginBottom: "12px",
                        fontWeight: typography.fontWeight.bold,
                      }}
                    >
                      {assignment.title}
                    </h3>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "16px", fontSize: typography.fontSize.base }}>
                      {assignment.description}
                    </p>
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        padding: "12px",
                        borderRadius: borderRadius.medium,
                        marginBottom: "16px",
                      }}
                    >
                      <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0" }}>
                        <strong>Due:</strong> {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      padding: "20px",
                      borderRadius: borderRadius.medium,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📁</div>
                      <p style={{
                        color: colors.text.white,
                        margin: "0",
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                      }}>
                        Click to Submit Files
                      </p>
                      <p style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "8px 0 0 0",
                        fontSize: typography.fontSize.sm,
                      }}>
                        Upload your assignment files
                      </p>
                    </div>
                  </div>
                }
                modal
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                contentStyle={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {(close: any) => (
                  <div style={{
                    background: gradients.primary,
                    padding: "40px",
                    minWidth: "500px",
                    maxWidth: "600px",
                    maxHeight: "85vh",
                    borderRadius: borderRadius.xl,
                    color: colors.text.white,
                    position: "relative",
                    boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)",
                    overflowY: "auto",
                    margin: "20px",
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

                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                      <h2 style={{
                        fontSize: typography.fontSize['3xl'],
                        fontWeight: typography.fontWeight.bold,
                        marginBottom: "10px",
                        color: colors.text.white,
                      }}>
                        Submit Assignment
                      </h2>
                      <h3 style={{
                        fontSize: typography.fontSize.xl,
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: "8px",
                        color: colors.text.white,
                        opacity: 0.9,
                      }}>
                        {assignment.title}
                      </h3>
                      <p style={{
                        fontSize: typography.fontSize.base,
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: "16px",
                      }}>
                        {assignment.description}
                      </p>
                      <div style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        padding: "12px",
                        borderRadius: borderRadius.medium,
                        display: "inline-block",
                      }}>
                        <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: "0", fontSize: typography.fontSize.sm }}>
                          <strong>Due:</strong> {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                      <FileUpload
                        onFilesChange={(files) => setSubmissionFiles(prev => ({
                          ...prev,
                          [assignment.id]: files
                        }))}
                        multiple={true}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                        maxSize={10}
                        label="Upload Your Assignment Files:"
                        placeholder="Upload assignment files (PDF, DOC, images, etc.)"
                        theme="dark"
                      />
                    </div>

                    <div style={{ 
                      display: "flex", 
                      gap: "15px", 
                      justifyContent: "center",
                      marginTop: "20px" 
                    }}>
                      <button 
                        onClick={() => {
                          submitWork(assignment.id);
                          close();
                        }}
                        disabled={submittingIds.has(assignment.id) || (submissionFiles[assignment.id]?.length || 0) === 0}
                        style={{
                          ...commonStyles.button.primary,
                          background: submittingIds.has(assignment.id) ? colors.neutral.gray400 : 
                                    (submissionFiles[assignment.id]?.length || 0) === 0 ? colors.neutral.gray400 : 
                                    "rgba(255, 255, 255, 0.9)",
                          color: submittingIds.has(assignment.id) || (submissionFiles[assignment.id]?.length || 0) === 0 ? 
                                colors.text.white : colors.primary.main,
                          padding: "12px 30px",
                          fontWeight: typography.fontWeight.semibold,
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          cursor: submittingIds.has(assignment.id) || (submissionFiles[assignment.id]?.length || 0) === 0 ? 
                                "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {submittingIds.has(assignment.id) && <div style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid transparent",
                          borderTop: "2px solid currentColor",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}></div>}
                        {submittingIds.has(assignment.id) ? "Submitting..." : 
                         (submissionFiles[assignment.id]?.length || 0) === 0 ? "Select Files First" : 
                         "Submit Assignment"}
                      </button>
                      <button
                        type="button"
                        onClick={close}
                        style={{
                          ...commonStyles.button.primary,
                          background: "rgba(255, 255, 255, 0.2)",
                          color: colors.text.white,
                          padding: "12px 30px",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Assignments */}
      <div>
        <h2 style={{ marginBottom: "20px", color: colors.text.primary, fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold }}>Submitted Assignments</h2>
        {completedAssignments.length === 0 ? (
          <div style={{ textAlign: "center", color: colors.text.secondary, padding: "20px" }}>
            No submitted assignments yet
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "25px",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            }}
          >
            {completedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                style={{
                  ...cardStyle,
                  background: "linear-gradient(135deg, #1c2961ff 30%, #533077ff 100%)",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    marginBottom: "12px",
                    fontWeight: "700",
                  }}
                >
                  {assignment.title}
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", marginBottom: "16px" }}>
                  {assignment.description}
                </p>
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0", fontWeight: "600" }}>
                    Submitted Successfully
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            </div>
    </>
  );
}