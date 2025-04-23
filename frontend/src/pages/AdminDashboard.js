import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Admin";

  // ✅ Fetch users
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

  // ✅ Fetch guest bookings
  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/guest-booking/all/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [token]);

  // ✅ Run on mount
  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
      fetchBookings();
    }
  }, [token, role, navigate, fetchUsers, fetchBookings]);

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`http://127.0.0.1:8000/api/auth/admin/users/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
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

  // ✅ Update booking status
  const handleBookingStatusChange = async (bookingId, status) => {
    if (!bookingId) {
      console.error("Booking ID is missing");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/guest-booking/${bookingId}/status/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Booking ${status} successfully.`);
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
      } else {
        alert("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  // ✅ Get CSRF token from cookies
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
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">Admin Dashboard</h2>
        <p className="admin-subtext">Welcome, {username}! Manage users and bookings below.</p>

        {/* Users Table */}
        <h3>Users</h3>
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
                    <button onClick={() => navigate(`/edit-user/${user.id}`)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guest Bookings Table */}
        <h3>Pending Guest Bookings</h3>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Purpose</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((booking) => booking.status === "pending")
                .map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.guest_name}</td>
                    <td>{booking.purpose}</td>
                    <td>{booking.room ? booking.room.room_number : "N/A"}</td>
                    <td>{booking.status}</td>
                    <td>
                      <button
                        onClick={() => handleBookingStatusChange(booking.id, "approved")}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleBookingStatusChange(booking.id, "rejected")}
                        className="reject-btn"
                      >
                        Reject
                      </button>
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
