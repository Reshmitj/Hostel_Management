import React, { useState } from "react";
import Sidebar from "./Sidebar";

const BookRoom = () => {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleBookRoom = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/booking/book-room/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong while booking the room.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="header">Book a Room</h2>
        <p>Click the button below to auto-assign a room.</p>
        <button
  onClick={handleBookRoom}
  style={{
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "fit-content",
    margin: "20px auto",
    display: "block"
  }}
>
  📌 Book My Room
</button>

        {message && <p className="info-text">{message}</p>}
      </div>
    </div>
  );
};

export default BookRoom;
