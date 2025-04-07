import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getInvoices, generateInvoices } from "../api";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices(token);
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.error("Unexpected response:", data);
          setInvoices([]);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token]);

  const handleGenerateInvoices = async () => {
    if (window.confirm("Are you sure you want to generate invoices?")) {
      try {
        await generateInvoices();
        alert("Invoices generated successfully!");
        window.location.reload();
      } catch (error) {
        alert("Failed to generate invoices.");
      }
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <h2 className="admin-header">
          {role === "admin" ? "Billing Invoices" : "My Invoices"}
        </h2>
        <p className="admin-subtext">
          {role === "admin"
            ? "View and manage student billing invoices."
            : "Here are your generated invoices."}
        </p>

        {role === "admin" && (
          <button className="generate-btn" onClick={handleGenerateInvoices}>
            Generate Invoices
          </button>
        )}

        <div className="table-container">
          {loading ? (
            <p>Loading invoices...</p>
          ) : invoices.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  {role === "admin" && <th>Student</th>}
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    {role === "admin" && <td>{invoice.student}</td>}
                    <td>${invoice.amount}</td>
                    <td>{new Date(invoice.created_on).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No invoices available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
