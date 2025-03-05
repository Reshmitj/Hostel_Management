import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Admin";

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/admin-users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [token, role, navigate, fetchUsers]); 

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
        const csrfToken = getCookie("csrftoken");  // Get CSRF Token
        const response = await fetch(`http://127.0.0.1:8000/api/auth/admin/users/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "X-CSRFToken": csrfToken,  // Include CSRF token
                "Content-Type": "application/json",
            },
            credentials: "include",  // Required for CSRF
        });

        if (response.ok) {
            setUsers(users.filter((user) => user.id !== id));
        } else {
            alert("Error: Could not delete user. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Something went wrong. Please try again.");
    }
};

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        document.cookie.split(";").forEach((cookie) => {
            if (cookie.trim().startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.trim().substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}



  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="admin-header">Admin Dashboard</h2>
        <p className="admin-subtext">Welcome, {username}! Manage users below.</p>

        {/* Users Table */}
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                  <button onClick={() => navigate(`/edit-user/${user.id}`)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
