import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component

const Home = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="header">Welcome, {token ? username : "Guest"}!</h2>
        <p className="info-text">
          {token ? `You are logged in as a ${role}. Choose an option from the left.` 
                 : "Please login or register to continue."}
        </p>
      </div>
    </>
  );
};

export default Home;
