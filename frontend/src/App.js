import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import RoomBooking from "./pages/RoomManagement";
import Billing from "./pages/Billing";
import VisitorLog from "./pages/VisitorLog";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import RoomManagement from "./pages/RoomManagement";
import Footer from "./components/Footer";
import BookRoom from "./pages/BookRoom";
import RequestRoom from "./pages/RequestRoom"; 

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else if (adminOnly && role !== "admin") {
      navigate("/"); // Redirect non-admins to home
    }
  }, [role, token, navigate, adminOnly]);

  return children;
};

const Navbar = () => {
  return (
    <div className="top-navbar">
      <h1 className="app-title">Hostel Management App</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/create-user" element={<ProtectedRoute adminOnly><CreateUser /></ProtectedRoute>} />
                  <Route path="/rooms" element={<ProtectedRoute><RoomBooking /></ProtectedRoute>} />
                  <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                  <Route path="/visitor-log" element={<ProtectedRoute><VisitorLog /></ProtectedRoute>} />
                  <Route path="/edit-user/:id" element={<EditUser />} />
                  <Route path="/book-room" element={<BookRoom />} />
                  <Route path="/request-room" element={<ProtectedRoute><RequestRoom /></ProtectedRoute>} />
                  <Route path="/rooms" element={<ProtectedRoute adminOnly><RoomManagement /></ProtectedRoute>} />
                  <Route path="/invoices" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
