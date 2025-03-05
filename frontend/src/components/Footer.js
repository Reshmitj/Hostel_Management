import React from "react";
import "../index.css"; // Ensure styles are applied

const Footer = () => {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Hostel Management
    </footer>
  );
};

export default Footer;
