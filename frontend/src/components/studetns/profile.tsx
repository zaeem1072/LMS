import React, { useEffect, useState } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaLock, FaEnvelope, FaPhone, FaCalendarAlt, FaUserTag } from "react-icons/fa";
import { colors, gradients, commonStyles, borderRadius, typography } from "../../styles/constants";

interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio: string;
  phone: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const base_url = "http://localhost:3000/api/v1";

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    bio: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${base_url}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
          setFormData({
            first_name: data.user.first_name || "",
            last_name: data.user.last_name || "",
            bio: data.user.bio || "",
            phone: data.user.phone || "",
          });
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch profile');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${base_url}/profile`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: formData }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.errors?.join(', ') || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${base_url}/profile/change_password`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          password: {
            current_password: passwordData.current_password,
            new_password: passwordData.new_password
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsChangingPassword(false);
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setSuccessMessage("Password changed successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.errors?.join(', ') || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      bio: profile?.bio || "",
      phone: profile?.phone || "",
    });
    setError(null);
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setError(null);
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>👤</div>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={{ padding: "30px", color: "red", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  const containerStyle: React.CSSProperties = commonStyles.container;

  const headerStyle: React.CSSProperties = {
    // marginBottom: "30px",
    padding: "20px 0",
    // borderBottom: "2px solid #072348ff",
  };

  const titleStyle: React.CSSProperties = commonStyles.title.h1;

  const cardStyle: React.CSSProperties = commonStyles.card;

  const avatarStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: "0 auto 20px",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "5px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #dbeafe",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    marginBottom: "15px",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  const infoRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #f1f5f9",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#2a0d3eff",
    minWidth: "120px",
  };

  const valueStyle: React.CSSProperties = {
    color: "#64748b",
    flex: 1,
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return profile?.email?.charAt(0).toUpperCase() || "S";
  };

  const getFullName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();
    }
    return "No name set";
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Profile</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          backgroundColor: "#10b981",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "600"
        }}>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
            <div style={{
          backgroundColor: "#ef4444",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "600"
        }}>
          {error}
        </div>
      )}

      {/* Profile Information Card */}
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={avatarStyle}>
            {getInitials()}
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: "1.8rem", color: "#1e40af" }}>
            {getFullName()}
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>
            Student
          </p>
        </div>

        {!isEditing ? (
          <div>
            <div style={infoRowStyle}>
              <FaEnvelope style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Email:</span>
              <span style={valueStyle}>{profile?.email}</span>
            </div>

            <div style={infoRowStyle}>
              <FaUser style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>First Name:</span>
              <span style={valueStyle}>{profile?.first_name || "Not set"}</span>
            </div>

            <div style={infoRowStyle}>
              <FaUser style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Last Name:</span>
              <span style={valueStyle}>{profile?.last_name || "Not set"}</span>
            </div>

            <div style={infoRowStyle}>
              <FaPhone style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Phone:</span>
              <span style={valueStyle}>{profile?.phone || "Not set"}</span>
            </div>

            <div style={infoRowStyle}>
              <FaUserTag style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Role:</span>
              <span style={valueStyle}>Student</span>
            </div>

            <div style={infoRowStyle}>
              <FaCalendarAlt style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Member Since:</span>
              <span style={valueStyle}>
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
              </span>
            </div>

            <div style={{ ...infoRowStyle, borderBottom: "none" }}>
              <FaUser style={{ color: "#667eea", fontSize: "1.2rem" }} />
              <span style={labelStyle}>Bio:</span>
              <span style={valueStyle}>{profile?.bio || "No bio added"}</span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
              <button
                onClick={() => setIsEditing(true)}
                style={buttonStyle}
              >
                <FaEdit /> Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                style={{ ...buttonStyle, background: "linear-gradient(135deg, #1e1e5bff 40%, #0c2e37ff 60%)" }}
              >
                <FaLock /> Change Password
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: "20px", color: "#1e40af" }}>Edit Profile</h3>
            
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              style={textareaStyle}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={buttonStyle}
              >
                <FaSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={cancelEdit}
                style={{ ...buttonStyle, background: "#64748b" }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px", color: "#1e40af" }}>Change Password</h3>
          
          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm New Password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleChangePassword}
              disabled={saving}
              style={buttonStyle}
            >
              <FaLock /> {saving ? "Changing..." : "Change Password"}
            </button>
            <button
              onClick={cancelPasswordChange}
              style={{ ...buttonStyle, background: "#64748b" }}
            >
              <FaTimes /> Cancel
            </button>
            </div>
        </div>
      )}
        </div>
    );
}

export default Profile;