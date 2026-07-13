import "./Settings.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";

function Settings() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [profile, setProfile] = useState({
    first_name: storedUser.first_name || "",
    last_name: storedUser.last_name || "",
    email: storedUser.email || "",
    username: storedUser.username || "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [saving, setSaving] = useState(false);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update local storage display — full profile update endpoint can be added later
      const updated = { ...storedUser, ...profile };
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.info("Password change endpoint not yet available.");
  };

  const fields = [
    { label: "First Name", name: "first_name", type: "text" },
    { label: "Last Name", name: "last_name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Username", name: "username", type: "text" },
  ];

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" />

      <div className="settings-header">
        <h1><i className="bi bi-gear-fill"></i> Settings</h1>
        <p>Manage your account preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2><i className="bi bi-person-fill"></i> Profile Information</h2>

          <div className="avatar-row">
            <div className="settings-avatar">
              {profile.first_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h4>{profile.first_name} {profile.last_name}</h4>
              <span>{storedUser.role}</span>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            {fields.map((f) => (
              <div className="settings-field" key={f.name}>
                <label>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={profile[f.name]}
                  onChange={handleProfileChange}
                />
              </div>
            ))}
            <button type="submit" className="save-btn" disabled={saving}>
              <i className="bi bi-check-circle-fill"></i>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>

        {/* Password Section */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2><i className="bi bi-shield-lock-fill"></i> Change Password</h2>

          <form onSubmit={changePassword}>
            {[
              { label: "Current Password", name: "current_password" },
              { label: "New Password", name: "new_password" },
              { label: "Confirm New Password", name: "confirm_password" },
            ].map((f) => (
              <div className="settings-field" key={f.name}>
                <label>{f.label}</label>
                <input
                  type="password"
                  name={f.name}
                  value={passwords[f.name]}
                  onChange={handlePasswordChange}
                />
              </div>
            ))}
            <button type="submit" className="save-btn">
              <i className="bi bi-lock-fill"></i> Update Password
            </button>
          </form>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2><i className="bi bi-bell-fill"></i> Notifications</h2>
          <div className="toggle-row">
            <span>Email Notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <span>Event Reminders</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <span>Booking Confirmations</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
