import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const Home = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  const [assignedRoom, setAssignedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedRoom = async () => {
      try {
        let url = null;

        if (role === "student") {
          url = "http://127.0.0.1:8000/api/booking/assigned-room/";
        } else if (role === "guest") {
          url = "http://127.0.0.1:8000/api/guest-booking/my-booking/";
        }

        if (url) {
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 204) {
            setAssignedRoom(null); // No booking yet
          } else if (!response.ok) {
            throw new Error("Failed to fetch assigned room");
          } else {
            const data = await response.json();
            setAssignedRoom(data);
          }
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRoom();
  }, [role, token]);

  return (
    <>
      <Sidebar role={role} />

      <div className="main-content">
        <h2 className="header">Welcome, {token ? username : "Guest"}!</h2>
        <p className="info-text">
          {token
            ? `You are logged in as a ${role}. Choose an option from the left.`
            : "Please login or register to continue."}
        </p>

       {/* Student Room Assignment */}
{role === "student" && !loading && assignedRoom && (
  <div className="room-info" style={{
    border: "2px solid #28a745",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "400px",
    margin: "20px auto",
    backgroundColor: "#e6f4ea",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: "16px"
  }}>
    <h3 style={{ color: "#28a745", marginBottom: "15px", textAlign: "center" }}>Your Assigned Room</h3>
    <p><strong>🏢 Room:</strong> {assignedRoom.room_number || "N/A"} ({assignedRoom.type || "N/A"})</p>
    <p><strong>📅 Assigned On:</strong> {new Date(assignedRoom.booked_on || Date.now()).toLocaleDateString()}</p>
  </div>
)}


        {role === "student" && !loading && !assignedRoom && (
          <p style={{ color: "orange" }}>No room has been assigned to you yet.</p>
        )}

        {/* Guest Booking Info */}
        {role === "guest" && !loading && assignedRoom && assignedRoom.status === "approved" && (
  <div className="room-info" style={{
    border: "2px solid #007bff",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "400px",
    margin: "20px auto",
    backgroundColor: "#f0f8ff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontSize: "16px"
  }}>
    
    <h3 style={{ color: "#007bff", marginBottom: "15px", textAlign: "center" }}>Your Booking Details</h3>
    <p><strong>📌 Room:</strong> {assignedRoom.room.room_number || "N/A"} ({assignedRoom.room.type || "N/A"})</p>
    <p><strong>📝 Purpose:</strong> {assignedRoom.purpose || "N/A"}</p>
    <p><strong>📅 Booked on:</strong> {new Date(assignedRoom.booked_on || Date.now()).toLocaleDateString()}</p>
    
  </div>
)}

{role === "guest" && !loading && assignedRoom && assignedRoom.status === "pending" && (
  <p style={{ color: "orange" }}>
    Your booking request is pending approval from the admin.
  </p>
)}




        {role === "guest" && !loading && !assignedRoom && (
          <p style={{ color: "orange" }}>
            You have not booked any room yet.
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
