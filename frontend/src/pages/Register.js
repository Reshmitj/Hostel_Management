import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import Footer from "../components/Footer"; // ✅ Import Footer

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(formData);
      alert("✅ Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.username) {
        setError(`❌ Username Error: ${err.username[0]}`);
      } else if (err.email) {
        setError(`❌ Email Error: ${err.email[0]}`);
      } else if (err.password) {
        setError(`❌ Password Error: ${err.password[0]}`);
      } else {
        setError("❌ Registration failed. Please check your details.");
      }
    }
  };

  return (
    <>
    <div>
      

      {/* Register Form */}
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-header">📝 Register</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
            <select name="role" value={formData.role} onChange={handleChange} className="input-field">
              <option value="student">🎓 Student</option>
              <option value="admin">🛠️ Admin</option>
              <option value="guest">🛏️ Guest</option>
              <option value="visitor">🚶 Visitor</option>
            </select>
            <button type="submit" className="btn">✅ Register</button>
          </form>

          <p className="login-text">
            Already have an account? <Link to="/login" className="link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
    
    <Footer /> 
    </>
  );
};

export default Register;
