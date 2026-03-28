// Profile.jsx
import React, { useState,useEffect} from "react";
import axios from "axios";


const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");



useEffect(() => {
  const fetchProfile = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        config
      );

      setProfile({ name: res.data.name, email: res.data.email, password: "" });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  fetchProfile();
}, []);

  // Update profile
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    const payload = {
      name: profile.name,
      email: profile.email,
    };

    // only send password if entered
    if (profile.password) {
      payload.password = profile.password;
    }

    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/users/profile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ update UI
    setMessage("Profile updated successfully!");

    // ✅ update local storage (optional)
    localStorage.setItem("user", JSON.stringify(res.data));

    // ✅ clear password field
    setProfile((prev) => ({ ...prev, password: "" }));

  } catch (err) {
    console.error("Update Profile Error:", err);

    if (err.response?.status === 401) {
      setMessage("Session expired. Please login again.");
    } else {
      setMessage("Failed to update profile.");
    }
  }
};
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h4>My Profile</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password (leave blank to keep unchanged)</label>
        <input
          type="password"
          className="form-control"
          value={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        Update Profile
      </button>
    </div>
  );
};

export default Profile;