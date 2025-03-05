import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/auth/admin/users/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setUser(data);
        setFormData({ username: data.username, email: data.email, role: data.role });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/admin/users/${id}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User updated successfully!");
        navigate("/admin-dashboard");
      } else {
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return user ? (
    <>
     <Sidebar role={role} />
    <div className="edit-user-page">
      <h2 className="edit-user-header">Edit User</h2>
      <form onSubmit={handleSubmit} className="edit-user-form">
        <label className="edit-label">Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required className="user-input" />

        <label className="edit-label">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="user-input" />

        <label className="edit-label">Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} required className="user-select">
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="guest">Guest</option>
          <option value="visitor">Visitor</option>
        </select>

        <div className="edit-user-buttons">
          <button type="submit" className="btn save-btn">Save Changes</button>
          <button type="button" onClick={() => navigate("/admin-dashboard")} className="btn cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default EditUser;
