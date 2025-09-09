import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { colors, gradients, commonStyles, borderRadius, typography } from "../../styles/constants";
import { useToastContext } from "../../contexts/ToastContext";
// import LoadingState from "../common/LoadingState";
import FileUpload from "../common/FileUpload";

interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    course_id: number;
}

const base_url = "http://localhost:3000/api/v1";

function Assignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const { showSuccess, showError } = useToastContext();

    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        due_date: "",
        course_id: 0,
    });
    const [assignmentFiles, setAssignmentFiles] = useState<File[]>([]);
    const [instructionFile, setInstructionFile] = useState<File[]>([]);
    
    useEffect(() => {
        const fetchAssignmentsAndCourses = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No auth token found");
                setLoading(false);
                return;
            }

            try {
                const assignmentsResponse = await fetch(`${base_url}/assignments/all_assignments`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!assignmentsResponse.ok) {
                    const errorText = await assignmentsResponse.text();
                    throw new Error(`Failed to fetch assignments: ${assignmentsResponse.status} ${errorText}`);
                }

                const assignmentsData = await assignmentsResponse.json();
                setAssignments(assignmentsData);

                const coursesResponse = await fetch(`${base_url}/courses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!coursesResponse.ok) {
                    const errorText = await coursesResponse.text();
                    throw new Error(`Failed to fetch courses: ${coursesResponse.status} ${errorText}`);
                }

                const coursesData = await coursesResponse.json();
                setCourses(coursesData);

                if (coursesData.length > 0) {
                    setNewAssignment((prev) => ({ ...prev, course_id: coursesData[0].id }));
                }
            } catch (err: any) {
                setError(`Failed to load assignments: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentsAndCourses();
    }, []);

    const createAssignment = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            showError("No auth token found", "Authentication Error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('assignment[title]', newAssignment.title);
            formData.append('assignment[description]', newAssignment.description);
            formData.append('assignment[due_date]', newAssignment.due_date);

            assignmentFiles.forEach((file) => {
                formData.append('assignment[files][]', file);
            });

            if (instructionFile.length > 0) {
                formData.append('assignment[instruction_file]', instructionFile[0]);
            }

            const response = await fetch(`${base_url}/courses/${newAssignment.course_id}/assignments`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create assignment: ${response.status}`);
            }

            const data: Assignment = await response.json();
            const assignmentWithCourse = {
                ...data,
                course_title: courses.find(course => course.id === data.course_id)?.title || 'Unknown Course'
            };
            setAssignments([...assignments, assignmentWithCourse]);

            setNewAssignment({
                title: "",
                description: "",
                due_date: "",
                course_id: courses.length > 0 ? courses[0].id : 0,
            });
            setAssignmentFiles([]);
            setInstructionFile([]);

            showSuccess("Assignment created successfully!", "Success");
        } catch (err: any) {
            console.error("Create assignment error:", err);
            showError("Failed to create assignment: " + err.message, "Creation Failed");
        }
    };

    const updateAssignment = async (assignmentId: number, updatedData: any) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No auth token found");
            return;
        }

        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) {
            alert("Assignment not found");
            return;
        }

        try {
            const response = await fetch(`${base_url}/courses/${assignment.course_id}/assignments/${assignmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ assignment: updatedData }),
            });

            if (!response.ok) {
                throw new Error("Failed to update assignment");
            }

            const data: Assignment = await response.json();
            setAssignments(assignments.map((a) => (a.id === assignmentId ? data : a)));

            alert("Assignment updated successfully!");
        } catch (err: any) {
            alert("Failed to update assignment: " + err.message);
        }
    };

    const deleteAssignment = async (assignmentId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No auth token found");
            return;
        }

        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) {
            alert("Assignment not found");
            return;
        }

        if (!confirm("Are you sure you want to delete this assignment?")) {
            return;
        }

        try {
            const response = await fetch(`${base_url}/courses/${assignment.course_id}/assignments/${assignmentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete assignment");
            }

            setAssignments(assignments.filter((a) => a.id !== assignmentId));
            alert("Assignment deleted successfully!");
        } catch (err: any) {
            alert("Failed to delete assignment: " + err.message);
        }
    };

    if (loading) return <span>Loading...</span>;
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
                <h3 style={{ marginBottom: '8px', color: colors.status.error }}>Error Loading Assignments</h3>
                <p>{error}</p>
            </div>
        </div>
    );


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

    return (
        <>
            {/* CSS Animation for loading spinner and custom scrollbar */}

            <div style={commonStyles.container}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px",
                        padding: "20px 0",
                    }}
                >
                    <h1 style={commonStyles.title.h1}>
                        Assignments
                    </h1>

                    {/* Assignment Creation Popup */}
                    <Popup as any
                        trigger={
                            <button
                                style={{
                                    ...buttonStyle,
                                    width: "auto",
                                    padding: "12px 30px",
                                    marginTop: "0",
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
                                Add Assignment
                            </button>
                        }
                        modal
                        closeOnDocumentClick={false}
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
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%)",
                                    padding: "0",
                                    minWidth: "600px",
                                    maxWidth: "800px",
                                    maxHeight: "95vh",
                                    borderRadius: "24px",
                                    position: "relative",
                                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                                    overflowY: "auto",
                                    margin: "20px",
                                }}
                            >
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
                                        Create New Assignment
                                    </h2>
                                    <p style={{
                                        color: colors.text.secondary,
                                        fontSize: typography.fontSize.base,
                                        margin: "0",
                                    }}>
                                        Design engaging assignments for your students
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
                                        setCreating(true);
                                        await createAssignment();
                                        close();
                                    }}
                                    style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "40px" }}
                                >
                                    {/* Assignment Title Section */}
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
                                                Assignment Title
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={newAssignment.title}
                                            onChange={(e) =>
                                                setNewAssignment({
                                                    ...newAssignment,
                                                    title: e.target.value,
                                                })
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
                                            placeholder="Enter assignment title"
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

                                    {/* Assignment Description Section */}
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
                                                Assignment Description
                                            </label>
                                        </div>
                                        <textarea
                                            value={newAssignment.description}
                                            onChange={(e) =>
                                                setNewAssignment({
                                                    ...newAssignment,
                                                    description: e.target.value,
                                                })
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
                                            placeholder="Enter assignment description"
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

                                    {/* Due Date & Course Selection */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "24px",
                                    }}>
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
                                                    Due Date
                                                </label>
                                            </div>
                                            <input
                                                type="date"
                                                value={newAssignment.due_date}
                                                onChange={(e) =>
                                                    setNewAssignment({
                                                        ...newAssignment,
                                                        due_date: e.target.value,
                                                    })
                                                }
                                                required
                                                style={{
                                                    width: "100%",
                                                    height: "56px",
                                                    padding: "16px",
                                                    fontSize: typography.fontSize.base,
                                                    border: "2px solid #c4b5fd",
                                                    borderRadius: borderRadius.medium,
                                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                    color: colors.text.primary,
                                                    outline: "none",
                                                    transition: "all 0.2s ease",
                                                }}
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
                                                    Course
                                                </label>
                                            </div>
                                            <select
                                                value={newAssignment.course_id}
                                                onChange={(e) =>
                                                    setNewAssignment({
                                                        ...newAssignment,
                                                        course_id: Number(e.target.value),
                                                    })
                                                }
                                                required
                                                style={{
                                                    width: "100%",
                                                    height: "56px",
                                                    padding: "16px",
                                                    fontSize: typography.fontSize.base,
                                                    border: "2px solid #c4b5fd",
                                                    borderRadius: borderRadius.medium,
                                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                    color: colors.text.primary,
                                                    outline: "none",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = "#8b5cf6";
                                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = "#c4b5fd";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            >
                                                <option value={0}>Select a course</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* File Uploads Section */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "32px",
                                    }}>
                                        {/* Assignment Instructions Upload */}
                                        <div>
                                            <div style={{
                                                marginBottom: "16px",
                                            }}>
                                                <label style={{
                                                    fontSize: typography.fontSize.lg,
                                                    fontWeight: typography.fontWeight.bold,
                                                    color: "#581c87",
                                                }}>
                                                    Instructions <span style={{ color: "#8b5cf6", fontWeight: "normal", fontSize: typography.fontSize.sm }}>(Optional)</span>
                                                </label>
                                            </div>
                                            <FileUpload
                                                onFilesChange={setInstructionFile}
                                                multiple={false}
                                                accept=".pdf,.doc,.docx,.txt"
                                                maxSize={5}
                                                label=""
                                                placeholder="Upload instruction document"
                                                theme="light"
                                            />
                                        </div>

                                        {/* Assignment Resources Upload */}
                                        <div>
                                            <div style={{
                                                marginBottom: "16px",
                                            }}>
                                                <label style={{
                                                    fontSize: typography.fontSize.lg,
                                                    fontWeight: typography.fontWeight.bold,
                                                    color: "#581c87",
                                                }}>
                                                    Resources <span style={{ color: "#8b5cf6", fontWeight: "normal", fontSize: typography.fontSize.sm }}>(Optional)</span>
                                                </label>
                                            </div>
                                            <FileUpload
                                                onFilesChange={setAssignmentFiles}
                                                multiple={true}
                                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                                                maxSize={10}
                                                label=""
                                                placeholder="Upload supporting materials"
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
                                                background: creating ? colors.neutral.gray400 : "linear-gradient(135deg, #7c22ce 0%, #8b5cf6 50%, #6d28d9 100%)",
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
                                            {creating ? "Creating..." : "Create Assignment"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Popup>
                </div>

                {assignments.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            ...commonStyles.card,
                            padding: "60px 20px",
                        }}
                    >
                        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
                        <h3 style={{ color: colors.text.primary, marginBottom: "10px" }}>No Assignments Yet</h3>
                        <p style={{ color: colors.text.secondary, marginBottom: "20px" }}>
                            {courses.length === 0
                                ? "Create a course first, then add assignments to it."
                                : "Start by creating your first assignment using the button above."}
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
                        {assignments.map((assignment, index) => (

                            <Popup as any
                                key={assignment.id}
                                trigger={
                                    <div
                                        style={{
                                            ...commonStyles.card,
                                            background: gradients.primary,
                                            cursor: "pointer",
                                            position: "relative",
                                            overflow: "hidden",
                                            color: colors.text.white,
                                            padding: "60px",
                                            transition: "all 0.3s ease",
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
                                            {assignment.title}
                                        </h3>
                                        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: typography.fontSize.base }}>
                                            Due: {assignment.due_date}
                                        </p>
                                    </div>
                                }
                                modal
                            >

                                {/* Assignment hover popup details */}

                                {(close: any) => (
                                    <div
                                        style={{
                                            margin: "0",
                                            padding: "30px",
                                            background: "transparent",
                                            // background: "none",
                                            backgroundColor: "#61166aff",
                                            color: "white",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 25px rgba(79, 18, 90, 1)",
                                            minWidth: "400px",
                                            border: "none",
                                            // maxWidth: "600px",
                                            // backgroundColor: "linear-gradient(135deg, #c96cdeff 30%, #8c63d7ff 100%)"

                                        }}
                                    >
                                        <h2 style={{ marginBottom: "20px", color: colors.primary.light, fontSize: typography.fontSize['3xl'] }}>
                                            {assignment.title}
                                        </h2>

                                        <p>
                                            <strong>Description:</strong> {assignment.description}
                                        </p>
                                        <p>
                                            <strong>Due Date:</strong> {assignment.due_date}
                                        </p>
                                        <p>
                                            <strong>Course ID:</strong> {assignment.course_id}
                                        </p>

                                        <div
                                            style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                                        >
                                            <button
                                                onClick={() => {
                                                    const title = prompt("Edit title:", assignment.title);
                                                    const description = prompt(
                                                        "Edit description:",
                                                        assignment.description
                                                    );
                                                    const due_date = prompt(
                                                        "Edit due date (YYYY-MM-DD):",
                                                        assignment.due_date
                                                    );

                                                    if (title && description && due_date) {
                                                        updateAssignment(assignment.id, {
                                                            title,
                                                            description,
                                                            due_date,
                                                        });
                                                        close();
                                                    }
                                                }}
                                                style={{
                                                    ...buttonStyle,
                                                    background: "rgba(72, 14, 85, 0.8)",
                                                    width: "auto",
                                                    padding: "10px 20px",
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    deleteAssignment(assignment.id);
                                                    close();
                                                }}
                                                style={{
                                                    ...buttonStyle,
                                                    background: "rgba(98, 15, 15, 0.8)",
                                                    width: "auto",
                                                    padding: "10px 20px",
                                                }}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={close}
                                                style={{
                                                    ...buttonStyle,
                                                    background: "gray",
                                                    width: "auto",
                                                    padding: "10px 20px",
                                                }}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

}

export default Assignments;