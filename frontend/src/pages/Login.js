import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer"; // ✅ Import Footer

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", credentials.username);

        // Redirect based on role
        navigate(data.role === "admin" ? "/admin-dashboard" : "/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-header">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" className="input-field" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="input-field" onChange={handleChange} required />
            <button type="submit" className="btn">Login</button>
          </form>
          <p className="register-text">
            Don't have an account? <Link to="/register" className="link">Register here</Link>
          </p>
        </div>
      </div>
      <Footer /> {/* ✅ Add Footer */}
    </>
  );
};

export default Login;
