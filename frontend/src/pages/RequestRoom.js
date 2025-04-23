import React, { useState } from "react";
import Sidebar from "./Sidebar";

const RequestRoom = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [roomType, setRoomType] = useState("single");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/guest-booking/book/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ room_type: roomType, purpose })
      });

      const data = await response.json();

      if (data.alreadyBooked) {
        setMessage("⚠️ You have already booked. Please wait for admin approval or check your dashboard.");
      } else if (response.ok) {
        if (data.room && data.room.room_number) {
          setMessage(`✅ Room ${data.room.room_number} (${data.room.type}) requested successfully.`);
        } else {
          setMessage("✅ Room requested successfully.");
        }
      } else {
        setMessage(`❌ ${data.error || data.message || "Failed to request room."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="header">Request a Guest Room</h2>

        <form onSubmit={handleRequestRoom} className="create-user-container">
          <label>Room Type:</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="user-select"
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>

          <label>Purpose of Visit:</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Enter purpose"
            className="user-input"
            required
          />

          <button type="submit" className="add-btn">🛏️ Request Room</button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontWeight: "500",
              fontSize: "16px",
              color: message.startsWith("✅")
                ? "green"
                : message.startsWith("❌")
                ? "red"
                : "orange"
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestRoom;
