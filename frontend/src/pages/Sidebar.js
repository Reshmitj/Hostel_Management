import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        {role === "admin" && "Admin Panel"}
        {role === "student" && "Student Dashboard"}
        {role === "guest" && "Guest Portal"}
        {role === "visitor" && "Visitor Log"}
      </h2>

      <div className="nav-links">
        {role === "admin" && (
          <>
            <button onClick={() => navigate("/admin-dashboard")} className="sidebar-btn">🏠 Home</button>
            <button onClick={() => navigate("/create-user")} className="sidebar-btn">➕ Create User</button>
            <button onClick={() => navigate("/rooms")} className="sidebar-btn">🏢 Manage Rooms</button>
            <button onClick={() => navigate("/billing")} className="sidebar-btn">💰 Billing</button>
            <button onClick={() => navigate("/visitor-log")} className="sidebar-btn">🛂 Visitors</button>
          </>
        )}

        {role === "student" && (
          <>
            <button onClick={() => navigate("/student-dashboard")} className="sidebar-btn">🏠 Home</button>
            <button onClick={() => navigate("/book-room")} className="sidebar-btn">📌 Book Room</button>
            <button onClick={() => navigate("/invoices")} className="sidebar-btn">📄 My Invoices</button>
          </>
        )}

        {role === "guest" && (
          <>
            <button onClick={() => navigate("/guest-dashboard")} className="sidebar-btn">🏠 Home</button>
            <button onClick={() => navigate("/request-room")} className="sidebar-btn">🛏️ Request Room</button>
            <button onClick={() => navigate("/invoices")} className="sidebar-btn">📄 My Invoices</button> {/* ✅ NEW */}
          </>
        )}

        {role === "visitor" && (
          <>
            <button onClick={() => navigate("/visitor-dashboard")} className="sidebar-btn">🏠 Home</button>
            <button onClick={() => navigate("/log-visit")} className="sidebar-btn">🛂 Log Visit</button>
          </>
        )}

        <button onClick={() => {
          localStorage.clear();
          navigate("/login");
        }} className="sidebar-btn logout-btn">🚪 Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
