import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component

const CreateUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // List of existing users
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchUsers(); // Fetch users on mount
  }, []);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/auth/admin-users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Unexpected response format:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // ✅ Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("Please fill in all details properly.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/admin-users/create_user/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchUsers(); // Refresh user list
        setNewUser({ username: "", email: "", password: "", role: "student" }); // Reset form
        alert("User created successfully!");
      } else {
        alert("Failed to create user. Please check your inputs.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong while creating the user.");
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/admin-users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete user.");
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Something went wrong while deleting the user.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">👤 Create a New User</h2>

        {/* Add User Form */}
        <form className="create-user-container" onSubmit={handleCreateUser}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={newUser.username} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={newUser.email} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={newUser.password} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <select name="role" value={newUser.role} onChange={handleChange} className="user-select">
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="guest">Guest</option>
            <option value="visitor">Visitor</option>
          </select>
          <button type="submit" className="add-btn">Create User</button>
        </form>

      </div>
    </div>
  );
};

export default CreateUser;
