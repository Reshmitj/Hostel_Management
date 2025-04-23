import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component

const VisitorLog = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]); // List of logged visitors
  const [newVisitor, setNewVisitor] = useState({ name: "", purpose: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchVisitors(); // Fetch visitor log when page loads
  }, []);

  // ✅ Fetch Visitors
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/visitor-log/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setVisitors(data);
      } else {
        console.error("Unexpected response format:", data);
        setVisitors([]);
      }
    } catch (error) {
      console.error("Error fetching visitor log:", error);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setNewVisitor({ ...newVisitor, [e.target.name]: e.target.value });
  };

  // ✅ Log Visitor
  const handleLogVisitor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/visitor-log/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVisitor),
      });
  
      if (response.ok) {
        fetchVisitors(); // Refresh visitor list
        setNewVisitor({ name: "", purpose: "" }); // Reset form
        setMessage("✅ Visitor logged successfully!");
  
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to log visitor.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error logging visitor:", error);
      setMessage("❌ Something went wrong.");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  

  // ✅ Delete Visitor Log Entry
  const handleDeleteVisitor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/visitor-log/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setVisitors(visitors.filter((visitor) => visitor.id !== id));
      } else {
        console.error("Failed to delete visitor log.");
        alert("Failed to delete visitor log.");
      }
    } catch (error) {
      console.error("Error deleting visitor log:", error);
      alert("Something went wrong while deleting the visitor log.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">🛂 Visitor Log</h2>
        
        {message && <p className="success-message">{message}</p>}

        {/* Log Visitor Form */}
        <form className="create-user-container" onSubmit={handleLogVisitor}>
          <input 
            type="text" 
            name="name" 
            placeholder="Visitor Name" 
            value={newVisitor.name} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <input 
            type="text" 
            name="purpose" 
            placeholder="Purpose of Visit" 
            value={newVisitor.purpose} 
            onChange={handleChange} 
            className="user-input" 
            required 
          />
          <button type="submit" className="add-btn">Log Visitor</button>
        </form>

        {/* Visitor Log Table */}
        <div className="table-container">
          {loading ? (
            <p>Loading visitor logs...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Purpose</th>
                  <th>Logged Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.length > 0 ? (
                  visitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>{visitor.name}</td>
                      <td>{visitor.purpose}</td>
                      <td>{new Date(visitor.logged_on).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleDeleteVisitor(visitor.id)} className="btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No visitor logs available.</td>
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

export default VisitorLog;
