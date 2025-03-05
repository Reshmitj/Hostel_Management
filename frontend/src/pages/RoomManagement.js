import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../api";

import Sidebar from "./Sidebar"; // Import Sidebar component

const RoomManagement = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]); // Ensure rooms is always an array
  const [newRoom, setNewRoom] = useState({ room_number: "", type: "", status: "available" });
  const [loading, setLoading] = useState(true); // Add loading state
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ Fetch Rooms
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found, redirecting to login...");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/rooms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", response); // Debugging log
  
      if (response.status === 401) {
        console.error("Unauthorized! Refreshing token...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          return fetchRooms(); // Retry with refreshed token
        } else {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
        }
      }
  
      const data = await response.json();
      console.log("Rooms Data:", data); // Debugging log
  
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("Unexpected response format:", data);
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };
  
  

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  // ✅ Add New Room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/rooms/", {  // ✅ Ensure correct URL
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });
  
      if (response.ok) {
        fetchRooms(); // Refresh room list
        setNewRoom({ room_number: "", type: "", status: "available" });
      } else {
        const errorData = await response.json();
        console.error("Error adding room:", errorData);
        alert("Failed to add room. Please check the details.");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Something went wrong while adding the room.");
    }
  };

  // ✅ Delete Room
  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/rooms/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setRooms(rooms.filter((room) => room.id !== id));
      } else {
        console.error("Failed to delete room. Response:", await response.json());
        alert("Failed to delete room.");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Something went wrong while deleting the room.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">🏢 Manage Rooms</h2>

        {/* Add Room Form */}
        <form className="create-user-container" onSubmit={handleAddRoom}>
          <input 
            type="text" 
            name="room_number" 
            placeholder="Room Number" 
            value={newRoom.room_number} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <select name="type" value={newRoom.type} onChange={handleChange} className="user-select" required>
            <option value="">Select Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
          <select name="status" value={newRoom.status} onChange={handleChange} className="user-select">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
          <button type="submit" className="add-btn">Add Room</button>
        </form>

        {/* Room Table */}
        <div className="table-container">
          {loading ? (
            <p>Loading rooms...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.room_number}</td>
                      <td>{room.type}</td>
                      <td>{room.status}</td>
                      <td>
                        <button onClick={() => handleDeleteRoom(room.id)} className="btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No rooms available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
